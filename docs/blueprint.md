# **App Name**: TechnoBillion AI Platform

## Core Features:

- Role-Based Authentication: User authentication with email/password and Google login, supporting 'Admin' and 'Student' roles.  Admin roles are managed via Firestore, with automatic student registration.
- Add Employee: Admin interface to add employees by name, role, and profile details, stored in a Firestore collection.
- Manage Employee Tasks: Admin interface to add and update employee tasks (description, date, status) within the employee data in Firestore.
- Student Assignment Submission: Student portal for PDF assignment submissions, storing files in Firebase Storage and submission metadata in Firestore under each student's profile.
- Admin Submission Review: Admin dashboard to view all students and their submissions, with search/filter functionality by name or email.
- Secure Access Control: Firebase security rules to enforce access control: students can only access their own data, while admins have full access.
- Frontend Pages: Frontend pages for landing, student dashboard (profile, submissions), and admin dashboard (employee/submission management) with a responsive UI.

## Style Guidelines:

- Primary color: Vibrant red (#E50914), drawing directly from the client's specifications.
- Background color: Very dark desaturated red (#141414). Using the client's dark mode specification, desaturated from the primary.
- Accent color: Muted reddish orange (#E54E09). This selection of the color about 30 degrees to the left of the primary creates good contrast while retaining the desired bold styling.
- Body and headline font: 'Inter' (sans-serif) for a modern, machined, objective, neutral look; suitable for both headlines or body text
- Professional icon set related to AI, education, and management.
- Cards with soft shadows and rounded corners, sidebar navigation for dashboards, and a clean overall layout.
- Subtle animations for UI interactions, such as loading states and transitions.