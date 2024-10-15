import { Priority, Status } from "@/state/api";
import { GridColDef } from "@mui/x-data-grid";

export const colors: string[] = [
  '#EF4444', // Red
  '#10B981', // Green
  '#3B82F6', // Blue
  '#F59E0B', // Yellow
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#6366F1', // Indigo
  '#F97316', // Orange
];

export const getColor = (color: keyof typeof colorSystem, isDark: boolean = false) => ({
  background: isDark ? colorSystem[color].dark : colorSystem[color].light,
  text: isDark ? colorSystem[color].light : colorSystem[color].text,
});

export const colorSystem = {
  red: { light: '#FEE2E2', dark: '#7F1D1D', text: '#991B1B' },
  orange: { light: '#FFEDD5', dark: '#7C2D12', text: '#C2410C' },
  yellow: { light: '#FEF3C7', dark: '#78350F', text: '#B45309' },
  green: { light: '#D1FAE5', dark: '#064E3B', text: '#065F46' },
  blue: { light: '#DBEAFE', dark: '#1E3A8A', text: '#1E40AF' },
  purple: { light: '#EDE9FE', dark: '#4C1D95', text: '#5B21B6' },
  gray: { light: '#F3F4F6', dark: '#111827', text: '#374151' },
};

export const statusColorMap: Record<Status, keyof typeof colorSystem> = {
  [Status.Completed]: 'green',
  [Status.WorkInProgress]: 'yellow',
  [Status.ToDo]: 'gray',
  [Status.UnderReview]: 'purple',
};

export const priorityColorMap: Record<Priority, keyof typeof colorSystem> = {
  [Priority.Urgent]: 'red',
  [Priority.High]: 'orange',
  [Priority.Medium]: 'blue',
  [Priority.Low]: 'green',
  [Priority.Backlog]: 'gray',
};

export const taskColumns: GridColDef[] = [
  {field: "title", headerName: "Title", width:200}, 
  {field: "status", headerName: "Status", width:150}, 
  {field: "priority", headerName: "Priority", width:150}, 
  {field: "dueDate", headerName: "Due Date", width:150}, 
  {field: "startDate", headerName: "Start Date", width:150}, 
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

