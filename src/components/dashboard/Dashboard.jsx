import React from "react";
import { useUser } from "../../../UserContext";
import Papa from "papaparse";

import MenuBar from "./MenuBar";
import DataBox from "./DataBox";
import ChatBox from "./ChatBox";
import EditProjectPopup from "./EditProjectPopup";
import CreateNewProjectPopup from "./CreateNewProjectPopup";
import ConfirmDeletePopup from "./ConfirmDeletePopup";

const Dashboard = () => {
  const [projects, setProjects] = React.useState([]);
  const [selectedProject, setSelectedProject] = React.useState("");
  const [tableData, setTableData] = React.useState([]);
  const [editProject, setEditProject] = React.useState(false);
  const [createProject, setCreateProject] = React.useState(false);
  const [deleteProjectPopup, setDeleteProjectPopup] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("chat"); // "chat" or "data"

  const {
    addNewProject,
    deleteProject,
    getProjects,
    updateProjectName,
    updateProjectCount,
    getLimitAndUsage,
    addMessage,
    getMessages,
    setFileUri,
    getFileUri,
    getDownloadUri,
  } = useUser();

  React.useEffect(() => {
    const fetchProjects = async () => {
      const projs = await getProjects();
      const projectArray = Object.values(projs || {});
      setProjects(projectArray);
      if (projectArray.length === 1) {
        setSelectedProject(projectArray[0].id);
      }
    };
    fetchProjects();
  }, [getProjects]);

  React.useEffect(() => {
    if (!selectedProject) {
      setTableData([]); // Clear table when no project is selected
      return;
    }

    const storedFile = localStorage.getItem(selectedProject + "file");
    if (!storedFile) {
      setTableData([]); // Reset table if no file exists for project
      return;
    }

    const getFileFromLocalStorage = (base64String) => {
      try {
        if (!base64String.startsWith("data:")) return null;
        const base64Data = base64String.split(",")[1];
        if (!base64Data) return null;

        // Convert Base64 to binary
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Uint8Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }

        // Convert to Blob
        const fileBlob = new Blob([byteNumbers], { type: "text/csv" });
        return new File([fileBlob], "data.csv", { type: "text/csv" });
      } catch (error) {
        console.error("Error decoding file:", error);
        return null;
      }
    };

    const currentFile = getFileFromLocalStorage(storedFile);
    if (currentFile) {
      Papa.parse(currentFile, {
        complete: (result) => {
          setTableData(result.data);
        },
        header: false,
      });
    }
  }, [selectedProject]);

  return (
    <div className="relative m-2 my-4 px-2 py-2.5 bg-section-base dark:bg-section-dark dark:text-text-dark rounded-lg flex flex-col justify-center content-center text-center shadow-lg h-screen">
      <MenuBar
        className="w-full p-2 mb-2 h-1/10 self-center"
        selectedProject={selectedProject}
        setSelectedProject={setSelectedProject}
        projects={projects}
        setEditProject={setEditProject}
        setCreateProject={setCreateProject}
        setDeleteProject={setDeleteProjectPopup}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <div className="flex flex-col h-9/10">
        {activeTab === "chat" ? (
          <ChatBox
            className="h-full"
            selectedProject={selectedProject}
            addMessage={addMessage}
            getMessages={getMessages}
            getFileUri={getFileUri}
            getLimitAndUsage={getLimitAndUsage}
            getDownloadUri={getDownloadUri}
          />
        ) : (
          <DataBox
            className="h-full"
            selectedProject={selectedProject}
            tableData={tableData}
          />
        )}
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
          setFileUri={setFileUri}
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
