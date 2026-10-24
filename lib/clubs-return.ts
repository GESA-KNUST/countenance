const KEY = "clubs-return";
const MAX_AGE_MS = 30 * 60 * 1000;

export interface ClubsReturn {
  clubId: string;
  scrollY: number;
  tab: number;
  search: string;
  at: number;
}

export function rememberClubsReturn(value: Omit<ClubsReturn, "at">) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify({ ...value, at: Date.now() }));
  } catch {}
}

export function readClubsReturn(): ClubsReturn | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    const value = JSON.parse(raw) as ClubsReturn;
    return Date.now() - value.at < MAX_AGE_MS ? value : null;
  } catch {
    return null;
  }
}

export function clearClubsReturn() {
  try {
    sessionStorage.removeItem(KEY);
  } catch {}
}
