import React, { useState } from "react";
import empdata from "../../dummydata/leaveData.json";
import { useParams } from "react-router-dom";
import { FaCaretLeft, FaCaretRight } from "react-icons/fa";
import Tooltip from "@mui/material/Tooltip";
import NotFound from "../../assets/images/norecordfound.svg";

import { makeStyles } from "@mui/styles";
import { motion } from "framer-motion";
import { IoTimer } from "react-icons/io5";
import { SiTask } from "react-icons/si";
import { FaSquareCheck } from "react-icons/fa6";
import { TbTimelineEventFilled } from "react-icons/tb";

const data = empdata;

const useStyles = makeStyles({
  root: {
    "& .MuiInputLabel-root": {
      fontFamily: "euclid",
      fontSize: 14,
      paddingTop: -2.5,
      fontWeight: "bold",
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "black",
      fontWeight: "bold",
      fontSize: 15,
    },
    "& .MuiInputBase-root": {
      backgroundColor: "#f0f9ff",
      border: "0 none",
      borderRadius: 7,
      height: 50,
      width: "100%",
      overflow: "hidden",
    },
    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
      borderColor: "transparent",
    },
    "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "transparent",
    },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "gray",
    },
    "& .Muilplaceholder": {
      fontFamily: "euclid",
      fontSize: 10,
    },
    "& .MuiOutlinedInput-input": {
      fontFamily: "euclid-medium",
      fontSize: 14,
    },
    "& ::placeholder": {
      fontSize: 12,
    },
    "& JoyCheckbox-input": {
      backgroundColor: "red",
    },
    display: "block",
    width: "100%",
    fontFamily: "euclid-medium",
  },
});

export default function TimeSheets() {
  const { empid } = useParams();
  const classes = useStyles();

  const [currentDate, setCurrentDate] = useState(
    new Date().toISOString().split("T")[0]
  ); // State to track current date

  // Filter the data array to find the matching employee data
  const employeeData = data.filter((emp) => emp.empid === empid);

  // Function to handle date change
  const handleDateChange = (event) => {
    const selectedDate = event.target.value;
    setCurrentDate(selectedDate);
  };

  // Access tasks data for the current date
  const currentTasks = employeeData
    .map((emp) => emp.timesheet[currentDate])
    .filter(Boolean)[0]; // Get tasks for current date

  // Calculate total number of tasks
  const totalTasks = currentTasks ? Object.keys(currentTasks).length : 0;

  // Calculate total duration
  const totalDuration = currentTasks
    ? Object.values(currentTasks).reduce(
        (acc, curr) => acc + parseFloat(curr.duration),
        0
      )
    : 0;

  // Function to handle clicking the previous date button
  const handlePrevDate = () => {
    const prevDate = new Date(
      new Date(currentDate).getTime() - 24 * 60 * 60 * 1000
    )
      .toISOString()
      .split("T")[0]; // Get previous date
    setCurrentDate(prevDate);
  };

  // Function to handle clicking the next date button
  const handleNextDate = () => {
    const nextDate = new Date(
      new Date(currentDate).getTime() + 24 * 60 * 60 * 1000
    )
      .toISOString()
      .split("T")[0]; // Get next date
    setCurrentDate(nextDate);
  };

  const totalPendingTasks = currentTasks
    ? Object.values(currentTasks).filter((task) => task.remark === 0).length
    : 0;

  const totalCompletedTasks = currentTasks
    ? Object.values(currentTasks).filter((task) => task.remark === 1).length
    : 0;

  // Function to handle clicking the "Today" button
  const handleToday = () => {
    setCurrentDate(new Date().toISOString().split("T")[0]); // Set current date to today's date
  };

  // Render tasks for the current date or "No data for today" if no tasks found
  return (
    <div className="rounded-md bg-white dark:bg-neutral-950  dark:text-white p-2 flex flex-col gap-2 mb-10">
      <div className=" grid grid-cols-12  gap-2 ">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.1 }}
          className="col-span-6 lg:col-span-3 border-2 dark:border-0 dark:bg-neutral-900 rounded-md p-2 flex flex-col gap-3"
        >
          <div className="flex items-center gap-2">
            <div className="bg-sky-200 rounded-md p-2 ">
              <SiTask fontSize={20} className="text-sky-600" />
            </div>
            <h2 className="font-bold">Total Tasks</h2>
          </div>
          <h2 className="flex items-end justify-end">
            <span className="text-4xl font-bold text-gray-300 cursor-pointer">
              <Tooltip title="Available" placement="top" arrow>
                {totalTasks}
              </Tooltip>
            </span>
          </h2>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="col-span-6 lg:col-span-3 border-2 dark:border-0 dark:bg-neutral-900 rounded-md p-2 flex flex-col gap-3"
        >
          <div className="flex items-center gap-2">
            <div className="bg-green-200 rounded-md p-2">
              <FaSquareCheck fontSize={20} className="text-green-500" />
            </div>
            <h2 className="font-bold">Completed Tasks</h2>
          </div>
          <h2 className="flex items-end justify-end">
            <span className="text-4xl font-bold text-gray-300 cursor-pointer">
              <Tooltip title="Available" placement="top" arrow>
                {totalCompletedTasks}
              </Tooltip>
            </span>
          </h2>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="col-span-6 lg:col-span-3 border-2 dark:border-0 dark:bg-neutral-900 rounded-md p-2 flex flex-col gap-3"
        >
          <div className="flex items-center gap-2">
            <div className="bg-orange-200 rounded-md p-2">
              <TbTimelineEventFilled
                fontSize={20}
                className="text-orange-600"
              />
            </div>
            <h2 className="font-bold">Pending Tasks</h2>
          </div>
          <h2 className="flex items-end justify-end">
            <span className="text-4xl font-bold text-gray-300 cursor-pointer">
              <Tooltip title="Available" placement="top" arrow>
                {totalPendingTasks}
              </Tooltip>
            </span>
          </h2>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="col-span-6 lg:col-span-3 border-2 dark:border-0 dark:bg-neutral-900 rounded-md p-2 flex flex-col gap-3"
        >
          <div className="flex items-center gap-2">
            <div className="bg-purple-200 rounded-md p-1.5">
              <IoTimer fontSize={24} className="text-purple-600" />
            </div>
            <h2 className="font-bold">Total Hours</h2>
          </div>
          <h2 className="flex items-end justify-end">
            <span className="text-4xl font-bold text-gray-300 cursor-pointer">
              <Tooltip title="Available" placement="top" arrow>
                {totalDuration}
              </Tooltip>
            </span>
          </h2>
        </motion.div>
      </div>
      <div className="flex gap-2 ">
        <input
          type="date"
          value={currentDate}
          onChange={handleDateChange}
          className="bg-sky-50 dark:bg-neutral-900 py-2 px-4 rounded-md"
        />
        <Tooltip title="Previous Day" placement="top" arrow>
          <button
            onClick={handlePrevDate}
            className="bg-sky-50 dark:bg-neutral-900 p-2 rounded-md"
          >
            <FaCaretLeft fontSize={20} />
          </button>
        </Tooltip>
        <Tooltip title="Next Day" placement="top" arrow>
          <button
            onClick={handleNextDate}
            className="bg-sky-50 dark:bg-neutral-900 p-2 rounded-md"
          >
            <FaCaretRight fontSize={20} />
          </button>
        </Tooltip>
        <button
          onClick={handleToday}
          className="bg-sky-50 dark:bg-neutral-900 py-2 px-4 rounded-md"
        >
          Today
        </button>{" "}
        {/* Button to go back to today's date */}
      </div>
      <div className="">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ul className="hidden lg:grid grid-cols-12 mb-2 gap-2 px-2 py-3 bg-sky-100 dark:bg-neutral-800 rounded-md font-bold">
            <li className="col-span-1 ">Sr.No</li>
            <li className="col-span-2 ">Project Name</li>
            <li className="col-span-2 ">Task</li>
            <li className="col-span-2 ">Subtask</li>
            <li className="col-span-3 ">Description</li>
            <li className="col-span-1 ">Duration</li>
            {/* <li className="col-span-1 ">Assigned</li> */}
            <li className="col-span-1 ">Remark</li>
          </ul>
        </motion.div>

        {currentTasks ? (
          <div className=" flex flex-col overflow-scroll h-[78vh]  2xl:h-[50vh] scrollbar-hide ">
            {Object.values(currentTasks).map((task, index) => (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                key={index}
                className={`bg-sky-50 dark:bg-neutral-900 p-2 rounded-md grid grid-cols-12 gap-2 items-start  ${
                  index !== 0 ? "mt-2" : ""
                }`}
              >
                <div className="flex col-span-12 lg:col-span-1 justify-between items-center">
                  {/* <h2 className="flex lg:hidden">Task - </h2> */}
                  <h2 className="py-1.5 px-3 rounded-md bg-sky-100 dark:bg-neutral-950">
                    {task.task}
                  </h2>
                </div>
                <div className="flex col-span-12 lg:col-span-2 justify-between items-center">
                  <h2 className="flex lg:hidden">Project Name - </h2>
                  <h2>{task.projectname}</h2>
                </div>
                <div className="flex col-span-12 lg:col-span-2 justify-between items-center">
                  <h2 className="flex lg:hidden">Task - </h2>
                  <h2>{task.taskname}</h2>
                </div>
                <div className="flex col-span-12 lg:col-span-2 justify-between items-center">
                  <h2 className="flex lg:hidden">Subtask - </h2>
                  <h2>{task.subtask}</h2>
                </div>
                <div className="flex col-span-12 lg:col-span-3 justify-between items-center">
                  <h2 className="flex lg:hidden">Description - </h2>
                  <h2>{task.description}</h2>
                </div>
                <div className="flex col-span-12 lg:col-span-1 justify-between items-center">
                  <h2 className="flex lg:hidden">Duration - </h2>
                  <h2>{task.duration} Hrs</h2>
                </div>
                {/* <div className="flex col-span-12 lg:col-span-1 justify-between items-center">
                  <h2 className="flex lg:hidden">Assigned Date - </h2>
                  <h2>{task.assigneddate}</h2>
                </div> */}
                <div className="flex col-span-12 lg:col-span-1 justify-between items-center">
                  <h2 className="flex lg:hidden">Remark - </h2>
                  <h2
                    className={`lg:text-xs py-1 font-bold lg:my-1.5 bg-${
                      task.remark === 0 ? "orange" : "green"
                    }-200 text-${
                      task.remark === 0 ? "orange" : "green"
                    }-600 flex items-center justify-center px-2 rounded-md`}
                  >
                    {task.remark === 0 ? "Pending" : "Complete"}
                  </h2>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row gap-10 md:gap-0 items-center bg-sky-50 dark:bg-neutral-900 rounded-md p-5 lg:mt-2"
          >
            <div className="md:w-1/2 flex justify-center flex-col items-center gap-4">
              <h2 className="text-lg font-bold">
                No Records for {currentDate}
              </h2>
              <div className="flex items-center gap-3">
                <h2>Try For</h2>
                <button
                  onClick={handleToday}
                  className="bg-sky-800 text-white font-bold py-2 px-4 rounded-md "
                >
                  Today
                </button>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <img src={NotFound} className="w-1/2" alt="No Records Found" />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
