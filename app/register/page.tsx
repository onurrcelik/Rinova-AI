'use client';

import { useState, Suspense } from 'react';
import { useActionState } from 'react';
import { register } from '@/app/actions';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { translations, Language } from '@/lib/translations';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

function RegisterForm() {
    const [lang, setLang] = useState<Language>('it');
    const t = translations[lang];

    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/';
    // Preserve the selected plan through the register → checkout flow
    const plan = searchParams.get('plan') || '';

    const [errorMessage, formAction, isPending] = useActionState(
        register,
        undefined,
    );

    const toggleLanguage = (value: string) => {
        setLang(value as Language);
    };

    const planLabel = plan === 'weekly' ? '(Weekly – €15/wk)' : plan === 'monthly' ? '(Monthly – €50/mo)' : '';

    return (
        <div className="flex h-screen w-full flex-col bg-gray-50">
            <div className="absolute top-4 right-4">
                <Select value={lang} onValueChange={toggleLanguage}>
                    <SelectTrigger className="w-[140px] bg-white border-gray-200">
                        <SelectValue placeholder="Language" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="en">🇬🇧 English</SelectItem>
                        <SelectItem value="it">🇮🇹 Italiano</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="flex flex-1 items-center justify-center">
                <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-md">
                    <h1 className="mb-2 text-2xl font-bold text-center text-gray-900">
                        {t.auth.createAccountTitle}
                    </h1>
                    {planLabel && (
                        <p className="mb-5 text-center text-sm font-semibold text-blue-600">
                            {planLabel}
                        </p>
                    )}
                    <form action={formAction} className="space-y-4">
                        <input type="hidden" name="redirectTo" value={callbackUrl} />
                        {/* Pass the plan so the server action can redirect to checkout */}
                        {plan && <input type="hidden" name="plan" value={plan} />}

                        <div>
                            <label
                                className="block mb-1 text-sm font-medium text-gray-700"
                                htmlFor="email"
                            >
                                {t.auth.email}
                            </label>
                            <input
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                id="email"
                                type="email"
                                name="email"
                                placeholder={t.auth.emailPlaceholder}
                                required
                            />
                        </div>
                        <div>
                            <label
                                className="block mb-1 text-sm font-medium text-gray-700"
                                htmlFor="password"
                            >
                                {t.auth.password}
                            </label>
                            <input
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                id="password"
                                type="password"
                                name="password"
                                placeholder={t.auth.passwordCreatePlaceholder}
                                required
                                minLength={6}
                            />
                        </div>
                        <div
                            className="flex items-end space-x-1"
                            aria-live="polite"
                            aria-atomic="true"
                        >
                            {errorMessage && (
                                <p className="text-sm text-red-500">{errorMessage}</p>
                            )}
                        </div>
                        <button
                            className="w-full px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 disabled:opacity-50"
                            aria-disabled={isPending}
                        >
                            {isPending ? t.auth.registering : t.auth.createAccountLink}
                        </button>
                    </form>
                    <p className="mt-4 text-center text-sm text-gray-600">
                        {t.auth.haveAccount}{' '}
                        <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                            {t.auth.login}
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function RegisterPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <RegisterForm />
        </Suspense>
    );
}
