import React from "react";

const Loading = () => {
  return (
    <div className="h-0.5 w-full bg-gray-900 rounded-md relative overflow-hidden flex gap-1 px-0.5 p-0.5">
      <div className="absolute left-0 top-0 h-full w-1/2 bg-green-500 rounded-full animate-slide "></div>
    </div>
  );
};

export default Loading;
