import React from "react";

import { IoSend } from "react-icons/io5";

const ChatBox = ({ className }) => {
  const [messages, setMessages] = React.useState([]);

  const addMessage = (message) => {
    setMessages([...messages, message]);
  };

  return (
    <div
      className={`p-4 bg-background/30 dark:bg-background-dark rounded-lg flex flex-col justify-start content-center shadow-lg ${className}`}
    >
      <div className="flex flex-col h-full">
        <h1 className="text-3xl font-bold">Chat Box</h1>
        <div className="flex flex-col gap-2 grow overflow-y-auto">
          {
            messages.length === 0 && (
              <div className="flex justify-center h-full items-center">
                <p className="text-black/50 dark:text-text-dark">No messages yet</p>
              </div>
            )
          }
          {messages.map((message, index) => (
            <div
              key={index}
              className="flex justify-end gap-2 border-b-1 border-gray-300 mr-4"
            >
              <div className="p-2 ">{message}</div>
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
                const message = document.querySelector("textarea").value;
                e.preventDefault();
                if (message.trim()) {
                  addMessage(message);
                  document.querySelector("textarea").value = "";
                }
              }
            }}
          ></textarea>
          <button
            className="self-end h-11 bg-primary text-white p-2 rounded-lg px-8"
            onClick={() => {
              const message = document.querySelector("textarea").value;
              if (message) {
                addMessage(message);
                document.querySelector("textarea").value = "";
              }
            }}
          >
            <IoSend />
          </button>
        </div>
        <p className="text-black/50 dark:text-text-dark text-sm text-left"><i className="">Enter</i> to send message. <i className="">Shift-Enter</i> for new line.</p>
      </div>
    </div>
  );
};

const DataBox = ({ className }) => {
  return (
    <div
      className={` px-4 py-8 bg-background/30 dark:bg-background-dark rounded-lg flex flex-col justify-center content-center text-center shadow-lg ${className}`}
    >
      <h1 className="text-3xl font-bold">Data View</h1>
    </div>
  );
};

const MenuBar = ({ className }) => {
  return (
    <div
      className={`p-4 bg-background/30 dark:bg-background-dark rounded-lg flex justify-start gap-2 shadow-lg ${className}`}
    >
      <h1 className="text-xl font-bold">Current Project:</h1>
      <select className="p- bg-background/20 dark:bg-section-dark/20 dark:text-text-dark outline-none border-b-2 border-primary">
        <option
          className="bg-background/20 dark:bg-section-dark/20 text-black/50 dark:text-text-dark"
          value="project1"
        >
          Project 1
        </option>
        <option
          className="bg-background/20 dark:bg-section-dark/20 text-black/50 dark:text-text-dark"
          value="project2"
        >
          Project 2
        </option>
        <option
          className="bg-background/20 dark:bg-section-dark/20 text-black/50 dark:text-text-dark"
          value="project3"
        >
          Project 3
        </option>
      </select>
    </div>
  );
};

const Dashboard = () => {
  return (
    <div className="mx-2 md:mx-8 my-8 px-4 py-5 bg-section-base dark:bg-section-dark dark:text-text-dark rounded-lg flex flex-col justify-center content-center text-center shadow-lg">
      {/* <h1 className="text-3xl font-bold">Welcome to your dashboard</h1> */}

      <MenuBar className="w-full p-2 mb-4 h-16 self-center" />
      <div className="flex flex-col lg:grid grid-cols-6 gap-4 grid-rows-4 h-dvh">
        <DataBox className="col-start-1 col-span-3 row-start-1 row-span-4 max-h-96 lg:max-h-dvh" />
        <ChatBox className="col-start-4 col-span-3 row-span-4 max-h-96 lg:max-h-lvh" />
      </div>
    </div>
  );
};

export default Dashboard;