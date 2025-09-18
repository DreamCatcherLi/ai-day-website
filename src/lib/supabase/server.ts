import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const getSupabaseServerClient = async () => {
	const cookieStore = await cookies();
	const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
	const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
	return createServerClient(url, anonKey, {
		cookies: {
			get(name: string) {
				return cookieStore.get(name)?.value;
			},
			set(name: string, value: string, options: Record<string, unknown>) {
				cookieStore.set({ name, value, ...options });
			},
			remove(name: string, options: Record<string, unknown>) {
				cookieStore.set({ name, value: "", ...options });
			},
		},
	});
}; 