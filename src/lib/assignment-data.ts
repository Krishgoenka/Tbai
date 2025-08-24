
import { z } from 'zod';
import { assignmentSchema, type Assignment } from '@/app/admin/assignments/schema';
import { db, storage } from './firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where, orderBy, increment } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

const assignmentsCollection = collection(db, 'assignments');

// Define a more specific type for the data coming into the add function
type AddAssignmentData = Omit<Assignment, 'id' | 'submissions' | 'fileUrl'>;

export async function getAssignments(options?: { publishedOnly?: boolean }): Promise<Assignment[]> {
  try {
    let q;
    if (options?.publishedOnly) {
       q = query(assignmentsCollection, where("status", "==", "Published"), orderBy("dueDate", "desc"));
    } else {
      q = query(assignmentsCollection, orderBy("dueDate", "desc"));
    }
    
    const querySnapshot = await getDocs(q);
    let assignments = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Ensure submissions is a number, default to 0 if it's missing
    const validatedAssignments = assignments.map(a => ({...a, submissions: a.submissions || 0}));
    
    return z.array(assignmentSchema).parse(validatedAssignments);
  } catch (error) {
    console.error("Error fetching assignments: ", error);
    if (error instanceof Error && error.message.includes("indexes?create_composite")) {
        console.error("Firestore composite index required. Please create it in the Firebase console.");
    }
    return [];
  }
}

export async function addAssignment(
    assignmentData: AddAssignmentData, 
    file?: File
) {
    try {
        let fileUrl = "/placeholder.pdf"; // Default placeholder

        if (file) {
            const storageRef = ref(storage, `assignments/${Date.now()}_${file.name}`);
            const snapshot = await uploadBytes(storageRef, file);
            fileUrl = await getDownloadURL(snapshot.ref);
        }

        const newAssignment: Omit<Assignment, 'id'> = {
            ...assignmentData,
            submissions: 0,
            fileUrl: fileUrl,
        };

        const docRef = await addDoc(assignmentsCollection, newAssignment);
        return { success: true, id: docRef.id };
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
        return { success: false };
    }
}


export async function updateAssignmentStatus(id: string, status: "Published" | "Draft") {
     try {
        const assignmentRef = doc(db, 'assignments', id);
        await updateDoc(assignmentRef, { status });
        return { success: true };
    } catch (error) {
        console.error("Error updating assignment status: ", error);
        return { success: false };
    }
}

export async function deleteAssignment(id: string) {
    try {
        const assignmentRef = doc(db, 'assignments', id);
        await deleteDoc(assignmentRef);
        return { success: true };
    } catch (error) {
        console.error("Error deleting assignment: ", error);
        return { success: false };
    }
}
