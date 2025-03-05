import React from "react";
import { IoCreate, IoBuild, IoTrash } from "react-icons/io5";

const MenuBar = ({
  className,
  selectedProject,
  setSelectedProject,
  projects,
  setEditProject,
  setCreateProject,
  setDeleteProject,
}) => {
  return (
    <div
      className={`p-4 bg-background/30 dark:bg-background-dark rounded-lg flex flex-col md:flex-row justify-between gap-2 shadow-lg ${className}`}
    >
      <div className=" flex justify-start gap-2">
        <h1 className="text-xl font-bold">Current Project:</h1>
        <select
          className=" bg-background/20 dark:bg-section-dark dark:text-text-dark outline-none border-b-2 border-primary"
          value={selectedProject}
          onChange={(e) => {
            setSelectedProject(e.target.value);
          }}
        >
          {projects.length > 0 ? (
            projects.map((p) => (
              <option
                key={p.id}
                className="bg-background/20 dark:bg-section-dark/20 text-black/50 dark:text-text-dark"
                value={p.id}
              >
                {p.projName}
              </option>
            ))
          ) : (
            <option disabled>No projects available</option>
          )}
        </select>
      </div>

      {selectedProject ? (
        <div className="flex flex-col md:flex-row gap-2">
          <button
            className="md:ml-4 mt-4 md:mt-0 w-2/12 md:w-auto bg-danger hover:bg-danger/80 text-text-dark border-1 border-background/20 px-2 py-1 rounded-lg hover:cursor-pointer"
            onClick={() => {
              setDeleteProject((prev) => {
                return !prev;
              });
            }}
          >
            <IoTrash className="self-center justify-self-center" />
          </button>
          <button
            className="bg-primary hover:bg-primary/80 cursor-pointer text-white px-2 py-1 rounded-lg flex gap-1 place-content-center"
            onClick={() => {
              setEditProject((prev) => {
                return !prev;
              });
            }}
          >
            <IoCreate className="self-center" />{" "}
            <p className="">Edit Project Info</p>
          </button>
          <button
            className="bg-primary hover:bg-primary/80 cursor-pointer text-white px-2 py-1 rounded-lg flex gap-1 place-content-center"
            onClick={() => {
              setCreateProject((prev) => {
                return !prev;
              });
            }}
          >
            <IoBuild className="self-center" />{" "}
            <p className="">Add New Project</p>
          </button>
        </div>
      ) : (
        <button
          className="md:ml-4 mt-4 md:mt-0 bg-primary hover:bg-primary/80 cursor-pointer text-white px-2 py-1 rounded-lg flex gap-1 place-content-center"
          onClick={() => {
            setCreateProject((prev) => {
              return !prev;
            });
          }}
        >
          <IoBuild className="self-center" />{" "}
          <p className="">Add New Project</p>
        </button>
      )}
    </div>
  );
};

export default MenuBar;
