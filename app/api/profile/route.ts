import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabaseAdmin
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is 'no rows returned'
        console.error("Supabase error fetching profile:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data || {});
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    // Whitelist allowed fields to prevent arbitrary updates
    const { name, school, grade, interests, experience } = body;

    const { data, error } = await supabaseAdmin
        .from("profiles")
        .upsert({
            id: session.user.id,
            name,
            school,
            grade,
            interests,
            experience,
            updated_at: new Date().toISOString(),
        }, { onConflict: 'id' })
        .select()
        .single();

    if (error) {
        console.error("Supabase error saving profile:", error);
        return NextResponse.json({
            error: error.message,
            code: error.code,
            details: error.details
        }, { status: 500 });
    }

    return NextResponse.json(data);
}
