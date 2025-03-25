import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { CopyBlock, dracula, paraisoLight } from "react-code-blocks";

// Function to check if a message contains code blocks
const containsCodeBlock = (text) => /```[\s\S]+?```/.test(text);

const MarkdownRenderer = ({ message }) => {
  const [wasCodeGenerated, setWasCodeGenerated] = useState(false);

  useEffect(() => {
    setWasCodeGenerated(containsCodeBlock(message.value));
  }, [message.value]);

  return (
    <div className="space-y-4">
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h1 className="text-xl font-bold mt-2">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg font-semibold mt-2">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-md font-medium mt-2">{children}</h3>
          ),
          b: ({ children }) => (
            <strong className="font-bold mt-12">{children}</strong>
          ),
          em: ({ children }) => <i className="italic">{children}</i>,
          u: ({ children }) => <u className="underline">{children}</u>,
          code({ node, inline, className, children, ...props }) {
            const codeText = String(children).trim();
            const isBlock = !inline && codeText.includes("\n");

            if (!isBlock) {
              return (
                <code className="bg-section-base dark:bg-background-dark px-1 py-0.5 rounded text-wrap">
                  {codeText}
                </code>
              );
            } else {
              return (
                <div className="my-2">
                  <CopyBlock
                    language={
                      className?.replace("language-", "") || "plaintext"
                    }
                    text={codeText}
                    theme={
                      (localStorage.getItem("isDarkMode") || "light") === "dark"
                        ? dracula
                        : paraisoLight
                    }
                    showLineNumbers={false}
                    wrapLines
                    codeBlock
                  >
                    {codeText}
                  </CopyBlock>
                </div>
              );
            }
          },
        }}
      >
        {message.value}
      </ReactMarkdown>

      {message.image !== null && message.sender === "ai" && (
        <img
          src={"data:image/png;base64," + message.image}
          alt="AI Response"
          className="w-full rounded-lg"
        />
      )}

      {/* Show warning if a code block exists */}
      {wasCodeGenerated && (
        <div className="flex items-center my-1 bg-info/30 text-xs w-52 p-1 rounded-lg gap-1 text-left">
          <IoMdInformationCircleOutline className="text-lg text-info" />
          <p className="flex mt-0.5 self-center">
            Use generated code with caution
          </p>
        </div>
      )}
    </div>
  );
};

export default MarkdownRenderer;
