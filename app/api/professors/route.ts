import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const campaignId = searchParams.get("campaignId");

    if (!campaignId) return NextResponse.json({ error: "Campaign ID required" }, { status: 400 });

    const { data, error } = await supabaseAdmin
        .from("professors")
        .select(`
            *,
            drafts (
                status,
                created_at
            )
        `)
        .eq("campaign_id", campaignId)
        .order("created_at", { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // Flatten data: find the latest draft status for each professor
    const professorsWithStatus = (data || []).map((p: any) => {
        const latestDraft = p.drafts?.sort((a: any, b: any) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )[0];

        return {
            ...p,
            status: latestDraft?.status || "none",
            drafts: undefined // Remove the nested drafts array for a cleaner response
        };
    });

    return NextResponse.json(professorsWithStatus);
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { campaignId, professors } = await req.json();

    if (!campaignId || !Array.isArray(professors)) {
        return NextResponse.json({ error: "Campaign ID and professors array required" }, { status: 400 });
    }

    // Add campaignId to each professor record
    const professorsWithCampaign = professors.map(p => ({
        ...p,
        campaign_id: campaignId
    }));

    const { data, error } = await supabaseAdmin
        .from("professors")
        .insert(professorsWithCampaign)
        .select();

    if (error) {
        console.error("Error inserting professors:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
}
