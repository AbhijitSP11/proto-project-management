import { createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth';
import { addMessageToChat } from './chatSlice';

export interface Project{
    id: number;
    name: string; 
    description?: string; 
    startDate?: string; 
    endDate?: string;
}

export interface User {
    userId?: number;
    username?: string;
    email: string;
    profilePictureUrl?: string;
    cognitoId?: string;
    teamId?: number;
}

export interface Attachment {
    id: number;
    fileURL: string;
    fileName: string;
    taskId: number;
    uploadedById: number;
}

export interface Task {
    id: number;
    title: string; 
    description?: string; 
    status?: Status; 
    priority?: Priority; 
    tags?: string; 
    startDate?: string; 
    dueDate?: string; 
    points?: number;
    assignedUserId?: number; 
    authorUserId?: number; 
    projectId?: number;
    
    author?: User;
    assignee?:User;
    comments: Comment[], 
    attachments?: Attachment[] 
}

export enum Priority {
    Urgent = "Urgent", 
    High = "High", 
    Medium = "Medium", 
    Low = "Low", 
    Backlog = "Backlog"
}

export interface Team {
    teamId: number;
    teamName: string;
    productOwnerUserId?: number;
    projectManagerUserId?: number;
}

export enum Status {
    ToDo = "To Do", 
    WorkInProgress = "Work In Progress", 
    UnderReview = "Under Review", 
    Completed = "Completed"
}

export interface SearchResults {
    tasks?: Task[];
    projects?:Project[], 
    users?:User[]
};

export interface ChatRequest {
  message: string;
};

export interface ChatResponse {
  response: string;
};

export const api = createApi({
    baseQuery: fetchBaseQuery({
      baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
      prepareHeaders: async (headers) => {
        const session = await fetchAuthSession();
        const { accessToken } = session.tokens ?? {};
        if (accessToken) {
          headers.set("Authorization", `Bearer ${accessToken}`);
        }
        return headers;
      },
    }),
    reducerPath: "api",
    tagTypes: ["Projects", "Tasks", "Users", "Teams"],
    endpoints: (build) => ({
      getAuthUser: build.query({
        queryFn: async (_, _queryApi, _extraoptions, fetchWithBQ) => {
          try {
            const user = await getCurrentUser();
            const session = await fetchAuthSession();
            if (!session) throw new Error("No session found");
            const { userSub } = session;
            console.log("userSub", userSub);

            const { accessToken } = session.tokens ?? {};
  
            const userDetailsResponse = await fetchWithBQ(`users/${userSub}`);
            console.log("userDetailsResponse", userDetailsResponse);
            const userDetails = userDetailsResponse.data as User;
            console.log("userDetails", userDetails);
  
            return { data: { user, userSub, userDetails } };
          } catch (error: any) {
            return { error: error.message || "Could not fetch user data" };
          }
        },
      }),
        getProjects: build.query<Project[], void>({
            query: ()=> "projects", 
            providesTags: ["Projects"],
        }), 
        createProject: build.mutation<Project, Partial<Project>>({
            query: (project) => ({
                url: "projects", 
                method: "POST", 
                body: project
            }), 
            invalidatesTags: ["Projects"]
        }),
        getProjectById: build.query<Project[], {id: number}>({
            query: ({id}) => `projects?id=${id}`,  
            providesTags: ["Projects"],
        }),
        getTasks: build.query<Task[], {projectId:number}>({
            query: ({projectId})=> `tasks?projectId=${projectId}`, 
            providesTags: (result) => result? result.map(({id}) => ({type: "Tasks" as const, id})) : [{type: "Tasks" as const}]
        }), 
        createTasks: build.mutation<Task, Partial<Task>>({
            query: (task) => ({
                url: "tasks", 
                method: "POST", 
                body: task,  
            }), 
            invalidatesTags: ["Tasks"]
        }), 
        updateTaskStatus: build.mutation<Task, {taskId: number, status: string}>({
            query: ({taskId, status}) => ({
                url: `tasks/${taskId}/status`, 
                method: "PATCH", 
                body: {status},  
            }), 
            invalidatesTags: (result, error, {taskId}) => [{type: "Tasks", id: taskId}]
        }), 
        getUsers: build.query<User[], void>({
            query: () => "users",
            providesTags: ["Users"],    
        }), 
        search: build.query<SearchResults, string>({
            query: (query) => `search?query=${query}`,
        }),
        getTeams: build.query<Team[], void>({
            query: () => "teams", 
            providesTags: ["Teams"]
        }), 
        getTasksByUser: build.query<Task[], number>({
            query: (userId) => `tasks/user/${userId}`,
            providesTags: (result, error, userId) =>
              result
                ? result.map(({ id }) => ({ type: "Tasks", id }))
                : [{ type: "Tasks", id: userId }],
          }),
          groqChat: build.mutation<ChatResponse, ChatRequest>({
            query: (chatRequest) => ({
              url: '/groq/chat',
              method: 'POST',
              body: chatRequest,
            })
          })
    }),
});

export const {
    useGetProjectsQuery, 
    useCreateProjectMutation, 
    useGetTasksQuery, 
    useCreateTasksMutation, 
    useUpdateTaskStatusMutation, 
    useGetUsersQuery, 
    useSearchQuery, 
    useGetTeamsQuery, 
    useGetTasksByUserQuery, 
    useGetAuthUserQuery, 
    useGroqChatMutation,
    useGetProjectByIdQuery
} = api;