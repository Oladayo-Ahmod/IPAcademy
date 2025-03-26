"use client";
import { useAuth } from "../contexts/AuthContext";

export default function RoleSelection() {
  const { setUserRole } = useAuth();

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Select Your Role</h2>
      <div className="grid grid-cols-1 gap-4">
        <button
          onClick={() => setUserRole('student')}
          className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-md transition-colors"
        >
          I'm a Student
        </button>
        <button
          onClick={() => setUserRole('instructor')}
          className="bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-md transition-colors"
        >
          I'm a Course Creator
        </button>
      </div>
    </div>
  );
}