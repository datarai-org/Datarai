import React from "react";

const LoadingAnim = ({justification="center"}) => {
  return (
    <div className={"animate-spin rounded-full h-6 w-6 border-4 border-b-info self-"+{justification}}>
      <p className="invisible">.</p>
    </div>
  );
};

export default LoadingAnim;
