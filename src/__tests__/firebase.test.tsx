import {
  getAuth,
  signInWithEmailAndPassword as signIn,
  signOut as signOutUser,
} from 'firebase/auth';
import { describe, expect, it, vi } from 'vitest';

import { logInWithEmailAndPassword, logout } from '@/utils/firebase';

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
}));

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(),
  collection: vi.fn(),
  addDoc: vi.fn(),
}));
describe('Firebase Functions', () => {
  it('should log in with email and password', async () => {
    const email = 'test@example.com';
    const password = 'password123';
    await logInWithEmailAndPassword(email, password);
    expect(signIn).toHaveBeenCalledWith(getAuth(), email, password);
  });

  it('should log out', () => {
    logout();
    expect(signOutUser).toHaveBeenCalled();
  });
});
