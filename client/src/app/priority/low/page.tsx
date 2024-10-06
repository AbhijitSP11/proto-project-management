import React from "react";
import { Priority } from "@/state/api";
import ReusablePriorityPage from "../ReusablePriorityPage";

const Low = () => {
  return <ReusablePriorityPage priority={Priority.Low} />;
};

export default Low;