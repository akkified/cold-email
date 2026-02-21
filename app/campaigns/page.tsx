"use client";

import { useState, useEffect } from "react";
import { Plus, List, Send, Users, ArrowRight, LayoutDashboard } from "lucide-react";
import Link from "next/link";

// Reuse Dashboard logic but with specific Campaigns focus
export default function CampaignsPage() {
    const [campaigns, setCampaigns] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCampaigns();
    }, []);

    const fetchCampaigns = async () => {
        try {
            const res = await fetch("/api/campaigns");
            const data = await res.json();
            if (Array.isArray(data)) {
                setCampaigns(data);
            } else {
                console.error("Expected array from /api/campaigns, got:", data);
                setCampaigns([]);
            }
        } catch (e) {
            console.error(e);
            setCampaigns([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCampaign = async (e: React.MouseEvent, id: string, name: string) => {
        e.preventDefault();
        e.stopPropagation();

        if (!confirm(`Are you sure you want to delete "${name}"? This will also remove all associated professors and drafts.`)) {
            return;
        }

        try {
            const res = await fetch(`/api/campaigns?id=${id}`, { method: "DELETE" });
            if (res.ok) {
                setCampaigns(campaigns.filter(c => c.id !== id));
            } else {
                const data = await res.json();
                alert("Failed to delete campaign: " + (data.error || "Unknown error"));
            }
        } catch (err) {
            console.error(err);
            alert("An error occurred while deleting the campaign.");
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-50 p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Campaigns</h1>
                        <p className="text-zinc-400 mt-1">Your outreach history and active batches.</p>
                    </div>
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-2 px-4 py-2 border border-zinc-700 hover:bg-zinc-800 rounded-xl font-semibold transition-all"
                    >
                        <LayoutDashboard className="h-4 w-4" />
                        Back to Dashboard
                    </Link>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-40 bg-zinc-900 animate-pulse rounded-2xl border border-zinc-800" />
                        ))}
                    </div>
                ) : campaigns.length === 0 ? (
                    <div className="text-center py-20 bg-zinc-900/50 rounded-2xl border border-dashed border-zinc-800">
                        <List className="h-12 w-12 text-zinc-700 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-zinc-300">No campaigns yet</h2>
                        <p className="text-zinc-500 mt-2">Go to the Dashboard to create your first batch.</p>
                        <Link
                            href="/dashboard"
                            className="inline-block mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all"
                        >
                            Create Campaign
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {campaigns.map((c) => (
                            <div key={c.id} className="relative group">
                                <Link
                                    href={`/campaigns/${c.id}`}
                                    className="block p-6 bg-zinc-900 border border-zinc-800 rounded-2xl hover:border-blue-500/50 hover:bg-zinc-800/50 transition-all"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="p-3 rounded-xl bg-blue-600/10 text-blue-500">
                                            <Users className="h-5 w-5" />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={(e) => handleDeleteCampaign(e, c.id, c.name)}
                                                className="p-2 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                                                title="Delete Campaign"
                                            >
                                                <Plus className="h-5 w-5 rotate-45" />
                                            </button>
                                            <ArrowRight className="h-5 w-5 text-zinc-600 group-hover:text-blue-500 transition-colors" />
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold group-hover:text-blue-400 transition-colors">{c.name}</h3>
                                    <p className="text-zinc-400 text-sm mt-2 line-clamp-2">{c.description || "No description provided."}</p>
                                    <div className="mt-6 pt-6 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-500">
                                        <span className="flex items-center gap-1.5">
                                            <Send className="h-3 w-3" />
                                            Sent: 0
                                        </span>
                                        <span>{new Date(c.created_at).toLocaleDateString()}</span>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
