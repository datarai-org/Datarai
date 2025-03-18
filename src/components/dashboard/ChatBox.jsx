import React from "react";
import axios from "axios";

import Markdown from "react-markdown";

import { IoSparklesOutline } from "react-icons/io5";
import {
  IoIosSend,
  IoMdInformationCircleOutline,
  IoMdCode,
} from "react-icons/io";
import LoadingAnim from "../ui/LoadingAnim";
import { CopyBlock, dracula, paraisoLight } from "react-code-blocks";

const callGeminiAPI = async (
  messages,
  selectedProject,
  fileUri,
  visualizationMode,
  codeExecutionMode
) => {
  try {
    const response = await axios.post("https://api.datarai.com/gemini", {
      messages,
      projectId: selectedProject,
      fileUri,
      visualize: visualizationMode,
      execution: codeExecutionMode,
    });

    return response.data.message;
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
    return "Error: Unable to connect to AI. " + error.message;
  }
};

const ChatBox = ({
  className,
  selectedProject,
  addMessage,
  getMessages,
  getFileUri,
  getLimitAndUsage,
}) => {
  const [messages, setMessages] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [visualizationMode, setVisualizationMode] = React.useState(false);
  const [codeExecutionMode, setCodeExecutionMode] = React.useState(false);

  const [textAreaCharacterCount, setTextAreaCharacterCount] = React.useState(0);

  const messagesContainerRef = React.useRef(null); // ✅ Ref to scroll to bottom
  const textareaRef = React.useRef(null); // ✅ Ref to refocus textarea

  React.useEffect(() => {
    textareaRef.current.addEventListener("input", () => {
      setTextAreaCharacterCount(textareaRef.current.value.length);
    });
  }, []);

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
    if (messagesContainerRef.current) {
      setTimeout(() => {
        messagesContainerRef.current.scrollTop =
          messagesContainerRef.current.scrollHeight;
      }, 0); // Ensure scrolling happens after React updates the DOM
    }

    if (textareaRef.current) {
      textareaRef.current.focus(); // Refocus the textarea
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!textareaRef.current) return;

    const message = textareaRef.current.value.trim();
    if (!message || isLoading) return;

    const messageLimit = await getLimitAndUsage("messages");
    if (messageLimit.usage >= messageLimit.limit) {
      alert("Free message limit reached");
      return;
    }

    setMessages((prev) => [
      ...prev,
      { value: message, timestamp: new Date().toISOString(), sender: "user" },
    ]);

    textareaRef.current.value = "";
    setIsLoading(true);

    await addMessage(selectedProject, message, "user");
    const fileUri = await getFileUri(selectedProject);

    const aiResponse = await callGeminiAPI(
      [
        ...messages,
        { value: message, timestamp: new Date().toISOString(), sender: "user" },
      ],
      selectedProject,
      fileUri,
      visualizationMode,
      codeExecutionMode
    );

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
        <div
          className="flex flex-col gap-2 grow overflow-y-auto no-scrollbar"
          ref={messagesContainerRef}
        >
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
              className={`flex mb-2 text-pretty ${
                message.sender === "user" ? "justify-end" : "justify-start"
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
                    : "bg-background dark:bg-section-dark text-black dark:text-text-dark max-w-11/12 md:max-w-4/7 rounded-b-lg rounded-tr-lg"
                }`}
              >
                <Markdown
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      const codeText = String(children).trim();
                      const isBlock = !inline && codeText.includes("\n"); // Check for newlines to confirm a block

                      if (!isBlock) {
                        // Inline code
                        return (
                          <code className="bg-section-base dark:bg-background-dark px-1 py-0.5 rounded">
                            {codeText}
                          </code>
                        );
                      } else {
                        // Block code
                        return (
                          <div>
                            <CopyBlock
                              language={
                                className?.replace("language-", "") ||
                                "plaintext"
                              }
                              text={codeText}
                              theme={
                                (localStorage.getItem("isDarkMode") ||
                                  "light") === "dark"
                                  ? dracula
                                  : paraisoLight
                              }
                              showLineNumbers={false}
                              wrapLines
                              codeBlock
                            />
                            <div className="flex items-center my-1 bg-info/30 text-xs w-58 p-1 rounded-lg gap-1">
                              <IoMdInformationCircleOutline className="text-lg text-info" />{" "}
                              <p className="flex text-center mt-0.5 self-center">
                                Use generated code with caution
                              </p>
                            </div>
                          </div>
                        );
                      }
                    },
                  }}
                >
                  {message.value}
                </Markdown>
              </div>
              {message.sender === "user" && (
                <div className="relative">
                  <div className="absolute top-0 right-0 w-0 h-0 border-t-8 border-t-primary border-r-8 border-r-transparent"></div>
                </div>
              )}
            </div>
          ))}
          {isLoading && <LoadingAnim left={true} />}
        </div>

        <div className="flex gap-4 mt-4">
          <div className="flex flex-col gap-1 grow">
            <div
              className="flex-grow p-2 bg-background/20 dark:bg-section-dark/20 dark:text-text-dark rounded-xl border-2 border-primary overflow-y-auto cursor-text"
              onClick={() => textareaRef.current?.focus()} // Focus textarea on div click
            >
              <div className="flex items-center my-1 bg-danger/30 text-xs w-71 p-1 rounded-lg gap-1">
                <IoMdInformationCircleOutline className="text-lg text-danger" />{" "}
                <p className="flex text-center self-center">
                  Alpha Version - Chat may not work as expected
                </p>
              </div>
              <textarea
                ref={textareaRef} // ✅ Assign ref to textarea
                placeholder="Type a message"
                className="w-full outline-none resize-none h-auto max-h-32 pt-1"
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
              <div className="flex justify-between items-end">
                <div className="flex justify-center items-center gap-2">
                  <button
                    className={
                      "flex justify-center items-center gap-2 w-44 py-0.5 border-2 border-primary cursor-pointer rounded-full " +
                      (visualizationMode ? "bg-primary text-text-dark" : "")
                    }
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent div click event from firing
                      setVisualizationMode(!visualizationMode);
                    }}
                  >
                    <IoSparklesOutline />
                    Visualize (Alpha)
                  </button>
                  <button
                    className={
                      "flex justify-center items-center gap-2 w-54 py-0.5 border-2 border-primary cursor-pointer rounded-full " +
                      (codeExecutionMode ? "bg-primary text-text-dark" : "")
                    }
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent div click event from firing
                      setCodeExecutionMode(!codeExecutionMode);
                    }}
                  >
                    <IoMdCode />
                    Code Execution (Alpha)
                  </button>
                </div>
                <button
                  className="self-start h-10 w-10 flex justify-center items-center text-2xl bg-primary hover:bg-primary/80 cursor-pointer text-white p-2 rounded-full disabled:opacity-50"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent div click event from firing
                    handleSendMessage();
                  }}
                  disabled={
                    isLoading ||
                    !selectedProject ||
                    textAreaCharacterCount > 1000
                  }
                >
                  <IoIosSend className="translate-x-[-1px] translate-y-[1px]" />
                </button>
              </div>
            </div>

            <div className="flex justify-between">
              <p className="text-black/50 dark:text-text-dark text-sm text-left">
                <i className="">Enter</i> to send message.{" "}
                <i className="">Shift-Enter</i> for new line.
              </p>
              <p
                className={
                  "text-sm " +
                  (textAreaCharacterCount > 1000
                    ? "text-red-500"
                    : "text-black/50 dark:text-text-dark")
                }
              >
                {textAreaCharacterCount}/1000
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
