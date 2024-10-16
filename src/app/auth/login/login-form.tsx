"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import axios from "axios"

export function LoginForm() {
  const handleLoginWithGoogle = async () => {
    try {
      const response = await axios.get("/api/user/login");
      const { url } = response.data;

      // Redirect to Google OAuth URL
      window.location.href = url;
    } catch (error) {
      console.error("Error during login", error);
    }
  };

  return (
      <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Login with your staff email account to continue.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={handleLoginWithGoogle}  className="w-full mt-3">
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
  )
}
