"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export const AuthHandler = () => {
	const router = useRouter();
	const supabase = getSupabaseBrowserClient();

	useEffect(() => {
		const handleAuth = async () => {
			// Check if we're coming from OAuth callback
			const urlParams = new URLSearchParams(window.location.search);
			const code = urlParams.get("code");
			
			if (code) {
				try {
					// Exchange code for session
					const { error } = await supabase.auth.exchangeCodeForSession(code);
					if (error) {
						console.error("Auth error:", error);
						router.push("/login?error=" + encodeURIComponent(error.message));
					} else {
						// Clear URL params and redirect to home
						window.history.replaceState({}, "", "/");
						router.push("/");
					}
				} catch (err) {
					console.error("Auth error:", err);
					router.push("/login?error=登录失败");
				}
			}
		};

		handleAuth();
	}, [router, supabase]);

	return null; // This component doesn't render anything
};
