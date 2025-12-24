"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { useSignIn } from "@/queries/auth.queries";
import axios from "axios";
import { useState } from "react";

export function LoginForm() {
    const handleLoginWithGoogle = useSignIn();

    return (
        <Card className="mx-auto w-md max-w-md">
            <CardHeader>
                <CardTitle className="text-2xl">Login</CardTitle>
                <CardDescription>
                    Login with your staff email account to continue.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Button
                    onClick={() => handleLoginWithGoogle.mutate}
                    className="w-full mt-3 hover:cursor-pointer"
                    disabled={handleLoginWithGoogle.isPending}
                >
                    Login with Google
                </Button>
                <div className="mt-4 text-center text-sm">
                    Don&apos;t have an account?{" "}
                    <Link href="#" className="underline">
                        Contact us
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}
