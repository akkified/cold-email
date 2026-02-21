"use client";

import { useState, useRef } from "react";
import { X, Upload, Clipboard, UserPlus, Table, AlertCircle, Trash2, Check, FileSpreadsheet, Plus } from "lucide-react";

interface ImportProfessorsModalProps {
    isOpen: boolean;
    onClose: () => void;
    campaignId: string;
    onImported: () => void;
}

type ImportTab = "manual" | "csv" | "paste";

export default function ImportProfessorsModal({ isOpen, onClose, campaignId, onImported }: ImportProfessorsModalProps) {
    const [activeTab, setActiveTab] = useState<ImportTab>("csv");
    const [previewData, setPreviewData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Manual Form State
    const [manualEntry, setManualEntry] = useState({
        name: "",
        email: "",
        university: "",
        department: "",
        research_area: "",
    });

    if (!isOpen) return null;

    const handlePaste = (e: React.ClipboardEvent) => {
        const text = e.clipboardData.getData("text");
        if (!text) return;

        // Simple TSV parser (Excel/Sheets usually paste as tab-separated)
        const rows = text.split(/\r?\n/).filter(line => line.trim());
        const parsed = rows.map(row => {
            const cols = row.split("\t");
            return {
                name: cols[0]?.trim() || "",
                email: cols[1]?.trim() || "",
                university: cols[2]?.trim() || "",
                department: cols[3]?.trim() || "",
                research_area: cols[4]?.trim() || "",
            };
        });

        setPreviewData([...previewData, ...parsed]);
        setActiveTab("manual"); // Switch to preview
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target?.result as string;
            // Simple CSV parser (split by comma, handle quotes loosely)
            const rows = text.split(/\r?\n/).filter(line => line.trim());
            // Skip header if it looks like one
            const startIdx = rows[0].toLowerCase().includes("name") ? 1 : 0;

            const parsed = rows.slice(startIdx).map(row => {
                const cols = row.split(",").map(c => c.replace(/^["']|["']$/g, '').trim());
                return {
                    name: cols[0] || "",
                    email: cols[1] || "",
                    university: cols[2] || "",
                    department: cols[3] || "",
                    research_area: cols[4] || "",
                };
            });

            setPreviewData([...previewData, ...parsed]);
            setActiveTab("manual"); // Switch to preview
        };
        reader.readAsText(file);
    };

    const handleAddManual = (e: React.FormEvent) => {
        e.preventDefault();
        setPreviewData([...previewData, { ...manualEntry }]);
        setManualEntry({
            name: "",
            email: "",
            university: "",
            department: "",
            research_area: "",
        });
    };

    const handleSaveImport = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/professors", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    campaignId,
                    professors: previewData
                }),
            });

            if (res.ok) {
                onImported();
                onClose();
                setPreviewData([]);
            } else {
                const err = await res.json();
                alert("Error importing: " + err.error);
            }
        } catch (e) {
            console.error(e);
            alert("Failed to import professors.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-all">
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold">Add Professors</h2>
                        <p className="text-sm text-zinc-500">Choose how you want to import your leads.</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-xl transition-colors">
                        <X className="h-5 w-5 text-zinc-400" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex p-2 gap-1 bg-zinc-950/50 border-b border-zinc-800">
                    <button
                        onClick={() => setActiveTab("csv")}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-xl transition-all ${activeTab === "csv" ? "bg-blue-600 text-white shadow-lg" : "text-zinc-500 hover:text-zinc-300"}`}
                    >
                        <Upload className="h-4 w-4" />
                        CSV Upload
                    </button>
                    <button
                        onClick={() => setActiveTab("paste")}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-xl transition-all ${activeTab === "paste" ? "bg-blue-600 text-white shadow-lg" : "text-zinc-500 hover:text-zinc-300"}`}
                    >
                        <Clipboard className="h-4 w-4" />
                        Paste Table
                    </button>
                    <button
                        onClick={() => setActiveTab("manual")}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-xl transition-all ${activeTab === "manual" ? "bg-blue-600 text-white shadow-lg" : "text-zinc-500 hover:text-zinc-300"}`}
                    >
                        <UserPlus className="h-4 w-4" />
                        Manual & Preview ({previewData.length})
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8">
                    {activeTab === "csv" && (
                        <div
                            className="border-2 border-dashed border-zinc-800 rounded-3xl p-12 text-center hover:border-blue-500/50 transition-all cursor-pointer bg-zinc-950/30 group"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept=".csv" />
                            <div className="bg-blue-600/10 p-4 rounded-2xl w-fit mx-auto mb-4 group-hover:scale-110 transition-transform">
                                <FileSpreadsheet className="h-10 w-10 text-blue-500" />
                            </div>
                            <h3 className="text-lg font-bold mb-2">Upload your Professor List</h3>
                            <p className="text-zinc-500 text-sm max-w-sm mx-auto mb-6">
                                Drop your .csv file here or click to browse. Ensure headers include Name, Email, University.
                            </p>
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-800 rounded-xl text-sm font-medium text-zinc-300">
                                <Upload className="h-4 w-4" />
                                Select File
                            </div>
                        </div>
                    )}

                    {activeTab === "paste" && (
                        <div className="space-y-4">
                            <div className="bg-blue-900/10 border border-blue-500/20 p-4 rounded-2xl flex gap-3 text-sm text-blue-400">
                                <FileSpreadsheet className="h-5 w-5 flex-shrink-0" />
                                <p>Copy a range from Google Sheets or Excel and paste it here. We'll automatically detect Name, Email, and University.</p>
                            </div>
                            <textarea
                                onPaste={handlePaste}
                                placeholder="Paste your table data here..."
                                className="w-full h-64 bg-zinc-950 border border-zinc-800 rounded-2xl p-4 font-mono text-xs focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                            />
                        </div>
                    )}

                    {activeTab === "manual" && (
                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                            {/* Manual Entry Form */}
                            <form onSubmit={handleAddManual} className="lg:col-span-2 space-y-4">
                                <h4 className="font-bold text-zinc-300 flex items-center gap-2">
                                    <UserPlus className="h-4 w-4" />
                                    Add One
                                </h4>
                                <div className="space-y-3">
                                    <input
                                        type="text"
                                        placeholder="Full Name"
                                        value={manualEntry.name}
                                        onChange={e => setManualEntry({ ...manualEntry, name: e.target.value })}
                                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                                        required
                                    />
                                    <input
                                        type="email"
                                        placeholder="Email Address"
                                        value={manualEntry.email}
                                        onChange={e => setManualEntry({ ...manualEntry, email: e.target.value })}
                                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                                        required
                                    />
                                    <input
                                        type="text"
                                        placeholder="University"
                                        value={manualEntry.university}
                                        onChange={e => setManualEntry({ ...manualEntry, university: e.target.value })}
                                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Research Area"
                                        value={manualEntry.research_area}
                                        onChange={e => setManualEntry({ ...manualEntry, research_area: e.target.value })}
                                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                                >
                                    <Plus className="h-4 w-4" />
                                    Add to Batch
                                </button>
                            </form>

                            {/* Preview List */}
                            <div className="lg:col-span-3 flex flex-col">
                                <h4 className="font-bold text-zinc-300 flex items-center gap-2 mb-4">
                                    <Table className="h-4 w-4" />
                                    Batch Preview ({previewData.length})
                                </h4>
                                <div className="flex-1 bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden overflow-y-auto max-h-[300px]">
                                    {previewData.length === 0 ? (
                                        <div className="p-8 text-center text-zinc-600 text-sm italic">
                                            No professors added to this batch yet.
                                        </div>
                                    ) : (
                                        <table className="w-full text-xs text-left">
                                            <thead className="bg-zinc-900 sticky top-0">
                                                <tr>
                                                    <th className="p-3 border-b border-zinc-800">Name</th>
                                                    <th className="p-3 border-b border-zinc-800">Email</th>
                                                    <th className="p-3 border-b border-zinc-800 w-8"></th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-zinc-900">
                                                {previewData.map((p, i) => (
                                                    <tr key={i} className="hover:bg-zinc-900/50">
                                                        <td className="p-3 font-medium text-zinc-300">{p.name}</td>
                                                        <td className="p-3 text-zinc-500">{p.email}</td>
                                                        <td className="p-3">
                                                            <button
                                                                onClick={() => setPreviewData(previewData.filter((_, idx) => idx !== i))}
                                                                className="p-1 hover:text-red-400 transition-colors"
                                                            >
                                                                <Trash2 className="h-3 w-3" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-zinc-800 bg-zinc-950/50 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-zinc-500">
                        <Check className="h-4 w-4 text-green-500" />
                        {previewData.length} records ready to import
                    </div>
                    <div className="flex gap-3">
                        <button onClick={onClose} className="px-6 py-2 border border-zinc-800 hover:bg-zinc-800 rounded-xl font-bold transition-all">
                            Cancel
                        </button>
                        <button
                            onClick={handleSaveImport}
                            disabled={loading || previewData.length === 0}
                            className="px-8 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-900/20 disabled:opacity-50"
                        >
                            {loading ? "Importing..." : "Finish Import"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
