export const SITE_URL = "https://www.gesaknust.com";


export const ORGANIZATION_ID = `${SITE_URL}/#organization`;

export const ORGANIZATION_NAME = "Ghana Engineering Students Association - KNUST";

export function absoluteUrl(path: string) {
  return path.startsWith("http") ? path : `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
