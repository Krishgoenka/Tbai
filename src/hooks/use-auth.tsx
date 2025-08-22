"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
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
        try {
            const userDocRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
              const role = userDoc.data().role as UserRole;
              setUser(user);
              setUserRole(role);
            } else {
              // New user (e.g., from Google Sign-In), create student profile
              const newUser = {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                role: 'student',
              };
              await setDoc(userDocRef, newUser);
              setUser(user);
              setUserRole('student');
            }
        } catch (e) {
            console.error("Error fetching user role:", e);
            await auth.signOut();
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
    if (loading) return;

    const isAuthPage = pathname === '/login' || pathname === '/signup';
    const isStudentPage = pathname.startsWith('/student');
    const isAdminPage = pathname.startsWith('/admin');
    
    if (user) {
        if (userRole === 'admin' && !isAdminPage) {
            router.push('/admin');
        } else if (userRole === 'student' && !isStudentPage) {
            router.push('/student');
        } else if (isAuthPage) {
            // If on auth page and logged in, redirect to correct dashboard
            if (userRole === 'admin') router.push('/admin');
            else if (userRole === 'student') router.push('/student');
        }
    } else {
        if (isAdminPage || isStudentPage) {
            router.push('/login');
        }
    }

  }, [user, userRole, loading, router, pathname]);

  const logout = async () => {
    await auth.signOut();
    router.push('/login');
  };
  
  const value = { user, userRole, loading, logout };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
