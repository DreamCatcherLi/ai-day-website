import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const getSupabaseServerClient = () => {
	const cookieStore = cookies();
	const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
	const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
	return createServerClient(url, anonKey, {
		cookies: {
			get(name: string) {
				return cookieStore.get(name)?.value;
			},
			set(name: string, value: string, options: any) {
				cookieStore.set({ name, value, ...options });
			},
			remove(name: string, options: any) {
				cookieStore.set({ name, value: "", ...options });
			},
		},
	});
}; 