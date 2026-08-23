"use client";

import * as React from "react";

function readList(key: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function writeList(key: string, list: string[]) {
  try {
    window.localStorage.setItem(key, JSON.stringify(list));
  } catch {
    /* ignore quota errors */
  }
}

const STORAGE_EVENT = "itb:storage-list-change";

export function useFavorites() {
  const KEY = "itb:favorites";
  const [ids, setIds] = React.useState<string[]>([]);

  React.useEffect(() => {
    setIds(readList(KEY));
    const handler = () => setIds(readList(KEY));
    window.addEventListener(STORAGE_EVENT, handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener(STORAGE_EVENT, handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  const toggle = React.useCallback((id: string) => {
    const current = readList(KEY);
    const next = current.includes(id) ? current.filter((x) => x !== id) : [id, ...current];
    writeList(KEY, next);
    setIds(next);
    window.dispatchEvent(new Event(STORAGE_EVENT));
  }, []);

  const isFavorite = React.useCallback((id: string) => ids.includes(id), [ids]);

  return { favorites: ids, toggleFavorite: toggle, isFavorite };
}

export function useRecentTools() {
  const KEY = "itb:recent";
  const [ids, setIds] = React.useState<string[]>([]);

  React.useEffect(() => {
    setIds(readList(KEY));
    const handler = () => setIds(readList(KEY));
    window.addEventListener(STORAGE_EVENT, handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener(STORAGE_EVENT, handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  const push = React.useCallback((id: string) => {
    const current = readList(KEY).filter((x) => x !== id);
    const next = [id, ...current].slice(0, 12);
    writeList(KEY, next);
    setIds(next);
    window.dispatchEvent(new Event(STORAGE_EVENT));
  }, []);

  return { recent: ids, pushRecent: push };
}
