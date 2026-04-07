'use server';
/**
 * @fileOverview A flow for retrieving student profile information.
 *
 * - getStudentProfile - A function that fetches a student's profile by their ID.
 */

import { ai } from '@/ai/genkit';
import { getStudentById } from '@/lib/student-db';
import {
  StudentProfileInputSchema,
  type StudentProfileInput,
  StudentProfileOutputSchema,
  type StudentProfileOutput,
} from '@/lib/types';

const getStudentProfileFlow = ai.defineFlow(
  {
    name: 'getStudentProfileFlow',
    inputSchema: StudentProfileInputSchema,
    outputSchema: StudentProfileOutputSchema,
  },
  async (studentId) => {
    console.log(`Looking up student with ID: ${studentId}`);
    // In a real app, this would make a secure API call to the college's database.
    // Here, we are calling our mock database function.
    const student = getStudentById(studentId);
    
    if (!student) {
        console.log(`Student with ID: ${studentId} not found.`);
        return null;
    }

    console.log(`Found student: ${student.name}`);
    return student;
  }
);


export async function getStudentProfile(
  input: StudentProfileInput
): Promise<StudentProfileOutput> {
  return getStudentProfileFlow(input);
}
