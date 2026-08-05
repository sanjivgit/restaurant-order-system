const isBrowser = typeof window !== "undefined";

export const Storage = {
  set: async (key: string, value: any) => {
    if (!isBrowser) return;
    window.localStorage.setItem(key, JSON.stringify(value));
  },

  get: async <T>(key: string): Promise<T | null> => {
    if (!isBrowser) return null;
    const data = window.localStorage.getItem(key);
    return data ? (JSON.parse(data) as T) : null;
  },

  getSync: <T>(key: string): T | null => {
    if (!isBrowser) return null;
    const data = window.localStorage.getItem(key);
    return data ? (JSON.parse(data) as T) : null;
  },

  remove: async (key: string) => {
    if (!isBrowser) return;
    window.localStorage.removeItem(key);
  },

  clear: async () => {
    if (!isBrowser) return;
    window.localStorage.clear();
  },
};
