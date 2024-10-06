import { Priority, Status } from "@/state/api";
import { GridColDef } from "@mui/x-data-grid";

export const colors: string[] = [
    'bg-red-500',
    'bg-green-500',
    'bg-blue-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-orange-500',
  ];

export const STATUS_STYLES = {
    [Status.Completed]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    [Status.WorkInProgress]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    [Status.ToDo]: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
    [Status.UnderReview]: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
};
  
export const PRIORITY_STYLES = {
  [Priority.Urgent]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  [Priority.High]: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  [Priority.Medium]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  [Priority.Low]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  [Priority.Backlog]: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
};


export const taskColumns: GridColDef[] = [
  {field: "title", headerName: "Title", width:200}, 
  {field: "status", headerName: "Status", width:150}, 
  {field: "priority", headerName: "Priority", width:150}, 
  {field: "dueDate", headerName: "Due Date", width:150}, 
];

export const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export const darkModePie = {
  bar: "#8884d8", 
  barGrid: "#303030", 
  pieFill: "#4A90E2", 
  text: "#FFFFFF"
}

export const LightModePie = {
  bar: "#8884d8", 
  barGrid: "#E0E0E0", 
  pieFill: "#82ca9d", 
  text: "#000000"
}
