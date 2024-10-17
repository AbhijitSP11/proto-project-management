import Header from '@/components/Header';
import { Clock, Filter, Grid3x3, List, PlusSquare, Share2, Table } from 'lucide-react';
import React, { useState } from 'react'
import ModalNewProject from "./ModalNewProject"
import { useGetProjectByIdQuery } from '@/state/api';

type Props = {
  activeTab: string;
  setActiveTab: (tabName: string) => void;
  id?:string;
};

const ProjectHeader = ({activeTab, setActiveTab, id}: Props) => {
  const [isModalNewProjectOpen, setIsModalNewProjectOpen] = useState<boolean>(false);

  const {data: project} = useGetProjectByIdQuery({id: Number(id)});

  return (
    <div className="px-4 xl:px-6">
       <ModalNewProject
        isOpen={isModalNewProjectOpen}
        onClose={() => setIsModalNewProjectOpen(false)}
      />
      <div className="flex items-center gap-2 pb-6 pt-6 lg:pb-4 lg:pt-8">
        <span className="flex rounded-lg px-6 py-2 text-2xl mb-5 items-center justify-center bg-blue-500 text-white font-bold">
          {project && project[0].name[0]}
        </span>
        <Header 
          name={`${project && project[0].name} Project Dashboard`}
          buttonComponent={
            <button
              onClick={()=> setIsModalNewProjectOpen(true)} 
              className='flex items-center rounded-md bg-blue-primary px-3 py-2 text-white hover:bg-blue-600'>
                <PlusSquare className='mr-2 h-5 w-5'/> New Boards
            </button>
          }
        />
      </div>
      <div className='flex flex-wrap-reverse gap-2 border-y border-gray-200 pb-[8px] pt-2 dark:border-stroke-dark md:items-center'>
        <div className='flex flex-1 items-center gap-2 md:gap-4'>
          <TabButton 
            name='Board' 
            icon={<Grid3x3 className='h-5 w-5'/>}
            setActiveTab={setActiveTab}
            activeTab={activeTab}
            />
            <TabButton 
            name='List' 
            icon={<List className='h-5 w-5'/>}
            setActiveTab={setActiveTab}
            activeTab={activeTab}
            />
            <TabButton 
            name='Timeline' 
            icon={<Clock className='h-5 w-5'/>}
            setActiveTab={setActiveTab}
            activeTab={activeTab}
            />
            <TabButton 
            name='Table' 
            icon={<Table className='h-5 w-5'/>}
            setActiveTab={setActiveTab}
            activeTab={activeTab}
            />
        </div>
      </div>
    </div>
  )
}

type TabButtonProps = {
  name: string;
  icon: React.ReactNode;
  setActiveTab: (tabName: string) => void;
  activeTab: string;
}

const TabButton = ({ name, icon, setActiveTab, activeTab }: TabButtonProps) => {
  const isActive = activeTab === name;

  return (
    <button
      className={`relative flex items-center gap-2 px-1 py-2 text-gray-500 
        after:absolute after:-bottom-[9px] after:left-0 after:h-[2px] after:w-full 
        hover:text-blue-600 dark:text-neutral-500 dark:hover:text-white sm:px-2 lg:px-4 ${
        isActive ? "text-blue-600 after:bg-blue-600 dark:text-white" : ""
      }`}
      onClick={() => setActiveTab(name)}
    >
      {icon}
      {name}
    </button>
  );
};

export default ProjectHeader