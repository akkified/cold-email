"use client";

import { useState, useEffect, use } from "react";
import {
    Plus,
    Upload,
    Trash2,
    Sparkles,
    ArrowLeft,
    CheckCircle2,
    AlertCircle,
    ChevronRight,
    FileText
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ImportProfessorsModal from "@/components/ImportProfessorsModal";

export default function CampaignPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: campaignId } = use(params);
    const router = useRouter();
    const [professors, setProfessors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedProfIds, setSelectedProfIds] = useState<string[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [templates, setTemplates] = useState<any[]>([]);

    useEffect(() => {
        fetchProfessors();
        fetchTemplates();
    }, [campaignId]);

    const fetchTemplates = async () => {
        try {
            const res = await fetch("/api/templates");
            const data = await res.json();
            if (Array.isArray(data)) setTemplates(data);
        } catch (e) {
            console.error(e);
        }
    };

    const fetchProfessors = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/professors?campaignId=${campaignId}`);
            const data = await res.json();
            setProfessors(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const toggleSelect = (id: string) => {
        setSelectedProfIds(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    const handleGenerateDrafts = async () => {
        if (selectedProfIds.length === 0) return;
        setIsGenerating(true);

        // Use the first template for now
        const templateId = templates[0]?.id || "default";
        router.push(`/drafts/review?ids=${selectedProfIds.join(',')}&templateId=${templateId}`);
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-50 p-8">
            <ImportProfessorsModal
                isOpen={isImportModalOpen}
                onClose={() => setIsImportModalOpen(false)}
                campaignId={campaignId}
                onImported={fetchProfessors}
            />

            <div className="max-w-6xl mx-auto space-y-8">
                <Link href="/dashboard" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group">
                    <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Dashboard
                </Link>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold">Campaign Details</h1>
                        <p className="text-zinc-400 mt-1">Select professors to generate personalized drafts.</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setIsImportModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl hover:bg-zinc-800 transition-colors"
                        >
                            <Upload className="h-4 w-4" />
                            Import Professors
                        </button>
                        <button
                            onClick={handleGenerateDrafts}
                            disabled={selectedProfIds.length === 0 || isGenerating}
                            className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold disabled:opacity-50 disabled:grayscale transition-all shadow-lg shadow-blue-900/20"
                        >
                            <Sparkles className="h-4 w-4" />
                            Generate {selectedProfIds.length} Drafts
                        </button>
                    </div>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-zinc-800/50">
                            <tr>
                                <th className="p-4 w-12 text-center">
                                    <input
                                        type="checkbox"
                                        onChange={(e) => {
                                            if (e.target.checked) setSelectedProfIds(professors.map(p => p.id));
                                            else setSelectedProfIds([]);
                                        }}
                                        checked={selectedProfIds.length === professors.length && professors.length > 0}
                                        className="rounded border-zinc-700 bg-zinc-900"
                                    />
                                </th>
                                <th className="p-4 font-semibold text-zinc-300">Professor</th>
                                <th className="p-4 font-semibold text-zinc-300">University</th>
                                <th className="p-4 font-semibold text-zinc-300">Research Area</th>
                                <th className="p-4 font-semibold text-zinc-300">Status</th>
                                <th className="p-4 w-12"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800">
                            {loading ? (
                                Array.from({ length: 3 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={6} className="p-8 h-10 bg-zinc-900/30"></td>
                                    </tr>
                                ))
                            ) : professors.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-20 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <FileText className="h-10 w-10 text-zinc-700" />
                                            <span className="text-zinc-500">No professors in this campaign.</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                professors.map((p) => (
                                    <tr key={p.id} className="hover:bg-zinc-800/30 transition-colors">
                                        <td className="p-4 text-center">
                                            <input
                                                type="checkbox"
                                                checked={selectedProfIds.includes(p.id)}
                                                onChange={() => toggleSelect(p.id)}
                                                className="rounded border-zinc-700 bg-zinc-900 text-blue-600"
                                            />
                                        </td>
                                        <td className="p-4">
                                            <div className="font-medium">{p.name}</div>
                                            <div className="text-xs text-zinc-500">{p.email}</div>
                                        </td>
                                        <td className="p-4 text-sm text-zinc-400">{p.university}</td>
                                        <td className="p-4 text-sm text-zinc-400">{p.research_area || "-"}</td>
                                        <td className="p-4">
                                            <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-zinc-800 text-zinc-400 border border-zinc-700">
                                                <AlertCircle className="h-3 w-3" />
                                                No Draft
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <ChevronRight className="h-4 w-4 text-zinc-600" />
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 bg-blue-600/5 border border-blue-500/20 rounded-2xl">
                        <h3 className="text-blue-400 font-bold flex items-center gap-2 mb-2">
                            <CheckCircle2 className="h-4 w-4" />
                            Ethical Tip
                        </h3>
                        <p className="text-sm text-zinc-400">
                            Mention a specific paper title. It shows you've actually looked at their work and aren't just spamming.
                        </p>
                    </div>
                    {/* More tips or stats here */}
                </div>
            </div>
        </div>
    );
}
