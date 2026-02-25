'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { translations, Language } from '@/lib/translations';
import { ArrowLeft, Check, Crown, Zap, Sparkles, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useSearchParams } from 'next/navigation';

function PlansContent() {
    const [lang, setLang] = useState<Language>('it');
    const [userRole, setUserRole] = useState<string>('general');
    const [loading, setLoading] = useState<string | null>(null);
    const searchParams = useSearchParams();
    const success = searchParams.get('success');
    const canceled = searchParams.get('canceled');

    const t = translations[lang];

    useEffect(() => {
        // Fetch user role
        const fetchUser = async () => {
            try {
                const res = await fetch('/api/history');
                if (res.ok) {
                    const data = await res.json();
                    if (data.user) {
                        setUserRole(data.user.role || 'general');
                    }
                }
            } catch (err) {
                console.error('Failed to fetch user:', err);
            }
        };
        fetchUser();
    }, []);

    const handleSubscribe = async (plan: 'weekly' | 'monthly') => {
        setLoading(plan);
        try {
            const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ plan }),
            });

            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                console.error('No checkout URL returned:', data.error);
                setLoading(null);
            }
        } catch (err) {
            console.error('Checkout error:', err);
            setLoading(null);
        }
    };

    const handleManageSubscription = async () => {
        setLoading('portal');
        try {
            const res = await fetch('/api/create-portal', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });

            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                console.error('No portal URL returned');
                setLoading(null);
            }
        } catch (err) {
            console.error('Portal error:', err);
            setLoading(null);
        }
    };

    const isUnlimited = userRole === 'paid' || userRole === 'admin';



    const features = [
        t.plans.feature1,
        t.plans.feature2,
        t.plans.feature3,
        t.plans.feature4,
        t.plans.feature5,
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#F2F5FF] via-white to-[#F2F5FF] flex flex-col">
            {/* Header */}
            <header className="p-4 md:p-6 flex items-center justify-between">
                <Link href="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                    <span className="text-sm font-medium">{t.plans.backToApp}</span>
                </Link>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setLang(lang === 'it' ? 'en' : 'it')}
                    className="text-sm"
                >
                    {lang === 'it' ? '🇬🇧 English' : '🇮🇹 Italiano'}
                </Button>
            </header>

            {/* Toast Messages */}
            {success && (
                <div className="mx-4 md:mx-auto md:max-w-2xl mb-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm font-medium animate-in fade-in slide-in-from-top duration-500 flex items-center gap-2">
                    <Check className="w-5 h-5 text-emerald-500" />
                    {t.plans.successMsg}
                </div>
            )}
            {canceled && (
                <div className="mx-4 md:mx-auto md:max-w-2xl mb-4 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-sm font-medium animate-in fade-in slide-in-from-top duration-500">
                    {t.plans.canceledMsg}
                </div>
            )}

            {/* Main Content */}
            <main className="flex-1 flex flex-col items-center justify-center px-4 pb-16">
                {/* Title */}
                <div className="text-center space-y-3 mb-12">
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                        <Crown className="w-3.5 h-3.5" />
                        Pro
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900">
                        {t.plans.title}
                    </h1>
                    <p className="text-muted-foreground text-lg md:text-xl max-w-xl mx-auto font-light">
                        {t.plans.subtitle}
                    </p>
                </div>

                {/* Pricing Cards */}
                <div className="grid md:grid-cols-2 gap-6 max-w-3xl w-full">

                    {/* Weekly Plan */}
                    <Card className={cn(
                        "relative p-8 border-2 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]",
                        isUnlimited ? "border-border/40 opacity-60" : "border-border/40 hover:border-primary/30"
                    )}>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Zap className="w-5 h-5 text-blue-500" />
                                    <h3 className="text-xl font-bold">{t.plans.weeklyTitle}</h3>
                                </div>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-black">{t.plans.weeklyPrice}</span>
                                    <span className="text-muted-foreground text-sm">{t.plans.weeklyPeriod}</span>
                                </div>
                            </div>

                            <ul className="space-y-3">
                                {features.map((feature, i) => (
                                    <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <Button
                                className="w-full h-12 text-base font-semibold"
                                variant="outline"
                                disabled={isUnlimited || loading !== null}
                                onClick={() => handleSubscribe('weekly')}
                            >
                                {loading === 'weekly' ? (
                                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{t.plans.processing}</>
                                ) : isUnlimited ? (
                                    t.plans.activePlan
                                ) : (
                                    t.plans.subscribe
                                )}
                            </Button>
                        </div>
                    </Card>

                    {/* Monthly Plan */}
                    <Card className={cn(
                        "relative p-8 border-2 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]",
                        isUnlimited
                            ? "border-border/40 opacity-60"
                            : "border-primary/50 shadow-lg shadow-primary/10 bg-gradient-to-b from-primary/[0.03] to-transparent"
                    )}>
                        {/* Best Value Badge */}
                        {!isUnlimited && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg">
                                    {t.plans.bestValue}
                                </div>
                            </div>
                        )}

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-indigo-500" />
                                    <h3 className="text-xl font-bold">{t.plans.monthlyTitle}</h3>
                                </div>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-black">{t.plans.monthlyPrice}</span>
                                    <span className="text-muted-foreground text-sm">{t.plans.monthlyPeriod}</span>
                                </div>
                            </div>

                            <ul className="space-y-3">
                                {features.map((feature, i) => (
                                    <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <Button
                                className={cn(
                                    "w-full h-12 text-base font-semibold",
                                    !isUnlimited && "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-xl border-0"
                                )}
                                disabled={isUnlimited || loading !== null}
                                onClick={() => handleSubscribe('monthly')}
                            >
                                {loading === 'monthly' ? (
                                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{t.plans.processing}</>
                                ) : isUnlimited ? (
                                    t.plans.activePlan
                                ) : (
                                    t.plans.subscribe
                                )}
                            </Button>
                        </div>
                    </Card>
                </div>

                {/* Manage Subscription (for paid users) */}
                {isUnlimited && userRole !== 'admin' && (
                    <div className="mt-8">
                        <Button
                            variant="outline"
                            className="border-primary/30 text-primary hover:bg-primary/5"
                            onClick={handleManageSubscription}
                            disabled={loading === 'portal'}
                        >
                            {loading === 'portal' ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{t.plans.processing}</>
                            ) : (
                                t.plans.manageSub
                            )}
                        </Button>
                    </div>
                )}
            </main>
        </div>
    );
}

export default function PlansPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <PlansContent />
        </Suspense>
    );
}
