import React from "react";
import { Priority } from "@/state/api";
import ReusablePriorityPage from "../ReusablePriorityPage";

const Urgent = () => {
  return <ReusablePriorityPage priority={Priority.Backlog} />;
};

export default Urgent;