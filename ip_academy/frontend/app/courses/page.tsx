// app/courses/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useAuth } from "../contexts/AuthContext";
import CourseCard from '../components/CourseCard';
import { canisterId, createActor } from '../utils/dfx_generated/hello_world/index';
import { _SERVICE } from '../utils/dfx_generated/hello_world/hello_world.did';

export default function CoursesPage() {
  const { identity, isAuthenticated } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchCourses = async () => {
      try {
        const actor = createActor(canisterId, {
          agentOptions: { identity }
        });
        const result = await actor.getCourses();
        setCourses(result);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [isAuthenticated, identity]);

  const handleEnroll = async (courseId: bigint) => {
    try {
      const actor = createActor(canisterId, {
        agentOptions: { identity }
      });
      await actor.enrollStudent(courseId);
      // Refresh courses after enrollment
      const updatedCourses = await actor.getCourses();
      setCourses(updatedCourses);
    } catch (error) {
      console.error("Error enrolling:", error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Please login to view courses
          </h2>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Available Courses</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard 
              key={Number(course.id)} 
              course={course} 
              onEnroll={handleEnroll}
            />
          ))}
        </div>
      </div>
    </div>
  );
}