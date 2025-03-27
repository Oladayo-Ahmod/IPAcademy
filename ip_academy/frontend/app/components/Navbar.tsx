"use client";

import Link from 'next/link';
import { useAuth } from "../contexts/AuthContext";


export default function Navbar() {
  const { identity, isAuthenticated, login, logout } = useAuth();

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-indigo-600">
              IP Academy
            </Link>
            {isAuthenticated && (
              <div className="hidden md:ml-10 md:flex md:space-x-8">
                <Link href="/courses" className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium">
                  Browse Courses
                </Link>
                {/* <Link href="/my-courses" className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium">
                  My Courses
                </Link> */}
              </div>
            )}
          </div>

          <div className="flex items-center">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">
                  {identity?.getPrincipal().toString().slice(0, 5)}...{identity?.getPrincipal().toString().slice(-3)}
                </span>
                <button
                  onClick={logout}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={login}
                className="text-sm text-indigo-600 hover:text-indigo-800"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}