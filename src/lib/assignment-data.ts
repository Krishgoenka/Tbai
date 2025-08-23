
import { z } from 'zod';
import { assignmentSchema, type Assignment } from '@/app/admin/assignments/schema';
import { db, storage } from './firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where, orderBy, increment } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

const assignmentsCollection = collection(db, 'assignments');

export async function getAssignments(options?: { publishedOnly?: boolean }) {
  try {
    let q;
    if (options?.publishedOnly) {
      // This query requires a composite index on status and dueDate.
      // Or we can filter client-side. Given the small number of statuses, let's query all and filter.
       q = query(assignmentsCollection, where("status", "==", "Published"));
    } else {
      q = query(assignmentsCollection);
    }
    
    const querySnapshot = await getDocs(q);
    let assignments = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Ensure submissions field exists
    const validatedAssignments = assignments.map(a => ({...a, submissions: a.submissions || 0}));

    // Sort by due date after fetching, descending (newest first)
    validatedAssignments.sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());

    return z.array(assignmentSchema).parse(validatedAssignments);
  } catch (error) {
    console.error("Error fetching assignments: ", error);
    // This could be a permissions error if rules are not set, or an index error.
    // Return empty array to prevent crashing the app.
    if (error instanceof Error && error.message.includes("indexes?create_composite")) {
        console.error("Firestore composite index required. Please create it in the Firebase console.");
    }
    return [];
  }
}

export async function addAssignment(
    assignmentData: Omit<Assignment, 'id' | 'submissions' | 'fileUrl'>, 
    file?: File
) {
    try {
        let fileUrl = "/placeholder.pdf"; // Default placeholder

        if (file) {
            const storageRef = ref(storage, `assignments/${Date.now()}_${file.name}`);
            const snapshot = await uploadBytes(storageRef, file);
            fileUrl = await getDownloadURL(snapshot.ref);
        }

        // CORRECTED: Ensure all fields from assignmentData, including status, are included.
        const newAssignment: Omit<Assignment, 'id'> = {
            ...assignmentData,
            submissions: 0,
            fileUrl: fileUrl,
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
