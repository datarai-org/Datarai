import React from "react";

import { IoSend } from "react-icons/io5";

const ChatBox = ({ className }) => {
  const [messages, setMessages] = React.useState([]);

  const addMessage = (message) => {
    setMessages([...messages, message]);
  };

  return (
    <div
      className={`mx-2 md:mx-4 mt-8 px-4 py-8 bg-background/30 rounded-lg flex flex-col justify-start content-center shadow-lg ${className}`}
    >
      <h1 className="text-3xl font-bold">Chat Box</h1>
      <div className="flex flex-col h-full">
        <div className="flex flex-col gap-2 grow overflow-y-auto">
          {messages.map((message, index) => (
            <div
              key={index}
              className="flex justify-end gap-2 border-b-1 border-gray-300"
            >
              <div className="p-2 ">{message}</div>
            </div>
          ))}
        </div>
        <div className="flex gap-4 mt-4">
          <textarea
            placeholder="Type a message"
            className="flex-grow p-2 bg-background/20 rounded-lg outline-none border-2 border-primary resize-none h-auto max-h-32 overflow-y-auto"
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
            onSubmit={() => {
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
        <p className="text-black/50 text-sm text-left mb-2"><i className="">Enter</i> to send message. <i className="">Shift-Enter</i> for new line.</p>
      </div>
    </div>
  );
};

const DataBox = ({ className }) => {
  return (
    <div
      className={`mx-2 md:mx-4 mt-8 px-4 py-8 bg-background/30 rounded-lg flex flex-col justify-center content-center text-center shadow-lg ${className}`}
    >
      <h1 className="text-3xl font-bold">Data View</h1>
    </div>
  );
};

const Dashboard = () => {
  return (
    <div className="mx-2 md:mx-8 my-8 px-4 py-8 bg-section-base rounded-lg flex flex-col justify-center content-center text-center shadow-lg">
      <h1 className="text-3xl font-bold">Welcome to your dashboard</h1>

      <div className="flex flex-col lg:grid grid-cols-6 gap-4 grid-rows-4">
        <DataBox className="col-start-1 col-span-3 row-start-1 row-span-4 h-screen" />
        <ChatBox className="col-start-4 col-span-3 row-span-4 h-screen" />
      </div>
    </div>
  );
};

export default Dashboard;
