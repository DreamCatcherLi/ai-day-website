"use client";

import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { useCallback, useState } from "react";

const LoginPage = () => {
	const supabase = getSupabaseBrowserClient();
	const [loading, setLoading] = useState(false);
	const handleSignInWithGoogle = useCallback(async () => {
		if (loading) return;
		setLoading(true);
		try {
			const { error } = await supabase.auth.signInWithOAuth({
				provider: "google",
				options: {
					redirectTo: `${window.location.origin}/auth/callback`,
					queryParams: {
						access_type: 'offline',
						prompt: 'consent',
					},
				},
			});
			if (error) {
				console.error('OAuth error:', error);
				alert(`登录失败: ${error.message}`);
			}
		} catch (err: unknown) {
			console.error('Sign in error:', err);
			alert(`登录出错: ${err instanceof Error ? err.message : '未知错误'}`);
		} finally {
			setLoading(false);
		}
	}, [loading, supabase]);

	return (
		<div className="min-h-screen flex items-center justify-center p-6">
			<div className="w-full max-w-sm rounded-xl border border-gray-200 p-6 shadow-sm">
				<h1 className="text-xl font-semibold mb-4 text-center">登录 AI-Day</h1>
				<button
					aria-label="使用 Google 登录"
					onClick={handleSignInWithGoogle}
					onKeyDown={(e) => { if (e.key === "Enter") handleSignInWithGoogle(); }}
					className="w-full bg-black text-white rounded-md py-2.5 text-sm font-medium hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-60"
					disabled={loading}
				>
					{loading ? "正在跳转..." : "使用 Google 登录"}
				</button>
			</div>
		</div>
	);
};

export default LoginPage;
