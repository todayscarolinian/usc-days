"use client"

import { useEffect } from 'react'
import { LoginForm } from '@/app/auth/login/login-form'
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/hooks/use-toast"
import { useSearchParams } from 'next/navigation'

export default function LoginPage() {
  const searchParams = useSearchParams()
  const { toast } = useToast();
 
  useEffect(() => {
    const error = searchParams.get('error');
    if (error === "no_account") {
      toast({
        variant: "destructive",
        title: "Login Failed!",
        description: "User not found. Please contact support.",
      })
    }
  }, [])
  

  return (
    <div className='flex items-center justify-center min-h-screen'>
      <div className="mt-[-140px]">
        <LoginForm />
      </div>
      <Toaster />
    </div>
  )
}
