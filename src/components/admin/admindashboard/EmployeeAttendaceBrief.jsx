import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import ApiendPonits from "../../../api/APIEndPoints.json";
import { HiUsers } from "react-icons/hi2";
import { TiFlash } from "react-icons/ti";
import { IoFlashOff } from "react-icons/io5";
import { FaCaretLeft, FaCaretRight } from "react-icons/fa";
import { RiRefreshLine } from "react-icons/ri";
import {
  FaCircleCheck,
  FaCircleXmark,
  FaCircleHalfStroke,
} from "react-icons/fa6";

import { motion } from "framer-motion";

// Helper function to format the date in the required format
const formatDate = (date) => {
  return date.toISOString().split("T")[0]; // "YYYY-MM-DD"
};

// Helper function to get formatted date
const getFormattedDate = (selectedDate) => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const formattedToday = formatDate(today);
  const formattedYesterday = formatDate(yesterday);

  if (selectedDate === formattedToday) {
    return "Today";
  } else if (selectedDate === formattedYesterday) {
    return "Yesterday";
  } else {
    return selectedDate; // Return the actual selected date if it's neither today nor yesterday
  }
};

const EmployeeAttendanceBrief = () => {
  const { userData } = useContext(AuthContext);
  const token = localStorage.getItem("accessToken");

  // State to store the selected date and attendance status counts
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date())); // Default to today's date
  const [statusCounts, setStatusCounts] = useState({ 1: 0, 2: 0 });
  const [employeeList, setEmployeeList] = useState([]); // Store employee data
  const [activeEmployeeCount, setActiveEmployeeCount] = useState(0); // Store count of employees with status 1
  const [inactiveEmployeeCount, setInactiveEmployeeCount] = useState(0); // Store count of inactive employees
  const [totalEmployeeCount, setTotalEmployeeCount] = useState(0);

  // Fetch attendance data based on the selected date
  useEffect(() => {
    const fetchEmployeeAttendanceByDate = async () => {
      try {
        const response = await fetch(
          `${ApiendPonits.baseUrl}${ApiendPonits.endpoints.getAttendanceRecordsbyDate}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              date: selectedDate, // Use selected date
            }),
          }
        );

        const data = await response.json();

        if (response.ok) {
          // Calculate the counts for each attendance status (excluding status 0)
          const counts = data.attendance.reduce(
            (acc, record) => {
              if (
                record.attendancestatus === 1 ||
                record.attendancestatus === 2
              ) {
                acc[record.attendancestatus] =
                  (acc[record.attendancestatus] || 0) + 1;
              }
              return acc;
            },
            { 1: 0, 2: 0 }
          );

          setStatusCounts(counts);
        } else {
          console.error(
            "Error in Response:",
            data.message || "Failed to fetch employees"
          );
        }
      } catch (err) {
        console.error(
          "Error fetching employee attendance:",
          err.message || err
        );
      }
    };

    fetchEmployeeAttendanceByDate();
  }, [token, selectedDate]);

  // Fetch employee list and count active employees (status 1) and inactive employees (status other than 1)
  useEffect(() => {
    const fetchEmployeeList = async () => {
      try {
        const response = await fetch(
          `${ApiendPonits.baseUrl}${ApiendPonits.endpoints.employeeList}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();
        console.log(data);

        if (response.ok) {
          setEmployeeList(data.data);

          // Calculate the total number of employees
          const totalCount = data.data.length;
          setTotalEmployeeCount(totalCount);

          // Calculate the number of employees with status 1 (active)
          const activeCount = data.data.filter(
            (employee) => employee.status === 1
          ).length;
          setActiveEmployeeCount(activeCount);

          // Calculate the number of inactive employees (status other than 1)
          const inactiveCount = data.data.filter(
            (employee) => employee.status !== 1
          ).length;
          setInactiveEmployeeCount(inactiveCount);
        } else {
          throw new Error("Failed to fetch employees");
        }
      } catch (err) {
        console.error("Error fetching employees:", err.message || err);
      }
    };

    if (token) {
      fetchEmployeeList();
    }
  }, [token]);

  const onleave = activeEmployeeCount - statusCounts[1];

  // Handle date change (previous or next)
  const handleChangeDate = (direction) => {
    const newDate = new Date(selectedDate);
    if (direction === "prev") {
      newDate.setDate(newDate.getDate() - 1); // Go to the previous day
    } else if (direction === "next") {
      newDate.setDate(newDate.getDate() + 1); // Go to the next day
    }
    setSelectedDate(formatDate(newDate)); // Update the selected date
  };

  // Check if selectedDate is today
  const isToday = selectedDate === formatDate(new Date());

  const ResetFiletr = () => {
    setSelectedDate(formatDate(new Date()));
  };

  return (
    <div>
      {/* Active inactive employee counts */}
      <div className="grid grid-cols-4 sm:grid-cols-3 gap-2">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="col-span-full sm:col-span-2 bg-none border-2 dark:border-none flex
            flex-col gap-2 dark:bg-neutral-900 p-2 rounded-md"
        >
          <div className="flex items-center gap-2 justify-en">
            <div className="flex items-center gap-2 bg-sky-50 dark:bg-neutral-800 p-1 h-full rounded-lg flex-col items-cente">
              <div className="flex justify-between items-center gap-1">
                <button
                  onClick={() => handleChangeDate("prev")}
                  className="p-1 bg-sky-100 hover:bg-sky-200 rounded-lg dark:bg-neutral-900 dark:border-neutral-700 group"
                >
                  <FaCaretLeft
                    fontSize={23}
                    className="group-hover:-translate-x-1 duration-300"
                  />
                </button>

                <h3 className="w-32 text-sm text-center font-semibold py-1.5 px-2 bg-sky-100 rounded-lg dark:bg-neutral-900 dark:border-neutral-700 group">
                  {getFormattedDate(selectedDate)}
                </h3>

                <button
                  onClick={() => handleChangeDate("next")}
                  disabled={isToday}
                  className="p-1 bg-sky-100 hover:bg-sky-200 rounded-lg dark:bg-neutral-900 dark:border-neutral-700 group"
                >
                  <FaCaretRight
                    fontSize={23}
                    className="group-hover:translate-x-1 duration-300"
                  />
                </button>

                {/* {!isToday && ( */}
                <button
                  onClick={() => ResetFiletr()}
                  className="p-1 bg-sky-100 hover:bg-sky-200 rounded-lg dark:bg-neutral-900 dark:border-neutral-700 group"
                >
                  <RiRefreshLine
                    fontSize={23}
                    className="group-hover:-rotate-90 duration-300"
                  />
                </button>
                {/* // )} */}
              </div>
            </div>
          </div>
          <div className="h-full">
            <div className="bg-sky-5 dark:bg-neutral-80  h-full rounded-lg flex flex-col items-center justify-center gap-2">
              <ul className="flex items-center gap-2 justify-between w-full h-full">
                <li className="flex justify-between w-full pl-2 pr-4 h-full gap-2 items-center font-medium bg-green-500/10  rounded-lg">
                  <div className="flex items-center gap-2">
                    <FaCircleCheck fontSize={18} className="text-green-500" />
                    <span>Present </span>
                  </div>
                  <span className="font-bold text-3xl text-green-500">
                    {statusCounts[1]}
                  </span>
                </li>

                <li className="flex justify-between w-full pl-2 pr-4 h-full gap-2 items-center font-medium bg-red-500/10  rounded-lg">
                  <div className="flex items-center gap-2">
                    <FaCircleHalfStroke
                      fontSize={18}
                      className="text-red-500"
                    />
                    <span>Absent</span>
                  </div>
                  <span className="font-bold text-3xl text-red-500">
                    {onleave}
                  </span>
                </li>

                <li className="flex justify-between w-full pl-2 pr-4 h-full gap-2 items-center font-medium bg-yellow-500/10  rounded-lg">
                  <div className="flex items-center gap-2">
                    <FaCircleXmark fontSize={18} className="text-yellow-500" />
                    <span>Half Day</span>
                  </div>
                  <span className="font-bold text-3xl text-yellow-500">
                    {statusCounts[2]}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

        <div className="col-span-2 sm:col-span-1 flex flex-col gap-2 h-full">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="col-span-2 sm:col-span-1 bg-none border-2 dark:border-none flex flex-col
                    gap-2 dark:bg-neutral-900 rounded-md h-full justify-center"
          >
            <div className="flex items-center justify-between  px-2 pt-2">
              <div className="flex items-center gap-2">
                <div className="bg-indigo-500/20  rounded-md p-2">
                  <HiUsers fontSize={20} className="text-indigo-600" />
                </div>
                <h2 className="font-bold">Total Employees</h2>
              </div>
              <div className="text-4xl font-bold text-blue-300 flex justify-end">
                {totalEmployeeCount}
              </div>
            </div>
            <div className="flex items-center justify-between gap-2 px-2 pb-2">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="col-span-2 sm:col-span-1 bg-none border-2 dark:border-none flex flex-col w-1/2
                    gap-4 dark:bg-neutral-950 p-2 rounded-md h-full justify-center"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="bg-green-500/20  rounded-md p-2">
                      <TiFlash fontSize={20} className="text-green-600" />
                    </div>
                    <h2 className="font-bold">Active</h2>
                  </div>
                  <div className="text-4xl font-bold text-green-300 flex justify-end">
                    {activeEmployeeCount}
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9 }}
                className="col-span-2 sm:col-span-1 bg-none border-2 dark:border-none flex flex-col w-1/2
                    gap-4 dark:bg-neutral-950 p-2 rounded-md h-full justify-center"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="bg-red-500/20  rounded-md p-2">
                      <IoFlashOff fontSize={20} className="text-red-600" />
                    </div>
                    <h2 className="font-bold">Inactive</h2>
                  </div>
                  <div className="text-4xl font-bold text-red-300 flex justify-end">
                    {inactiveEmployeeCount}
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeAttendanceBrief;
