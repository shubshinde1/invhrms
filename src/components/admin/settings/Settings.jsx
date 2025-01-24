import React, { useState } from "react";
import DepartmentSettings from "./DepartmentSettings";
import DesignationSettings from "./DesignationSettings";
import CountrySettings from "./CountrySettings";
import ReportingManagerSettings from "./ReportingManagerSettings";
import TimeSheetSettings from "./TimeSheetSettings";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("Department");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="h-full pb-20">
      <div className="bg-gray-50 dark:bg-neutral-950 p-2 rounded-md shadow-lg text-black dark:text-white h-full max-h-full flex flex-col gap-2">
        {/* Tabs Section */}
        <div className="flex gap-2 bg-blue-100 dark:bg-neutral-900 p-1 rounded-lg">
          <button
            className={`px-3 py-1.5 rounded-md hover:bg-blue-400/20 hover:text-blue-400 duration-500 ${
              activeTab === "TimeSheet"
                ? "bg-blue-500/20 text-blue-500 font-bold"
                : ""
            }`}
            onClick={() => handleTabClick("TimeSheet")}
          >
            TimeSheet
          </button>
          <button
            className={`px-3 py-1.5 rounded-md hover:bg-blue-400/20 hover:text-blue-400 duration-500 ${
              activeTab === "Department"
                ? "bg-blue-500/20 text-blue-500 font-bold"
                : ""
            }`}
            onClick={() => handleTabClick("Department")}
          >
            Departments
          </button>
          <button
            className={`px-3 py-1.5 rounded-md hover:bg-blue-400/20 hover:text-blue-400 duration-500 ${
              activeTab === "Designation"
                ? "bg-blue-500/20 text-blue-500 font-bold"
                : ""
            }`}
            onClick={() => handleTabClick("Designation")}
          >
            Designations
          </button>
          <button
            className={`px-3 py-1.5 rounded-md hover:bg-blue-400/20 hover:text-blue-400 duration-500 ${
              activeTab === "Country"
                ? "bg-blue-500/20 text-blue-500 font-bold"
                : ""
            }`}
            onClick={() => handleTabClick("Country")}
          >
            Counties
          </button>
          <button
            className={`px-3 py-1.5 rounded-md hover:bg-blue-400/20 hover:text-blue-400 duration-500 ${
              activeTab === "ReportingManager"
                ? "bg-blue-500/20 text-blue-500 font-bold"
                : ""
            }`}
            onClick={() => handleTabClick("ReportingManager")}
          >
            Reporting Managers
          </button>
        </div>

        {/* Content Section */}
        <div className="h-full">
          {activeTab === "TimeSheet" && <TimeSheetSettings />}
          {activeTab === "Department" && <DepartmentSettings />}
          {activeTab === "Designation" && <DesignationSettings />}
          {activeTab === "Country" && <CountrySettings />}
          {activeTab === "ReportingManager" && <ReportingManagerSettings />}
        </div>
      </div>
    </div>
  );
};

export default Settings;
