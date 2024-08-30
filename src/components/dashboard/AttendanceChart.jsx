import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import ApiendPonits from "../../api/APIEndPoints.json";
import dayjs from "dayjs";
import Tooltip from "@mui/material/Tooltip";
import { motion } from "framer-motion";

const AttendanceChart = () => {
  const token = localStorage.getItem("accessToken");
  const { userData } = useContext(AuthContext);
  const employee_id = userData?.employeeData._id;

  const [attendanceData, setAttendanceData] = useState([]);

  const getAttendanceHistory = async () => {
    try {
      const response = await fetch(ApiendPonits.getattendancehistory, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ employee_id }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch attendance history");
      }

      const data = await response.json();
      setAttendanceData(data.attendance);
    } catch (error) {
      console.error("Error fetching attendance history:", error);
    }
  };

  useEffect(() => {
    if (employee_id && token) {
      getAttendanceHistory();
    }
  }, [employee_id, token]);

  // Utility function to convert milliseconds to hh:mm
  const formatMilliseconds = (milliseconds) => {
    const totalMinutes = Math.floor(milliseconds / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${String(hours).padStart(1, "0")}.${String(minutes).padStart(
      1,
      "0"
    )}`;
  };

  // Utility function to convert milliseconds to hh:mm:ss
  const formatMillisecondsToHMS = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;
  };

  // Get today's date in the same format as the date in the records
  const today = dayjs().format("YYYY-MM-DD");

  // Filter the attendance data to exclude today's records, sort by date, and get the last 7 records
  const filteredAttendanceData = attendanceData
    .filter((record) => dayjs(record.date).format("YYYY-MM-DD") !== today)
    .sort((a, b) => dayjs(b.date).diff(dayjs(a.date))) // Sort by date in descending order
    .slice(0, 7); // Get the last 7 records

  // Max hours in milliseconds
  const maxHours = 9.5;
  const maxMilliseconds = maxHours * 60 * 60 * 1000; // Convert hours to milliseconds

  return (
    <div className="">
      <div className="min-w-full text-sm">
        <div className="flex flex-row ">
          {filteredAttendanceData.map((record) => {
            const totalHours = record.totalhrs / (1000 * 60 * 60); // Convert milliseconds to hours
            const percentage = (totalHours / maxHours) * 100;

            return (
              <div
                key={record._id}
                className="flex flex-col justify-end  items-center"
              >
                <div className="relative flex my-2 ">
                  <div className="bg-blue-200/10 h-44 rounded-md flex items-end">
                    <Tooltip
                      title={formatMillisecondsToHMS(record.totalhrs)}
                      placement="top"
                      arrow
                    >
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: -1 }}
                        transition={{
                          type: "tween",
                          duration: 0.8,
                        }}
                        className="bg-indigo-600 w-8 rounded-md flex justify-start"
                        style={{
                          height: `${percentage}%`,
                          transition: "height 0.3s ease",
                        }}
                      >
                        <div className="flex w-full justify-center items-center font-semibold text-white text-[0.60rem] px-">
                          {record.totalhrs > 9000000
                            ? formatMilliseconds(record.totalhrs)
                            : ""}
                        </div>
                      </motion.div>
                    </Tooltip>
                  </div>
                </div>
                <div className="px-4 text-xs text-neutral-500 font-bold">
                  {dayjs(record.date).format("ddd")}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AttendanceChart;
