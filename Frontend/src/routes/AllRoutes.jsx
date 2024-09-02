// src/components/AllRoutes.js
import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../components/Login";
import Register from "../components/Register";
import Dashboard from "../components/Dashboard";
import DocumentManager from "../components/DocumentManager";
import FolderManager from "../components/FolderManager";
import Main from "../components/Main";
import Project from "../pages/Project";
import Task from "../components/Task";
// import DocumentEditor from "../components/DocumentEditor";

const AllRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/documents" element={<DocumentManager />} />{" "}
      {/* Route for Documents */}
      <Route path="/folders" element={<FolderManager />} />{" "}
      <Route path="/Project" element={<Project />} />
      {/* <Route path="/:projectId" element={<Task />} />
      <Route
        path="/projects"
        element={
          <div className="flex flex-col items-center w-full pt-10">
            <img src="./image/welcome.svg" className="w-5/12" alt="" />
            <h1 className="text-lg font-bold text-gray-600">
              Select or create new project
            </h1>
          </div>
        }
      /> */}
    </Routes>
  );
};

export default AllRoutes;
