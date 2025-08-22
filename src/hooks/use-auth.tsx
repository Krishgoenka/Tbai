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
        try {
            const userDocRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
              const role = userDoc.data().role as UserRole;
              setUser(user);
              setUserRole(role);
            } else {
              // User exists in Auth but not in Firestore, treat as logged out
              await auth.signOut();
              setUser(null);
              setUserRole(null);
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
        // If user is logged in, redirect from auth pages to their dashboard
        if (isAuthPage) {
            if (userRole === 'admin') router.push('/admin');
            else if (userRole === 'student') router.push('/student');
        }
        // If user is on the wrong dashboard, redirect them
        else if (userRole === 'admin' && !isAdminPage) {
            router.push('/admin');
        } else if (userRole === 'student' && !isStudentPage) {
            router.push('/student');
        }
    } else {
        // If user is not logged in, redirect from protected pages
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

  // Render children only when not loading to prevent flicker and premature rendering
  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
