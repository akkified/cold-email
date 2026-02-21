import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { supabaseAdmin } from "@/lib/supabase";
import { generateEmailDraft } from "@/lib/ai";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { professorIds, templateId } = await req.json();

    if (!Array.isArray(professorIds) || professorIds.length === 0 || !templateId) {
        return NextResponse.json({ error: "Professor IDs and Template ID required" }, { status: 400 });
    }

    try {
        // 1. Fetch Profile, Template, and Professors
        const [profileRes, templateRes, professorsRes] = await Promise.all([
            supabaseAdmin.from("profiles").select("*").eq("id", session.user.id).single(),
            supabaseAdmin.from("templates").select("*").eq("id", templateId).single(),
            supabaseAdmin.from("professors").select("*").in("id", professorIds)
        ]);

        if (profileRes.error || !profileRes.data) throw new Error("Profile not found");
        if (templateRes.error || !templateRes.data) throw new Error("Template not found");
        if (professorsRes.error || !professorsRes.data) throw new Error("Professors not found");

        const profile = profileRes.data;
        let template = templateRes.data;
        const professors = professorsRes.data;

        // Fallback for default template if not found or "default" string used
        if (!template || templateId === "default") {
            console.log("Using default fallback template");
            template = {
                id: null,
                name: "Default Template",
                subject_template: "Inquiry regarding research opportunities in [RESEARCH_AREA]",
                body_template: "Dear Professor [PROF_NAME],\n\nI am a [GRADE] at [UNIVERSITY] and I recently read your paper titled \"[PAPER_TITLE]\". [WHY_THEIR_WORK].\n\n[YOUR_EXPERIENCE]. I am very interested in your work on [RESEARCH_AREA] and was wondering if you would be open to discussing potential mentorship or research opportunities in your lab.\n\nThank you for your time and consideration.",
                tone: "formal",
                target_length: "short"
            };
        }

        if (!professors || professors.length === 0) {
            throw new Error("No valid professors found for the provided IDs");
        }

        console.log(`Generating drafts for ${professors.length} professors...`);

        const draftsToInsert = [];
        let lastError = null;

        // 3. Generate individual drafts
        for (const prof of professors) {
            try {
                console.log(`Generating for ${prof.name}...`);
                const generated = await generateEmailDraft({
                    profile,
                    prof,
                    template
                });

                draftsToInsert.push({
                    user_id: session.user.id,
                    professor_id: prof.id,
                    template_id: template.id || undefined,
                    subject: generated.subject,
                    body: generated.body,
                    status: "generated"
                });
            } catch (err: any) {
                console.error(`Failed to generate draft for professor ${prof.id}:`, err);
                lastError = err.message;
            }
        }

        if (draftsToInsert.length === 0) {
            throw new Error(lastError || "Failed to generate any drafts");
        }

        console.log(`Saving and returning ${draftsToInsert.length} drafts...`);

        // 4. Save drafts AND return with joined professor info in one atomic operation
        const { data: finalDrafts, error: insertError } = await supabaseAdmin
            .from("drafts")
            .insert(draftsToInsert)
            .select(`
                *,
                professor:professors (
                    name,
                    university
                )
            `);

        if (insertError) {
            console.error("Insert error:", insertError);
            throw insertError;
        }

        console.log(`Returning ${finalDrafts?.length || 0} drafts to frontend.`);
        return NextResponse.json(finalDrafts || []);

    } catch (e: any) {
        console.error("AI Generation Error:", e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
