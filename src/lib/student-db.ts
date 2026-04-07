import type { Student } from './types';

// A mock student database. This now contains a hardcoded list of valid students.
const MOCK_STUDENTS: Student[] = [
  { id: '99220040182', name: 'Ravi raj singh', email: '99220040182@klu.ac.in', walletBalance: 500.00 },
  { id: '99220040181', name: 'Ravi Kumar', email: '99220040181@klu.ac.in', walletBalance: 450.50 },
  { id: '99220040190', name: 'Sanjay kumar', email: '99220040190@klu.ac.in', walletBalance: 720.00 },
  { id: '99220040184', name: 'Govinda reddy', email: '99220040184@klu.ac.in', walletBalance: 150.25 },
  { id: '9922005079', name: 'Akash mishra', email: '9922005079@klu.ac.in', walletBalance: 980.00 }
];


/**
 * Validates a student ID against a hardcoded list and returns student information.
 *
 * @param studentId The ID of the student to look up.
 * @returns A Student object if the ID is valid, otherwise null.
 */
export function getStudentById(studentId: string): Student | null {
  const foundStudent = MOCK_STUDENTS.find((s) => s.id === studentId);
  
  if (foundStudent) {
    // Return a copy to prevent direct mutation of the "database"
    return { ...foundStudent };
  }

  return null; // Return null if student is not in the hardcoded list
}

/**
 * Finds a student by their email address.
 * @param email The email of the student to look up.
 * @returns A Student object if found, otherwise null.
 */
export function getStudentByEmail(email: string): Student | null {
  const foundStudent = MOCK_STUDENTS.find((s) => s.email.toLowerCase() === email.toLowerCase());
  
  if (foundStudent) {
    return { ...foundStudent };
  }

  return null;
}


/**
 * Updates a student's wallet balance in the mock database.
 * @param studentId The ID of the student.
 * @param newBalance The new balance to set.
 */
export function updateStudentBalance(studentId: string, newBalance: number): void {
  const studentIndex = MOCK_STUDENTS.findIndex((s) => s.id === studentId);
  if (studentIndex !== -1) {
    MOCK_STUDENTS[studentIndex].walletBalance = newBalance;
    console.log(`Updated balance for ${studentId} to ${newBalance}`);
  } else {
    // In a real app, this should throw an error. For now, we log a warning.
    console.warn(`Attempted to update balance for non-existent student: ${studentId}`);
  }
}

/**
 * Adds funds to a student's wallet.
 * @param studentId The ID of the student.
 * @param amount The amount to add.
 */
export function rechargeWallet(studentId: string, amount: number): void {
    const studentIndex = MOCK_STUDENTS.findIndex((s) => s.id === studentId);
    if (studentIndex !== -1) {
        MOCK_STUDENTS[studentIndex].walletBalance += amount;
        console.log(`Recharged wallet for ${studentId} by ${amount}. New balance: ${MOCK_STUDENTS[studentIndex].walletBalance}`);
    } else {
        console.warn(`Attempted to recharge wallet for non-existent student: ${studentId}`);
    }
}
