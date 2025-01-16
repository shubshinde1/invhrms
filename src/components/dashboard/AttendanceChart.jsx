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
  const [maxHours, setMaxHours] = useState(0);

  const getAttendanceHistory = async () => {
    try {
      const response = await fetch(
        `${ApiendPonits.baseUrl}${ApiendPonits.endpoints.getattendancehistory}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ employee_id }),
        }
      );

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

  const formatMilliseconds = (milliseconds) => {
    const totalMinutes = Math.floor(milliseconds / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${String(hours).padStart(1, "0")}.${String(minutes).padStart(
      1,
      "0"
    )}`;
  };

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

  const today = dayjs().format("YYYY-MM-DD");

  const filteredAttendanceData = Array.from(
    new Map(
      attendanceData
        .filter((record) => dayjs(record.date).format("YYYY-MM-DD") !== today)
        .map((record) => [dayjs(record.date).format("YYYY-MM-DD"), record])
    ).values()
  ).sort((a, b) => dayjs(a.date).diff(dayjs(b.date)));

  // Fill missing attendance data for the last 15 days
  const last15Days = Array.from({ length: 15 }, (_, index) => {
    const date = dayjs().subtract(index, "day").format("YYYY-MM-DD");
    const attendanceRecord = filteredAttendanceData.find(
      (record) => dayjs(record.date).format("YYYY-MM-DD") === date
    );

    return {
      date,
      totalhrs: attendanceRecord?.totalhrs || 0, // 0 if no attendance record
    };
  });

  useEffect(() => {
    if (attendanceData.length > 0) {
      const maxTotalHours = Math.max(
        ...attendanceData.map((record) => record.totalhrs || 0)
      );

      const hours = Math.floor(maxTotalHours / (1000 * 60 * 60));
      const minutes = Math.floor(
        (maxTotalHours % (1000 * 60 * 60)) / (1000 * 60)
      );

      const maxHours = hours + 2;
      setMaxHours(maxHours);
    }
  }, [attendanceData]);

  return (
    <div className="overflow-x-scroll scrollbrhorhdn">
      <div className="min-w-full text-sm">
        <div className="flex flex-row">
          {last15Days.map((record, rowIndex) => {
            const totalHours = record.totalhrs / (1000 * 60 * 60);
            const percentage =
              totalHours > 0 ? (totalHours / maxHours) * 100 : 0;
            const hasData = totalHours > 0;

            return (
              <div
                key={record.date}
                className="flex flex-col justify-end items-center"
              >
                <div className="relative flex my-2">
                  <div
                    className={`${
                      hasData ? "bg-blue-200/10" : "bg-red-300/10 "
                    } h-44 rounded-md flex items-end`}
                  >
                    <Tooltip
                      title={hasData ? record.date : "No Data"}
                      placement="top"
                      arrow
                    >
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          type: "spring",
                          duration: 0.8,
                          delay: rowIndex * 0.1,
                        }}
                        className={`${
                          totalHours >= 7
                            ? "bg-green-500/30 text-green-500"
                            : totalHours >= 5
                            ? "bg-orange-500/30 text-orange-500"
                            : "bg-red-500/30 text-red-500"
                        } w-9 rounded-md flex justify-start`}
                        style={{
                          height: `${percentage}%`,
                          transition: "height 0.5s ease",
                        }}
                      >
                        <div className="flex w-full justify-center items-start font-semibold text-whi text-[0.7rem] mt-1">
                          {hasData ? formatMilliseconds(record.totalhrs) : ""}
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
