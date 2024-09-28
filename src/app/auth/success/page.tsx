"use client";

import { useUserStore } from "@/stores/user-store";

export default function AuthSuccess() {

  const { name, email} = useUserStore()


  if (name && email ) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <h1 className="text-2xl font-bold">
          Welcome, {`${name} (${email})` ?? "User"}!
        </h1>
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