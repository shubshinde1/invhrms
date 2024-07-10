import React from "react";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

const ErrorMsg = ({ severity = "error", children }) => {
  return (
    <Stack sx={{ width: "100%" }} spacing={2}>
      <Alert severity={severity} className="dark:bg-red-500">
        {children}
      </Alert>
    </Stack>
  );
};

export default ErrorMsg;
