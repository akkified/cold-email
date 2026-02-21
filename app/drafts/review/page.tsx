"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
    Send,
    Edit3,
    CheckCircle2,
    Clock,
    AlertTriangle,
    Loader2,
    ChevronLeft
} from "lucide-react";
import Link from "next/link";

function DraftReviewContent() {
    const searchParams = useSearchParams();
    const profIds = searchParams.get("ids")?.split(",") || [];
    const templateId = searchParams.get("templateId");
    const [drafts, setDrafts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [progress, setProgress] = useState({ current: 0, total: 0 });

    useEffect(() => {
        if (profIds.length > 0 && templateId) {
            generateDrafts();
        } else {
            console.log("Missing profIds or templateId:", { profIds, templateId });
            setLoading(false);
        }
    }, [searchParams.toString()]);

    const generateDrafts = async () => {
        setLoading(true);
        try {
            console.log("Generating drafts for:", { profIds, templateId });
            const res = await fetch("/api/drafts/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    professorIds: profIds,
                    templateId: templateId
                }),
            });
            const data = await res.json();
            if (res.ok) {
                console.log("Drafts received:", data);
                setDrafts(Array.isArray(data) ? data : []);
            } else {
                console.error("Generation error:", data.error);
                alert("Generation failed: " + data.error);
            }
        } catch (e) {
            console.error("Error generating drafts:", e);
            alert("An error occurred during generation.");
        } finally {
            setLoading(false);
        }
    };

    const handleSend = async () => {
        if (drafts.length === 0) return;
        if (!confirm(`Are you sure you want to send ${drafts.length} drafts via Gmail?`)) return;

        setSending(true);
        setProgress({ current: 0, total: drafts.length });

        try {
            const res = await fetch("/api/drafts/send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    draftIds: drafts.map(d => d.id)
                }),
            });

            const data = await res.json();
            if (res.ok) {
                const updatedDrafts = drafts.map(d => {
                    const result = data.find((r: any) => r.draft_id === d.id);
                    if (result?.status === 'sent') return { ...d, status: 'sent' };
                    if (result?.error) return { ...d, status: 'failed', error: result.error };
                    return d;
                });
                setDrafts(updatedDrafts);
                alert("Outreach complete! Check the status indicators.");
            } else {
                alert("Sending failed: " + (data.error || "Unknown error"));
            }
        } catch (e) {
            console.error("Error sending drafts:", e);
            alert("An error occurred while sending.");
        } finally {
            setSending(false);
        }
    };

    const updateDraft = (idx: number, field: string, value: string) => {
        const newDrafts = [...drafts];
        newDrafts[idx] = { ...newDrafts[idx], [field]: value };
        setDrafts(newDrafts);
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-50 p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <Link href="/dashboard" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
                        <ChevronLeft className="h-4 w-4" />
                        Back
                    </Link>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-zinc-500 italic">
                            Daily Cap: 3/15 sent
                        </span>
                        <button
                            onClick={handleSend}
                            disabled={loading || sending || drafts.length === 0}
                            className="flex items-center gap-2 px-8 py-3 bg-green-600 hover:bg-green-500 rounded-xl font-bold transition-all shadow-lg shadow-green-900/20 disabled:opacity-50"
                        >
                            <Send className="h-4 w-4" />
                            {sending ? `Sending (${progress.current}/${progress.total})...` : "Send All Drafts"}
                        </button>
                    </div>
                </div>

                <div className="bg-yellow-600/10 border border-yellow-500/20 p-4 rounded-xl flex items-start gap-4">
                    <AlertTriangle className="h-5 w-5 text-yellow-500 shrink-0" />
                    <p className="text-sm text-yellow-200/80">
                        <strong>Check before sending:</strong> AI can make mistakes. Ensure the paper title and your experience description are accurate. Honesty is crucial in academic outreach.
                    </p>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
                        <p className="text-zinc-400 animate-pulse">Generating drafts using LLM...</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {drafts.map((draft, idx) => (
                            <div key={draft.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
                                <div className="p-4 bg-zinc-800/50 border-b border-zinc-800 flex justify-between items-center">
                                    <div>
                                        <h3 className="font-bold text-zinc-200">
                                            {draft.professor?.name || "Professor"}
                                        </h3>
                                        <p className="text-xs text-zinc-500">
                                            {draft.professor?.university || "University"}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
                                        {draft.status === 'sent' ? (
                                            <span className="text-green-500 flex items-center gap-1">
                                                <CheckCircle2 className="h-3 w-3" /> Sent
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1">
                                                <Clock className="h-3 w-3" /> Ready
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest">Subject</label>
                                        <input
                                            type="text"
                                            value={draft.subject}
                                            onChange={(e) => updateDraft(idx, "subject", e.target.value)}
                                            className="w-full bg-transparent border-b border-zinc-800 focus:border-blue-500 outline-none py-1 text-zinc-300 font-medium"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest">Body</label>
                                        <textarea
                                            rows={8}
                                            value={draft.body}
                                            onChange={(e) => updateDraft(idx, "body", e.target.value)}
                                            className="w-full bg-zinc-800/30 p-4 border border-zinc-800 rounded-xl focus:border-blue-500 outline-none text-zinc-400 text-sm font-light leading-relaxed resize-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function DraftReviewPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-4">
                <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
                <p className="text-zinc-400">Loading Review Content...</p>
            </div>
        }>
            <DraftReviewContent />
        </Suspense>
    );
}
