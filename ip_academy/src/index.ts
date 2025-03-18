import {
    IDL,
    query,
    update,
    caller,
    Principal,
} from "azle";
import { ic } from "azle/experimental";
//   import { Ledger, binaryAddressFromPrincipal, hexAddressFromPrincipal } from "azle/canisters/ledger";
import { v4 as uuidv4 } from "uuid";

/**
 * Represents a course in the platform.
 * @typedef {Object} Course
 * @property {number} id - The unique ID of the course.
 * @property {string} title - The title of the course.
 * @property {string} description - The description of the course.
 * @property {Opt<Principal>} instructor - The Principal of the course instructor (optional).
 * @property {nat64} duration - The duration of the course in nanoseconds.
 * @property {string} skillLevel - The skill level required for the course.
 * @property {string[]} prerequisites - The list of prerequisites for the course.
 * @property {nat64} price - The price of the course in ICP tokens.
 * @property {Principal[]} students - The list of students enrolled in the course.
 */
const Course = IDL.Record({
    id: IDL.Nat,
    title: IDL.Text,
    description: IDL.Text,
    instructor: IDL.Opt(IDL.Principal),
    duration: IDL.Nat64,
    skillLevel: IDL.Text,
    prerequisites: IDL.Vec(IDL.Text),
    price: IDL.Nat64,
    students: IDL.Vec(IDL.Principal),
});

/**
* Represents a course in the platform.
*/
type Course = {
    id: number; // IDL.Nat
    title: string; // IDL.Text
    description: string; // IDL.Text
    instructor: typeof IDL.Principal.name | null; // IDL.Opt(IDL.Principal)
    duration: bigint; // IDL.Nat64
    skillLevel: string; // IDL.Text
    prerequisites: string[]; // IDL.Vec(IDL.Text)
    price: bigint; // IDL.Nat64
    students: Principal[]; // IDL.Vec(IDL.Principal)
};

/**
 * Represents a user in the platform.
 * @typedef {Object} User
 * @property {Principal} id - The Principal of the user.
 * @property {string} username - The username of the user.
 * @property {string} bio - The bio of the user.
 * @property {string[]} skills - The list of skills of the user.
 * @property {Principal[]} enrolledCourses - The list of course IDs the user is enrolled in.
 * @property {string[]} purchasedCourses - The list of course IDs the user has purchased.
 */
const User = IDL.Record({
    id: IDL.Principal,
    username: IDL.Text,
    bio: IDL.Text,
    skills: IDL.Vec(IDL.Text),
    enrolledCourses: IDL.Vec(IDL.Principal),
    purchasedCourses: IDL.Vec(IDL.Text),
});

/**
* Represents a user in the platform.
*/
type User = {
    id: Principal; // IDL.Principal
    username: string; // IDL.Text
    bio: string; // IDL.Text
    skills: string[]; // IDL.Vec(IDL.Text)
    enrolledCourses: Principal[]; // IDL.Vec(IDL.Principal)
    purchasedCourses: string[]; // IDL.Vec(IDL.Text)
};

/**
 * Represents a transaction in the platform.
 * @typedef {Object} Transaction
 * @property {string} id - The unique ID of the transaction.
 * @property {Principal} from - The Principal of the sender.
 * @property {Principal} to - The Principal of the receiver.
 * @property {nat64} amount - The amount transferred in ICP tokens.
 * @property {string} memo - The memo associated with the transaction.
 * @property {string} status - The status of the transaction: "Pending", "Completed", or "Failed".
 */
const Transaction = IDL.Record({
    id: IDL.Text,
    from: IDL.Principal,
    to: IDL.Principal,
    amount: IDL.Nat64,
    memo: IDL.Text,
    status: IDL.Text,
});

/**
 * Represents a transaction in the platform.
 */
type Transaction = {
    id: string; // IDL.Text
    from: Principal; // IDL.Principal
    to: Principal; // IDL.Principal
    amount: bigint; // IDL.Nat64
    memo: string; // IDL.Text
    status: string; // IDL.Text
  };

/**
 * Message variants for error handling and responses.
 * @typedef {Object} Message
 * @property {string} NotFound - Error message when a resource is not found.
 * @property {string} InvalidPayload - Error message when the payload is invalid.
 * @property {string} PaymentFailed - Error message when a payment fails.
 * @property {string} PaymentCompleted - Success message when a payment is completed.
 */
const Message = IDL.Variant({
    NotFound: IDL.Text,
    InvalidPayload: IDL.Text,
    PaymentFailed: IDL.Text,
    PaymentCompleted: IDL.Text,
});

/**
 * Represents message variants for error handling and responses.
 */
type Message =
  | { NotFound: string } // IDL.Variant({ NotFound: IDL.Text })
  | { InvalidPayload: string } // IDL.Variant({ InvalidPayload: IDL.Text })
  | { PaymentFailed: string } // IDL.Variant({ PaymentFailed: IDL.Text })
  | { PaymentCompleted: string }; // IDL.Variant({ PaymentCompleted: IDL.Text })

export default class IpAcademy {
    private courses: Course[] = [];
    private users: User[] = [];
    private transactions: Transaction[] = [];
    private nextCourseId: number = 0;


    /**
     * Retrieves a list of all available courses.
     * @returns {Course[]} - A list of all courses.
     */
    @query([], IDL.Vec(Course))
    getCourses(): Course[]{
        return this.courses
    }

  // Get a course by its ID
  @query([IDL.Nat], IDL.Opt(Course))
  getCourseById(courseId: number): [] | [Course] {
    const course = this.courses.find((c) => c.id === courseId);
    return course ? [course] : []; // Return as an optional value
  }

    /**
     * Adds a new course to the platform.
     * @param {Object} payload - The course details.
     * @param {string} payload.title - The title of the course.
     * @param {string} payload.description - The description of the course.
     * @param {Opt<Principal>} payload.instructor - The instructor of the course (optional).
     * @param {nat64} payload.duration - The duration of the course.
     * @param {string} payload.skillLevel - The skill level of the course.
     * @param {string[]} payload.prerequisites - The prerequisites for the course.
     * @param {nat64} payload.price - The price of the course.
     * @returns {Result<number, Message>} - The ID of the newly created course or an error message.
     */

     // Create a new course
  @update([IDL.Text, IDL.Text, IDL.Principal, IDL.Nat64, IDL.Text, IDL.Vec(IDL.Text), IDL.Nat64], IDL.Nat)
  createCourse(
    title: string,
    description: string,
    instructor: typeof IDL.Principal.name,
    duration: bigint,
    skillLevel: string,
    prerequisites: string[],
    price: bigint
  ): number {
    const courseId = this.nextCourseId++;
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


    // Enroll a student in a course
  @update([IDL.Nat, IDL.Principal], IDL.Bool)
  enrollStudent(courseId: number, student: Principal): boolean {
    const course = this.courses.find((c) => c.id === courseId);
    if (course) {
      course.students.push(student); // Enroll the student
      return true;
    }
    return false;
  }

   // Mark a course as completed by a student
   @update([IDL.Nat, IDL.Principal], IDL.Bool)
   completeCourse(courseId: number, student: Principal): boolean {
     const course = this.courses.find((c) => c.id === courseId);
     if (course) {
       // Remove the student from the enrolled list (simulating completion)
       const index = course.students.indexOf(student);
       if (index !== -1) {
         course.students.splice(index, 1);
         return true;
       }
     }
     return false;
   }

    // register student
   @update([IDL.Text, IDL.Text, IDL.Vec(IDL.Text)], IDL.Bool)
   registerStudent(username: string, bio: string, skills: string[]): boolean {
     const currentCaller = caller(); // Get the caller's principal
     const existingUser = this.users.find((u) => u.id.toText() === currentCaller.toText());
     if (existingUser) {
       return false; // User already registered
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

}