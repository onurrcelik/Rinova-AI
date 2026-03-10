'use client';

import { useEffect } from 'react';

/**
 * Mounts global window.onerror and unhandledrejection listeners.
 * Fetches user identity from /api/history on mount and attaches it to error reports.
 * Renders nothing — purely side-effect.
 */
export function ErrorReporter() {
    useEffect(() => {
        let userId: string | null = null;
        let userEmail: string | null = null;

        // Fetch user identity once on mount (best-effort)
        fetch('/api/history')
            .then((res) => {
                if (res.ok) return res.json();
                return null;
            })
            .then((data) => {
                if (data?.user) {
                    userId = data.user.id ?? null;
                    userEmail = data.user.email ?? null;
                }
            })
            .catch(() => {
                // No session or network issue — that's ok
            });

        const logError = (errorMessage: string, errorStack?: string, errorType = 'unhandled') => {
            try {
                fetch('/api/log-error', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId,
                        userEmail,
                        errorMessage,
                        errorStack: errorStack ?? null,
                        pageUrl: window.location.href,
                        componentStack: null,
                        errorType,
                    }),
                }).catch(() => {
                    // Silently ignore log POST failures
                });
            } catch {
                // Silently ignore
            }
        };

        const handleError = (event: ErrorEvent) => {
            logError(
                event.message || 'Unknown error',
                event.error?.stack ?? `${event.filename}:${event.lineno}:${event.colno}`,
                'window_onerror'
            );
        };

        const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
            const reason = event.reason;
            const message =
                reason instanceof Error ? reason.message : String(reason ?? 'Unhandled promise rejection');
            const stack = reason instanceof Error ? reason.stack : undefined;
            logError(message, stack, 'unhandled_rejection');
        };

        window.addEventListener('error', handleError);
        window.addEventListener('unhandledrejection', handleUnhandledRejection);

        return () => {
            window.removeEventListener('error', handleError);
            window.removeEventListener('unhandledrejection', handleUnhandledRejection);
        };
    }, []);

    return null;
}
