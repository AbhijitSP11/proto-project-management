import React from 'react'
import Header from '@/components/Header';
import { Task, useGetTasksQuery } from '@/state/api';
import TaskTable from '@/components/TaskTable';
import Spinner from "@/components/Spinner";

type Props = {
    id: string;
    setIsModalNewTaskOpen: (isOpen: boolean) => void;
}

const ListView = ({id, setIsModalNewTaskOpen}: Props) => {
    const {
        data: tasks, 
        isLoading, 
        error
    } = useGetTasksQuery({projectId: Number(id)});
    
    if(isLoading) return <div><Spinner/></div>
    if(error) return <div>An error occured while fetching tasks</div>
    
    return (
    <div className='px-4 pb-8 xl:px-6'>
          <div className="pt-5">
        <Header
          name="List"
          buttonComponent={
            <button
              className="flex items-center rounded bg-blue-primary px-3 py-2 text-white hover:bg-blue-600"
              onClick={() => setIsModalNewTaskOpen(true)}
            >
              Add Task
            </button>
          }
          isSmallText
        />
      </div>
        {tasks && tasks.length > 0 && (
            <div className='flex flex-col gap-1'>
                <TaskTable tasks={tasks}/>
            </div>    
        )}
    </div>
  )
}

export default ListView