
import { z } from 'zod';
import { db } from './firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import type { Student } from '@/app/admin/students/schema';

const usersCollection = collection(db, 'users');

export async function getStudents(): Promise<Student[]> {
  try {
    const q = query(usersCollection, where("role", "==", "student"));
    const querySnapshot = await getDocs(q);
    const students = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Basic validation to ensure required fields are present
    const studentSchema = z.object({
        id: z.string(),
        displayName: z.string(),
        email: z.string().email(),
    });

    return z.array(studentSchema).parse(students);

  } catch (error) {
    console.error("Error fetching students: ", error);
    return [];
  }
}
