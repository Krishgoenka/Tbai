
"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useRouter, usePathname } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

type UserRole = 'admin' | 'student' | null;

interface AuthContextType {
  user: User | null;
  userRole: UserRole;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  // Return a mock user and role to bypass login
  return {
    user: {
      displayName: 'Demo User',
      email: 'demo@example.com',
      photoURL: 'https://placehold.co/100x100.png',
    } as User,
    userRole: 'admin' as UserRole, // Can be 'admin' or 'student'
    loading: false,
    logout: async () => {
      console.log("Logout function called");
      // In a real scenario, you'd sign out here.
      // For now, we do nothing as there's no real auth.
    },
  };
};
