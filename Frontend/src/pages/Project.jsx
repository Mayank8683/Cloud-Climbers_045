import React from "react";
import AppLayout from "../components/AppLayout";
import { Toaster } from "react-hot-toast";
import Task from "../components/Task";

const Project = () => {
  return (
    <>
      <AppLayout>
        <Toaster position="top-right" gutter={8} />
        <Task />
        <div className="flex flex-col items-center w-full pt-10">
          <img src="./image/welcome.svg" className="w-5/12" alt="" />
          <h1 className="text-lg font-bold text-gray-600">
            Select or create new project
          </h1>
        </div>
      </AppLayout>
    </>
  );
};

export default Project;
