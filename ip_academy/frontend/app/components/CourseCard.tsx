"use client";
import { Principal } from '@dfinity/principal';
import { useAuth } from "../contexts/AuthContext";

interface Course {
  id: bigint;
  title: string;
  description: string;
  duration: bigint;
  students: Principal[];
  prerequisites: string[];
  instructor: Principal;
  skillLevel: string;
  price: bigint;
}

interface CourseCardProps {
  course: Course;
  onEnroll?: (courseId: bigint) => void;
  isInstructor?: boolean;
  isEnrolled: boolean; // 
}

export default function CourseCard({ 
  course,
  onEnroll,
  isInstructor = false,
  isEnrolled
}:  CourseCardProps){
  const { identity } = useAuth();


  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{course.title}</h3>
        <p className="text-gray-600 mb-4">{course.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
            {course.skillLevel}
          </span>
          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
            {Number(course.duration)} weeks
          </span>
          <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
            ${Number(course.price)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          {!isInstructor && (
            <div>
              {isEnrolled ? (
                <span className="bg-gray-100 text-gray-800 px-4 py-2 rounded-md">
                  Enrolled ✅
                </span>
              ) : (
                onEnroll && (
                  <button
                    onClick={() => onEnroll(course.id)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition-colors"
                  >
                    Enroll
                  </button>
                )
              )}
            </div>
          )}

          <span className="text-sm text-gray-500">
            {course.students.length} student{course.students.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
    </div>
  );
}