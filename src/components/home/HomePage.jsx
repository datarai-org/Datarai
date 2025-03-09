import React from "react";
import axios from "axios";

import { FaUpload, FaMagnifyingGlass, FaDatabase } from "react-icons/fa6";
import { IoCloseOutline } from "react-icons/io5";
import { BsStars } from "react-icons/bs";

import { useDropzone } from "react-dropzone";

import { useUser } from "../../../UserContext";

const SampleDataPopup = ({
  className,
  handleStorageFile,
  setSampleDataWindow,
}) => {
  return (
    <div
      className={`p-4 border-2 border-primary bg-section-base dark:bg-section-dark rounded-lg flex flex-col justify-center content-center text-center shadow-lg ${className}`}
    >
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Sample Datasets</h1>
        <button
          className=" text-danger p-2 cursor-pointer"
          onClick={() => {
            setSampleDataWindow(false);
          }}
        >
          <IoCloseOutline className="text-2xl" />
        </button>
      </div>
      <div className="flex flex-col items-start mt-8 w-full">
        <button
          className="border-primary border-1 rounded-lg shadow p-2 cursor-pointer hover:bg-primary/30"
          onClick={handleStorageFile}
        >
          Customer Dataset (1000 rows)
        </button>
      </div>
    </div>
  );
};

const HomePage = ({ setSelectedWindow }) => {
  const [error, setError] = React.useState(null);
  const [sampleDataWindow, setSampleDataWindow] = React.useState(false);

  const { addNewProject, updateProjectCount, getLimitAndUsage, getSampleCSV } =
    useUser();

  const handleStorageFile = async () => {
    const url = await getSampleCSV();
    handleFileFromStorage(url);
  };

  const handleFileFromStorage = async (fileUrl) => {
    try {
      console.log("File url:", fileUrl);
      const response = await fetch(fileUrl, {
        mode: "no-cors",
      });
      console.log("Response:", response);
      const blob = await response.blob();
      const file = new File([blob], "customers-1000.csv", {
        type:
          response.headers.get("content-type") || "application/octet-stream",
      });
      onDrop([file]); // Call onDrop with the downloaded file
    } catch (error) {
      console.error("Error downloading/processing file:", error);
      setError("Error: Could not process file from storage.");
    }
  };

  const onDrop = React.useCallback(
    async (acceptedFiles) => {
      const limAndUse = await getLimitAndUsage("projects");
      console.log(limAndUse);

      if (limAndUse.usage < limAndUse.limit) {
        updateProjectCount(1);

        const newId = new Date().getTime();
        addNewProject({
          id: newId,
          projName: "New Project",
          creationDate: new Date().toISOString(),
          lastEdited: new Date().toISOString(),
          dataInfo: {
            name: acceptedFiles[0].name,
            type: acceptedFiles[0].type,
            size: acceptedFiles[0].size,
          },
          messages: [],
        });

        const formData = new FormData();
        formData.append("file", acceptedFiles[0]);
        formData.append("projectId", newId);

        try {
          console.log("File uploading...");
          const response = await axios.post(
            "https://api.datarai.com/upload",
            formData,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );
          console.log("File uploaded");
        } catch (error) {
          console.error("Upload failed", error);
        }

        const saveFileToLocalStorage = (file) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onloadend = () => {
            localStorage.setItem(newId + "file", reader.result);
            // console.log(reader.result)
          };
        };
        saveFileToLocalStorage(acceptedFiles[0]);
        setSelectedWindow("dashboard");
      } else {
        setError(
          "Error: Plan limit for projects reached, delete existing projects or upgrade your plan"
        );
      }
    },
    [addNewProject, getLimitAndUsage, setSelectedWindow, updateProjectCount]
  );

  const {
    acceptedFiles,
    fileRejections,
    getRootProps,
    getInputProps,
    isDragActive,
  } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: {
      "text/csv": [".csv"],
      "text/tab-separated-values": [".tsv"],
    },
  });

  return (
    <div className="mx-2 md:mx-8 my-8 px-4 py-8 bg-section-base dark:bg-section-dark text-black dark:text-text-dark rounded-lg flex flex-col justify-center content-center text-center shadow-lg">
      {sampleDataWindow && (
        <SampleDataPopup
          className="absolute w-1/3 self-center"
          handleStorageFile={handleStorageFile}
          setSampleDataWindow={setSampleDataWindow}
        />
      )}
      <h1 className="md:w-3/5 text-5xl font-bold self-center text-pretty">
        Intelligent AI Powered Tool for{" "}
        <span className="bg-gradient-to-br from-primary to-primary/30 text-transparent bg-clip-text">
          Data Analysis{" "}
        </span>
        and{" "}
        <span className="bg-gradient-to-br from-primary to-primary/30 text-transparent bg-clip-text">
          Visualization
        </span>
      </h1>
      <p className="text-lg self-center py-4 text-black/40 dark:text-text-dark/40">
        Talk to your data and get expert-level insights and graphs in seconds.
      </p>

      <div className="flex flex-col md:flex-row justify-center gap-8 mt-2">
        <div className="flex flex-col items-center justify-start md:w-5/12">
          <h3 className="text-xl font-bold mb-4">Upload data to start!</h3>
          <div
            {...getRootProps()}
            className="flex flex-col bg-info/30 w-full md:w-6/7 self-center p-12 rounded-lg border-2 border-info border-dashed cursor-pointer"
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
            Only .csv, .tsv file types are accepted (Max 1 file)
          </p>
          {acceptedFiles.length > 0 && (
            <p className="text-black/50 dark:text-text-dark/50 text-center text-sm mt-2">
              Uploaded - {acceptedFiles[0].name}
            </p>
          )}
          {fileRejections.length > 0 && (
            <p className="text-red-500 text-center text-sm mt-2">
              Error: {fileRejections[0].errors[0].message}
            </p>
          )}
          {error !== null && (
            <p className="text-red-500 text-center text-sm mt-2">{error}</p>
          )}
        </div>
        {/* <div className="flex flex-col content-center justify-start md:mt-16 md:w-5/12">
          <h3 className="text-xl font-bold mb-4">Or use sample data!</h3>
          <div
            className="flex flex-col bg-gray-600/30 w-full md:w-6/7 self-center p-12 rounded-lg border-2 border-gray-600 border-dashed cursor-pointer"
            onClick={() => setSampleDataWindow(true)}
          >
            <FaDatabase className="self-center text-4xl m-4" />
            <p>Sample data</p>
          </div>
        </div> */}
      </div>

      <div className="flex flex-col lg:flex-row justify-center gap-4 text-left mt-8">
        <div className="flex flex-col justify-between p-4 rounded-b-lg lg:w-3/12 shadow-lg">
          <div>
            <h2 className="text-xl">
              <b className="flex gap-2">
                <FaUpload className="self-center" />
                Upload
              </b>
            </h2>
            <p className="text-black/50 dark:text-text-dark/50 pt-4">
              Upload your data as a CSV file or spreadsheet to get started.
            </p>
          </div>
          <p className="text-black/50 dark:text-text-dark/50 text-sm pt-8">
            Learn how we use your{" "}
            <a
              className="text-info/50"
              href="https://datarai.com/privacy.html"
              target="none"
            >
              <u>data</u>
            </a>
          </p>
        </div>
        <div className="flex flex-col p-4 rounded-b-lg lg:w-5/12 shadow-lg">
          <h2 className="text-xl">
            <b className="flex gap-2">
              <FaMagnifyingGlass className="self-center" />
              Analyze
            </b>
          </h2>
          <p className="text-black/50 dark:text-text-dark/50 pt-4">
            Talk to your data, generate statistics and perform in-depth
            analysis.
          </p>
          <p className="text-black/50 dark:text-text-dark/50 pt-3">
            "How many users created an account this year?"
          </p>
          <p className="text-black/50 dark:text-text-dark/50 pt-1">
            "What is the average revenue generated by each user?"
          </p>
          <p className="text-black/50 dark:text-text-dark/50 pt-1">
            "How can I improve my budget to align with my goals based on this
            data?"
          </p>
        </div>
        <div className="flex flex-col p-4 rounded-b-lg lg:w-3/12 shadow-lg">
          <h2 className="text-xl">
            <b className="flex gap-2">
              <BsStars className="self-center" />
              Visualize
            </b>
          </h2>
          <p className="text-black/50 dark:text-text-dark/50 pt-4">
            Generate customizable Python code to visualize your data in seconds,
            or just get ready-made graphs that you can directly use.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
