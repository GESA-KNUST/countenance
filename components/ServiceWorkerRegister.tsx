'use client'

import { useEffect } from 'react'
import { usePostHog } from 'posthog-js/react'
import { LogError } from '@/lib/logger'

export default function ServiceWorkerRegister() {
    const posthog = usePostHog()

    useEffect(() => {
        if (!('serviceWorker' in navigator)) return

        let refreshing = false

        // When a new worker takes control, reload once so the user gets the
        // latest assets without a manual refresh.
        const onControllerChange = () => {
            if (refreshing) return
            refreshing = true
            window.location.reload()
        }
        navigator.serviceWorker.addEventListener('controllerchange', onControllerChange)

        const register = async () => {
            try {
                const registration = await navigator.serviceWorker.register('/sw.js')

                // If an updated worker is waiting, ask it to activate immediately.
                const promote = (worker: ServiceWorker | null) => {
                    if (worker) worker.postMessage('SKIP_WAITING')
                }

                if (registration.waiting) promote(registration.waiting)

                registration.addEventListener('updatefound', () => {
                    const installing = registration.installing
                    installing?.addEventListener('statechange', () => {
                        if (installing.state === 'installed' && navigator.serviceWorker.controller) {
                            promote(installing)
                        }
                    })
                })
            } catch (error) {
                LogError('Service Worker registration failed:', error)
                posthog?.captureException(error)
            }
        }

        // Register after load so it never competes with the initial render.
        if (document.readyState === 'complete') {
            register()
        } else {
            window.addEventListener('load', register, { once: true })
        }

        return () => {
            navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange)
        }
    }, [posthog])

    return null
}
