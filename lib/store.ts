"use client";

import { useSyncExternalStore } from "react";
import type { Profile, ProgressMap, TaskStatus } from "@/types";

const PROFILE_KEY = "todoca_profile_v1";
const PROGRESS_KEY = "todoca_progress_v1";

export function loadProfile(): Profile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Profile & { topConcern?: string };
    // 旧版本 profile 迁移：topConcern 单选 → topConcerns 多选
    if (!Array.isArray(parsed.topConcerns)) {
      parsed.topConcerns = parsed.topConcern
        ? [parsed.topConcern as Profile["topConcerns"][number]]
        : [];
      delete parsed.topConcern;
      localStorage.setItem(PROFILE_KEY, JSON.stringify(parsed));
    }
    return parsed;
  } catch {
    return null;
  }
}

export function loadProgress(): ProgressMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    return raw ? (JSON.parse(raw) as ProgressMap) : {};
  } catch {
    return {};
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
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  snapshot = { ...getSnapshot(), profile };
  emit();
}

export function setTaskStatus(taskId: string, status: TaskStatus) {
  const progress: ProgressMap = { ...getSnapshot().progress };
  if (status === "not_started") {
    delete progress[taskId];
  } else {
    progress[taskId] = { status, updatedAt: new Date().toISOString() };
  }
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  snapshot = { ...getSnapshot(), progress };
  emit();
}

export function clearAllData() {
  localStorage.removeItem(PROFILE_KEY);
  localStorage.removeItem(PROGRESS_KEY);
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
