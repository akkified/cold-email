"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    FileText,
    UserCircle,
    Settings,
    LogOut,
    Mail
} from "lucide-react";
import { signOut } from "next-auth/react";

const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, exact: true },
    { name: "Campaigns", href: "/campaigns", icon: Users },
    { name: "Templates", href: "/templates", icon: FileText },
    { name: "Profile", href: "/profile", icon: UserCircle },
];

export function Sidebar() {
    const pathname = usePathname();

    if (pathname === "/login" || pathname === "/") return null;

    return (
        <div className="w-64 bg-zinc-900 border-r border-zinc-800 h-screen sticky top-0 flex flex-col">
            <div className="p-6">
                <div className="flex items-center gap-3 text-white mb-8">
                    <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <Mail className="h-5 w-5" />
                    </div>
                    <span className="font-bold text-lg tracking-tight">ColdEmailer</span>
                </div>

                <nav className="space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = item.exact
                            ? pathname === item.href
                            : pathname.startsWith(item.href);
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
                                    : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                                    }`}
                            >
                                <Icon className="h-5 w-5" />
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="mt-auto p-6 border-t border-zinc-800">
                <button
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="w-full flex items-center gap-3 px-4 py-3 text-zinc-400 hover:text-red-400 hover:bg-red-500/5 rounded-xl transition-all"
                >
                    <LogOut className="h-5 w-5" />
                    <span className="font-medium">Sign Out</span>
                </button>
            </div>
        </div>
    );
}
