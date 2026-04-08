// components/Navbar.tsx
"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();       // Déconnecte l'utilisateur et suppprime les tokens
    router.push("/"); 
  };

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      
      {/* Logo */}
      <h1 className="text-xl font-bold text-blue-600">
        FreelanceApp
      </h1>

      {/* Liens */}
      <div className="flex gap-6">
        <Link href="/" className="hover:text-blue-600">Accueil</Link>
        <Link href="/missions" className="hover:text-blue-600">Missions</Link>

        {!user && (
          <>
            <Link href="/login" className="hover:text-blue-600">Login</Link>
            <Link href="/register" className="hover:text-blue-600">Register</Link>
          </>
        )}

        {user && (
          <>
            <Link href="/profile" className="hover:text-blue-600">Profile</Link>
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

