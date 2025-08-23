
"use client";

import React from 'react';
import type { User } from 'firebase/auth';
import { useRouter }from "next/navigation";

type UserRole = 'admin' | 'student' | null;

interface AuthContextType {
  user: User | null;
  userRole: UserRole;
  loading: boolean;
  logout: () => Promise<void>;
}

export const useAuth = () => {
    const router = useRouter();

    const logout = async () => {
        console.log("Logout function called");
        // For now, redirect to home page on logout.
        router.push('/');
    };

    // Return a mock user and role to bypass login
    return {
        user: {
        displayName: 'Demo User',
        email: 'demo@example.com',
        photoURL: 'https://placehold.co/100x100.png',
        } as User,
        userRole: 'admin' as UserRole, // Can be 'admin' or 'student'
        loading: false,
        logout,
    };
};
