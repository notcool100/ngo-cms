export async function register() {
  // Node.js 22+ has a built-in localStorage global, but it requires
  // --localstorage-file to be set with a valid path. When the path is
  // invalid (or not provided), localStorage exists but getItem/setItem
  // throw "TypeError: localStorage.getItem is not a function".
  // This breaks next-themes and any other library that accesses localStorage
  // during SSR. We polyfill it with a simple in-memory Map.
  if (typeof globalThis.localStorage !== 'undefined') {
    try {
      // Test if localStorage actually works
      globalThis.localStorage.getItem('__test__');
    } catch {
      // localStorage exists but is broken — replace with a no-op polyfill
      const store = new Map<string, string>();
      (globalThis as any).localStorage = {
        getItem(key: string) {
          return store.get(key) ?? null;
        },
        setItem(key: string, value: string) {
          store.set(key, String(value));
        },
        removeItem(key: string) {
          store.delete(key);
        },
        clear() {
          store.clear();
        },
        get length() {
          return store.size;
        },
        key(index: number) {
          return [...store.keys()][index] ?? null;
        },
      };
    }
  }
}
