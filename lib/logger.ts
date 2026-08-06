/**
 * Development-only console helpers. In production these are no-ops so we don't
 * leak internals to the browser console; capture real errors via PostHog instead.
 */
export const Log = (...args: unknown[]) => {
    if (process.env.NODE_ENV !== 'production') {
        console.log(...args);
    }
};

export const LogError = (...args: unknown[]) => {
    if (process.env.NODE_ENV !== 'production') {
        console.error(...args);
    }
};
