import express, { Request, Response } from 'express';
import { Groq } from "groq-sdk";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const MODEL = "llama3-groq-70b-8192-tool-use-preview";

app.use(express.json());

// API functions
async function getUserTasks(userId: number): Promise<string> {
  const tasks = await prisma.task.findMany({
    where: {
      OR: [
        { authorUserId: userId },
        { assignedUserId: userId },
      ],
    },
    include: {
      author: true,
      assignee: true,
    },
  });
  return JSON.stringify(tasks);
}

async function getAllTasks(): Promise<string> {
  const tasks = await prisma.task.findMany({
    include: {
      author: true,
      assignee: true,
    },
  });
  return JSON.stringify(tasks);
}

async function getUserProject(userId: number): Promise<string> {
  const projects = await prisma.project.findMany({
    where: {
      projectTeams: {
        some: {
          team: {
            user: {
              some: {
                userId: userId,
              },
            },
          },
        },
      },
    },
  });
  return JSON.stringify(projects);
}

async function getProjectTasks(projectId: number): Promise<string> {
  const tasks = await prisma.task.findMany({
    where: {
      projectId: projectId,
    },
    include: {
      author: true,
      assignee: true,
    },
  });
  return JSON.stringify(tasks);
}

async function getProjectTeamMembers(projectId: number): Promise<string> {
  const teamMembers = await prisma.user.findMany({
    where: {
      team: {
        projectTeams: {
          some: {
            projectId: projectId,
          },
        },
      },
    },
  });
  return JSON.stringify(teamMembers);
}

async function getTeamMembers(teamId: number): Promise<string> {
  const teamMembers = await prisma.user.findMany({
    where: {
      teamId: teamId,
    },
  });
  return JSON.stringify(teamMembers);
}

async function getProjectTimeline(projectId: number): Promise<string> {
  const tasks = await prisma.task.findMany({
    where: {
      projectId: projectId,
    },
    select: {
      id: true,
      title: true,
      startDate: true,
      dueDate: true,
    },
  });
  return JSON.stringify(tasks);
}

async function getTasksByUser(userId: number): Promise<string> {
  const tasks = await prisma.task.findMany({
    where: {
      assignedUserId: userId,
    },
    include: {
      project: true,
    },
  });
  return JSON.stringify(tasks);
}

// Get Task Statistics
async function getTaskStatistics(): Promise<string> {
  const totalTasks = await prisma.task.count();
  const completedTasks = await prisma.task.count({ where: { status: 'completed' } });
  const overdueTasks = await prisma.task.count({
    where: {
      dueDate: {
        lt: new Date(),
      },
      status: {
        not: 'completed',
      },
    },
  });

  return JSON.stringify({
    totalTasks,
    completedTasks,
    overdueTasks,
    completionRate: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0,
  });
}

// Get Project Progress
async function getProjectProgress(projectId: number): Promise<string> {
  const totalTasks = await prisma.task.count({ where: { projectId } });
  const completedTasks = await prisma.task.count({
    where: {
      projectId,
      status: 'completed',
    },
  });

  return JSON.stringify({
    projectId,
    totalTasks,
    completedTasks,
    progressPercentage: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0,
  });
}

// Get User Workload
async function getUserWorkload(userId: number): Promise<string> {
  const tasks = await prisma.task.findMany({
    where: {
      assignedUserId: userId,
    },
    select: {
      id: true,
      title: true,
      status: true,
      priority: true,
    },
  });

  return JSON.stringify(tasks);
}


async function runConversation(userPrompt: string) {
  const messages: Groq.Chat.Completions.ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: `You are a project management assistant. 
      Use the provided functions to retrieve information about 
      tasks, projects, and team members based on the user's request. 
      Always provide concise and relevant responses.`
    },
    {
      role: "user",
      content: userPrompt,
    }
  ];

  const tools: Groq.Chat.Completions.ChatCompletionTool[] = [
    {
      type: "function",
      function: {
        name: "getUserTasks",
        description: "Get the list of tasks for the specified user in the project.",
        parameters: {
          type: "object",
          properties: {
            userId: {
              type: "number",
              description: "The ID of the user whose tasks to fetch",
            },
          },
          required: ["userId"],
        },
      },
    },
    {
      type: "function",
      function: {
        name: "getAllTasks",
        description: "Get the list of all tasks in the project.",
        parameters: {
          type: "object",
          properties: {},
          required: [],
        },
      },
    },
    {
      type: "function",
      function: {
        name: "getUserProject",
        description: "Get the list of projects for the specified user.",
        parameters: {
          type: "object",
          properties: {
            userId: {
              type: "number",
              description: "The ID of the user whose projects to fetch",
            },
          },
          required: ["userId"],
        },
      },
    },
    {
      type: "function",
      function: {
        name: "getProjectTasks",
        description: "Get the list of tasks for the specified project.",
        parameters: {
          type: "object",
          properties: {
            projectId: {
              type: "number",
              description: "The ID of the project whose tasks to fetch",
            },
          },
          required: ["projectId"],
        },
      },
    },
    {
      type: "function",
      function: {
        name: "getProjectTeamMembers",
        description: "Get the list of team members for the specified project.",
        parameters: {
          type: "object",
          properties: {
            projectId: {
              type: "number",
              description: "The ID of the project whose team members to fetch",
            },
          },
          required: ["projectId"],
        },
      },
    },
    {
      type: "function",
      function: {
        name: "getTeamMembers",
        description: "Get the list of members in the specified team.",
        parameters: {
          type: "object",
          properties: {
            teamId: {
              type: "number",
              description: "The ID of the team whose members to fetch",
            },
          },
          required: ["teamId"],
        },
      },
    },
    {
      type: "function",
      function: {
        name: "getProjectTimeline",
        description: "Get the timeline of tasks for the specified project.",
        parameters: {
          type: "object",
          properties: {
            projectId: {
              type: "number",
              description: "The ID of the project whose timeline to fetch",
            },
          },
          required: ["projectId"],
        },
      },
    },
    {
      type: "function",
      function: {
        name: "getTasksByUser",
        description: "Get the list of tasks assigned to the specified user.",
        parameters: {
          type: "object",
          properties: {
            userId: {
              type: "number",
              description: "The ID of the user whose assigned tasks to fetch",
            },
          },
          required: ["userId"],
        },
      },
    },
    {
      type: "function",
      function: {
        name: "getTaskStatistics",
        description: "Get insights on task completion rates, overdue tasks, and user workload.",
        parameters: {
          type: "object",
          properties: {},
          required: [],
        },
      },
    },
    {
      type: "function",
      function: {
        name: "getProjectProgress",
        description: "Get a summary of project progress based on completed and pending tasks.",
        parameters: {
          type: "object",
          properties: {
            projectId: {
              type: "number",
              description: "The ID of the project to get progress for",
            },
          },
          required: ["projectId"],
        },
      },
    },
    {
      type: "function",
      function: {
        name: "getUserWorkload",
        description: "Get a summary of tasks assigned to a user, including their status and priority.",
        parameters: {
          type: "object",
          properties: {
            userId: {
              type: "number",
              description: "The ID of the user whose workload to retrieve",
            },
          },
          required: ["userId"],
        },
      },
    },
  ];
  

  try {
    const response = await groq.chat.completions.create({
      model: MODEL,
      messages: messages,
      tools: tools,
      max_tokens: 400
    });

    const responseMessage = response.choices[0].message;
    const toolCalls = responseMessage.tool_calls;

    if (toolCalls) {
      const availableFunctions = {
        getUserTasks,
        getAllTasks,
        getUserProject,
        getProjectTasks,
        getProjectTeamMembers,
        getTeamMembers,
        getProjectTimeline,
        getTasksByUser,
        getProjectProgress, 
        getTaskStatistics, 
        getUserWorkload
      };

      messages.push(responseMessage);

      for (const toolCall of toolCalls) {
        const functionName = toolCall.function.name as keyof typeof availableFunctions;
        const functionToCall = availableFunctions[functionName];
        const functionArgs = JSON.parse(toolCall.function.arguments);
        const functionResponse = await functionToCall(functionArgs.userId || functionArgs.projectId || functionArgs.teamId);

        messages.push({
          role: "function",
          name: functionName,
          content: functionResponse,
        });
      }

      const secondResponse = await groq.chat.completions.create({
        model: MODEL,
        messages: messages
      });

      return secondResponse.choices[0].message.content;
    }

    return responseMessage.content;
  } catch (error) {
    console.error("Error:", error);
    return "An error occurred while processing your request.";
  }
}

export const groqResponse = async (req: Request, res: Response) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const response = await runConversation(message);
    res.json({ response });
  } catch (error) {
    console.error('Error processing chatbot request:', error);
    res.status(500).json({ error: 'An error occurred while processing your request' });
  }
}

