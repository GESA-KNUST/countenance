import { LogError } from "../logger";
import { SITE_URL, absoluteUrl } from "./site";

const KEY = process.env.INDEXNOW_KEY;
const ENDPOINT = "https://api.indexnow.org/indexnow";

export const INDEXNOW_KEY = KEY ?? null;

export const INDEXNOW_KEY_LOCATION = `${SITE_URL}/indexnow-key.txt`;


export async function pingIndexNow(paths: string[]): Promise<boolean> {
  if (!KEY || paths.length === 0) return false;

  const urlList = [...new Set(paths.map(absoluteUrl))].slice(0, 10000);

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        host: new URL(SITE_URL).host,
        key: KEY,
        keyLocation: INDEXNOW_KEY_LOCATION,
        urlList,
      }),
      cache: "no-store",
    });

    if (!res.ok) {
      LogError("[indexnow] rejected", res.status, await res.text().catch(() => ""));
      return false;
    }

    return true;
  } catch (error) {
    LogError("[indexnow]", error);
    return false;
  }
}
