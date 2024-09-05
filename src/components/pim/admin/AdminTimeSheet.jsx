import React from "react";
import { useParams } from "react-router-dom";

const AdminTimeSheet = (Id) => {
  const { _id } = useParams(); // Get the employee ID from URL params

  return <div>TimeSheet{_id}</div>;
};

export default AdminTimeSheet;
