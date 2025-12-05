"use client";

import { useUserStore } from "@/src/stores/user-store";
import Image from "next/image";

export default function AuthSuccess() {
  const { name, email, picture } = useUserStore();

  if (name && email) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <Image
          src={picture}
          alt={`${name}'s profile picture`}
          className="w-24 h-24 rounded-full"
        />
        <h1 className="text-2xl font-bold">Welcome, {`${name} (${email})`}!</h1>
        <p className="text-lg">You are logged in.</p>
      </div>
    );
  } else {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <p className="text-lg">Login Failed.</p>
      </div>
    );
  }
}
