import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
	const { searchParams, origin } = new URL(request.url);
	const code = searchParams.get("code");
	const next = searchParams.get("next") ?? "/dashboard";

	if (code) {
		const supabase = await createClient();
		const { error } = await supabase.auth.exchangeCodeForSession(code);
		if (!error) {
			const requestUrl = new URL(request.url);
			return NextResponse.redirect(`${requestUrl.origin}${next}`);
		}
	}

	// Something went wrong — redirect to error page or home
	return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
