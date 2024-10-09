import React, { useState } from "react";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Flag,
  User,
  Tag,
  X,
  ChevronDown,
} from "lucide-react";
import dayjs from "dayjs";
import { cn } from "@/lib/utils";
import Select, { components } from "react-select";
import { Priority, Status, Task, useCreateTasksMutation, useGetUsersQuery} from "@/state/api";
import { PRIORITY_STYLES } from "@/constants/constants";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  id?: string | null;
}

const priorityOptions = [
  { value: Priority.Urgent, label: "Urgent" },
  { value: Priority.High, label: "High" },
  { value: Priority.Medium, label: "Medium" },
  { value: Priority.Low, label: "Low" },
  { value: Priority.Backlog, label: "Backlog" },
];


// Mock data for tags (replace with actual data from your application)
const tagOptions = [
  { value: "Frontend", label: "Frontend" },
  { value: "Backend", label: "Backend" },
  { value: "Design", label: "Design" },
];

const UserOption = ({ data, ...props }: any) => (
    <components.Option {...props}>
      <div className="flex items-center">
        <img 
          src={data.profilePictureUrl || '/default-avatar.png'} 
          alt={data.label} 
          className="w-6 h-6 rounded-full mr-2"
        />
        {data.label}
      </div>
    </components.Option>
  );

  const UserSingleValue = ({ data, ...props }: any) => (
    <components.SingleValue {...props}>
      <div className="flex items-center">
        <img 
          src={data.profilePictureUrl || '/default-avatar.png'} 
          alt={data.label} 
          className="w-6 h-6 rounded-full mr-2"
        />
        {data.label}
      </div>
    </components.SingleValue>
  );

const PriorityOption = (props: any) => (
  <components.Option {...props}>
    <div className="flex items-center">
      <div className={`w-3 h-3 rounded-full mr-2 ${PRIORITY_STYLES[props.data.value as keyof typeof PRIORITY_STYLES].split(' ')[0]}`} />
      {props.data.label}
    </div>
  </components.Option>
);

const PrioritySingleValue = (props: any) => (
  <components.SingleValue {...props}>
    <div className="flex items-center">
      <div className={`w-3 h-3 rounded-full mr-2 ${PRIORITY_STYLES[props.data.value as keyof typeof PRIORITY_STYLES].split(' ')[0]}`} />
      {props.data.label}
    </div>
  </components.SingleValue>
);

const ModalNewTask: React.FC<Props> = ({ isOpen, onClose, id = null  }) => {

  const [createTask, {isLoading}] = useCreateTasksMutation();
  const {data: users} = useGetUsersQuery();

  const userOptions = users ? users.map(user => ({
    value: user.userId,
    label: user.username,
    profilePictureUrl: user.profilePictureUrl
  })) : [];
  
  const [taskData, setTaskData] = useState<Partial<Task>>({
    title: "",
    description: "",
    startDate: "",
    dueDate: "",
    priority: Priority.Medium,
    status: Status.ToDo,
    assignedUserId: 0,
    authorUserId: 0,
    tags: "",
    projectId: Number(id),
  });

  const [calendarVisible, setCalendarVisible] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(dayjs());
  const [dateType, setDateType] = useState<"start" | "due">("start");

  const handleQuickSelection = (daysToAdd: number) => {
    const date = dayjs().add(daysToAdd, "day").toISOString();
    handleInputChange(dateType === "start" ? "startDate" : "dueDate", date);
    setCalendarVisible(false);
  };

  const handleInputChange = (field: keyof Task, value: any) => {
    setTaskData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDateSelect = (date: dayjs.Dayjs) => {
    handleInputChange(
      dateType === "start" ? "startDate" : "dueDate",
      date.toISOString()
    );
    setCalendarVisible(false);
  };

  const generateCalendarDays = () => {
    const startOfMonth = selectedMonth.startOf("month");
    const endOfMonth = selectedMonth.endOf("month");
    const startDate = startOfMonth.startOf("week");
    const endDate = endOfMonth.endOf("week");
    const days: dayjs.Dayjs[] = [];

    let currentDay = startDate;
    while (currentDay.isBefore(endDate)) {
      days.push(currentDay);
      currentDay = currentDay.add(1, "day");
    }

    return days;
  };

  const isFormValid = (): boolean =>
    taskData.title !== undefined && 
    taskData.title.trim() !== "" && 
    taskData.startDate !== undefined && 
    taskData.dueDate !== undefined &&
    taskData.assignedUserId !== 0 &&
    taskData.authorUserId !== 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid()) {
      createTask(taskData);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-2xl rounded-lg bg-white p-6 shadow-lg">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 transition hover:text-gray-600"
        >
          <X className="h-6 w-6" />
        </button>

        <h2 className="mb-4 text-2xl font-bold">Create New Task</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Task Title"
              value={taskData.title || ""}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-3 text-lg focus:border-blue-500 focus:ring focus:ring-blue-200"
            />
          </div>

          <div>
            <textarea
              placeholder="Task Description"
              value={taskData.description || ""}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:ring focus:ring-blue-200"
            />
          </div>

          {/* Date Selectors */}
          <div className="flex space-x-4">
            <div className="relative flex-1">
              <div
                className="flex cursor-pointer items-center justify-between rounded-lg bg-gray-100 p-3"
                onClick={() => {
                  setDateType("start");
                  setCalendarVisible(!calendarVisible);
                }}
              >
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-600" />
                  <span className="ml-3 text-sm text-gray-700">
                    {taskData.startDate
                      ? `Start: ${dayjs(taskData.startDate).format("MMM D, YYYY")}`
                      : "Set start date"}
                  </span>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-600" />
              </div>
            </div>
            <div className="relative flex-1">
              <div
                className="flex cursor-pointer items-center justify-between rounded-lg bg-gray-100 p-3"
                onClick={() => {
                  setDateType("due");
                  setCalendarVisible(!calendarVisible);
                }}
              >
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-600" />
                  <span className="ml-3 text-sm text-gray-700">
                    {taskData.dueDate
                      ? `Due: ${dayjs(taskData.dueDate).format("MMM D, YYYY")}`
                      : "Set due date"}
                  </span>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-600" />
              </div>
            </div>
          </div>

          {calendarVisible && (
            <div className="absolute z-10 mt-2 w-full rounded-lg border bg-white shadow-lg">
              <div className="p-4">
                {/* Quick selections */}
                <div className="mb-3 flex items-center justify-around">
                  <button
                    type="button"
                    className="rounded-lg bg-blue-100 px-3 py-2 text-sm text-blue-700"
                    onClick={() => handleQuickSelection(0)}
                  >
                    Today
                  </button>
                  <button
                    type="button"
                    className="rounded-lg bg-green-100 px-3 py-2 text-sm text-green-700"
                    onClick={() => handleQuickSelection(1)}
                  >
                    Tomorrow
                  </button>
                </div>

                {/* Month navigation */}
                <div className="mb-2 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setSelectedMonth(selectedMonth.subtract(1, "month"))}
                  >
                    <ChevronLeft className="h-5 w-5 text-gray-600" />
                  </button>
                  <span className="text-sm font-medium">
                    {selectedMonth.format("MMMM YYYY")}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedMonth(selectedMonth.add(1, "month"))}
                  >
                    <ChevronRight className="h-5 w-5 text-gray-600" />
                  </button>
                </div>

                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-1">
                  {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
                    <div
                      key={index}
                      className="text-center text-xs font-medium text-gray-600"
                    >
                      {day}
                    </div>
                  ))}

                  {generateCalendarDays().map((day, index) => (
                    <div
                      key={index}
                      onClick={() => handleDateSelect(day)}
                      className={cn(
                        "cursor-pointer rounded-full p-2 text-center text-sm",
                        {
                          "bg-blue-500 text-white":
                            (dateType === "start" &&
                              taskData.startDate &&
                              dayjs(taskData.startDate).isSame(day, "day")) ||
                            (dateType === "due" &&
                              taskData.dueDate &&
                              dayjs(taskData.dueDate).isSame(day, "day")),
                          "text-gray-400": !day.isSame(selectedMonth, "month"),
                          "hover:bg-blue-100": day.isSame(selectedMonth, "month"),
                        }
                      )}
                    >
                      {day.date()}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Priority</label>
              <Select
                options={priorityOptions}
                value={priorityOptions.find(option => option.value === taskData.priority)}
                onChange={(selected) => handleInputChange("priority", selected?.value)}
                className="react-select-container"
                classNamePrefix="react-select"
                components={{
                  Option: PriorityOption,
                  SingleValue: PrioritySingleValue,
                }}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Status</label>
              <div className="rounded-md bg-gray-100 p-3 text-sm text-gray-700">
                {Status.ToDo}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Assignee</label>
            <Select
              options={userOptions}
              value={userOptions.find(option => option.value === taskData.assignedUserId)}
              onChange={(selected) => handleInputChange("assignedUserId", selected?.value)}
              className="react-select-container"
              classNamePrefix="react-select"
              placeholder="Select assignee"
              components={{
                Option: UserOption,
                SingleValue: UserSingleValue,
              }}
            />
          </div>
          
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Author</label>
            <Select
              options={userOptions}
              value={userOptions.find(option => option.value === taskData.authorUserId)}
              onChange={(selected) => handleInputChange("authorUserId", selected?.value)}
              className="react-select-container"
              classNamePrefix="react-select"
              placeholder="Select author"
              components={{
                Option: UserOption,
                SingleValue: UserSingleValue,
              }}
            />
          </div>
        </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Tags</label>
            <Select
              isMulti
              options={tagOptions}
              value={taskData.tags?.split(',').map(tag => ({ value: tag, label: tag }))}
              onChange={(selected) => handleInputChange("tags", selected.map(s => s.value).join(','))}
              className="react-select-container"
              classNamePrefix="react-select"
              placeholder="Select tags"
            />
          </div>

          <div className="text-right">
            <button
              type="submit"
              disabled={!isFormValid()}
              className={cn(
                "rounded-lg bg-blue-600 px-6 py-2 text-white transition hover:bg-blue-500",
                !isFormValid() && "cursor-not-allowed opacity-50"
              )}
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalNewTask;