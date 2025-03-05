import React from "react";
import Papa from "papaparse";

const DataBox = ({ className, selectedProject, showData, setShowData }) => {
  const [tableData, setTableData] = React.useState([]);

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
  }, [selectedProject, showData]); // ✅ Add `showData` as a dependency

  return (
    <div
      className={`p-4 bg-background/30 dark:bg-background-dark rounded-lg flex flex-col text-center shadow-lg ${className}`}
    >
      {selectedProject ? (
        <>
          {showData ? (
            <>
              <button
                className="bg-primary p-2 rounded-lg text-text-dark hover:bg-primary/80 cursor-pointer mb-4"
                onClick={() => setShowData(false)}
              >
                Hide Data
              </button>
              <div className="flex flex-col gap-4 overflow-y-scroll ">
                {tableData.length > 0 ? (
                  <div className="overflow-x-auto no-scrollbar">
                    <table className="border-x w-full ">
                      <thead>
                        <tr className="bg-primary text-white">
                          {tableData[0]?.map((header, index) => (
                            <th key={index} className="border-t p-2">
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {tableData.slice(1).map((row, rowIndex) => (
                          <tr key={rowIndex}>
                            {row.map((cell, cellIndex) => (
                              <td key={cellIndex} className="border-y p-2">
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500">No data available.</p>
                )}
              </div>
            </>
          ) : (
            <button
              className="bg-primary p-2 rounded-lg text-text-dark hover:bg-primary/80 cursor-pointer"
              onClick={() => setShowData(true)}
            >
              Show Data
            </button>
          )}
        </>
      ) : (
        <p className="text-black/50 dark:text-text-dark">
          Select or create a project to view data
        </p>
      )}
    </div>
  );
};

export default DataBox;
