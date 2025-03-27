"use client";
import React, { useEffect, useState } from 'react';
import { useAuth } from "./contexts/AuthContext";
import Navbar from './components/Navbar';
import CourseCard from './components/CourseCard';
import CreateCourseForm from './components/CreateCourseForm';
import { canisterId, createActor } from './utils/dfx_generated/hello_world/index';
import RegistrationForm from './components/RegistrationForm';
import { showErrorToast, showInfoToast, showSuccessToast } from './utils/toast';
import RoleSelection from './components/RoleSelection';


export default function Home() {
  const { identity, isAuthenticated, login, isRegistered, userRole, checkRegistration } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'my-courses'>('all');
  const [initialCheckDone, setInitialCheckDone] = useState(false);

  const fetchCourses = async (type: 'all' | 'my-courses' = 'all') => {
    try {
      const actor = createActor(canisterId, {
        agentOptions: { identity }
      });

      const result = type === 'all'
        ? await actor.getCourses()
        : await actor.getCoursesEnrolledByUser();

      setCourses(result);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  // Check registration status and fetch courses
  useEffect(() => {
    const initialize = async () => {
      if (!isAuthenticated) return;

      try {
        // First check registration status and role
        await checkRegistration();
        setInitialCheckDone(true);

        // Then fetch appropriate courses
        const actor = createActor(canisterId, {
          agentOptions: { identity }
        });

        const result = activeTab === 'all'
          ? await actor.getCourses()
          : await actor.getCoursesEnrolledByUser();

        setCourses(result);
      } catch (error) {
        console.error("Initialization error:", error);
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, [isAuthenticated, activeTab, identity, checkRegistration]);

  const handleEnroll = async (courseId: bigint) => {
    if (!isRegistered) {
      showInfoToast('Please complete student registration first');
      return;
    }
    try {
      const actor = createActor(canisterId, {
        agentOptions: { identity }
      });
      await actor.enrollStudent(courseId);
      showSuccessToast('Successfully enrolled in the course!');
      fetchCourses(activeTab);
    } catch (error) {
      showErrorToast('Enrollment failed. Please try again.');
      console.error("Error enrolling:", error);
    }
  };

  const handleCourseCreated = () => {
    showSuccessToast('Course created successfully!');
    setShowCreateForm(false);
    fetchCourses();
  };

  // Handle refresh scenario
  if (isAuthenticated && !initialCheckDone) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="text-center p-8 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Welcome to ICP Courses
            </h2>
            <button
              onClick={login}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-md transition-colors"
            >
              Login with Internet Identity
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!isRegistered) {
    console.log(userRole, 'fore')
    // New user - show role selection
    if (userRole === null) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <RoleSelection />
        </div>
      );
    }

    // Show registration form ONLY for unregistered students
    if (userRole === 'student' && !isRegistered) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <RegistrationForm />
        </div>
      );
    }
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {activeTab === 'all' ? 'Available Courses' : 'My Enrolled Courses'}
          </h1>

          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-md ${activeTab === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              All Courses
            </button>
            <button
              onClick={() => setActiveTab('my-courses')}
              className={`px-4 py-2 rounded-md ${activeTab === 'my-courses' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              My Courses
            </button>
            {/* Only show create button for instructors */}
            {userRole === 'instructor' && (
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
              >
                Create Course
              </button>
            )}
          </div>
        </div>

        {showCreateForm && (
          <div className="mb-8">
            <CreateCourseForm onCreated={handleCourseCreated} />
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No courses found. {activeTab === 'all' ? 'Why not create one?' : 'Enroll in some courses!'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => {
              const isEnrolled = identity
                ? course.students.some(student =>
                  student.toString() === identity.getPrincipal().toString()
                )
                : false;

              return (
                <CourseCard
                  key={Number(course.id)}
                  course={course}
                  isEnrolled={isEnrolled}
                  onEnroll={
                    userRole === 'student' &&
                      activeTab === 'all' &&
                      !isEnrolled
                      ? handleEnroll
                      : undefined
                  }
                />
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}