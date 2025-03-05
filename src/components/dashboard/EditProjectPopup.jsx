import React from "react";
import { IoCloseOutline } from "react-icons/io5";

const EditProjectPopup = ({
  className,
  projectsList,
  selectedProject,
  setEditProject,
  updateProjectName,
}) => {
  // given the id in selectedProject, find the project object
  const project = projectsList.find((p) => p.id === selectedProject);

  const [newName, setNewName] = React.useState("");

  const onSave = React.useCallback(() => {
    const newName = document.getElementById("projName").value;
    if (newName.trim() === "") return;

    updateProjectName(selectedProject, newName).then(() => {
      setEditProject(false);
    });
  }, [selectedProject, updateProjectName, setEditProject]);

  return (
    <div
      className={`p-4 border-2 border-primary bg-section-base dark:bg-section-dark rounded-lg flex flex-col justify-center content-center text-center shadow-lg ${className}`}
    >
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">Edit Project Info</h1>
        <button
          className=" text-danger p-2 cursor-pointer"
          onClick={() => {
            setEditProject(false);
          }}
        >
          <IoCloseOutline className="text-2xl" />
        </button>
      </div>
      <div className="flex flex-col items-start">
        <p className="">
          Created on{" "}
          {new Date(Date.parse(project.creationDate)).toLocaleDateString(
            undefined,
            {
              year: "numeric",
              month: "long",
              day: "numeric",
            }
          )}{" "}
          at{" "}
          {new Date(Date.parse(project.creationDate)).toLocaleTimeString(
            undefined,
            {
              hour: "2-digit",
              minute: "2-digit",
            }
          )}
        </p>
        <p className="">
          Last edited on{" "}
          {new Date(Date.parse(project.lastEdited)).toLocaleDateString(
            undefined,
            {
              year: "numeric",
              month: "long",
              day: "numeric",
            }
          )}{" "}
          at{" "}
          {new Date(Date.parse(project.lastEdited)).toLocaleTimeString(
            undefined,
            {
              hour: "2-digit",
              minute: "2-digit",
            }
          )}
        </p>
        <div className="flex flex-col items-start mt-8">
          <label htmlFor="projName" className="text-lg mb-1">
            Change Project Name:{" "}
          </label>
          <input
            type="text"
            id="projName"
            placeholder={project.projName}
            onChange={(e) => setNewName(e.target.value)}
            className="bg-background/20 dark:bg-section-dark dark:text-text-dark outline-none border-2 border-primary rounded-lg p-2"
          />
          {newName.trim() === "" && (
            <p className="text-danger text-sm mt-1">Name cannot be empty</p>
          )}
          <button
            className="bg-success text-black py-2 px-4 rounded-md mt-8 cursor-pointer disabled:bg-success/30 disabled:cursor-default"
            disabled={newName.trim() === ""}
            onClick={onSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProjectPopup;
