"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GoogleUserMetadata } from "@/types/auth.types";
import { useUserStore } from "@/stores/user-store";

export default function Page() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [url, setUrl] = useState("");
  const [hasFetched, setHasFetched] = useState(false);
  const { setEmail, setName, setPicture } = useUserStore()

  useEffect(() => {
    const exchangeCodeForSession = async () => {
      const code = new URLSearchParams(window.location.search).get("code");

      if (!code) {
        setError("Authorization code not found.");
        return;
      }

      try {
        // Make a request to the API endpoint to exchange the code and set the session
        const response = await fetch(`/api/user/session?code=${code}`);
        const data = await response.json();
        
        if (response.ok) {
          const currentUser = data.currentUser as GoogleUserMetadata;
          setUrl(data.redirectTo);
          setEmail(currentUser.email);
          setName(currentUser.full_name);
          setPicture(currentUser.picture);
          // Mark the API call as done
          setHasFetched(true);

          // On success, redirect the user to the success page
          router.push(data.redirectTo);
        } else {
          // Handle redirect to login if user is not in the database
          if (data.redirectTo) {
            router.push(data.redirectTo);
          } else {
            setError(data.error || "Unknown error occurred.");
          }
        }
      } catch (err) {
        console.error("Error exchanging code for session:", err);
        setError("An error occurred while exchanging the code.");
      }
    };
    if (!hasFetched) {
      setHasFetched(true);
      exchangeCodeForSession();
    }
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return <div>Exchanging code for session...</div>;
}
