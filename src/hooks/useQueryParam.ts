import { useCallback, useEffect, useMemo, useState } from "react";

/**
 * A tiny hook to read/write a single query param without react-router.
 * Uses history.pushState to avoid full page reload.
 */
export function useQueryParam(key: string) {
  const get = useCallback((): string | null => {
    try {
      const u = new URL(window.location.href);
      return u.searchParams.get(key);
    } catch {
      return null;
    }
  }, [key]);

  const [value, setValueState] = useState<string | null>(() => (typeof window !== "undefined" ? get() : null));

  // Keep state in sync with browser back/forward
  useEffect(() => {
    const onPop = () => setValueState(get());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [get]);

  const set = useCallback((next: string | null) => {
    const url = new URL(window.location.href);
    if (next === null || next === "") {
      url.searchParams.delete(key);
    } else {
      url.searchParams.set(key, next);
    }
    window.history.pushState({}, "", url.toString());
    setValueState(next);
  }, [key]);

  return [value, set] as const;
}

export function setQueryParam(key: string, value: string | null) {
  const url = new URL(window.location.href);
  if (value === null || value === "") {
    url.searchParams.delete(key);
  } else {
    url.searchParams.set(key, value);
  }
  window.history.pushState({}, "", url.toString());
}
