import React from "react";

const DataBox = ({ className, selectedProject, tableData }) => {
  return (
    <div
      className={`p-4 bg-background/30 dark:bg-background-dark rounded-lg flex flex-col text-center shadow-lg ${className}`}
    >
      {selectedProject ? (
        <div className="flex flex-col gap-4 overflow-y-scroll ">
          {tableData.length > 0 ? (
            <div className="overflow-x-auto no-scrollbar">
              <table className="border-x-2 w-full ">
                <thead>
                  <tr className="bg-primary text-white">
                    {tableData[0]?.map((header, index) => (
                      <th
                        key={index}
                        className="border-t-2 border-black dark:border-white p-2"
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
                        <td key={cellIndex} className="border-y-2 p-2">
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
      ) : (
        <p className="text-black/50 dark:text-text-dark">
          Select or create a project to view data
        </p>
      )}
    </div>
  );
};

export default DataBox;
