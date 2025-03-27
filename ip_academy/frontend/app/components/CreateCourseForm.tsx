"use client";

import { useState } from 'react';
import { useAuth } from "../contexts/AuthContext";
import { canisterId, createActor } from '../utils/dfx_generated/hello_world/index';


export default function CreateCourseForm({ onCreated }: { onCreated: () => void }) {
  const { identity } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '',
    prerequisites: '',
    skillLevel: 'beginner',
    price: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const actor = createActor(canisterId, {
        agentOptions: { identity }
      });
      
      await actor.createCourse(
        formData.title,
        formData.description,
        BigInt(parseInt(formData.duration)),
        formData.skillLevel,
        formData.prerequisites.split(',').map(p => p.trim()),
        BigInt(parseInt(formData.price))
      );
      
      onCreated();
      setFormData({
        title: '',
        description: '',
        duration: '',
        prerequisites: '',
        skillLevel: 'beginner',
        price: ''
      });
    } catch (error) {
      console.error("Error creating course:", error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Create New Course</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="mt-1 text-black block w-full rounded-md border-gray-300 shadow-sm focus:text-black focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={3}
              className="mt-1 text-black block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Duration (weeks)</label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({...formData, duration: e.target.value})}
                className="mt-1 block text-black w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Price (ICP)</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                className="mt-1 block w-full text-black rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Prerequisites (comma separated)</label>
            <input
              type="text"
              value={formData.prerequisites}
              onChange={(e) => setFormData({...formData, prerequisites: e.target.value})}
              className="mt-1 block w-full text-black rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Skill Level</label>
            <select
              value={formData.skillLevel}
              onChange={(e) => setFormData({...formData, skillLevel: e.target.value})}
              className="mt-1 block w-full text-black rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <div className="mt-4">
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md transition-colors"
            >
              Create Course
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}