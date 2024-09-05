import React from "react";
import { useParams } from "react-router-dom";

const AdminLeave = (Id) => {
  const { _id } = useParams(); // Get the employee ID from URL params

  return <div>Leave{_id}</div>;
};

export default AdminLeave;
