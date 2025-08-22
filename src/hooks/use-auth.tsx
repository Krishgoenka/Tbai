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

    const isDashboardPage = pathname.startsWith('/admin') || pathname.startsWith('/student');

    if (!user && isDashboardPage) {
      router.push('/login');
      return;
    }

    if (user && userRole === 'admin' && !pathname.startsWith('/admin')) {
      router.push('/admin');
    } else if (user && userRole === 'student' && !pathname.startsWith('/student')) {
      router.push('/student');
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
