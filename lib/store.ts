"use client";

import { useSyncExternalStore } from "react";
import type { Profile, ProgressMap, TaskStatus } from "@/types";

const PROFILE_KEY = "todoca_profile_v1";
const PROGRESS_KEY = "todoca_progress_v1";
const WINDOW_STATE_PREFIX = "todoca_session_v1:";

interface VolatileState {
  profile: Profile | null;
  progress: ProgressMap;
}

declare global {
  interface Window {
    __TODOCA_VOLATILE_PROFILE__?: Profile | null;
    __TODOCA_VOLATILE_PROGRESS__?: ProgressMap;
  }
}

function readWindowState(): VolatileState | null {
  if (typeof window === "undefined" || !window.name.startsWith(WINDOW_STATE_PREFIX)) {
    return null;
  }
  try {
    const value = JSON.parse(window.name.slice(WINDOW_STATE_PREFIX.length)) as unknown;
    if (!value || typeof value !== "object") return null;
    const state = value as Partial<VolatileState>;
    if (state.profile !== null && !isProfile(state.profile)) return null;
    if (!isProgressMap(state.progress)) return null;
    return { profile: state.profile ?? null, progress: state.progress };
  } catch {
    return null;
  }
}

function writeWindowState(state: VolatileState) {
  if (typeof window === "undefined") return;
  if (window.name && !window.name.startsWith(WINDOW_STATE_PREFIX)) return;
  window.name = `${WINDOW_STATE_PREFIX}${JSON.stringify(state)}`;
}

function getVolatileProfile() {
  if (typeof window === "undefined") return null;
  return window.__TODOCA_VOLATILE_PROFILE__ ?? readWindowState()?.profile ?? null;
}

function setVolatileProfile(profile: Profile | null) {
  if (typeof window === "undefined") return;
  window.__TODOCA_VOLATILE_PROFILE__ = profile;
  writeWindowState({ profile, progress: getVolatileProgress() });
}

function getVolatileProgress() {
  if (typeof window === "undefined") return {};
  return window.__TODOCA_VOLATILE_PROGRESS__ ?? readWindowState()?.progress ?? {};
}

function setVolatileProgress(progress: ProgressMap) {
  if (typeof window === "undefined") return;
  window.__TODOCA_VOLATILE_PROGRESS__ = progress;
  writeWindowState({ profile: getVolatileProfile(), progress });
}

function safeSetItem(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    try {
      sessionStorage.setItem(key, value);
      return true;
    } catch {
      return false;
    }
  }
}

function safeRemoveItem(key: string) {
  let removed = false;
  try {
    localStorage.removeItem(key);
    removed = true;
  } catch {}
  try {
    sessionStorage.removeItem(key);
    removed = true;
  } catch {}
  return removed;
}

function safeGetItem(key: string) {
  try {
    const value = localStorage.getItem(key);
    if (value !== null) return value;
  } catch {}
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function isProfile(value: unknown): value is Profile & { topConcern?: string } {
  if (!value || typeof value !== "object") return false;
  const profile = value as Partial<Profile> & { topConcern?: string };
  return (
    (profile.identity === "student" ||
      profile.identity === "work_permit" ||
      profile.identity === "new_pr") &&
    typeof profile.landingDate === "string" &&
    typeof profile.hasLanded === "boolean" &&
    typeof profile.hasChildren === "boolean" &&
    typeof profile.hasHousing === "boolean" &&
    typeof profile.hasCarPlan === "boolean" &&
    typeof profile.createdAt === "string"
  );
}

function isProgressMap(value: unknown): value is ProgressMap {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  return Object.values(value).every((entry) => {
    if (!entry || typeof entry !== "object") return false;
    const item = entry as Partial<{ status: TaskStatus; updatedAt: string }>;
    return (
      (item.status === "completed" || item.status === "skipped") &&
      typeof item.updatedAt === "string"
    );
  });
}

export function loadProfile(): Profile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = safeGetItem(PROFILE_KEY);
    if (!raw) return getVolatileProfile();
    const parsed = JSON.parse(raw) as unknown;
    if (!isProfile(parsed)) return getVolatileProfile();
    // 旧版本 profile 迁移：topConcern 单选 → topConcerns 多选
    if (!Array.isArray(parsed.topConcerns)) {
      parsed.topConcerns = parsed.topConcern
        ? [parsed.topConcern as Profile["topConcerns"][number]]
        : [];
      delete parsed.topConcern;
      safeSetItem(PROFILE_KEY, JSON.stringify(parsed));
    }
    setVolatileProfile(parsed);
    return parsed;
  } catch {
    return getVolatileProfile();
  }
}

export function loadProgress(): ProgressMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = safeGetItem(PROGRESS_KEY);
    if (!raw) return getVolatileProgress();
    const parsed = JSON.parse(raw) as unknown;
    if (!isProgressMap(parsed)) return getVolatileProgress();
    setVolatileProgress(parsed);
    return parsed;
  } catch {
    return getVolatileProgress();
  }
}

interface AppSnapshot {
  /** 是否已从 localStorage 完成加载（服务端渲染时为 false） */
  ready: boolean;
  profile: Profile | null;
  progress: ProgressMap;
}

const SERVER_SNAPSHOT: AppSnapshot = { ready: false, profile: null, progress: {} };

let snapshot: AppSnapshot = SERVER_SNAPSHOT;
let initialized = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): AppSnapshot {
  if (!initialized) {
    initialized = true;
    snapshot = { ready: true, profile: loadProfile(), progress: loadProgress() };
  }
  return snapshot;
}

function getServerSnapshot(): AppSnapshot {
  return SERVER_SNAPSHOT;
}

export function setProfile(profile: Profile) {
  setVolatileProfile(profile);
  snapshot = { ...getSnapshot(), profile };
  safeSetItem(PROFILE_KEY, JSON.stringify(profile));
  emit();
}

export function setTaskStatus(taskId: string, status: TaskStatus) {
  const progress: ProgressMap = { ...getSnapshot().progress };
  if (status === "not_started") {
    delete progress[taskId];
  } else {
    progress[taskId] = { status, updatedAt: new Date().toISOString() };
  }
  setVolatileProgress(progress);
  snapshot = { ...getSnapshot(), progress };
  safeSetItem(PROGRESS_KEY, JSON.stringify(progress));
  emit();
}

export function clearAllData() {
  setVolatileProfile(null);
  setVolatileProgress({});
  safeRemoveItem(PROFILE_KEY);
  safeRemoveItem(PROGRESS_KEY);
  snapshot = { ready: true, profile: null, progress: {} };
  emit();
}

/** 全局应用状态：profile + 任务进度，跨页面共享，自动持久化到 localStorage */
export function useAppState() {
  const snap = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return {
    ready: snap.ready,
    profile: snap.profile,
    progress: snap.progress,
    setProfile,
    setTaskStatus,
  };
}
