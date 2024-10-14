"use client"

import { useState } from "react";
import ProjectHeader from "@/app/projects/ProjectHeader";
import BoardView from "../BoardView";
import List from "../ListView";
import Timeline from "../TimelineView"
import Table from "../TableView"
import ModalNewTask from "@/components/ModalNewTask";

type Props = {
    params : {id: string};
};

const Project = ({params}: Props) => {
    const {id} = params;
    const [activeTab, setActiveTab] = useState<string>("Board");
    const [isModalNewTaskOpen, setIsModalNewTaskOpen] = useState<boolean>(false);

    return (
        <div>
             <ModalNewTask
                isOpen={isModalNewTaskOpen}
                onClose={() => setIsModalNewTaskOpen(false)}
                id={id}
            />
            <ProjectHeader activeTab={activeTab} setActiveTab={setActiveTab} id={id}/>
            {activeTab === "Board" && (
                <BoardView id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} />
            )}
            {activeTab === "List" && (
                <List id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} />
            )}
            {activeTab === "Timeline" && (
                <Timeline id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} />
            )}
            {activeTab === "Table" && (
                <Table id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} />
            )}
        </div>
    )
};

export default Project;