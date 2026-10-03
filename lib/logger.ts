/**
 * Development-only console helper. In production this is a no-op so we don't
 * leak internals to the browser console; capture real errors via PostHog instead.
 */
export const LogError = (...args: unknown[]) => {
    if (process.env.NODE_ENV !== 'production') {
        console.error(...args);
    }
};
