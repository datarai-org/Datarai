import React from "react";
import axios from "axios";

import { IoCloseOutline } from "react-icons/io5";
import { FaUpload } from "react-icons/fa6";

import { useDropzone } from "react-dropzone";
import LoadingAnim from "../ui/LoadingAnim";

const CreateNewProjectPopup = ({
  className,
  addNewProject,
  getLimitAndUsage,
  updateProjectCount,
  setCreateProject,
  setSelectedProject,
  setFileUri,
}) => {
  const [projName, setProjName] = React.useState("");
  const [acceptedFiles, setAcceptedFiles] = React.useState([]);
  const [fileRejections, setFileRejections] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState({
    nameError: null,
    projectError: null,
  });

  const onCreate = React.useCallback(async () => {
    const limAndUse = await getLimitAndUsage("projects");

    if (limAndUse.usage < limAndUse.limit) {
      updateProjectCount(1);

      const newId = new Date().getTime();

      const formData = new FormData();
      formData.append("file", acceptedFiles[0]);
      formData.append("projectId", newId);

      try {
        console.log("File uploading...");
        setIsLoading(true);
        const response = await axios.post(
          "https://api.datarai.com/upload",
          // "http://localhost:10000/upload",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        console.log(response.data);
        await addNewProject({
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
          fileUri: response.data.fileUri,
          downloadUri: response.data.downloadUri,
        });
        console.log("File uploaded");
        setIsLoading(false);
      } catch (error) {
        console.error("Upload failed", error);
      }

      const saveFileToLocalStorage = (file, callback) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
          localStorage.setItem(newId + "file", reader.result);
          // console.log(reader.result);
          callback(); // ✅ Only set selected project after the file is saved
        };
      };

      saveFileToLocalStorage(acceptedFiles[0], () => {
        setSelectedProject(newId);
      });

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
          {isLoading ? (
            <LoadingAnim/>
          ) : isDragActive ? (
            <p>Drop file here ...</p>
          ) : (
            <p>Click or drag and drop</p>
          )}
        </div>
        <p className="text-black/50 dark:text-text-dark/50 text-center text-sm mt-2">
          Only .csv, .tsv file types are accepted (Max 1 file)
        </p>
        {fileRejections.length > 0 && (
          <p className="text-red-500 text-left w-4/7 text-sm mt-2">
            Error: {fileRejections[0].errors[0].message}
          </p>
        )}
        {acceptedFiles.length > 0 && (
          <p className="text-black/50 dark:text-text-dark/50 text-center text-sm mt-2">
            {isLoading ? "Uploading" : "Uploaded"} - {acceptedFiles[0].name}
          </p>
        )}

        <button
          className="bg-success hover:bg-success/80 disabled:bg-success/30 text-black py-2 px-4 rounded-md mt-8 cursor-pointer"
          onClick={onCreate}
          disabled={projName.trim() === "" || fileRejections.length > 0}
        >
          Create
        </button>
        {error.projectError != null && (
          <p className="text-danger mt-1 text-left w-4/7">
            Error: {error.projectError}
          </p>
        )}
      </div>
    </div>
  );
};

export default CreateNewProjectPopup;
