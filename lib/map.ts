/**
 * Keyless basemaps keep closing: OpenStreetMap blocks application traffic under
 * its tile usage policy, and Carto now stamps "API KEY REQUIRED" across unkeyed
 * tiles. Esri's street basemap still serves without a key, and the provider is
 * an environment variable so it can be repointed the next time one of these
 * closes, without a code change.
 *
 * These are raster tiles on purpose. Vector basemaps need WebGL, which is
 * unreliable on the low-end Android phones much of the audience uses.
 */
export const TILE_URL =
  process.env.NEXT_PUBLIC_MAP_TILE_URL ??
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}";

export const TILE_ATTRIBUTION =
  process.env.NEXT_PUBLIC_MAP_TILE_ATTRIBUTION ??
  'Tiles &copy; <a href="https://www.esri.com">Esri</a>';

export const TILE_MAX_ZOOM = 19;

export const PIN_HTML =
  '<span style="display:block;width:22px;height:22px;border-radius:9999px;background:#FFBE00;border:3px solid #252638;box-shadow:0 2px 6px rgba(0,0,0,.35);cursor:pointer"></span>';

export const googleMapsLink = (lat: number, lon: number) =>
  `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;
