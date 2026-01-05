'use client'

import { useEffect } from 'react'
import { usePostHog } from 'posthog-js/react'

export default function ServiceWorkerRegister() {
    const posthog = usePostHog()

    useEffect(() => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then((registration) => {
                })
                .catch((error) => {
                    console.error('Service Worker registration failed:', error)
                    posthog?.captureException(error)
                });
        }
    }, [posthog])

    return null
}
