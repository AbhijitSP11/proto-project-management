import { PrismaClient, Task } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient

export const getTasks  = async (
    req: Request, 
    res: Response
): Promise<void> => {
    const {projectId} = req.query;
    try{
        const tasks = await prisma.task.findMany({
            where: {
                projectId: Number(projectId)
            }, 
            include: {
                author: true, 
                assignee: true, 
                comments: true, 
                attachments: true,
            }
        });
        res.json(tasks); 
    }catch(err:any){
        res.status(500).json({messaage: `Error retriving tasks ${err.messaage}`})
    }
};

export const createTask = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { title, description, status, priority, tags, startDate, dueDate, assignedUserId, authorUserId, projectId } : Task = req.body;
    try {
      const newTask = await prisma.task.create({
        data: {
            title, description, status, priority, tags, startDate, dueDate, assignedUserId, authorUserId, projectId
        },
      });
      res.status(201).json(newTask);
    } catch (error: any) {
      res
        .status(500)
        .json({ message: `Error creating the task: ${error.message}` });
    }
  };

export const updateTaskStatus  = async (
    req: Request, 
    res: Response
): Promise<void> => {
    const {taskId} = req.params;
    const {status} = req.body;

    try{
        const updatedTask = await prisma.task.update({
            where: {
                id: Number(taskId)
            }, 
            data: {
                status: status
            }
        });
        res.json(updatedTask); 
    }catch(err:any){
        res.status(500).json({messaage: `Error updating task ${err.messaage}`})
    }
};

export const getUserTasks  = async (
    req: Request, 
    res: Response
): Promise<void> => {
    const {userId} = req.params;
    try{
        const tasks = await prisma.task.findMany({
            where: {
                OR: [
                    {authorUserId: Number(userId)}, 
                    {assignedUserId: Number(userId)}
                ]
            }, 
            include: {
                author: true, 
                assignee: true
            }
        });
        res.json(tasks); 
    }catch(err:any){
        res.status(500).json({messaage: `Error retriving user tasks ${err.messaage}`})
    }
};