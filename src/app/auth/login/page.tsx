'use client';

import { Suspense, useEffect } from 'react';
import { LoginForm } from '@/app/auth/login/login-form';
import { toast } from 'sonner';
import { useSearchParams } from 'next/navigation';

function SearchParamsHandler() {
    const searchParams = useSearchParams();

    useEffect(() => {
        const error = searchParams.get('error');
        if (error === 'no_account') {
            toast.error('User not found. Please contact support.');
        }
    }, [searchParams]);

    return null; // This component does not render anything
}

export default function LoginPage() {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="mt-[-140px]">
                <LoginForm />
            </div>

            <Suspense fallback={<div>Loading...</div>}>
                <SearchParamsHandler />
            </Suspense>
        </div>
    );
}
