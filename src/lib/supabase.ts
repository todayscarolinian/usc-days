import { createClient } from '@/utils/server';
import { cookies } from 'next/headers';

const globalForSupabase = global as unknown as { supabase: ReturnType<typeof createClient> };

export const supabase = globalForSupabase.supabase || createClient(cookies());

if (process.env.NODE_ENV !== 'production') globalForSupabase.supabase = supabase;
