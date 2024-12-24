import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import AdminLeave from "./admin/AdminLeave";
import AdminAttendance from "./admin/AdminAttendance";
import AdminTimeSheet from "./admin/AdminTimeSheet";
import AdminInfo from "./admin/AdminInfo";

const EmployeeDetails = () => {
  const [activeTab, setActiveTab] = useState("TimeSheet");
  const { _id } = useParams();

  const renderContent = () => {
    switch (activeTab) {
      case "Info":
        return <AdminInfo Id={_id} />;
      case "Leave":
        return <AdminLeave Id={_id} />;
      case "TimeSheet":
        return <AdminTimeSheet Id={_id} />;
      case "Attendance":
        return <AdminAttendance Id={_id} />;
      default:
        return <AdminInfo Id={_id} />;
    }
  };

  return (
    <div className="flex flex-col gap-2 ">
      <div className="bg-white dark:bg-neutral-950 p-2 dark:text-white rounded-md sticky top-0 z-20 flex gap-2">
        <button
          className={`px-3 py-1  ${
            activeTab === "TimeSheet"
              ? "bg-[#5336FD] text-white font-bold  rounded-md"
              : "hover:bg-sky-50 dark:hover:bg-neutral-900 rounded-md"
          }`}
          onClick={() => setActiveTab("TimeSheet")}
        >
          TimeSheet
        </button>

        <button
          className={`px-3 py-1  ${
            activeTab === "Attendance"
              ? "bg-[#5336FD] text-white font-bold  rounded-md"
              : "hover:bg-sky-50 dark:hover:bg-neutral-900 rounded-md"
          }`}
          onClick={() => setActiveTab("Attendance")}
        >
          Attendance
        </button>
        <button
          className={`px-3 py-1  ${
            activeTab === "Leave"
              ? "bg-[#5336FD] text-white font-bold  rounded-md"
              : "hover:bg-sky-50 dark:hover:bg-neutral-900 rounded-md"
          }`}
          onClick={() => setActiveTab("Leave")}
        >
          Leave
        </button>
        <button
          className={`px-3 py-1  ${
            activeTab === "Info"
              ? "bg-[#5336FD] text-white font-bold  rounded-md"
              : "hover:bg-sky-50 dark:hover:bg-neutral-900 rounded-md"
          }`}
          onClick={() => setActiveTab("Info")}
        >
          User Details
        </button>
      </div>

      <div className="">{renderContent()}</div>
    </div>
  );
};

export default EmployeeDetails;
