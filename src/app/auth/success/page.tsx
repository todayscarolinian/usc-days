"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { GoogleUserMetadata } from "@/types/auth.types";

export default function AuthSuccess() {
  const [name, setName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [picture, setPicture] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Retrieve session from Cookies
  useEffect(() => {
    const nameCookie = Cookies.get("name");
    const emailCookie = Cookies.get("email");
    const picCookie = Cookies.get("pic");
    if (emailCookie && nameCookie && picCookie) {
      setName(nameCookie);
      setEmail(emailCookie);
      setPicture(picCookie);
      setLoading(false);
    }
  }, []);

  // If loading, show a spinner or loading text
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-medium">Loading...</p>
      </div>
    );
  }

  if (name && email && picture) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <img
          src={picture}
          alt={`${name}'s profile picture`}
          className="w-24 h-24 rounded-full"
        />
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
