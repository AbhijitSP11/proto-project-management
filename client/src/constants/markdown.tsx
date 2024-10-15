import { BarChart2, CheckSquare, Link, PlusCircle } from "lucide-react";
import { Components } from "react-markdown";

export const customComponents: Components = {
    h3: ({ node, ...props }) =>  (
      <h3 className="font-bold text-[1.125rem] my-3 text-blue-500 flex gap-2 items-center" {...props} >{props.children} </h3>
    ),
    h2: ({ node, ...props }) => (
      <h2 className="font-bold text-[1.18rem] my-4" {...props} />
    ),
    h4: ({ node, ...props }) => (
      <h2 className="font-bold text-[0.8rem] my-4" {...props} />
    ),
    ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mt-5 px-4" {...props} />,
    li: ({ node, ...props }) => <li className="mb-2 px-2" {...props} />,
    p: ({ node, ...props }) => <p className='mt-4 px-2' {...props} />,
    table: ({ node, ...props }) => <table className="table-auto w-full border-collapse border font-normal border-gray-200 my-4" {...props} />,
    thead: ({ node, ...props }) => <thead className="bg-gray-100 font-normal" {...props} />,
    tbody: ({ node, ...props }) => <tbody {...props} />,
    tr: ({ node, ...props }) => <tr className="border-b border-gray-200 even:bg-gray-50 odd:bg-white text-gray-600" {...props} />,
    th: ({ node, ...props }) => <th className="px-4 py-2 border-b border-gray-200 text-left text-gray-700 font-semibold" {...props} />,
    td: ({ node, ...props }) => <td className="px-4 py-2 border-b border-gray-200" {...props} />,
    a: ({ node, children, ...props }) => (
      <a href={props.href} className='text-blue-400 flex items-center gap-2 hover:underline text-sm px-4' target="_blank" rel="noopener noreferrer">
        {children} <Link className='' size={14} />
      </a>
    ),
  };


export const menuOptions = [
    { id: 'tasks', label: 'Tasks', icon: CheckSquare, subOptions: [
      'Provide me a list of taks associated with the Apollo Project',
      'Provide me the tasks assigned to the user with userId 2 in a tabular format',
      'What are the tasks completed and pending in the Apollo Project?',
      'Are there any comments in the tasks'
    ]},
    { id: 'create', label: 'Create', icon: PlusCircle, subOptions: [
      'Create Task',
      'Create Project Board'
    ]},
    { id: 'summarize', label: 'Summarize', icon: BarChart2, subOptions: [
      'Provide me a brief summary for the timeline of a Apollo Project',
      'What is the progress of tasks in the Apollo Project?'
    ]}
  ];