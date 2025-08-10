export function useMediaQuery(query: string): boolean {
  if (typeof window === 'undefined') return false;
  const mql = window.matchMedia(query);
  return mql.matches;
}

