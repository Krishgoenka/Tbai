
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

const LoadingScreen = () => (
  <div className="flex h-screen w-screen items-center justify-center">
    <div className="flex flex-col items-center space-y-4">
       <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
        </div>
    </div>
  </div>
);

// Mock user for demo mode
const mockUser = (role: 'admin' | 'student'): User => ({
  uid: role === 'admin' ? 'admin-uid' : 'student-uid',
  email: role === 'admin' ? 'admin@example.com' : 'student@example.com',
  displayName: role === 'admin' ? 'Admin User' : 'Student User',
  photoURL: `https://placehold.co/100x100.png`,
  emailVerified: true,
  isAnonymous: false,
  metadata: {},
  providerData: [],
  providerId: 'password',
  tenantId: null,
  delete: async () => {},
  getIdToken: async () => '',
  getIdTokenResult: async () => ({
    token: '',
    expirationTime: '',
    authTime: '',
    issuedAtTime: '',
    signInProvider: null,
    signInSecondFactor: null,
    claims: {},
  }),
  reload: async () => {},
  toJSON: () => ({}),
});


export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setIsClient(true);
  }, []);


  useEffect(() => {
    // This is the demo mode setup
    if (!isClient) return;

    const isAdminPath = pathname.startsWith('/admin');
    const isStudentPath = pathname.startsWith('/student');

    if (isAdminPath) {
      setUser(mockUser('admin'));
      setUserRole('admin');
    } else if (isStudentPath) {
      setUser(mockUser('student'));
      setUserRole('student');
    } else {
       setUser(null);
       setUserRole(null);
    }
    setLoading(false);

  }, [isClient, pathname]);

  const logout = async () => {
    // In demo mode, just redirect to home
    router.push('/');
  };
  
  const value = { user, userRole, loading, logout };

  if (!isClient || loading) {
    return <LoadingScreen />;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
