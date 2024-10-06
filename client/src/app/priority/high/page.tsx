import React from "react";
import { Priority } from "@/state/api";
import ReusablePriorityPage from "../ReusablePriorityPage";

const High = () => {
  return <ReusablePriorityPage priority={Priority.High} />;
};

export default High;