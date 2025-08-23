
import { z } from 'zod';
import { employeeSchema, type Employee, type Task } from '@/app/admin/employees/schema';

let employeesData: Employee[] = [
    {
      id: "EMP721",
      name: "John Doe",
      role: "Software Engineer",
      details: "Frontend specialist with React expertise.",
      tasks: [
        { id: "TSK001", description: "Develop new dashboard feature", date: "2024-08-15", status: "In Progress" },
        { id: "TSK002", description: "Fix login page bug", date: "2024-07-30", status: "Done" },
      ],
    },
     {
      id: "EMP452",
      name: "Jane Smith",
      role: "Project Manager",
      details: "Agile certified project manager.",
       tasks: [
        { id: "TSK003", description: "Plan Q4 roadmap", date: "2024-09-01", status: "To Do" },
      ],
    },
    {
      id: "EMP883",
      name: "Sam Wilson",
      role: "UI/UX Designer",
      details: "Focuses on user-centric design principles.",
      tasks: [],
    },
];

export async function getEmployees() {
  await new Promise(resolve => setTimeout(resolve, 50));
  return Promise.resolve(z.array(employeeSchema).parse(JSON.parse(JSON.stringify(employeesData))));
}

export async function updateEmployeeData(id: string, updatedData: Omit<Employee, 'id' | 'tasks'>) {
    const index = employeesData.findIndex(e => e.id === id);
    if (index === -1) throw new Error("Employee not found");

    const existingEmployee = employeesData[index];
    const newEmployeeData: Employee = {
      ...existingEmployee,
      ...updatedData,
    };
    
    const validatedEmployee = employeeSchema.parse(newEmployeeData);
    employeesData[index] = validatedEmployee;
    return validatedEmployee;
}


export async function deleteEmployeeData(id: string) {
    const index = employeesData.findIndex(e => e.id === id);
    if (index === -1) throw new Error("Employee not found");
    employeesData.splice(index, 1);
    return { success: true };
}


export async function addEmployeeTask(employeeId: string, taskData: Omit<Task, 'id'>) {
    const employeeIndex = employeesData.findIndex(e => e.id === employeeId);
    if (employeeIndex === -1) throw new Error("Employee not found");

    const newTaskId = `TSK${String(Math.random()).slice(2, 7)}`;
    const newTask: Task = {
        id: newTaskId,
        ...taskData
    };
    const validatedTask = taskSchema.parse(newTask);
    employeesData[employeeIndex].tasks.push(validatedTask);
    return validatedTask;
}

export async function deleteEmployeeTask(employeeId: string, taskId: string) {
    const employeeIndex = employeesData.findIndex(e => e.id === employeeId);
    if (employeeIndex === -1) throw new Error("Employee not found");
    
    const taskIndex = employeesData[employeeIndex].tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) throw new Error("Task not found");

    employeesData[employeeIndex].tasks.splice(taskIndex, 1);
    return { success: true };
}
