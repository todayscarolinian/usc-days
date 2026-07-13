"use client";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_HERALD_AUTH_URL,
});

export const { useSession } = authClient;

export async function signOutFromHerald() {
  await fetch(`${process.env.NEXT_PUBLIC_HERALD_AUTH_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
}
