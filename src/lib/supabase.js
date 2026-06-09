import { createClient } from '@supabase/supabase-js'

// Replace these with your actual credentials (copy from .env.example → .env.local)
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key'

const isConfigured = SUPABASE_URL !== 'https://placeholder.supabase.co' &&
  SUPABASE_ANON_KEY !== 'placeholder-anon-key' &&
  SUPABASE_URL.startsWith('https://') &&
  SUPABASE_ANON_KEY.length > 20

export const supabase = isConfigured ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null
export const isSupabaseConfigured = isConfigured

/*
  ══════════════════════════════════════════════════════════════════
  SUPABASE SETUP — paste this into your Supabase SQL Editor and run
  ══════════════════════════════════════════════════════════════════

  -- 1. Transactions table
  CREATE TABLE public.transactions (
    id         UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now(),
    amount     NUMERIC     NOT NULL,
    date       DATE        NOT NULL,
    category   TEXT        NOT NULL,
    slip_url   TEXT,
    note       TEXT
  );

  -- 2. Row Level Security
  ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

  CREATE POLICY "Allow all for now" ON public.transactions
    FOR ALL USING (true) WITH CHECK (true);

  -- 3. Storage: go to Storage → New Bucket → name "bank-slips" → toggle Public
  --    Then run this storage policy:
  CREATE POLICY "Public slip access" ON storage.objects
    FOR ALL USING (bucket_id = 'bank-slips');

  ══════════════════════════════════════════════════════════════════
*/

export const CATEGORIES = [
  'Food',
  'Travel',
  'Shopping',
  'Bills',
  'Entertainment',
  'Health',
  'Other',
]

export const CATEGORY_COLORS = {
  Food:          '#3B82F6',
  Travel:        '#8B5CF6',
  Shopping:      '#F59E0B',
  Bills:         '#EF4444',
  Entertainment: '#10B981',
  Health:        '#06B6D4',
  Other:         '#6B7280',
}
