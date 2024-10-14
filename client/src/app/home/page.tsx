"use client";

import {
  Priority,
  Project,
  Task,
  useGetProjectsQuery,
  useGetTasksQuery,
} from "@/state/api";
import React from "react";
import { useAppSelector } from "../redux";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Header from "@/components/Header";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { dataGridClassNames, dataGridSxStyles } from "@/utils/dataGridClassNames.utils";
import { COLORS, taskColumns } from "@/constants/constants";
import { useTheme } from "next-themes";
import Spinner from "@/components/UI/spinner";
import { BarChartIcon, CheckCircleIcon, ClockIcon, FlagIcon, Info, LucideIcon, PieChartIcon, UsersIcon } from "lucide-react";
import { Tooltip as ReactToolTip} from 'react-tooltip';

const HomePage = () => {
  const {
    data: tasks,
    isLoading: tasksLoading,
    isError: tasksError,
  } = useGetTasksQuery({ projectId: parseInt("1") });

  const { data: projects, isLoading: isProjectsLoading } = useGetProjectsQuery();

    const { theme } = useTheme();
    const isDarkMode = theme === "dark";

  if (tasksLoading || isProjectsLoading) return <div><Spinner/></div>;
  if (tasksError || !tasks || !projects) return <div>Error fetching data</div>;

  const priorityCount = tasks.reduce(
    (acc: Record<string, number>, task: Task) => {
      const { priority } = task;
      acc[priority as Priority] = (acc[priority as Priority] || 0) + 1;
      return acc;
    },
    {},
  );

  const taskDistribution = Object.keys(priorityCount).map((key) => ({
    name: key,
    count: priorityCount[key],
  }));

  const statusCount = projects.reduce(
    (acc: Record<string, number>, project: Project) => {
      const status = project.endDate ? "Completed" : "Active";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    {},
  );

  const projectStatus = Object.keys(statusCount).map((key) => ({
    name: key,
    count: statusCount[key],
  }));

  const totalProjects = projects.length;

  const totalTasks = tasks.length;
  
  const overdueTasks = tasks.filter(task => {
    const dueDate = task.dueDate ? new Date(task.dueDate) : null;
    return dueDate && dueDate < new Date();
  }).length;
  
  const tasksDueSoon = tasks.filter(task => {
    const today = new Date();
    const dueDate = task.dueDate ? new Date(task.dueDate) : null;
    return dueDate && dueDate > today && (dueDate.getTime() - today.getTime()) <= 7 * 24 * 60 * 60 * 1000; 
  }).length;
  
  
  const uniqueAssignees = new Set(tasks.map(task => task.assignedUserId)).size;

  const chartColors = isDarkMode
    ? {
        bar: "#8884d8",
        barGrid: "#303030",
        pieFill: "#4A90E2",
        text: "#FFFFFF",
      }
    : {
        bar: "#8884d8",
        barGrid: "#E0E0E0",
        pieFill: "#82ca9d",
        text: "#000000",
      };

  const stats = [
    { icon: PieChartIcon, title: "Total Projects", count: totalProjects, iconColor: "text-blue-500", bgColor: "bg-blue-100" },
    { icon: BarChartIcon, title: "Total Tasks", count: totalTasks, iconColor: "text-orange-500", bgColor: "bg-orange-100"},
    { icon: CheckCircleIcon, title: "Overdue Tasks", count: overdueTasks, iconColor: "text-pink-500", bgColor: "bg-pink-100"},
    { icon: ClockIcon, title: "Tasks Due Soon", count: tasksDueSoon, iconColor: "text-yellow-500", bgColor: "text-yellow-200"},
    { icon: UsersIcon, title: "Unique Assignees", count: uniqueAssignees, iconColor: "text-brown-500", bgColor: "bg-brown-100" },
    { icon: FlagIcon, title: "Urgent Tasks", count: priorityCount["Urgent"] || 0, iconColor: "text-purple-500", bgColor: "bg-purple-100" },
  ];

  return (
    <div className="container h-full w-[100%] bg-gray-100 bg-transparent p-8">
      <div className="w-full flex items-center gap-2">
        <span className="flex rounded-lg px-6 py-2 text-2xl mb-5 items-center justify-center bg-blue-500 text-white font-bold">
          {projects[0].name[0]}
        </span>
        <Header name={`${projects[0].name} Project Dashboard`}/>
      </div>
      <div className="flex gap-2 rounded-lg">
        {stats.map((stat, index) => (
          <DashboardStats
            key={index}
            icon={stat.icon}
            title={stat.title}
            count={stat.count}
            bgColor={stat.bgColor}
            iconColor={stat.iconColor}
          />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-lg bg-white p-4 shadow dark:bg-dark-secondary">
          <h3 className="mb-4 text-lg font-semibold dark:text-white">
            Task Priority Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={taskDistribution}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={chartColors.barGrid}
              />
              <XAxis dataKey="name" stroke={chartColors.text} />
              <YAxis stroke={chartColors.text} />
              <Tooltip
                contentStyle={{
                  width: "min-content",
                  height: "min-content",
                }}
              />
              <Legend />
              <Bar dataKey="count" fill={chartColors.bar}  barSize={50} radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-lg bg-white p-4 shadow dark:bg-dark-secondary">
          <h3 className="mb-4 text-lg font-semibold dark:text-white">
            Project Status
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie dataKey="count" data={projectStatus} fill="#82ca9d" label>
                {projectStatus.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-lg bg-white p-4 shadow dark:bg-dark-secondary md:col-span-2">
          <h3 className="mb-4 text-lg font-semibold dark:text-white">
            Tasks
          </h3>
          <div style={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={tasks}
              columns={taskColumns}
              loading={tasksLoading}
              getRowClassName={() => "data-grid-row"}
              getCellClassName={() => "data-grid-cell"}
              className={dataGridClassNames}
              sx={dataGridSxStyles(isDarkMode)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

type DashboardProps  = {
  icon: LucideIcon;
  title: string;
  count: number;
  iconColor: string;
  bgColor: string
}

const DashboardStats = ({icon: Icon, count, title, bgColor, iconColor}: DashboardProps) => {
  return (
    <div className="w-full flex flex-col border border-gray-100 dark:bg-dark-secondary dark:border-gray-600 shadow-sm rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
            <span><Icon className={`size-6 ${bgColor} ${iconColor} rounded-sm p-1`}/></span>
            <p className="text-base text-gray-600 dark:text-white">{title}</p>
        </div>
        <div 
         data-tooltip-id={title}
         data-tooltip-content={title}
         data-tooltip-place="right">
          <Info className="size-4 text-gray-400 dark:text-gray-300"/>
        </div>
      </div>
      <ReactToolTip id={title}/>
      <span className="flex text-3xl text-gray-600 font-bold mt-2 dark:text-gray-300">{count}</span>
    </div>
  )
}

export default HomePage;