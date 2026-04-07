import type { Student } from './types';

// A mock student database. In a real application, this would be a connection
// to a secure database or an API call to the college's student information system.

const MOCK_STUDENTS: Student[] = [
  {
    id: '99220040182',
    name: 'Ravi raj singh',
    email: '99220040182@klu.ac.in',
  },
  {
    id: '99220040181',
    name: 'Ravi Kumar',
    email: '99220040181@klu.ac.in',
  },
  {
    id: '99220040190',
    name: 'Sanjay kumar',
    email: '99220040190@klu.ac.in',
  },
  {
    id: '99220040184',
    name: 'Govinda reddy',
    email: '99220040190@klu.ac.in',
  },
  {
    id: '9922005079',
    name: 'Akash mishra',
    email: '9922005079@klu.ac.in',
  },
  {
    id: '99220041923',
    name: 'Abhijeet kumar',
    email: '99220041023@klu.ac.in',
  },

];

/**
 * Validates a student ID and returns student information.
 * This function simulates checking a college database.
 *
 * @param studentId The ID of the student to look up.
 * @returns A Student object if the ID is valid, otherwise null.
 */
export function getStudentById(studentId: string): Student | null {
  // Rule 1: Must start with the college prefix.
  if (!studentId.startsWith('992200')) {
    return null;
  }

  // Rule 2: Must be a specific length (e.g., 11 characters).
  if (studentId.length !== 11) {
    return null;
  }

  // Rule 3: Must contain only numbers.
  if (!/^\d+$/.test(studentId)) {
    return null;
  }

  // Check if the student is in our small list of mock students.
  const foundStudent = MOCK_STUDENTS.find((s) => s.id === studentId);
  if (foundStudent) {
    return foundStudent;
  }

  // If not in the specific list, but the format is correct,
  // we can generate a mock student "on-the-fly" to simulate that any valid number works.
  // This fulfills the "create for all the students" requirement.
  const lastName = studentId.slice(-3);
  return {
    id: studentId,
    name: `Student ${lastName}`,
    email: `student.${lastName}@university.edu`,
  };
}
