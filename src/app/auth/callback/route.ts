import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
	const { searchParams, origin } = new URL(request.url);
	const next = searchParams.get("next") ?? "/";
	
	// Simple redirect - let client handle the auth
	return NextResponse.redirect(`${origin}${next}`);
} 