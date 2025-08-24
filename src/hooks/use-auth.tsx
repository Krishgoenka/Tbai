
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User } from 'firebase/auth';
import { onAuthStateChanged, signOut, updateProfile } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { usePathname, useRouter } from "next/navigation";

type UserRole = 'admin' | 'student' | null;

interface AuthContextType {
  user: User | null;
  userRole: UserRole;
  loading: boolean;
  logout: () => Promise<void>;
  profileNeedsUpdate: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [userRole, setUserRole] = useState<UserRole>(null);
    const [loading, setLoading] = useState(true);
    const [profileNeedsUpdate, setProfileNeedsUpdate] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    const handleUser = useCallback(async (firebaseUser: User | null) => {
        if (firebaseUser) {
            setUser(firebaseUser);
            const userDocRef = doc(db, 'users', firebaseUser.uid);
            const userDoc = await getDoc(userDocRef);

            // This temporary data is set during the signup process
            const signupRole = window.sessionStorage.getItem('signupRole');
            const signupName = window.sessionStorage.getItem('signupName');

            const isAdminEmail = firebaseUser.email === 'goenkakrish02@gmail.com';
            let determinedRole: UserRole = isAdminEmail ? 'admin' : 'student';

            if (userDoc.exists()) {
                const userData = userDoc.data();
                const currentDbRole = userData?.role;
                setUserRole(currentDbRole);

                 // Check if profile is complete
                const isProfileComplete = 
                    currentDbRole === 'admin' 
                        ? !!userData.displayName 
                        : !!(userData.displayName && userData.studentId && userData.batch && userData.yearOfStudy);

                if (!isProfileComplete) {
                    setProfileNeedsUpdate(true);
                    if (!pathname.endsWith('/profile')) {
                        router.push(currentDbRole === 'admin' ? '/admin/profile' : '/student/profile');
                    }
                } else {
                    setProfileNeedsUpdate(false);
                    // Standard redirection for existing, complete users
                    if (pathname.startsWith('/login') || pathname.startsWith('/signup') || pathname === '/') {
                        router.push(currentDbRole === 'admin' ? '/admin' : '/student');
                    }
                }

            } else {
                // NEW USER: Create their document
                if (signupRole) {
                    determinedRole = signupRole as UserRole;
                }
                
                await updateProfile(firebaseUser, { displayName: signupName });

                const newUserDoc: any = {
                    email: firebaseUser.email, 
                    displayName: signupName || 'New User',
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
                
                // This is a new user, they need to complete their profile.
                setProfileNeedsUpdate(true);
                router.push(determinedRole === 'admin' ? '/admin/profile' : '/student/profile');

                // Clean up temporary data
                window.sessionStorage.removeItem('signupRole'); 
                window.sessionStorage.removeItem('signupName');
            }
        } else {
            setUser(null);
            setUserRole(null);
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
    
    const value = { user, userRole, loading, logout, profileNeedsUpdate };

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
