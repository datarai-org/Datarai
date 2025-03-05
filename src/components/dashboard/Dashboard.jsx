import React from "react";

import { useUser } from "../../../UserContext";

import MenuBar from "./MenuBar";
import DataBox from "./DataBox";
import ChatBox from "./ChatBox";
import EditProjectPopup from "./EditProjectPopup";
import CreateNewProjectPopup from "./CreateNewProjectPopup";
import ConfirmDeletePopup from "./ConfirmDeletePopup";

const Dashboard = () => {
  const [projects, setProjects] = React.useState([]);
  const [selectedProject, setSelectedProject] = React.useState("");
  const [editProject, setEditProject] = React.useState(false);
  const [createProject, setCreateProject] = React.useState(false);
  const [deleteProjectPopup, setDeleteProjectPopup] = React.useState(false);
  const [showData, setShowData] = React.useState(true);

  const {
    addNewProject,
    deleteProject,
    getProjects,
    updateProjectName,
    updateProjectCount,
    getLimitAndUsage,
    addMessage,
    getMessages,
  } = useUser();

  React.useEffect(() => {
    const fetchProjects = async () => {
      const projs = await getProjects();
      const projectArray = Object.values(projs || {}); // Convert object to array

      setProjects(projectArray);

      // If there's only 1 project, select it by default
      if (projectArray.length === 1) {
        setSelectedProject(projectArray[0].id);
      }
    };

    fetchProjects();
  }, [getProjects]);

  return (
    <div className="relative mx-2 md:mx-8 my-8 px-4 py-5 bg-section-base dark:bg-section-dark dark:text-text-dark rounded-lg flex flex-col justify-center content-center text-center shadow-lg">
      {/* <h1 className="text-3xl font-bold">Welcome to your dashboard</h1> */}

      <MenuBar
        className="w-full p-2 mb-4 min-h-16 self-center"
        selectedProject={selectedProject}
        setSelectedProject={setSelectedProject}
        projects={projects}
        setEditProject={setEditProject}
        setCreateProject={setCreateProject}
        setDeleteProject={setDeleteProjectPopup}
      />
      <div className="flex flex-col gap-4 h-dvh pb-3">
        <DataBox
          className={showData ? "min-h-3/7" : ""}
          selectedProject={selectedProject}
          showData={showData}
          setShowData={setShowData}
        />
        <ChatBox
          className="min-h-4/7"
          selectedProject={selectedProject}
          addMessage={addMessage}
          getMessages={getMessages}
        />
      </div>

      {editProject && (
        <EditProjectPopup
          className="absolute w-8/9 self-center"
          projectsList={projects}
          selectedProject={selectedProject}
          setEditProject={setEditProject}
          updateProjectName={updateProjectName}
        />
      )}

      {createProject && (
        <CreateNewProjectPopup
          className="absolute w-8/9 self-center"
          addNewProject={addNewProject}
          getLimitAndUsage={getLimitAndUsage}
          updateProjectCount={updateProjectCount}
          setCreateProject={setCreateProject}
          setSelectedProject={setSelectedProject}
        />
      )}

      {deleteProjectPopup && (
        <ConfirmDeletePopup
          className="absolute w-1/3 self-center"
          selectedProject={selectedProject}
          setSelectedProject={setSelectedProject}
          projects={projects}
          setProjects={setProjects}
          deleteProject={deleteProject}
          setDeleteProject={setDeleteProjectPopup}
          updateProjectCount={updateProjectCount}
        />
      )}
    </div>
  );
};

export default Dashboard;
