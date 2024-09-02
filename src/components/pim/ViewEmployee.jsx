import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import View from "./View";
import Leave from "./Leave";
import TimeSheets from "./TimeSheets";
import { useParams } from "react-router-dom";
import MenuTabs from "./Menutabs";

export default function ViewEmployee() {
  const [activeTab, setActiveTab] = useState("view");

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const { empid } = useParams();
  // console.log("Employee ID:", empid);

  return (
    <div className="">
      <MenuTabs />
      <div className="bg-white dark:bg-neutral-950 rounded-md p-2 sticky top-0 mb-2">
        <ul className="flex gap-2">
          <li
            className={`text-sm px-3 py-1.5 rounded-md ${
              activeTab === "view"
                ? "bg-[#5336FD] text-white font-bold"
                : "bg-sky-50 dark:bg-neutral-900 dark:text-white"
            }`}
            onClick={() => handleTabChange("view")}
          >
            <div className="cursor-pointer">View</div>
          </li>
          <li
            className={`text-sm px-3 py-1.5 rounded-md ${
              activeTab === "leave"
                ? "bg-[#5336FD] text-white font-bold"
                : "bg-sky-50 dark:bg-neutral-900 dark:text-white"
            }`}
            onClick={() => handleTabChange("leave")}
          >
            <div className="cursor-pointer">Leave info</div>
          </li>
          <li
            className={`text-sm px-3 py-1.5 rounded-md ${
              activeTab === "timesheets"
                ? "bg-[#5336FD] text-white font-bold"
                : "bg-sky-50 dark:bg-neutral-900 dark:text-white"
            }`}
            onClick={() => handleTabChange("timesheets")}
          >
            <div className="cursor-pointer">Time Sheet</div>
          </li>
        </ul>
      </div>
      <div>
        {activeTab === "view" && (
          <div id="view" className="">
            <View />
          </div>
        )}
        {activeTab === "leave" && (
          <div id="leave" className="">
            <Leave empid={empid} />
          </div>
        )}
        {activeTab === "timesheets" && (
          <div id="timesheets" className="">
            <TimeSheets empid={empid} />
          </div>
        )}
      </div>
    </div>
  );
}
