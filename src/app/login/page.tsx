import { LoginForm } from '@/app/login/login-form'
import { Toaster } from "@/components/ui/toaster"

export default function LoginPage() {
  return (
    <div className='flex items-center justify-center min-h-screen'>
      <div className="mt-[-140px]">
        <LoginForm />
      </div>
      <Toaster />
    </div>
  )
}