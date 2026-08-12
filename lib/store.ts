"use client";

import { Preferences } from "@capacitor/preferences";
import { useEffect, useSyncExternalStore } from "react";
import type { Profile, ProgressMap, TaskStatus } from "@/types";

const PROFILE_KEY = "todoca_profile_v1";
const PROGRESS_KEY = "todoca_progress_v1";
const STORAGE_SCHEMA_KEY = "todoca_storage_schema_version";
const STORAGE_SCHEMA_VERSION = "2";
const WINDOW_STATE_PREFIX = "todoca_session_v1:";

interface VolatileState {
  profile: Profile | null;
  progress: ProgressMap;
}

interface AppSnapshot extends VolatileState {
  /** 是否已完成原生 Preferences / Web 存储加载 */
  ready: boolean;
}

declare global {
  interface Window {
    __TODOCA_VOLATILE_PROFILE__?: Profile | null;
    __TODOCA_VOLATILE_PROGRESS__?: ProgressMap;
  }
}

const SERVER_SNAPSHOT: AppSnapshot = { ready: false, profile: null, progress: {} };
let snapshot: AppSnapshot = SERVER_SNAPSHOT;
let initializationPromise: Promise<void> | null = null;
let mutationVersion = 0;
let preferenceWriteQueue: Promise<void> = Promise.resolve();
const listeners = new Set<() => void>();

function readWindowState(): VolatileState | null {
  if (typeof window === "undefined" || !window.name.startsWith(WINDOW_STATE_PREFIX)) {
    return null;
  }
  try {
    const value = JSON.parse(window.name.slice(WINDOW_STATE_PREFIX.length)) as unknown;
    if (!value || typeof value !== "object") return null;
    const state = value as Partial<VolatileState>;
    if (state.profile !== null && state.profile !== undefined && !isProfile(state.profile)) {
      return null;
    }
    if (!isProgressMap(state.progress)) return null;
    return { profile: normalizeProfile(state.profile ?? null), progress: state.progress };
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

function safeSetLegacyItem(key: string, value: string) {
  if (typeof window === "undefined") return false;
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

function safeRemoveLegacyItem(key: string) {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(key);
  } catch {}
  try {
    sessionStorage.removeItem(key);
  } catch {}
}

function safeGetLegacyItem(key: string) {
  if (typeof window === "undefined") return null;
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

function normalizeProfile(value: (Profile & { topConcern?: string }) | null): Profile | null {
  if (!value) return null;
  if (Array.isArray(value.topConcerns)) return value;
  const migrated: Profile = {
    ...value,
    topConcerns: value.topConcern
      ? [value.topConcern as Profile["topConcerns"][number]]
      : [],
  };
  delete (migrated as Profile & { topConcern?: string }).topConcern;
  return migrated;
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

function parseProfile(raw: string | null): Profile | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as unknown;
    return isProfile(parsed) ? normalizeProfile(parsed) : null;
  } catch {
    return null;
  }
}

function parseProgress(raw: string | null): ProgressMap | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as unknown;
    return isProgressMap(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

async function setPreference(key: string, value: string) {
  preferenceWriteQueue = preferenceWriteQueue
    .then(() => Preferences.set({ key, value }))
    .catch(() => {
      // Legacy storage remains as a disclosed fallback if the native plugin is unavailable.
    });
  await preferenceWriteQueue;
}

async function removePreference(key: string) {
  preferenceWriteQueue = preferenceWriteQueue
    .then(() => Preferences.remove({ key }))
    .catch(() => {
      // Legacy keys are removed separately below.
    });
  await preferenceWriteQueue;
}

function persistProfile(profile: Profile | null) {
  if (profile) {
    const value = JSON.stringify(profile);
    safeSetLegacyItem(PROFILE_KEY, value);
    void setPreference(PROFILE_KEY, value);
  } else {
    safeRemoveLegacyItem(PROFILE_KEY);
    void removePreference(PROFILE_KEY);
  }
}

function persistProgress(progress: ProgressMap) {
  const value = JSON.stringify(progress);
  safeSetLegacyItem(PROGRESS_KEY, value);
  void setPreference(PROGRESS_KEY, value);
}

function emit() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): AppSnapshot {
  return snapshot;
}

function getServerSnapshot(): AppSnapshot {
  return SERVER_SNAPSHOT;
}

/**
 * 首次启动时优先读取原生 Preferences；若不存在或内容损坏，则读取 V1 的
 * localStorage/sessionStorage 数据并迁移。旧键在 V1.0.1 继续双写，便于回退。
 */
export function initializeAppState(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (snapshot.ready) return Promise.resolve();
  if (initializationPromise) return initializationPromise;

  const startingMutationVersion = mutationVersion;
  initializationPromise = (async () => {
    let storedProfile: string | null = null;
    let storedProgress: string | null = null;

    try {
      const [profileResult, progressResult] = await Promise.all([
        Preferences.get({ key: PROFILE_KEY }),
        Preferences.get({ key: PROGRESS_KEY }),
      ]);
      storedProfile = profileResult.value;
      storedProgress = progressResult.value;
    } catch {
      // Continue with the V1 storage fallback.
    }

    const legacyProfileRaw = safeGetLegacyItem(PROFILE_KEY);
    const legacyProgressRaw = safeGetLegacyItem(PROGRESS_KEY);
    const profile =
      parseProfile(storedProfile) ?? parseProfile(legacyProfileRaw) ?? getVolatileProfile();
    const progress =
      parseProgress(storedProgress) ?? parseProgress(legacyProgressRaw) ?? getVolatileProgress();

    if (mutationVersion === startingMutationVersion) {
      setVolatileProfile(profile);
      setVolatileProgress(progress);
      snapshot = { ready: true, profile, progress };
    } else {
      snapshot = { ...snapshot, ready: true };
    }

    // Always normalize both stores after a successful read. This makes migration idempotent,
    // repairs a corrupt copy when the other copy is valid, and preserves V1 rollback data.
    persistProfile(snapshot.profile);
    persistProgress(snapshot.progress);
    safeSetLegacyItem(STORAGE_SCHEMA_KEY, STORAGE_SCHEMA_VERSION);
    await setPreference(STORAGE_SCHEMA_KEY, STORAGE_SCHEMA_VERSION);
    emit();
  })().finally(() => {
    initializationPromise = null;
  });

  return initializationPromise;
}

/** 同步读取当前内存快照；仅用于非 React 事件中的兼容调用。 */
export function loadProfile(): Profile | null {
  return snapshot.ready ? snapshot.profile : parseProfile(safeGetLegacyItem(PROFILE_KEY));
}

export function setProfile(profile: Profile) {
  mutationVersion += 1;
  setVolatileProfile(profile);
  snapshot = { ...snapshot, ready: true, profile };
  persistProfile(profile);
  emit();
}

export function setTaskStatus(taskId: string, status: TaskStatus) {
  mutationVersion += 1;
  const progress: ProgressMap = { ...snapshot.progress };
  if (status === "not_started") {
    delete progress[taskId];
  } else {
    progress[taskId] = { status, updatedAt: new Date().toISOString() };
  }
  setVolatileProgress(progress);
  snapshot = { ...snapshot, ready: true, progress };
  persistProgress(progress);
  emit();
}

export function clearAllData() {
  mutationVersion += 1;
  setVolatileProfile(null);
  setVolatileProgress({});
  [PROFILE_KEY, PROGRESS_KEY, STORAGE_SCHEMA_KEY].forEach(safeRemoveLegacyItem);
  void Promise.all([
    removePreference(PROFILE_KEY),
    removePreference(PROGRESS_KEY),
    removePreference(STORAGE_SCHEMA_KEY),
  ]);
  snapshot = { ready: true, profile: null, progress: {} };
  emit();
}

/** 全局应用状态：原生端使用 Preferences，Web/PWA 使用 localStorage 回退。 */
export function useAppState() {
  useEffect(() => {
    void initializeAppState();
  }, []);

  const snap = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return {
    ready: snap.ready,
    profile: snap.profile,
    progress: snap.progress,
    setProfile,
    setTaskStatus,
  };
}
