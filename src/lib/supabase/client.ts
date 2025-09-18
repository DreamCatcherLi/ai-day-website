"use client";

import { createBrowserClient } from "@supabase/ssr";

type SupabaseClient = ReturnType<typeof createBrowserClient>;

let browserClient: SupabaseClient | null = null;

export const getSupabaseBrowserClient = (): SupabaseClient => {
	if (browserClient) return browserClient;
	const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
	const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
	browserClient = createBrowserClient(url, anonKey);
	return browserClient;
}; 