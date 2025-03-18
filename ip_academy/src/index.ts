import {
  IDL,
  query,
  update,
  Principal,
  msgCaller,
} from "azle";
import { v4 as uuidv4 } from "uuid";

// Define the Course structure using IDL
const Course = IDL.Record({
  id: IDL.Nat,
  title: IDL.Text,
  description: IDL.Text,
  instructor: IDL.Principal,
  duration: IDL.Nat64,
  skillLevel: IDL.Text,
  prerequisites: IDL.Vec(IDL.Text),
  price: IDL.Nat64,
  students: IDL.Vec(IDL.Principal),
});

// Define TypeScript types for the structures
type Course = {
  id: number; // IDL.Nat
  title: string; // IDL.Text
  description: string; // IDL.Text
  instructor: Principal; // IDL.Principal
  duration: bigint; // IDL.Nat64
  skillLevel: string; // IDL.Text
  prerequisites: string[]; // IDL.Vec(IDL.Text)
  price: bigint; // IDL.Nat64
  students: Principal[]; // IDL.Vec(IDL.Principal)
};

// Define the User structure using IDL
const User = IDL.Record({
  id: IDL.Principal,
  username: IDL.Text,
  bio: IDL.Text,
  skills: IDL.Vec(IDL.Text),
  enrolledCourses: IDL.Vec(IDL.Principal),
  purchasedCourses: IDL.Vec(IDL.Text),
});

// Define TypeScript types for the structures
type User = {
  id: Principal; // IDL.Principal
  username: string; // IDL.Text
  bio: string; // IDL.Text
  skills: string[]; // IDL.Vec(IDL.Text)
  enrolledCourses: Principal[]; // IDL.Vec(IDL.Principal)
  purchasedCourses: string[]; // IDL.Vec(IDL.Text)
};

export default class IpAcademy {
  private courses: Course[] = [];
  private users: User[] = [];
  private nextCourseId: number = 0;

  /**
   * Retrieves a list of all available courses.
   * @returns {Course[]} - A list of all courses.
   */
  @query([], IDL.Vec(Course))
  getCourses(): Course[] {
    return this.courses;
  }

  /**
   * Retrieves a course by its ID.
   * @param {number} courseId - The ID of the course.
   * @returns {Opt<Course>} - The course if found, otherwise `None`.
   */
  @query([IDL.Nat], IDL.Opt(Course))
  getCourseById(courseId: number): [Course] | [] {
    const course = this.courses.find((c) => c.id.toString() === courseId.toString());
    return course ? [course] : []; // Return as an optional value
  }

  /**
   * Creates a new course.
   */
  @update([IDL.Text, IDL.Text, IDL.Nat64, IDL.Text, IDL.Vec(IDL.Text), IDL.Nat64], IDL.Nat)
  createCourse(
    title: string,
    description: string,
    duration: bigint,
    skillLevel: string,
    prerequisites: string[],
    price: bigint
  ): number {
    const courseId = this.nextCourseId++;
    const instructor = msgCaller(); // Get the caller's principal
    const newCourse: Course = {
      id: courseId,
      title,
      description,
      instructor,
      duration,
      skillLevel,
      prerequisites,
      price,
      students: [], // Initially no students
    };
    this.courses.push(newCourse);
    return courseId;
  }

  /**
   * Enrolls a student in a course.
   * @param {number} courseId - The ID of the course.
   * @returns {boolean} - True if the student was enrolled successfully, false otherwise.
   */
  @update([IDL.Nat], IDL.Bool)
  enrollStudent(courseId: number): string | boolean {
    const course = this.courses.find((c) => c.id === courseId);
    const student = msgCaller(); // Get the caller's principal

    if (!course) {
      return 'course not found'; // Course not found
    }

    // Ensure the instructor cannot enroll in their own course
    if (course.instructor.toText() === student.toText()) {
      return 'instructor cannot enroll in their own course'; // Instructor cannot enroll in their own course
    }

    // Check if the student is already enrolled
    if (course.students.includes(student)) {
      return 'Student already enrolled'; // Student already enrolled
    }

    // Enroll the student
    course.students.push(student);
    return true;
  }

  /**
   * Marks a course as completed by a student.
   * @param {number} courseId - The ID of the course.
   * @returns {boolean} - True if the course was marked as completed, false otherwise.
   */
  @update([IDL.Nat], IDL.Bool)
  completeCourse(courseId: number): boolean | string{
    const course = this.courses.find((c) => c.id === courseId);
    const student = msgCaller(); // Get the caller's principal

    if (!course) {
      return 'course not found'; // Course not found
    }

    // Remove the student from the enrolled list (simulating completion)
    const index = course.students.indexOf(student);
    if (index === -1) {
      return 'student not found'; // Student not enrolled in the course
    }

    course.students.splice(index, 1);
    return true;
  }

  /**
   * Registers a new student (user) in the system.
   * @param {string} username - The username of the student.
   * @param {string} bio - The bio of the student.
   * @param {string[]} skills - The list of skills of the student.
   * @returns {boolean} - True if the student was registered successfully, false otherwise.
   */
  @update([IDL.Text, IDL.Text, IDL.Vec(IDL.Text)], IDL.Bool)
  registerStudent(username: string, bio: string, skills: string[]): boolean | string {
    const currentCaller = msgCaller(); // Get the caller's principal
    const existingUser = this.users.find((u) => u.id.toText() === currentCaller.toText());
    if (existingUser) {
      return 'already registered'; // User already registered
    }

    const newUser: User = {
      id: currentCaller,
      username,
      bio,
      skills,
      enrolledCourses: [], // Initially no enrolled courses
      purchasedCourses: [], // Initially no purchased courses
    };
    this.users.push(newUser);
    return true;
  }

  /**
   * Retrieves courses created by a specific user (instructor).
   * @param {Principal} instructor - The Principal of the instructor.
   * @returns {Course[]} - A list of courses created by the instructor.
   */
  @query([], IDL.Vec(Course))
  getCoursesCreatedByUser(): Course[] {
    const instructor = msgCaller()
    return this.courses.filter((course) => course.instructor.toText() === instructor.toText());
  }

  /**
   * Retrieves courses enrolled by a specific user (student).
   * @param {Principal} student - The Principal of the student.
   * @returns {Course[]} - A list of courses enrolled by the student.
   */
  @query([], IDL.Vec(Course))
  getCoursesEnrolledByUser(): Course[] {
    const student = msgCaller()
    return this.courses.filter((course) => course.students.includes(student));
  }
}