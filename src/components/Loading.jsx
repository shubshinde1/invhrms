import React from "react";
import { leapfrog } from "ldrs";

leapfrog.register();

const Loading = () => {
  return (
    <div className="h-dvh z-50 flex justify-center items-center">
      <l-leapfrog size="40" speed="2.5" color="#285999"></l-leapfrog>
    </div>
  );
};

export default Loading;
