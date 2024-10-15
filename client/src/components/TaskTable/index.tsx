import React, { useMemo } from 'react';
import { format } from 'date-fns';
import { Tooltip } from 'react-tooltip';
import { FlagIcon } from 'lucide-react';
import { Priority, Status, Task, User } from '@/state/api';
import { getInitials } from '@/utils/getInitials.utils';
import {  colors, getColor, priorityColorMap, statusColorMap} from '@/constants/constants';

interface TaskGroupProps {
  status: Status;
  tasks: Task[];
}

interface StatusBadgeProps {
  status: Status | string;
  isDark?: boolean;

}

interface AssigneeAvatarProps {
  user?: User
}

interface PriorityFlagProps {
  priority: Priority | string;
  isDark?: boolean;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, isDark = false }) => {
  const color = getColor(statusColorMap[status as Status], isDark);
  
  return (
    <div 
      style={{
        width: '1rem',
        height: '1rem',
        borderRadius: '9999px',
        marginRight: '0.5rem',
        backgroundColor: color.background,
        border: `2px solid ${color.text}`,
      }}
    />
  );
};


function useColorAssignment(username: string): string {
  const hash = username.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  const index = Math.abs(hash) % colors.length;
  return colors[index];
}
const AssigneeAvatar: React.FC<AssigneeAvatarProps> = ({ user }) => {
  const username = user?.username ?? "Not Available";
  const color = useColorAssignment(username);

  return (
    <span 
    data-tooltip-id="assignee-id"
    data-tooltip-content={username}
    data-tooltip-place="right"
    style={{
      backgroundColor: color,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '2rem',
      height: '2rem',
      borderRadius: '9999px',
      fontSize: '0.75rem',
      color: 'white',
      fontWeight: '600',
      padding: '0.5rem',
    }}
  >
    {getInitials(username)}
  </span>
  );
};


const PriorityFlag: React.FC<PriorityFlagProps> = ({ priority, isDark = false }) => {
  const color = getColor(priorityColorMap[priority as Priority], isDark);
  
  return (
    <FlagIcon 
      style={{
        color: color.text,
        backgroundColor: color.background,
        padding: '4px',
        borderRadius: '4px',
      }}
      size={24}
    />
  );
};

const TaskGroup: React.FC<TaskGroupProps> = ({ status, tasks }) => {
  return (
  <div className="rounded-lg border border-gray-200 dark:border-[#2d3135] mb-6">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-[#2d3135]">
        <div className="flex items-center gap-2">
          <StatusBadge status={status} />
          <span className="font-medium">{status}</span>
          <span className="text-sm text-gray-500">({tasks.length})</span>
        </div>
      </div>
      
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50 dark:bg-[#1d1f21]">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Task</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assignee</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-[#1d1f21] divide-y divide-gray-200">
          {tasks.map(task => (
            <tr key={task.id}>
              <td className="px-6 py-4 w-[50%]"> 
                <div className="flex items-center">
                  <StatusBadge status={task.status || "NA"} />
                  <span>{task.title}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <AssigneeAvatar user={task.assignee} />
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {task.dueDate ? format(new Date(task.dueDate), 'P') : 'No date'}
              </td>
              <td className="px-6 py-4">
                <PriorityFlag priority={task.priority || "Not Set"} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
 )
};

interface TaskBoardProps {
  tasks: Task[];
}

const TaskBoard: React.FC<TaskBoardProps> = ({ tasks }) => {
  const groupedTasks = tasks.reduce((acc, task) => {
    const status = task.status || Status.ToDo;
    if (!acc[status]) {
      acc[status] = [];
    }
    acc[status].push(task);
    return acc;
  }, {} as Record<Status, Task[]>);
  return (
    <div className="flex flex-col w-full justify-start overflow-x-auto">
      {Object.entries(Status).map(([key, status]) => (
        groupedTasks[status] && (
          <TaskGroup 
            key={status} 
            status={status} 
            tasks={groupedTasks[status]} 
          />
        )
      ))}
      <Tooltip id="assignee-id" />
    </div>
  );
};

export default TaskBoard;