
import { z } from 'zod';
import { assignmentSchema, type Assignment } from '@/app/admin/assignments/schema';
import { db, storage } from './firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where, orderBy, increment } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

const assignmentsCollection = collection(db, 'assignments');

// --- Mock Data ---
const mockAssignments: Assignment[] = [
    {
        id: "ASN001",
        title: "one pircr",
        description: "Complete problems 1-10 on page 53 of the textbook. Show all work for full credit. Submissions must be a single PDF file.",
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Due in 7 days
        status: "Published",
        submissions: 15,
        fileUrl: "/placeholder.pdf"
    },
    {
        id: "ASN002",
        title: "one piece is real",
        description: "Write a 5-page essay on the impact of the Punic Wars on Roman expansion. Use at least 3 academic sources.",
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // Due in 14 days
        status: "Published",
        submissions: 8,
        fileUrl: "/placeholder.pdf"
    },
    {
        id: "ASN003",
        title: "Intro to Python: Final Project",
        description: "Develop a simple command-line application. Project brief attached. This will be saved as a draft.",
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // Due in 30 days
        status: "Draft",
        submissions: 0,
        fileUrl: "/placeholder.pdf"
    }
];
// --- End Mock Data ---


// Define a more specific type for the data coming into the add function
type AddAssignmentData = Omit<Assignment, 'id' | 'submissions' | 'fileUrl'>;

export async function getAssignments(options?: { publishedOnly?: boolean }): Promise<Assignment[]> {
  // Returning mock data for now to ensure UI stability.
  // In a real application, you would remove this and use the Firestore logic below.
  if (process.env.NODE_ENV === 'development') {
    if (options?.publishedOnly) {
        return mockAssignments.filter(a => a.status === "Published");
    }
    return mockAssignments;
  }
  
  // --- Real Firestore Logic ---
  try {
    let q;
    if (options?.publishedOnly) {
       q = query(assignmentsCollection, where("status", "==", "Published"), orderBy("dueDate", "desc"));
    } else {
      q = query(assignmentsCollection, orderBy("dueDate", "desc"));
    }
    
    const querySnapshot = await getDocs(q);
    let assignments = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
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
    if (process.env.NODE_ENV === 'development') {
        const newId = `ASN${String(Math.random()).slice(2, 5)}`;
        const newAssignment: Assignment = {
            id: newId,
            ...assignmentData,
            submissions: 0,
            fileUrl: file ? URL.createObjectURL(file) : "/placeholder.pdf",
        };
        mockAssignments.unshift(newAssignment);
        return newAssignment;
    }
    try {
        let fileUrl = "/placeholder.pdf"; // Default placeholder

        if (file) {
            const storageRef = ref(storage, `assignments/${Date.now()}_${file.name}`);
            const snapshot = await uploadBytes(storageRef, file);
            fileUrl = await getDownloadURL(snapshot.ref);
        }

        const newAssignment: Omit<Assignment, 'id'> = {
            title: assignmentData.title,
            description: assignmentData.description,
            dueDate: assignmentData.dueDate,
            status: assignmentData.status,
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
