"use client";

import { useState, useEffect } from "react";
import { Save, Wand2, FileText, ChevronRight } from "lucide-react";

const BUILT_IN_TEMPLATES = [
    {
        name: "First Contact: Research Mentorship",
        subject_template: "Inquiry regarding research opportunities in [RESEARCH_AREA]",
        body_template: "Dear Professor [PROF_NAME],\n\nI am a [GRADE] at [UNIVERSITY] and I recently read your paper titled \"[PAPER_TITLE]\". [WHY_THEIR_WORK].\n\n[YOUR_EXPERIENCE]. I am very interested in your work on [RESEARCH_AREA] and was wondering if you would be open to discussing potential mentorship or research opportunities in your lab.\n\nThank you for your time and consideration.",
        tone: "formal",
        target_length: "short"
    }
];

export default function TemplatesPage() {
    const [templates, setTemplates] = useState<any[]>(BUILT_IN_TEMPLATES);
    const [activeTemplate, setActiveTemplate] = useState<any>(BUILT_IN_TEMPLATES[0]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
        try {
            const res = await fetch("/api/templates");
            const data = await res.json();
            if (Array.isArray(data) && data.length > 0) {
                setTemplates(data);
                // If there's a user template, select it by default
                const userTpl = data.find((t: any) => !t.is_built_in);
                if (userTpl) setActiveTemplate(userTpl);
            }
        } catch (e) {
            console.error("Error fetching templates:", e);
        }
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/templates", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(activeTemplate),
            });
            if (res.ok) {
                alert("Template saved!");
                fetchTemplates();
            } else {
                const err = await res.json();
                alert("Error saving: " + err.error);
            }
        } catch (e) {
            console.error(e);
            alert("Failed to save template.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-50 p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                <div>
                    <h1 className="text-3xl font-bold">Email Templates</h1>
                    <p className="text-zinc-400 mt-1">Define how the AI should structure your outreach.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-1 space-y-4">
                        <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">Your Templates</h2>
                        <div className="space-y-2">
                            {templates.map((t, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveTemplate(t)}
                                    className={`w-full text-left p-4 rounded-xl border transition-all ${activeTemplate.name === t.name
                                        ? "bg-blue-600/10 border-blue-500 text-blue-400"
                                        : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                                        }`}
                                >
                                    <div className="font-medium text-sm">{t.name}</div>
                                    <div className="text-xs opacity-60 mt-1">{t.is_built_in ? "Built-in" : "Your Template"}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-3 bg-zinc-900 border border-zinc-800 rounded-2xl p-8 space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm border-zinc-400">Template Name</label>
                                <input
                                    type="text"
                                    value={activeTemplate.name}
                                    onChange={(e) => setActiveTemplate({ ...activeTemplate, name: e.target.value })}
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm border-zinc-400">Tone</label>
                                    <select
                                        value={activeTemplate.tone}
                                        onChange={(e) => setActiveTemplate({ ...activeTemplate, tone: e.target.value })}
                                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 outline-none"
                                    >
                                        <option value="formal">Formal</option>
                                        <option value="neutral">Neutral</option>
                                        <option value="friendly">Friendly</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm border-zinc-400">Target Length</label>
                                    <select
                                        value={activeTemplate.target_length}
                                        onChange={(e) => setActiveTemplate({ ...activeTemplate, target_length: e.target.value })}
                                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 outline-none"
                                    >
                                        <option value="short">Short (150-220 words)</option>
                                        <option value="medium">Medium</option>
                                        <option value="long">Long</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm border-zinc-400">Subject Line Pattern</label>
                                <input
                                    type="text"
                                    value={activeTemplate.subject_template}
                                    onChange={(e) => setActiveTemplate({ ...activeTemplate, subject_template: e.target.value })}
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 font-mono text-sm"
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm border-zinc-400">Body Template</label>
                                    <span className="text-xs text-zinc-500">Use [BRACKETS] for placeholders</span>
                                </div>
                                <textarea
                                    rows={10}
                                    value={activeTemplate.body_template}
                                    onChange={(e) => setActiveTemplate({ ...activeTemplate, body_template: e.target.value })}
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-4 font-mono text-sm resize-none outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
                            <button
                                onClick={handleSave}
                                disabled={loading}
                                className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold transition-all shadow-lg shadow-blue-900/20 disabled:opacity-50"
                            >
                                <Save className="h-4 w-4" />
                                {loading ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
