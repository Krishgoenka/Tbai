
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

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      if (user) {
        setUser(user);
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const role = userDoc.data()?.role as UserRole;
          setUserRole(role);
          // Redirect based on role
          if (role === 'admin' && !pathname.startsWith('/admin')) {
            router.push('/admin');
          } else if (role === 'student' && !pathname.startsWith('/student')) {
            router.push('/student');
          }
        } else {
          // New user, but signed in. Determine role from signup path or default.
          const isSigningUpAsAdmin = window.sessionStorage.getItem('signupRole') === 'admin';
          const role = isSigningUpAsAdmin ? 'admin' : 'student';
          
          await setDoc(userDocRef, {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || 'New User',
            role: role,
          });
          setUserRole(role);
          window.sessionStorage.removeItem('signupRole');
          if (role === 'admin') router.push('/admin');
          else router.push('/student');
        }
      } else {
        setUser(null);
        setUserRole(null);
        // If user is logged out, redirect to a public page if they are on a protected route
        const isProtectedRoute = pathname.startsWith('/admin') || pathname.startsWith('/student');
        if (isProtectedRoute) {
          router.push('/login');
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router, pathname]);

  const logout = async () => {
    await auth.signOut();
    router.push('/');
  };
  
  const value = { user, userRole, loading, logout };

  if (loading) {
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
