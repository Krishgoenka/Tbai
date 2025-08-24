
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User } from 'firebase/auth';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from 'firebase/firestore';
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

            // Check for a temporary role set during signup
            const signupRole = window.sessionStorage.getItem('signupRole');

            if (userDoc.exists()) {
                const role = userDoc.data()?.role;
                setUserRole(role);
                if (pathname.startsWith('/login') || pathname.startsWith('/signup') || pathname === '/') {
                    router.push(role === 'admin' ? '/admin' : '/student');
                }
            } else if (signupRole) {
                // This is a new user, create their document
                const role = signupRole === 'admin' ? 'admin' : 'student';
                const newUserDoc: any = {
                    email: firebaseUser.email, 
                    displayName: firebaseUser.displayName,
                    photoURL: firebaseUser.photoURL,
                    role: role,
                    uid: firebaseUser.uid
                };
                if (role === 'student') {
                    newUserDoc.batch = "";
                    newUserDoc.studentId = "";
                    newUserDoc.yearOfStudy = "";
                }
                await setDoc(userDocRef, newUserDoc);

                setUserRole(role);
                window.sessionStorage.removeItem('signupRole'); // Clean up temp item
                 if (pathname.startsWith('/login') || pathname.startsWith('/signup') || pathname === '/') {
                    router.push(role === 'admin' ? '/admin' : '/student');
                }
            } else {
                // User exists in Auth but not in Firestore and didn't just sign up
                // This is an edge case, maybe redirect to a role selection or error page
                setUserRole(null);
                // For now, redirect to login to be safe
                if (!pathname.startsWith('/login') && !pathname.startsWith('/signup')) {
                    router.push('/login');
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
            router.push('/login');
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
