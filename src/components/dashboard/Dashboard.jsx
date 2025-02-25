import React from "react";

import {
  IoSend,
  IoCreate,
  IoBuild,
  IoCloseOutline,
  IoTrash,
} from "react-icons/io5";
import { FaUpload } from "react-icons/fa6";

import { useUser } from "../../../UserContext";

import Papa from "papaparse";
import { useDropzone } from "react-dropzone";

const ChatBox = ({ className, selectedProject, addMessage, getMessages }) => {
  const [messages, setMessages] = React.useState([]);

  // Fetch messages whenever selectedProject changes
  React.useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedProject) return; // Ensure a project is selected
      const fetchedMessages = (await getMessages(selectedProject)) || [];
      console.log("Messages:", fetchedMessages);
      setMessages(fetchedMessages);
    };

    fetchMessages();
  }, [selectedProject, getMessages]); // ✅ Update when project changes

  return (
    <div
      className={`p-4 bg-background/30 dark:bg-background-dark rounded-lg flex flex-col justify-start content-center shadow-lg ${className}`}
    >
      <div className="flex flex-col h-full">
        <h1 className="text-3xl font-bold">Chat Box</h1>
        <div className="flex flex-col gap-2 grow overflow-y-auto">
          {messages.length === 0 && (
            <div className="flex justify-center h-full items-center">
              <p className="text-black/50 dark:text-text-dark">
                No messages yet
              </p>
            </div>
          )}
          {messages.map((message, index) => (
            <div
              key={index}
              className="flex justify-end gap-2 border-b-1 border-gray-300 mr-4"
            >
              <div className="p-2">{message.value}</div>
            </div>
          ))}
        </div>
        <div className="flex gap-4 mt-4">
          <textarea
            placeholder="Type a message"
            className="flex-grow p-2 bg-background/20 dark:bg-section-dark/20 dark:text-text-dark rounded-lg outline-none border-2 border-primary resize-none h-auto max-h-32 overflow-y-auto"
            rows={1}
            onInput={(e) => {
              const target = e.target;
              target.style.height = "auto"; // Reset height to recalculate
              target.style.height = `${Math.min(target.scrollHeight, 128)}px`; // Adjust, limit to ~5 lines
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                const message = e.target.value.trim();
                if (message) {
                  addMessage(selectedProject, message).then(() => {
                    setMessages((prev) => [
                      ...prev,
                      { value: message, timestamp: new Date().toISOString() },
                    ]);
                  });
                  e.target.value = "";
                }
              }
            }}
          ></textarea>
          <button
            className="self-end h-11 bg-primary text-white p-2 rounded-lg px-8"
            onClick={() => {
              const textarea = document.querySelector("textarea");
              const message = textarea.value.trim();
              if (message) {
                addMessage(selectedProject, message).then(() => {
                  setMessages((prev) => [
                    ...prev,
                    { value: message, timestamp: new Date().toISOString() },
                  ]);
                });
                textarea.value = "";
              }
            }}
          >
            <IoSend />
          </button>
        </div>
        <p className="text-black/50 dark:text-text-dark text-sm text-left">
          <i className="">Enter</i> to send message.{" "}
          <i className="">Shift-Enter</i> for new line.
        </p>
      </div>
    </div>
  );
};

const DataBox = ({ className, selectedProject }) => {
  const [tableData, setTableData] = React.useState([]);

  React.useEffect(() => {
    const storedFile = localStorage.getItem(selectedProject + "file");
    // console.log("Stored File:", storedFile);
    if (!storedFile) return;

    const getFileFromLocalStorage = (base64String) => {
      try {
        if (!base64String.startsWith("data:")) {
          console.error("Invalid Base64 format:", base64String);
          return null;
        }

        // Extract Base64 part after the comma
        const base64Data = base64String.split(",")[1];
        if (!base64Data) return null;

        // Convert Base64 to binary
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Uint8Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }

        // Convert to Blob
        const fileBlob = new Blob([byteNumbers], { type: "text/csv" }); // Adjust type if needed
        return new File([fileBlob], "data.csv", { type: "text/csv" }); // Convert to File
      } catch (error) {
        console.error("Error decoding file:", error);
        return null;
      }
    };

    const currentFile = getFileFromLocalStorage(storedFile);
    if (currentFile) {
      Papa.parse(currentFile, {
        complete: (result) => {
          // console.log("Parsed Data:", result.data);
          setTableData(result.data);
        },
        header: false,
      });
    }
  }, [selectedProject]); // Re-run when selectedProject changes

  return (
    <div
      className={`px-4 py-8 bg-background/30 dark:bg-background-dark rounded-lg flex flex-col justify-center content-center text-center shadow-lg overflow-auto ${className}`}
    >
      <div className="h-full">
        {tableData.length > 0 && (
          <table className="table-auto border-collapse border border-gray-400">
            <thead>
              <tr className="bg-primary text-white">
                {tableData[0].map((header, index) => (
                  <th
                    key={index}
                    className="border border-section-dark dark:border-section-base p-2"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.slice(1).map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      className="border border-section-dark dark:border-section-base p-2"
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

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

const ConfirmDeletePopup = ({
  className,
  selectedProject,
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
          className="p-2 bg-danger rounded-lg w-1/2 cursor-pointer"
          onClick={() => {
            deleteProject(selectedProject);
            setDeleteProject(false);
            updateProjectCount(-1);
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

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

const CreateNewProjectPopup = ({
  className,
  addNewProject,
  getLimitAndUsage,
  updateProjectCount,
  setCreateProject,
}) => {
  const [projName, setProjName] = React.useState("");
  const [acceptedFiles, setAcceptedFiles] = React.useState([]);
  const [fileRejections, setFileRejections] = React.useState([]);
  const [error, setError] = React.useState({
    nameError: null,
    projectError: null,
  });

  const onCreate = React.useCallback(async () => {
    const limAndUse = await getLimitAndUsage("projects");

    if (limAndUse.usage < limAndUse.limit) {
      updateProjectCount();

      const newId = new Date().getTime();
      addNewProject({
        id: newId,
        projName: projName,
        creationDate: new Date().toISOString(),
        lastEdited: new Date().toISOString(),
        dataInfo: {
          name: acceptedFiles[0].name,
          type: acceptedFiles[0].type,
          size: acceptedFiles[0].size,
        },
        messages: [],
      });

      const saveFileToLocalStorage = (file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
          localStorage.setItem(newId + "file", reader.result);
          console.log(reader.result);
        };
      };
      saveFileToLocalStorage(acceptedFiles[0]);
      setCreateProject(false);
    } else {
      setError({ ...error, projectError: "Project limit reached" });
    }
  }, [
    projName,
    acceptedFiles,
    addNewProject,
    getLimitAndUsage,
    updateProjectCount,
    setCreateProject,
    error,
  ]);

  const onDrop = React.useCallback((acceptedFiles, fileRejections) => {
    setAcceptedFiles(acceptedFiles);
    setFileRejections(fileRejections);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: {
      "text/csv": [".csv"],
      "text/tab-separated-values": [".tsv"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "application/vnd.ms-excel": [".xls"],
    },
  });

  return (
    <div
      className={`p-4 border-2 border-primary bg-section-base dark:bg-section-dark rounded-lg flex flex-col justify-center content-center text-center shadow-lg ${className}`}
    >
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">Create New Project</h1>
        <button
          className=" text-danger p-2 cursor-pointer"
          onClick={() => {
            setCreateProject(false);
          }}
        >
          <IoCloseOutline className="text-2xl" />
        </button>
      </div>
      <div className="flex flex-col items-start mt-8 w-full">
        <label htmlFor="projName" className="text-lg mb-1">
          Project Name:{" "}
        </label>
        <input
          type="text"
          id="projName"
          placeholder="Enter project name"
          onChange={(e) => setProjName(e.target.value)}
          className="bg-background/20 dark:bg-section-dark dark:text-text-dark outline-none border-2 border-primary rounded-lg p-2"
        />
        {error.nameError != null && (
          <p className="text-danger text-sm mt-1 text-left w-4/7">
            Error: {error.nameError}
          </p>
        )}

        <div
          {...getRootProps()}
          className="self-start mt-8 flex flex-col bg-info/30 w-full md:w-3/7 p-12 rounded-lg border-2 border-info border-dashed cursor-pointer"
        >
          <FaUpload className="self-center text-4xl m-4" />
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop file here ...</p>
          ) : (
            <p>Click or drag and drop</p>
          )}
        </div>
        <p className="text-black/50 dark:text-text-dark/50 text-center text-sm mt-2">
          Only .csv, .tsv, .xlsx, .xls file types are accepted (Max 1 file)
        </p>
        {fileRejections.length > 0 && (
          <p className="text-red-500 text-left w-4/7 text-sm mt-2">
            Error: {fileRejections[0].errors[0].message}
          </p>
        )}
        {acceptedFiles.length > 0 && (
          <p className="text-black/50 dark:text-text-dark/50 text-center text-sm mt-2">
            Uploaded - {acceptedFiles[0].name}
          </p>
        )}
        <button
          className="bg-success disabled:bg-success/30 text-black py-2 px-4 rounded-md mt-8"
          onClick={onCreate}
          disabled={
            projName.trim() === "" ||
            fileRejections.length > 0 ||
            error.projectError !== null
          }
        >
          Create
        </button>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [projects, setProjects] = React.useState([]);
  const [selectedProject, setSelectedProject] = React.useState("");
  const [editProject, setEditProject] = React.useState(false);
  const [createProject, setCreateProject] = React.useState(false);
  const [deleteProjectPopup, setDeleteProjectPopup] = React.useState(false);

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
        <DataBox className="min-h-3/7" selectedProject={selectedProject} />
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
        />
      )}

      {deleteProjectPopup && (
        <ConfirmDeletePopup
          className="absolute w-1/3 self-center"
          selectedProject={selectedProject}
          deleteProject={deleteProject}
          setDeleteProject={setDeleteProjectPopup}
          updateProjectCount={updateProjectCount}
        />
      )}
    </div>
  );
};

export default Dashboard;
