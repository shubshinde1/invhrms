import React, { useEffect } from "react";
import AttendanceHistory from "./AttendanceHistory";
import ApexCharts from "apexcharts";
import intime from "../../assets/images/intime.png";
import breaktime from "../../assets/images/breaktime.png";
import totalhours from "../../assets/images/totalhours.png";
import tasks from "../../assets/images/tasks.png";
import AttendanceChart from "./AttendanceChart";

export default function Bodycards() {
  return (
    <div className="bg-white dark:bg-neutral-950 p- rounded-md  ">
      <h2 className="dark:text-white mt-2 md:mt-0">
        Last 15 days Time at work
      </h2>
      <AttendanceChart className="" />
    </div>
  );
}
