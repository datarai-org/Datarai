import React from "react";

import { IoSend } from "react-icons/io5";

import { useUser } from "../../../UserContext";

import Papa from "papaparse";

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
                  <th key={index} className="border border-section-dark dark:border-section-base p-2">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.slice(1).map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="border border-section-dark dark:border-section-base p-2">
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
  getProjects,
  selectedProject,
  setSelectedProject,
}) => {
  const [projects, setProjects] = React.useState([]);

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
    <div
      className={`p-4 bg-background/30 dark:bg-background-dark rounded-lg flex justify-start gap-2 shadow-lg ${className}`}
    >
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
  );
};

const Dashboard = () => {
  const [selectedProject, setSelectedProject] = React.useState("");

  const { addNewProject, getProjects, updateProjectCount, getLimitAndUsage, addMessage, getMessages } =
    useUser();

  return (
    <div className="mx-2 md:mx-8 my-8 px-4 py-5 bg-section-base dark:bg-section-dark dark:text-text-dark rounded-lg flex flex-col justify-center content-center text-center shadow-lg">
      {/* <h1 className="text-3xl font-bold">Welcome to your dashboard</h1> */}

      <MenuBar
        className="w-full p-2 mb-4 h-16 self-center"
        getProjects={getProjects}
        selectedProject={selectedProject}
        setSelectedProject={setSelectedProject}
      />
      <div className="flex flex-col gap-4 h-dvh pb-3">
        <DataBox
          className="min-h-3/7"
          selectedProject={selectedProject}
        />
        <ChatBox
          className="min-h-4/7"
          selectedProject={selectedProject}
          addMessage={addMessage}
          getMessages={getMessages}
        />
      </div>
    </div>
  );
};

export default Dashboard;
