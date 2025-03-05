import React from "react";
import { IoCloseOutline } from "react-icons/io5";

const ConfirmDeletePopup = ({
  className,
  selectedProject,
  projects,
  setProjects,
  setSelectedProject,
  deleteProject,
  setDeleteProject,
  updateProjectCount,
}) => {
  return (
    <div
      className={`p-4 border-2 border-primary bg-section-base dark:bg-section-dark rounded-lg flex flex-col justify-center content-center text-center shadow-lg ${className}`}
    >
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">Confirm Deletion</h1>
        <button
          className=" text-danger p-2 cursor-pointer"
          onClick={() => {
            setDeleteProject(false);
          }}
        >
          <IoCloseOutline className="text-2xl" />
        </button>
      </div>
      <div className="flex w-full gap-2 mt-8">
        <button
          className="p-2 bg-info rounded-lg w-1/2 cursor-pointer"
          onClick={() => {
            setDeleteProject(false);
          }}
        >
          Nevermind
        </button>
        <button
          className="p-2 bg-danger rounded-lg w-1/2 cursor-pointer disabled:bg-danger/30 disabled:cursor-default"
          onClick={async () => {
            localStorage.removeItem(selectedProject + "file");
            await deleteProject(selectedProject);
            await updateProjectCount(-1);

            // ✅ Use functional update to ensure correct project filtering
            setProjects((prevProjects) => {
              const updatedProjects = prevProjects.filter(
                (p) => p.id !== selectedProject
              );

              // ✅ Update selectedProject safely
              setSelectedProject(
                updatedProjects.length > 0 ? updatedProjects[0].id : ""
              );

              return updatedProjects;
            });

            setDeleteProject(false);
          }}
          disabled={selectedProject === ""}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ConfirmDeletePopup;
