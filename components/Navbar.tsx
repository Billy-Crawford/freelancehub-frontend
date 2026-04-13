"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      {/* Logo */}
      <h1 className="text-xl font-bold text-blue-600">FreelanceApp</h1>

      {/* Liens */}
      <div className="flex gap-6 items-center">
        <Link href="/" className="hover:text-blue-600">
          Accueil
        </Link>
        
        <Link href="/messages" className="hover:text-blue-600">
          Messages
        </Link>

        {/* 🔹 Dropdown Missions */}
        <div
          className="relative"
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          <button className="hover:text-blue-600">Missions ▾</button>

          {open && (
            <div className="absolute top-8 left-0 bg-white shadow-md rounded w-52 py-2 z-50">
              <Link
                href="/missions"
                className="block px-4 py-2 hover:bg-gray-100"
              >
                Toutes les missions
              </Link>

              {/* 🔹 Client */}
              {user?.role === "client" && (
                <Link
                  href="/my-missions"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Mes missions
                </Link>
              )}

              {user?.role === "client" && (
                <>
                  <Link
                    href="/missions/create"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Créer une mission
                  </Link>
                </>
              )}

              {/* 🔹 Freelance */}
              {user?.role === "freelance" && (
                <Link
                  href="/applications"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Mes candidatures
                </Link>
              )}
            </div>
          )}
        </div>

        {/* 🔹 Auth */}
        {!user ? (
          <>
            <Link href="/login" className="hover:text-blue-600">
              Login
            </Link>
            <Link href="/register" className="hover:text-blue-600">
              Register
            </Link>
          </>
        ) : (
          <>
            <Link href="/profile" className="hover:text-blue-600">
              Profile
            </Link>

            <button
              onClick={handleLogout}
              className="text-red-500 hover:text-red-700 font-semibold"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
