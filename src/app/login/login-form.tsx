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

import { loginWithGoogle, loginWithPassword } from "./actions"

export function LoginForm() {
  const { toast } = useToast()
  
  const handleLogin = async (formData: FormData) => {
    const response = await loginWithPassword(formData)

    if (response?.error) {
      toast({
        variant: "destructive",
        title: "Login Failed!",
        description: response?.error,
      })
    }
  }
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
          <Button formAction={async (formData) =>  await handleLogin(formData) } type="submit" className="w-full">
            Login
          </Button>
        </div>
        </form>
        <form action={loginWithGoogle}>
          <Button variant="outline" className="w-full mt-3">
              Login with Google
          </Button>
        </form>
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
