
import { z } from 'zod';
import { assignmentSchema, type Assignment } from '@/app/admin/assignments/schema';
import { db } from './firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where, orderBy } from 'firebase/firestore';

const assignmentsCollection = collection(db, 'assignments');

export async function getAssignments(options?: { publishedOnly?: boolean }) {
  try {
    let q = query(assignmentsCollection, orderBy("dueDate", "desc"));
    if (options?.publishedOnly) {
        q = query(q, where("status", "==", "Published"));
    }
    const querySnapshot = await getDocs(q);
    const assignments = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // Ensure submissions field exists, default to 0 if not
    const validatedAssignments = assignments.map(a => ({...a, submissions: a.submissions || 0}));
    return z.array(assignmentSchema).parse(validatedAssignments);
  } catch (error) {
    console.error("Error fetching assignments: ", error);
    return [];
  }
}

export async function addAssignment(assignment: Omit<Assignment, 'id' | 'submissions' | 'fileUrl'>) {
    try {
        const newAssignment: Omit<Assignment, 'id'> = {
            ...assignment,
            submissions: 0,
            fileUrl: "/placeholder.pdf", // Placeholder
        };
        const docRef = await addDoc(assignmentsCollection, newAssignment);
        return { ...newAssignment, id: docRef.id };
    } catch (error) {
        console.error("Error adding assignment: ", error);
        throw new Error("Failed to add assignment.");
    }
}

export async function updateAssignment(id: string, updatedData: Partial<Omit<Assignment, 'id' | 'submissions' | 'fileUrl'>>) {
    try {
        const assignmentRef = doc(db, 'assignments', id);
        await updateDoc(assignmentRef, updatedData);
        return { success: true };
    } catch (error) {
        console.error("Error updating assignment: ", error);
        throw new Error("Failed to update assignment.");
    }
}


export async function updateAssignmentStatus(id: string, status: "Published" | "Draft") {
     try {
        const assignmentRef = doc(db, 'assignments', id);
        await updateDoc(assignmentRef, { status });
        return { success: true };
    } catch (error) {
        console.error("Error updating assignment status: ", error);
        throw new Error("Failed to update status.");
    }
}

export async function deleteAssignment(id: string) {
    try {
        const assignmentRef = doc(db, 'assignments', id);
        await deleteDoc(assignmentRef);
        return { success: true };
    } catch (error) {
        console.error("Error deleting assignment: ", error);
        throw new Error("Failed to delete assignment.");
    }
}
