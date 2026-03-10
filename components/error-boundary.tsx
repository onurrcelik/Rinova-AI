'use client';

import React from 'react';

interface ErrorBoundaryProps {
    children: React.ReactNode;
    userId?: string | null;
    userEmail?: string | null;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, info: React.ErrorInfo) {
        // Fire and forget — we don't want log failures to cause more errors
        try {
            fetch('/api/log-error', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: this.props.userId ?? null,
                    userEmail: this.props.userEmail ?? null,
                    errorMessage: error.message,
                    errorStack: error.stack,
                    pageUrl: typeof window !== 'undefined' ? window.location.href : null,
                    componentStack: info.componentStack,
                    errorType: 'react_boundary',
                }),
            }).catch(() => {
                // Silently ignore log failures
            });
        } catch {
            // Silently ignore
        }
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <div className="max-w-md w-full mx-auto p-8 text-center space-y-4">
                        <div className="text-4xl">⚠️</div>
                        <h1 className="text-xl font-bold text-gray-900">Something went wrong</h1>
                        <p className="text-gray-500 text-sm">
                            This error has been automatically reported. Try refreshing the page.
                        </p>
                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <pre className="text-left text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg p-4 overflow-auto max-h-64">
                                {this.state.error.message}
                                {'\n\n'}
                                {this.state.error.stack}
                            </pre>
                        )}
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
                        >
                            Reload Page
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
