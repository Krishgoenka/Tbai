
"use server"

import { z } from "zod"
import { employeeSchema, taskSchema } from "./schema"
import { revalidatePath } from "next/cache"
import { updateEmployeeData, deleteEmployeeData, addEmployeeTask, deleteEmployeeTask } from "@/lib/employee-data"

const updateEmployeeFormSchema = employeeSchema.omit({ id: true, tasks: true });
const addTaskFormSchema = taskSchema.omit({ id: true });

export async function updateEmployee(id: string, data: z.infer<typeof updateEmployeeFormSchema>) {
    try {
        const validatedData = updateEmployeeFormSchema.parse(data);
        await updateEmployeeData(id, validatedData);
        revalidatePath("/admin/employees");
        return { success: true, message: "Employee updated successfully." };
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { success: false, message: error.errors.map(e => e.message).join(", ") };
        }
        console.error(error);
        return { success: false, message: "An unknown error occurred." };
    }
}

export async function deleteEmployee(id: string) {
    try {
        await deleteEmployeeData(id);
        revalidatePath("/admin/employees");
        return { success: true, message: "Employee deleted successfully." };
    } catch (error) {
        return { success: false, message: "Failed to delete employee." };
    }
}


export async function addTask(employeeId: string, data: z.infer<typeof addTaskFormSchema>) {
    try {
        const validatedData = addTaskFormSchema.parse(data);
        await addEmployeeTask(employeeId, validatedData);
        revalidatePath("/admin/employees");
        return { success: true, message: "Task added successfully." };
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { success: false, message: error.errors.map(e => e.message).join(", ") };
        }
        return { success: false, message: "An unknown error occurred." };
    }
}

export async function deleteTask(employeeId: string, taskId: string) {
    try {
        await deleteEmployeeTask(employeeId, taskId);
        revalidatePath("/admin/employees");
        return { success: true, message: "Task deleted successfully." };
    } catch (error) {
        return { success: false, message: "Failed to delete task." };
    }
}
