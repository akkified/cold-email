"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Save, User, GraduationCap, Sparkles } from "lucide-react";

export default function ProfilePage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [profile, setProfile] = useState({
        name: "",
        school: "",
        grade: "",
        location: "",
        interests: "",
        bio: "",
        experience: "",
    });

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        } else if (session?.user) {
            // Fetch existing profile from Supabase (handled in NextAuth sign-in, but let's fetch full details)
            fetchProfile();
        }
    }, [status, session]);

    const fetchProfile = async () => {
        try {
            const res = await fetch("/api/profile");
            const data = await res.json();
            if (res.ok && data && !data.error) {
                setProfile(prev => ({
                    ...prev,
                    ...data,
                    name: data.name || session?.user?.name || prev.name
                }));
            }
        } catch (e) {
            console.error("Error fetching profile:", e);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/profile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(profile),
            });
            const data = await res.json();

            if (res.ok) {
                router.push("/dashboard");
            } else {
                console.error("Error saving profile:", data);
                alert(`Failed to save profile: ${data.error || 'Unknown error'}. ${data.details || ''}`);
            }
        } catch (e) {
            console.error("Error during save:", e);
            alert("An error occurred while saving. Check the console for details.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-50 p-8">
            <div className="max-w-2xl mx-auto space-y-8">
                <div>
                    <h1 className="text-3xl font-bold">Your Student Profile</h1>
                    <p className="text-zinc-400 mt-2">
                        This info helps the AI draft more personalized and honest emails.
                    </p>
                </div>

                <form onSubmit={handleSave} className="space-y-6 bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-400">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                                <input
                                    type="text"
                                    value={profile.name}
                                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                    className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-400">School / University</label>
                            <div className="relative">
                                <GraduationCap className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                                <input
                                    type="text"
                                    value={profile.school}
                                    onChange={(e) => setProfile({ ...profile, school: e.target.value })}
                                    className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-400">Grade / Year</label>
                        <input
                            type="text"
                            placeholder="e.g. Junior at Lincoln High, Sophomore @ MIT"
                            value={profile.grade}
                            onChange={(e) => setProfile({ ...profile, grade: e.target.value })}
                            className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-400">Research Interests</label>
                        <div className="relative">
                            <Sparkles className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                            <input
                                type="text"
                                placeholder="e.g. Computer Vision, Synthetic Biology, Quantum Optics"
                                value={profile.interests}
                                onChange={(e) => setProfile({ ...profile, interests: e.target.value })}
                                className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-400">Key Experiences & Skills</label>
                        <textarea
                            rows={4}
                            placeholder="List relevant clubs, projects, or classes (e.g. 3 years in Robotics, AP Physics C, Volunteer @ Tech Museum)"
                            value={profile.experience}
                            onChange={(e) => setProfile({ ...profile, experience: e.target.value })}
                            className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all disabled:opacity-50"
                    >
                        <Save className="h-5 w-5" />
                        {loading ? "Saving..." : "Save & Continue to Dashboard"}
                    </button>
                </form>
            </div>
        </div>
    );
}
