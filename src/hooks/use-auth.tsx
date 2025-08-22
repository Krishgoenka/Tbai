"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useRouter, usePathname } from 'next/navigation';

type UserRole = 'admin' | 'student' | null;

interface AuthContextType {
  user: User | null;
  userRole: UserRole;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const role = userDoc.data().role as UserRole;
          setUser(user);
          setUserRole(role);
        } else {
          // This case can happen if user is created in Auth but Firestore doc creation fails.
          // Or if the user is deleted from Firestore but not Auth.
          await auth.signOut(); // Log them out to be safe.
          setUser(null);
          setUserRole(null);
        }
      } else {
        setUser(null);
        setUserRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (loading) {
      return; // Don't do anything while loading.
    }

    const isAuthPage = pathname === '/login' || pathname === '/signup';
    const isDashboardPage = pathname.startsWith('/admin') || pathname.startsWith('/student');

    if (user && userRole) {
      // User is logged in and has a role.
      if (userRole === 'admin' && !pathname.startsWith('/admin')) {
        router.push('/admin');
      } else if (userRole === 'student' && !pathname.startsWith('/student')) {
        router.push('/student');
      } else if (isAuthPage) {
        // If they are on login/signup, redirect them away.
        router.push(userRole === 'admin' ? '/admin' : '/student');
      }
    } else {
      // User is not logged in or role is not determined yet.
      if (isDashboardPage) {
        // If they are trying to access a protected page, redirect to login.
        router.push('/login');
      }
    }
  }, [user, userRole, loading, router, pathname]);

  const logout = async () => {
    await auth.signOut();
    setUser(null);
    setUserRole(null);
    router.push('/login');
  };
  
  const value = { user, userRole, loading, logout };

  // We only render children when loading is false to avoid flashes of incorrect content.
  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
