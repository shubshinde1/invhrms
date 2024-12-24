import React from "react";
import Tooltip from "@mui/material/Tooltip";

const TruncatedTextWithTooltip = ({ text, maxLength }) => {
  return (
    <Tooltip title={text} placement="top" arrow>
      <span>
        {text.length > maxLength ? `${text.slice(0, maxLength)}...` : text}
      </span>
    </Tooltip>
  );
};

export default TruncatedTextWithTooltip;
