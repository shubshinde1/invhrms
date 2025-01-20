import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import AdminLeave from "./admin/AdminLeave";
import AdminAttendance from "./admin/AdminAttendance";
import AdminTimeSheet from "./admin/AdminTimeSheet";
import AdminInfo from "./admin/AdminInfo";
import { useLocation } from "react-router-dom";

const EmployeeDetails = () => {
  const location = useLocation();
  const defaultTab = location.state?.activeTab || "TimeSheet"; // Default to "TimeSheet" if no state is passed

  const [activeTab, setActiveTab] = useState(defaultTab);
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
      case "Info":
        return <AdminInfo Id={_id} />;
      default:
        return <AdminInfo Id={_id} />;
    }
  };

  useEffect(() => {}, [activeTab]);

  return (
    <div className="flex flex-col gap-2 h-full ">
      <div className="bg-white dark:bg-neutral-950 p-2 dark:text-white rounded-md sticky top-0 z-20 flex justify-between md:justify-start gap-2 h-fit ">
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
          Details
        </button>
      </div>

      <div
        className={`h-full   ${
          activeTab === "TimeSheet"
            ? "pb-20"
            : activeTab === "Info"
            ? "pb-20"
            : "pb-32"
        }`}
      >
        {renderContent()}
      </div>
    </div>
  );
};

export default EmployeeDetails;
