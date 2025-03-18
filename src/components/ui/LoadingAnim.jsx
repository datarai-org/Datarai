import React from "react";

const LoadingAnim = ({left=false}) => {
  return (
    <div className={"animate-spin rounded-full h-6 w-6 border-4 border-b-info self-"+(left ? "start" : "center")}>
      <p className="invisible">.</p>
    </div>
  );
};

export default LoadingAnim;
