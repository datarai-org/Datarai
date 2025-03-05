import React from "react";
import axios from "axios";

import {
    IoSend,
} from "react-icons/io5";

const callGeminiAPI = async (prompt) => {
  try {
    const response = await axios.post("http://localhost:5000/gemini", {
      prompt,
    });

    console.log("AI Response:", response.data);
    return response.data.message;
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
    return "Error: Unable to connect to AI.";
  }
};

const ChatBox = ({ className, selectedProject, addMessage, getMessages }) => {
  const [messages, setMessages] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const messagesEndRef = React.useRef(null); // ✅ Ref to scroll to bottom
  const textareaRef = React.useRef(null); // ✅ Ref to refocus textarea

  // Fetch messages whenever selectedProject changes
  React.useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedProject) return;
      const fetchedMessages = (await getMessages(selectedProject)) || [];
      setMessages(fetchedMessages);
    };
    fetchMessages();
  }, [selectedProject, getMessages]);

  // Scroll to bottom when messages update
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!textareaRef.current) return;

    const message = textareaRef.current.value.trim();
    if (!message || isLoading) return;

    setMessages((prev) => [
      ...prev,
      { value: message, timestamp: new Date().toISOString(), sender: "user" },
    ]);

    textareaRef.current.value = "";
    textareaRef.current.focus(); // ✅ Refocus textarea after sending
    setIsLoading(true);

    await addMessage(selectedProject, message, "user");

    const aiResponse = await callGeminiAPI(message);
    const aiMessage = aiResponse || "I couldn't understand that.";

    setMessages((prev) => [
      ...prev,
      { value: aiMessage, timestamp: new Date().toISOString(), sender: "ai" },
    ]);

    await addMessage(selectedProject, aiMessage, "ai");

    setIsLoading(false);
  };

  return (
    <div
      className={`p-4 bg-background/30 dark:bg-background-dark rounded-lg flex flex-col justify-start content-center shadow-lg ${className}`}
    >
      <div className="flex flex-col h-full">
        <div className="flex flex-col gap-2 grow overflow-y-auto no-scrollbar">
          <h1 className="text-3xl font-bold mb-1">Chat Box</h1>
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
              className={`flex mb-2 ${
                message.sender === "user"
                  ? "justify-end"
                  : "justify-start max-w-11/12 md:max-w-4/7"
              } gap-2`}
            >
              {message.sender === "ai" && (
                <div className="relative">
                  <div className="absolute top-0 left-0 w-0 h-0 border-t-8 border-t-background dark:border-t-section-dark border-l-8 border-l-transparent"></div>
                </div>
              )}
              <div
                className={`p-2 px-4 shadow-md text-left ${
                  message.sender === "user"
                    ? "bg-primary text-text-dark max-w-11/12 md:max-w-4/7 rounded-b-lg rounded-tl-lg"
                    : "bg-background dark:bg-section-dark text-black dark:text-text-dark rounded-b-lg rounded-tr-lg"
                }`}
              >
                {message.value}
              </div>
              {message.sender === "user" && (
                <div className="relative">
                  <div className="absolute top-0 right-0 w-0 h-0 border-t-8 border-t-primary border-r-8 border-r-transparent"></div>
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary">
              <p className="invisible">.</p>
            </div>
          )}
          <div ref={messagesEndRef}></div>
        </div>

        <div className="flex gap-4 mt-4">
          <textarea
            ref={textareaRef} // ✅ Assign ref to textarea
            placeholder="Type a message"
            className="flex-grow p-2 bg-background/20 dark:bg-section-dark/20 dark:text-text-dark rounded-lg outline-none border-2 border-primary resize-none h-auto max-h-32 overflow-y-auto"
            rows={1}
            disabled={isLoading || !selectedProject}
            onInput={(e) => {
              e.target.style.height = "auto";
              e.target.style.height = `${Math.min(
                e.target.scrollHeight,
                128
              )}px`;
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          ></textarea>

          <button
            className="self-end h-11 bg-primary text-white p-2 rounded-lg px-8 disabled:opacity-50"
            onClick={handleSendMessage}
            disabled={isLoading || !selectedProject}
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

export default ChatBox;