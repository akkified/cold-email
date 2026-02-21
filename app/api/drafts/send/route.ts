import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { supabaseAdmin } from "@/lib/supabase";
import { sendEmail } from "@/lib/gmail";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.accessToken) {
        return NextResponse.json({ error: "Unauthorized or missing Gmail session" }, { status: 401 });
    }

    const { draftIds } = await req.json();
    if (!draftIds || !Array.isArray(draftIds)) {
        return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const results = [];
    const dailyCap = parseInt(process.env.DAILY_SEND_CAP || "15");

    // Check daily sent count
    const today = new Date().toISOString().split('T')[0];
    const { count: sentToday } = await supabaseAdmin
        .from("drafts")
        .select("*", { count: 'exact', head: true })
        .eq("user_id", session.user.id)
        .eq("status", "sent")
        .gte("sent_at", today);

    if (sentToday && sentToday >= dailyCap) {
        return NextResponse.json({ error: "Daily send cap reached" }, { status: 429 });
    }

    for (const draftId of draftIds) {
        // Re-check cap inside loop in case multiple threads or something
        if (results.filter(r => r.status === 'sent').length + (sentToday || 0) >= dailyCap) {
            results.push({ draft_id: draftId, error: "Daily cap reached mid-run" });
            continue;
        }

        const { data: draft } = await supabaseAdmin
            .from("drafts")
            .select("*, professor:professor_id(*)")
            .eq("id", draftId)
            .eq("user_id", session.user.id)
            .single();

        if (!draft || !draft.professor?.email) {
            results.push({ draft_id: draftId, error: "Draft or professor email not found" });
            continue;
        }

        try {
            // Implementation of random delay (30-120 seconds as requested)
            // Note: In a real production app, this would be better handled by a background queue (like BullMQ or Inngest)
            // to avoid timing out the HTTP request. For this small app, we'll do it inline but it's risky.
            if (results.length > 0) {
                const delay = Math.floor(Math.random() * (120 - 30 + 1) + 30) * 1000;
                await new Promise(resolve => setTimeout(resolve, delay));
            }

            await sendEmail({
                to: draft.professor.email,
                subject: draft.subject,
                body: draft.body,
                accessToken: session.accessToken,
                refreshToken: session.refreshToken!,
            });

            await supabaseAdmin
                .from("drafts")
                .update({
                    status: "sent",
                    sent_at: new Date().toISOString()
                })
                .eq("id", draftId);

            results.push({ draft_id: draftId, status: "sent" });
        } catch (error: any) {
            console.error(`Error sending email for ${draftId}:`, error);
            await supabaseAdmin
                .from("drafts")
                .update({
                    status: "failed",
                    error_message: error.message
                })
                .eq("id", draftId);
            results.push({ draft_id: draftId, status: "failed", error: error.message });
        }
    }

    return NextResponse.json(results);
}
