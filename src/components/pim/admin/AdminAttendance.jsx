import React from "react";
import { useParams } from "react-router-dom";

const AdminAttendance = (Id) => {
  const { _id } = useParams(); // Get the employee ID from URL params

  return <div>Attendance{_id}</div>;
};

export default AdminAttendance;
