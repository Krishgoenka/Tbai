
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User } from 'firebase/auth';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { usePathname, useRouter } from "next/navigation";

type UserRole = 'admin' | 'student' | null;

interface AuthContextType {
  user: User | null;
  userRole: UserRole;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [userRole, setUserRole] = useState<UserRole>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    const handleUser = useCallback(async (firebaseUser: User | null) => {
        if (firebaseUser) {
            setUser(firebaseUser);
            const userDocRef = doc(db, 'users', firebaseUser.uid);
            const userDoc = await getDoc(userDocRef);

            const isAdminEmail = firebaseUser.email === 'goenkakrish02@gmail.com';
            const determinedRole = isAdminEmail ? 'admin' : 'student';

            if (userDoc.exists()) {
                const currentDbRole = userDoc.data()?.role;
                // If the role in DB is different from what it should be, update it.
                if (currentDbRole !== determinedRole) {
                    await updateDoc(userDocRef, { role: determinedRole });
                }
                setUserRole(determinedRole);

                if (pathname.startsWith('/login') || pathname.startsWith('/signup') || pathname === '/') {
                    router.push(determinedRole === 'admin' ? '/admin' : '/student');
                }
            } else {
                // This is a new user, create their document with the correct role.
                const newUserDoc: any = {
                    email: firebaseUser.email, 
                    displayName: firebaseUser.displayName || 'New User',
                    photoURL: firebaseUser.photoURL,
                    role: determinedRole,
                    uid: firebaseUser.uid
                };
                 if (determinedRole === 'student') {
                    newUserDoc.batch = "";
                    newUserDoc.studentId = "";
                    newUserDoc.yearOfStudy = "";
                }
                await setDoc(userDocRef, newUserDoc);
                setUserRole(determinedRole);
                
                // Clean up session storage just in case
                window.sessionStorage.removeItem('signupRole'); 
                
                if (pathname.startsWith('/login') || pathname.startsWith('/signup') || pathname === '/') {
                    router.push(determinedRole === 'admin' ? '/admin' : '/student');
                }
            }
        } else {
            setUser(null);
            setUserRole(null);
            // Protect dashboard routes
            if (pathname.startsWith('/admin') || pathname.startsWith('/student')) {
                router.push('/login');
            }
        }
        setLoading(false);
    }, [router, pathname]);


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, handleUser);
        return () => unsubscribe();
    }, [handleUser]);

    const logout = async () => {
        try {
            await signOut(auth);
            router.push('/');
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };
    
    const value = { user, userRole, loading, logout };

    return (
        <AuthContext.Provider value={value}>
            {loading ? (
                <div className="flex items-center justify-center h-screen w-screen">
                    <p>Loading...</p>
                </div>
            ) : children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
