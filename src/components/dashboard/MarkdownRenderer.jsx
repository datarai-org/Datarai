import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { CopyBlock, dracula, paraisoLight } from "react-code-blocks";

// Function to check if a message contains code blocks
const containsCodeBlock = (text) => /```[\s\S]+?```/.test(text);

const MarkdownRenderer = ({ message }) => {
  const [wasCodeGenerated, setWasCodeGenerated] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    setWasCodeGenerated(containsCodeBlock(message.value));

    // Detect dark mode
    const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDarkMode(darkModeQuery.matches);
  }, [message.value]);

  return (
    <div className="space-y-4">
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h1 className="text-xl font-bold mt-4 mb-2">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg font-semibold mt-4 mb-2">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-md font-medium mt-4 mb-2">{children}</h3>
          ),
          strong: ({ children }) => (
            <strong className="font-bold">{children}</strong>
          ),
          em: ({ children }) => <em className="italic">{children}</em>,
          u: ({ children }) => <u className="underline">{children}</u>,
          code({ node, inline, className, children, ...props }) {
            const codeText = String(children).trim();
            const isBlock = !inline && codeText.includes("\n");

            if (!isBlock) {
              return (
                <code className="bg-gray-200 dark:bg-gray-800 px-1 py-0.5 rounded break-words text-sm">
                  {codeText}
                </code>
              );
            } else {
              return (
                <div className="my-3">
                  <CopyBlock
                    language={className?.replace("language-", "") || "plaintext"}
                    text={codeText}
                    theme={isDarkMode ? dracula : paraisoLight}
                    showLineNumbers={false}
                    wrapLines
                    codeBlock
                  />
                </div>
              );
            }
          },
        }}
      >
        {message.value}
      </ReactMarkdown>

      {message.image && message.sender === "ai" && (
        <img
          src={`data:image/png;base64,${message.image}`}
          alt="AI Visualisation Image"
          className="w-full rounded-lg mt-2"
        />
      )}

      {/* Show warning if a code block exists */}
      {wasCodeGenerated && (
        <div className="flex items-center my-2 bg-info/30 text-xs w-56 p-2 rounded-lg gap-2">
          <IoMdInformationCircleOutline className="text-lg text-info" />
          <p className="flex self-center">Use generated code with caution</p>
        </div>
      )}
    </div>
  );
};

export default MarkdownRenderer;
