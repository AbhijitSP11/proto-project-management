import React from 'react'
import { Priority, Status, useGetTasksQuery } from '@/state/api';
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { dataGridClassNames, dataGridSxStyles } from '@/utils/dataGridClassNames.utils';
import { getInitials } from '@/utils/getInitials.utils';
import { getColorForName } from '@/utils/getProfileColor.utils';
import { useTheme } from "next-themes";
import Spinner from "@/components/Spinner";
import { priorityColorMap, statusColorMap } from '@/constants/constants';

type Props = {
    id: string;
    setIsModalNewTaskOpen: (isOpen: boolean) => void;
};

const TableView: React.FC<Props> = ({ id, setIsModalNewTaskOpen }) => {
    const { theme } = useTheme();
    const isDarkMode = theme === "dark";
    
    const columns: GridColDef[] = [
        {
            field: "title",
            headerName: "Title",
            flex: 1,
            minWidth: 150,
            renderCell: (params) => (
                <div className="font-medium">{params.value}</div>
            )
        },
        {
            field: "description",
            headerName: "Description",
            flex: 1.5,
            minWidth: 200,
            renderCell: (params) => (
                <div className="truncate">{params.value}</div>
            )
        },
        {
            field: "status",
            headerName: "Status",
            width: 130,
            renderCell: (params) => (
                <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${statusColorMap[params.value as Status] || 'bg-gray-100 text-gray-800'}`}>
                    {params.value}
                </span>
            )
        },
        {
            field: "priority",
            headerName: "Priority",
            width: 100,
            renderCell: (params) => (
                <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${priorityColorMap[params.value as Priority] || 'bg-gray-100 text-gray-800'}`}>
                    {params.value}
                </span>
            )
        },
        {
            field: "tags",
            headerName: "Tags",
            width: 180,
            renderCell: (params) => (
                <div className="inline-flex gap-1 items-center">
                    {params.value?.split(',').map((tag: string, index: number) => (
                        <span key={index} className="flex items-center bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded dark:bg-blue-900 dark:text-blue-200">
                            {tag.trim()}
                        </span>
                    ))}
                </div>
            )
        },
        {
            field: "startDate",
            headerName: "Start Date",
            width: 130,
            renderCell: (params) => (
                <div className="text-gray-600 dark:text-gray-300">
                    {new Date(params.value).toLocaleDateString()}
                </div>
            )
        },
        {
            field: "dueDate",
            headerName: "Due Date",
            width: 130,
            renderCell: (params) => (
                <div className="text-gray-600 dark:text-gray-300">
                    {new Date(params.value).toLocaleDateString()}
                </div>
            )
        },
        {
            field: "author",
            headerName: "Author",
            width: 150,
            renderCell: (params) => (
                <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${getColorForName(params.value.username)}`}>
                        {getInitials(params.value.username)}
                    </div>
                    <span>{params.value.username || "Unknown"}</span>
                </div>
            )
        },
        {
            field: "assignee",
            headerName: "Assignee",
            width: 150,
            renderCell: (params) => (
                <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${getColorForName(params.value.username)}`}>
                        {getInitials(params.value.username)}
                    </div>
                    <span>{params.value.username || "Unassigned"}</span>
                </div>
            )
        }
    ];

    const {
        data: tasks,
        isLoading,
        error
    } = useGetTasksQuery({ projectId: Number(id) });

    if (isLoading) return <div className="flex justify-center items-center h-[540px]"> <Spinner/> </div>;
    if (error) return <div className="flex justify-center items-center h-[540px] text-red-500">An error occurred while fetching tasks</div>;

    const customDataGridStyles = {
        ...dataGridSxStyles(isDarkMode),
        '& .MuiDataGrid-cell': {
            borderBottom: isDarkMode ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid rgba(0, 0, 0, 0.12)',
        },
        '& .MuiDataGrid-row:hover': {
            backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)',
        }
    };

    return (
        <div className="h-[540px] w-full px-4 pb-8 xl:px-6">
            <DataGrid
                rows={tasks || []}
                columns={columns}
                className={`${dataGridClassNames} ${isDarkMode ? 'dark' : ''}`}
                sx={customDataGridStyles}
                disableRowSelectionOnClick
                pageSizeOptions={[10, 25, 50]}
                initialState={{
                    pagination: { paginationModel: { pageSize: 10 } },
                }}
            />
        </div>
    );
};

export default TableView;