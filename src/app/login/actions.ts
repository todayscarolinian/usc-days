'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  // const supabase = createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  // uncomment once supabase client is already set up

  // const { error } = await supabase.auth.signInWithPassword(data)
  // if (error) {
  //   redirect('/error')
  // }
  // revalidatePath('/', 'layout')
  // redirect('/')

  // mock data fetching, remove this once supabase client is already set up
  const response = await fetch('http://localhost:3001/users', {
    method: 'GET',
  })
  const users = await response.json()
  const user = users.find((u: { 
    email: string; 
    password: string;
    active: boolean;
  }) => u.email === data.email && u.password === data.password && u.active === true)

  if (!user) {
    console.log('Invalid credentials or account is inactive')
  }else{
    redirect('/')
  }
}