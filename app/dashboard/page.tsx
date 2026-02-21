"use client";

import { useState, useEffect } from "react";
import { Plus, List, Send, Users, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
    const [campaigns, setCampaigns] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newCampaign, setNewCampaign] = useState({ name: "", description: "" });

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

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/campaigns", {
                method: "POST",
                body: JSON.stringify(newCampaign),
            });
            const data = await res.json();
            setCampaigns([data, ...campaigns]);
            setIsModalOpen(false);
            setNewCampaign({ name: "", description: "" });
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-50 p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Dashboard</h1>
                        <p className="text-zinc-400 mt-1">Manage your professor outreach batches.</p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl font-semibold transition-all"
                    >
                        <Plus className="h-4 w-4" />
                        New Campaign
                    </button>
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
                        <p className="text-zinc-500 mt-2">Create your first batch to start drafting emails.</p>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold transition-all"
                        >
                            Create First Campaign
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {campaigns.map((c) => (
                            <Link
                                key={c.id}
                                href={`/campaigns/${c.id}`}
                                className="group block p-6 bg-zinc-900 border border-zinc-800 rounded-2xl hover:border-blue-500/50 hover:bg-zinc-800/50 transition-all"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="p-3 rounded-xl bg-blue-600/10 text-blue-500">
                                        <Users className="h-5 w-5" />
                                    </div>
                                    <ArrowRight className="h-5 w-5 text-zinc-600 group-hover:text-blue-500 transition-colors" />
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
                        ))}
                    </div>
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl max-w-md w-full shadow-2xl">
                        <h2 className="text-2xl font-bold mb-6">Create Campaign</h2>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-400">Campaign Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Summer 2024 Research"
                                    value={newCampaign.name}
                                    onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-400">Description (Optional)</label>
                                <textarea
                                    placeholder="What is this batch for?"
                                    value={newCampaign.description}
                                    onChange={(e) => setNewCampaign({ ...newCampaign, description: e.target.value })}
                                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none h-24 resize-none"
                                />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-2 rounded-xl border border-zinc-700 hover:bg-zinc-800 font-semibold"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-white shadow-lg shadow-blue-900/20"
                                >
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
