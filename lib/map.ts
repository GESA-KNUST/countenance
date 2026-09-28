/**
 * Every map on the site is Google's own: the venue embed on an event page and
 * the preview in the admin. Neither needs an API key, and there is no tile
 * provider left that can block or watermark us.
 */
export const googleMapsLink = (lat: number, lon: number) =>
  `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;
