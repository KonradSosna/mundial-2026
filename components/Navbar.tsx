"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const { user, profile, logout } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    setOpen(false);
    await logout();
    router.push("/login");
  };

  const close = () => setOpen(false);

  return (
    <nav className="bg-green-800 text-white shadow-lg">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl hover:text-yellow-300 transition-colors" onClick={close}>
          <span>⚽</span>
          <span>Mundial 2026</span>
        </Link>

        {/* Desktop menu */}
        <div className="hidden sm:flex items-center gap-4 text-sm">
          <Link href="/" className="hover:text-yellow-300 transition-colors">
            Mecze
          </Link>
          <Link href="/leaderboard" className="hover:text-yellow-300 transition-colors">
            Ranking
          </Link>

          {user ? (
            <>
              <Link href="/profile" className="hover:text-yellow-300 transition-colors">
                Moje typy
              </Link>
              {profile?.isAdmin && (
                <Link href="/admin" className="hover:text-yellow-300 transition-colors text-yellow-400">
                  Admin
                </Link>
              )}
              <div className="flex items-center gap-2 border-l border-green-600 pl-4">
                <span className="text-yellow-300 font-semibold">
                  {profile?.points ?? 0} pkt
                </span>
                <span className="text-green-300">{profile?.displayName}</span>
                <button
                  onClick={handleLogout}
                  className="bg-green-700 hover:bg-green-600 px-3 py-1 rounded transition-colors"
                >
                  Wyloguj
                </button>
              </div>
            </>
          ) : (
            <div className="flex gap-2 border-l border-green-600 pl-4">
              <Link href="/login" className="hover:text-yellow-300 transition-colors">
                Logowanie
              </Link>
              <Link
                href="/register"
                className="bg-yellow-400 text-green-900 px-3 py-1 rounded font-semibold hover:bg-yellow-300 transition-colors"
              >
                Rejestracja
              </Link>
            </div>
          )}
        </div>

        {/* Hamburger button */}
        <button
          className="sm:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          <span className={`block w-6 h-0.5 bg-white transition-all duration-200 ${open ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-6 h-0.5 bg-white transition-all duration-200 ${open ? "opacity-0" : ""}`} />
          <span className={`block w-6 h-0.5 bg-white transition-all duration-200 ${open ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="sm:hidden bg-green-900 px-4 pb-4 flex flex-col gap-3 text-sm">
          <Link href="/" onClick={close} className="py-2 border-b border-green-700 hover:text-yellow-300 transition-colors">
            Mecze
          </Link>
          <Link href="/leaderboard" onClick={close} className="py-2 border-b border-green-700 hover:text-yellow-300 transition-colors">
            Ranking
          </Link>

          {user ? (
            <>
              <Link href="/profile" onClick={close} className="py-2 border-b border-green-700 hover:text-yellow-300 transition-colors">
                Moje typy
              </Link>
              {profile?.isAdmin && (
                <Link href="/admin" onClick={close} className="py-2 border-b border-green-700 text-yellow-400 hover:text-yellow-300 transition-colors">
                  Admin
                </Link>
              )}
              <div className="pt-1 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-yellow-300 font-semibold">{profile?.points ?? 0} pkt</span>
                  <span className="text-green-300">{profile?.displayName}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full bg-green-700 hover:bg-green-600 px-3 py-2 rounded transition-colors text-left"
                >
                  Wyloguj
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-2 pt-1">
              <Link href="/login" onClick={close} className="py-2 hover:text-yellow-300 transition-colors">
                Logowanie
              </Link>
              <Link
                href="/register"
                onClick={close}
                className="bg-yellow-400 text-green-900 px-3 py-2 rounded font-semibold hover:bg-yellow-300 transition-colors text-center"
              >
                Rejestracja
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
