"use client";
import React, { useState } from 'react';
import { useAuth } from "../contexts/AuthContext";
import { showErrorToast, showSuccessToast } from '../utils/toast';

export default function RegistrationForm() {
  const { registerStudent } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    skills: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Registration handler
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);
  try {
    const success = await registerStudent(
      formData.name,
      formData.email,
      formData.skills.split(',').map(s => s.trim())
    );
    if (success) {
      showSuccessToast('Registration completed successfully!');
    }
  } catch (error) {
    showErrorToast('Registration failed. Please try again.');
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Student Registration</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Skills (comma separated)
          </label>
          <input
            type="text"
            value={formData.skills}
            onChange={(e) => setFormData({...formData, skills: e.target.value})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="e.g., JavaScript, React, Motoko"
          />
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isSubmitting ? 'Registering...' : 'Complete Registration'}
        </button>
      </form>
    </div>
  );
}