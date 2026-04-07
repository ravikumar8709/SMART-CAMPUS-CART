'use client';
import type { Role, MockUser } from './types';
import { getStudentByEmail } from './student-db';

const USER_KEY = 'campus-cart-user';

// Hardcoded vendor credentials
const VENDORS: Record<string, { password: string; name: string }> = {
    'bombaychatwala@gmail.com': { password: '12345678', name: 'Bombay Chaatwala' },
    'leecorner@gmail.com': { password: '12345678', name: 'Lee Corner' },
    'samosaspot@gmail.com': { password: '12345678', name: 'Samosa Spot' },
    'fruitshop@gmail.com': { password: '12345678', name: 'Fruit Shop' },
};

export const ADMIN_EMAIL = 'admin@campustcart.com';


/**
 * Simulates user login for different roles.
 * - Admin: fixed email, any password.
 * - Vendor: hardcoded email/password.
 * - Student: hardcoded email, any password.
 * @param email The user's email.
 * @param password The user's password (optional, not used for Admin/Student).
 * @returns A MockUser object on success, or null on failure.
 */
export const signIn = (email: string, password?: string): MockUser | null => {
  let user: MockUser | null = null;
  const lowercasedEmail = email.toLowerCase();

  // 1. Admin login check (any password works)
  if (lowercasedEmail === ADMIN_EMAIL) {
    user = {
      email: lowercasedEmail,
      displayName: 'Admin',
      role: 'Admin',
    };
  } 
  // 2. Vendor login check (requires matching password)
  else if (VENDORS[lowercasedEmail] && VENDORS[lowercasedEmail].password === password) {
    user = {
      email: lowercasedEmail,
      displayName: VENDORS[lowercasedEmail].name,
      role: 'Vendor',
    };
  }
  // 3. Student login check (any password works)
  else {
    const student = getStudentByEmail(lowercasedEmail);
    if (student) {
        user = {
            email: student.email,
            displayName: student.name,
            role: 'Student',
        };
    }
  }


  if (user && typeof window !== 'undefined') {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
  
  return user;
};


export const signOut = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(USER_KEY);
  }
};

export const getSession = (): MockUser | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  const userStr = localStorage.getItem(USER_KEY);
  if (!userStr) {
    return null;
  }
  try {
    return JSON.parse(userStr) as MockUser;
  } catch (e) {
    return null;
  }
};
