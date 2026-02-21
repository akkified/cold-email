import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: userTemplates, error: userError } = await supabaseAdmin
        .from("templates")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

    const { data: builtInTemplates, error: builtInError } = await supabaseAdmin
        .from("templates")
        .select("*")
        .eq("is_built_in", true);

    if (userError || builtInError) {
        return NextResponse.json({ error: userError?.message || builtInError?.message }, { status: 500 });
    }

    return NextResponse.json([...(userTemplates || []), ...(builtInTemplates || [])]);
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { id, name, subject_template, body_template, tone, target_length } = body;

    const { data, error } = await supabaseAdmin
        .from("templates")
        .upsert({
            id: id || undefined, // Allow Supabase to generate UUID if not provided
            user_id: session.user.id,
            name,
            subject_template,
            body_template,
            tone,
            target_length
        }, { onConflict: 'id' })
        .select()
        .single();

    if (error) {
        console.error("Error saving template:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
}
