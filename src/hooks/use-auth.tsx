"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
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
      if (user) {
        try {
            const userDocRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
              const role = userDoc.data().role as UserRole;
              setUser(user);
              setUserRole(role);
            } else {
              // New user, create their profile document
              const role: UserRole = user.email === 'goenkakrish@gmail.com' ? 'admin' : 'student';

              const newUser = {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName || user.email?.split('@')[0],
                role: role,
              };
              await setDoc(userDocRef, newUser);
              setUser(user);
              setUserRole(role);
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

    const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/signup');
    const isStudentPage = pathname.startsWith('/student');
    const isAdminPage = pathname.startsWith('/admin');

    if (user) {
      if (isAuthPage) {
        router.push(userRole === 'admin' ? '/admin' : '/student');
      } else if (userRole === 'admin' && isStudentPage) {
        router.push('/admin');
      } else if (userRole === 'student' && isAdminPage) {
        router.push('/student');
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

  return <AuthContext.Provider value={value}>{loading ? <LoadingScreen /> : children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
