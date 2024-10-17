"use client"

import { useAppSelector } from '@/app/redux';
import { useGetProjectsQuery } from '@/state/api';
import React, { useMemo, useState } from 'react'
import {DisplayOption, Gantt, ViewMode} from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import Select from 'react-select';
import Header from '@/components/Header';
import { useTheme } from 'next-themes';
import Spinner from "@/components/Spinner";

interface ViewModeOption {
    value: ViewMode;
    label: string;
};

type TaskTypeItems = "task" | "milestone" | "project";

const Timeline = () => {
    const { theme } = useTheme();
    const isDarkMode = theme === "dark";
    const {data: projects, isLoading, isError } = useGetProjectsQuery();
    
    const [displayOptions, setDisplayOptions] = useState<DisplayOption>({
        viewMode: ViewMode.Month,
        locale: "en-US"
    });

    const ganttTasks = useMemo(()=> {
        return (
            projects?.map((project)=> ({
                start: new Date(project.startDate as string),
                end: new Date(project.endDate as string),
                name: project.name, 
                id: `Project-${project.id}`,
                type: "project" as TaskTypeItems, 
                progress: 50,
            })) || []
        );
    }, [projects]);

    const handleViewModeChange = (selectedOption: ViewModeOption | null) => {
        if (selectedOption) {
          setDisplayOptions(prev => ({
            ...prev,
            viewMode: selectedOption.value
          }));
        }
    };
    
    if(isLoading) return <div> <Spinner/> </div>
    if(isError || !projects) return <div>An error occured while fetching tasks</div>

    const options: ViewModeOption[] = [
        { value: ViewMode.Day, label: 'Day' },
        { value: ViewMode.Week, label: 'Week' },
        { value: ViewMode.Month, label: 'Month' },
      ]

    return (
    <div className='w-full md:w-[calc(100%-16rem)] p-8'>
        <header className='mb-4 flex items-center justify-between'>
          <Header name="Projects Timeline"/>
            <div className='relative inline-block w-64'>
                <Select<ViewModeOption>
                options={options}
                value={options.find(option => option.value === displayOptions.viewMode)}
                onChange={handleViewModeChange}
                className="react-select-container"
                classNamePrefix="react-select"
                />
            </div>
        </header>
        <div className='overflow-hidden rounded-md bg-white shadow dark:bg-dark-secondary dark:text-white'>
            <div className='timeline'>
                <Gantt
                    tasks={ganttTasks}
                    {...displayOptions}
                    columnWidth={displayOptions.viewMode === ViewMode.Month ? 150 : 100}
                    listCellWidth="100px"
                    projectBackgroundColor={isDarkMode ? "#101214" : "#1F2937"}
                    projectProgressColor={isDarkMode ? "#1F2937" : "#aeb8c2"}
                    projectProgressSelectedColor={isDarkMode ? "#000" : "#9ba1a6"}
                />
            </div>
        </div>
    </div>
  )
}

export default Timeline