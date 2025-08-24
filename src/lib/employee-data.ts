
import { z } from 'zod';
import { employeeSchema, type Employee, type Task, taskSchema } from '@/app/admin/employees/schema';
import { db } from './firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, arrayUnion, arrayRemove, getDoc } from 'firebase/firestore';

const employeesCollection = collection(db, 'employees');

export async function getEmployees() {
  try {
    const querySnapshot = await getDocs(employeesCollection);
    const employees = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // Ensure tasks array exists and is valid, default to empty array if not.
    const validatedEmployees = employees.map(emp => ({...emp, tasks: emp.tasks || []}));
    return z.array(employeeSchema).parse(validatedEmployees);
  } catch (error) {
    console.error("Error fetching employees: ", error);
    return [];
  }
}

export async function addEmployeeData(employee: Omit<Employee, 'id' | 'tasks'>) {
    try {
        const newEmployee = {
            ...employee,
            tasks: [], // Start with an empty task list
        };
        const docRef = await addDoc(employeesCollection, newEmployee);
        return { ...newEmployee, id: docRef.id };
    } catch (error) {
        console.error("Error adding employee: ", error);
        throw new Error("Failed to add employee to the database.");
    }
}


export async function updateEmployeeData(id: string, updatedData: Partial<Omit<Employee, 'id' | 'tasks'>>) {
    try {
        const employeeRef = doc(db, 'employees', id);
        await updateDoc(employeeRef, updatedData);
        return { success: true };
    } catch (error) {
        console.error("Error updating employee: ", error);
        throw new Error("Failed to update employee.");
    }
}


export async function deleteEmployeeData(id: string) {
    try {
        const employeeRef = doc(db, 'employees', id);
        await deleteDoc(employeeRef);
        return { success: true };
    } catch (error) {
        console.error("Error deleting employee: ", error);
        throw new Error("Failed to delete employee.");
    }
}


export async function addEmployeeTask(employeeId: string, taskData: Omit<Task, 'id'>) {
    try {
        const employeeRef = doc(db, 'employees', employeeId);
        const newTaskId = `TSK${String(Math.random()).slice(2, 7)}`;
        const newTask: Task = {
            id: newTaskId,
            ...taskData
        };
        const validatedTask = taskSchema.parse(newTask);
        await updateDoc(employeeRef, {
            tasks: arrayUnion(validatedTask)
        });
        return validatedTask;
    } catch (error) {
        console.error("Error adding task: ", error);
        throw new Error("Failed to add task.");
    }
}

export async function deleteEmployeeTask(employeeId: string, taskId: string) {
    try {
        const employeeRef = doc(db, 'employees', employeeId);
        const employeeDoc = await getDoc(employeeRef);
        if (!employeeDoc.exists()) throw new Error("Employee not found");
        
        const employee = employeeSchema.parse({ id: employeeDoc.id, ...employeeDoc.data() });
        const taskToDelete = employee.tasks.find(t => t.id === taskId);

        if (!taskToDelete) throw new Error("Task not found");
        
        await updateDoc(employeeRef, {
            tasks: arrayRemove(taskToDelete)
        });
        return { success: true };
    } catch (error) {
        console.error("Error deleting task: ", error);
        throw new Error("Failed to delete task.");
    }
}
