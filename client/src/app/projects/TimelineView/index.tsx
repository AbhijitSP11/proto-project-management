import { useAppSelector } from '@/app/redux';
import { useGetTasksQuery } from '@/state/api';
import React, { useMemo, useState } from 'react'
import {DisplayOption, Gantt, ViewMode} from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import Select from 'react-select';
import { useTheme } from 'next-themes';
import Spinner from "@/components/Spinner";

type Props = {
    id: string;
    setIsModalNewTaskOpen: (isOpen: boolean) => void;
};

interface ViewModeOption {
    value: ViewMode;
    label: string;
};

type TaskTypeItems = "task" | "milestone" | "project";

const Timeline = ({id, setIsModalNewTaskOpen}: Props) => {
    const { theme } = useTheme();
    const isDarkMode = theme === "dark";
    const {
        data: tasks, 
        isLoading, 
        error
    } = useGetTasksQuery({projectId: Number(id)});
    const [displayOptions, setDisplayOptions] = useState<DisplayOption>({
        viewMode: ViewMode.Month,
        locale: "en-US"
    });

    const ganttTasks = useMemo(()=> {
        return (
            tasks?.map((task)=> ({
                start: new Date(task.startDate as string),
                end: new Date(task.dueDate as string),
                name: task.title, 
                id: `Tasl-${task.id}`,
                type: "task" as TaskTypeItems, 
                progress: task.points ? (task.points  / 10) * 100 : 0,
            })) || []
        );
    }, [tasks]);

    const handleViewModeChange = (selectedOption: ViewModeOption | null) => {
        if (selectedOption) {
          setDisplayOptions(prev => ({
            ...prev,
            viewMode: selectedOption.value
          }));
        }
    };
    
    if(isLoading) return <div> <Spinner/> </div>
    if(error) return <div>An error occured while fetching tasks</div>

    const options: ViewModeOption[] = [
        { value: ViewMode.Day, label: 'Day' },
        { value: ViewMode.Week, label: 'Week' },
        { value: ViewMode.Month, label: 'Month' },
      ]

    return (
    <div className='px-4 xl:px-6'>
        <div className='flex flex-wrap items-center justify-between gap-2 py-5'>
            <h1 className='me-2 text-lg font-bold dark:text-white'>
                Project Tasks Timeline
            </h1>
            <div className='relative inline-block w-64'>
                <Select<ViewModeOption>
                options={options}
                value={options.find(option => option.value === displayOptions.viewMode)}
                onChange={handleViewModeChange}
                className="react-select-container"
                classNamePrefix="react-select"
                />
            </div>
        </div>
        <div className='overflow-hidden rounded-md bg-white shadow dark:bg-dark-secondary dark:text-white'>
            <div className='timeline'>
                <Gantt
                    tasks={ganttTasks}
                    {...displayOptions}
                    columnWidth={displayOptions.viewMode === ViewMode.Month ? 150 : 100}
                    listCellWidth="100px"
                    barBackgroundColor={isDarkMode ? "#101214" : "#aeb8c2"}
                    barBackgroundSelectedColor={isDarkMode ? "#000" : "#9ba1e6"}
                />
            </div>
            <div className='px-4 pb-5 pt-1'>
                <button 
                    onClick={()=> setIsModalNewTaskOpen} 
                    className='flex items-center rounded bg-blue-primary px-3 py-2 text-white hover:bg-blue-600'
                >
                    Add New Task
                </button>
            </div>
        </div>
    </div>
  )
}

export default Timeline