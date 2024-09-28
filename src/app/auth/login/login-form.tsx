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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/hooks/use-toast"

import axios from "axios"

export function LoginForm() {
  // const { toast } = useToast()
  
  // const handleLoginWithPassword = async (formData: FormData) => {
  //   const response = await loginWithPassword(formData)

  //   if (response?.error) {
  //     toast({
  //       variant: "destructive",
  //       title: "Login Failed!",
  //       description: response?.error,
  //     })
  //   }
  // }

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
          Enter your staff email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="example@gmail.com"
              name='email'
              required
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <Link href="#" className="ml-auto inline-block text-sm underline">
                Forgot your password?
              </Link>
            </div>
            <Input id="password" type="password" name='password' required />
          </div>
          <Button type="submit" className="w-full">
            Login
          </Button>
        </div>
        </form>
        <Button onClick={handleLoginWithGoogle} variant="outline" className="w-full mt-3">
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
