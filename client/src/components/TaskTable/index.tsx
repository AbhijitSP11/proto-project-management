import React from 'react';
import { format } from 'date-fns';
import { Tooltip } from 'react-tooltip';
import { ChevronRight, FlagTriangleRight } from 'lucide-react';
import { Priority, Status, Task, User } from '@/state/api';
import { getInitials } from '@/utils/getInitials.utils';
import { getColorForName } from '@/utils/getProfileColor.utils';
import {  PRIORITY_STYLES, STATUS_STYLES } from '@/constants/constants';

interface TaskGroupProps {
  status: Status;
  tasks: Task[];
}

interface StatusBadgeProps {
  status: Status | string;
}

interface AssigneeAvatarProps {
  user?: User
}

interface PriorityFlagProps {
  priority: Priority | string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => (
  <div 
    className={`w-4 h-4 rounded-full border-2 mr-2 ${
      STATUS_STYLES[status as Status] || 'border-red-500 bg-red-500'
    }`}
  />
);

const AssigneeAvatar: React.FC<AssigneeAvatarProps> = ({ user }) => (
  <span 
    data-tooltip-id="assignee-id"
    data-tooltip-content={user?.username}
    data-tooltip-place="right"
    className={`flex items-center justify-center w-6 h-6 rounded-full p-4 text-xs text-white
      ${getColorForName(user?.username ?? "Not Available")}
    `}
  >
    {getInitials(user?.username ?? "Not Available")}
  </span>
);

const PriorityFlag: React.FC<PriorityFlagProps> = ({ priority }) => (
  <FlagTriangleRight className={PRIORITY_STYLES[priority as Priority] || "text-gray-500"} />
);

const TaskGroup: React.FC<TaskGroupProps> = ({ status, tasks }) => (
  <div className="rounded-lg border border-gray-200 mb-6">
    <div className="flex items-center justify-between p-4 border-b border-gray-200">
      <div className="flex items-center gap-2">
        <StatusBadge status={status} />
        <span className="font-medium">{status}</span>
        <span className="text-sm text-gray-500">({tasks.length})</span>
      </div>
      <button className="text-gray-400 hover:text-gray-600">+ Add Task</button>
    </div>
    
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Task</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assignee</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
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
);

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