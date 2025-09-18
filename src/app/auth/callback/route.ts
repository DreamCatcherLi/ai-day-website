import { createBrowserClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
	const { searchParams, origin } = new URL(request.url);
	const code = searchParams.get("code");
	const next = searchParams.get("next") ?? "/";

	if (code) {
		// Create a simple response that will trigger client-side auth handling
		const html = `
			<!DOCTYPE html>
			<html>
				<head>
					<title>登录中...</title>
				</head>
				<body>
					<script>
						// Handle the auth callback on client side
						const urlParams = new URLSearchParams(window.location.search);
						const code = urlParams.get('code');
						const next = urlParams.get('next') || '/';
						
						if (code) {
							// Import Supabase client and handle auth
							import('https://unpkg.com/@supabase/supabase-js@2').then(({ createClient }) => {
								const supabase = createClient(
									'${process.env.NEXT_PUBLIC_SUPABASE_URL}',
									'${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}'
								);
								
								supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
									if (error) {
										console.error('Auth error:', error);
										window.location.href = '/login?error=' + encodeURIComponent(error.message);
									} else {
										window.location.href = next;
									}
								});
							});
						} else {
							window.location.href = next;
						}
					</script>
					<p>正在登录，请稍候...</p>
				</body>
			</html>
		`;
		
		return new NextResponse(html, {
			headers: {
				'Content-Type': 'text/html',
			},
		});
	}

	// No code, redirect to home
	return NextResponse.redirect(`${origin}${next}`);
} 