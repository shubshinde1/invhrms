import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { FaCaretLeft, FaCaretRight } from "react-icons/fa";
import Tooltip from "@mui/material/Tooltip";
import NotFound from "../../assets/images/norecordfound.svg";
import { motion } from "framer-motion";
import { IoTimer } from "react-icons/io5";
import { SiTask } from "react-icons/si";
import { FaSquareCheck } from "react-icons/fa6";
import { TbTimelineEventFilled } from "react-icons/tb";

export default function TimeSheet() {
  const token = localStorage.getItem("accessToken");
  const { userData } = useContext(AuthContext);
  const [currentDate, setCurrentDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [timesheetData, setTimesheetData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [projects, setProjects] = useState([]);

  // Form state
  const [formData, setFormData] = useState({
    employee_id: userData?.employeeData?._id,
    date: currentDate,
    taskName: "",
    subTaskName: "",
    description: "",
    duration: "",
    remark: "",
    project: "",
  });

  // Fetch timesheet data on component mount and date change
  useEffect(() => {
    const fetchTimesheetData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "http://localhost:3000/api/gettimesheetbydate",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              employee_id: userData?.employeeData?._id,
              startDate: currentDate,
              endDate: currentDate,
            }),
          }
        );
        setLoading(false);
        const data = await response.json();
        if (data.success) {
          setTimesheetData(data.data);
          setError(null);
        } else {
          setError(data.msg);
        }
      } catch (error) {
        setError("Failed to fetch timesheet data");
      } finally {
        setLoading(false);
      }
    };

    fetchTimesheetData();
  }, [currentDate, userData?.employeeData?._id]);

  useEffect(() => {
    const getProjectDetails = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/getprojectdetails",
          {
            method: "get",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        if (data.success) {
          setProjects(data.data); // Store project data
          setError(null);
          // Log each project's name and _id
          data.data.forEach((project) => {
            // console.log(
            //   `Project Name: ${project.projectname}, Project ID: ${project._id}`
            // );
          });
        } else {
          setError(data.msg + " " + "From project details");
        }
      } catch (error) {
        setError("Failed to fetch project data");
      } finally {
        setLoading(false);
      }
    };

    getProjectDetails();
  }, []);

  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      date: currentDate,
    }));
  }, [currentDate]);

  // Handle date change
  const handleDateChange = (event) => {
    setCurrentDate(event.target.value);
  };

  // Handle previous date
  const handlePrevDate = () => {
    const prevDate = new Date(
      new Date(currentDate).getTime() - 24 * 60 * 60 * 1000
    )
      .toISOString()
      .split("T")[0];
    setCurrentDate(prevDate);
  };

  // Handle next date
  const handleNextDate = () => {
    const nextDate = new Date(
      new Date(currentDate).getTime() + 24 * 60 * 60 * 1000
    )
      .toISOString()
      .split("T")[0];
    setCurrentDate(nextDate);
  };

  // Handle today button
  const handleToday = () => {
    setCurrentDate(new Date().toISOString().split("T")[0]);
  };

  // Handle form input change
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");

      const response = await fetch("http://localhost:3000/api/filltimesheet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success) {
        setTimesheetData((prevData) => ({
          ...prevData,
          [formData.date]: [...(prevData[formData.date] || []), formData],
        }));
        setFormData({
          employee_id: userData?.employeeData?._id,
          date: currentDate,
          taskName: "",
          subTaskName: "",
          description: "",
          duration: "",
          remark: "",
          project: "",
        });
        setError(null);
        location.reload();
      } else {
        setError(data.msg);
      }
    } catch (error) {
      setError("Failed to submit form");
    } finally {
      setLoading(false);
    }
  };

  //   console.log("Submitting form data:", formData);

  // Calculate total tasks and durations
  const totalTasks = timesheetData[currentDate]
    ? timesheetData[currentDate].length
    : 0;
  const totalDuration = timesheetData[currentDate]
    ? timesheetData[currentDate].reduce(
        (acc, task) => acc + parseFloat(task.duration || 0),
        0
      )
    : 0;

  const totalPendingTasks = timesheetData[currentDate]
    ? timesheetData[currentDate].filter((task) => task.remark === "0").length
    : 0;

  const totalCompletedTasks = timesheetData[currentDate]
    ? timesheetData[currentDate].filter((task) => task.remark === "1").length
    : 0;

  // Render loading and error states
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white dark:bg-neutral-950 dark:text-white p-2 rounded-lg shadow-lg mb-14 flex flex-col gap-2">
      <div className="grid grid-cols-12 gap-2">
        {/* Stats Sections */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.1 }}
          className="col-span-6 lg:col-span-3 border-2 dark:border-0 dark:bg-neutral-900 rounded-lg p-2 flex flex-col gap-3"
        >
          <div className="flex items-center gap-2">
            <div className="bg-sky-200 dark:bg-sky-800 rounded-lg p-3">
              <SiTask
                fontSize={20}
                className="text-sky-600 dark:text-sky-400"
              />
            </div>
            <h2 className="font-bold text-lg">Total Tasks</h2>
          </div>
          <h2 className="flex items-end justify-end text-4xl font-bold text-gray-700 dark:text-gray-300">
            <Tooltip title="Available" placement="top" arrow>
              <span>{totalTasks}</span>
            </Tooltip>
          </h2>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="col-span-6 lg:col-span-3 border-2 dark:border-0 dark:bg-neutral-900 rounded-lg p-2 flex flex-col gap-3"
        >
          <div className="flex items-center gap-2">
            <div className="bg-green-200 dark:bg-green-800 rounded-lg p-3">
              <FaSquareCheck
                fontSize={20}
                className="text-green-500 dark:text-green-300"
              />
            </div>
            <h2 className="font-bold text-lg">Completed Tasks</h2>
          </div>
          <h2 className="flex items-end justify-end text-4xl font-bold text-gray-700 dark:text-gray-300">
            <Tooltip title="Available" placement="top" arrow>
              <span>{totalCompletedTasks}</span>
            </Tooltip>
          </h2>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="col-span-6 lg:col-span-3 border-2 dark:border-0 dark:bg-neutral-900 rounded-lg p-2 flex flex-col gap-3"
        >
          <div className="flex items-center gap-2">
            <div className="bg-orange-200 dark:bg-orange-800 rounded-lg p-3">
              <TbTimelineEventFilled
                fontSize={20}
                className="text-orange-600 dark:text-orange-300"
              />
            </div>
            <h2 className="font-bold text-lg">Pending Tasks</h2>
          </div>
          <h2 className="flex items-end justify-end text-4xl font-bold text-gray-700 dark:text-gray-300">
            <Tooltip title="Available" placement="top" arrow>
              <span>{totalPendingTasks}</span>
            </Tooltip>
          </h2>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="col-span-6 lg:col-span-3 border-2 dark:border-0 dark:bg-neutral-900 rounded-lg p-2 flex flex-col gap-3"
        >
          <div className="flex items-center gap-2">
            <div className="bg-pink-200 dark:bg-pink-800 rounded-lg p-3">
              <IoTimer
                fontSize={20}
                className="text-pink-600 dark:text-pink-400"
              />
            </div>
            <h2 className="font-bold text-lg">Total Time</h2>
          </div>
          <h2 className="flex items-end justify-end text-4xl font-bold text-gray-700 dark:text-gray-300">
            <Tooltip title="Available" placement="top" arrow>
              <span>{totalDuration}</span>
            </Tooltip>
          </h2>
        </motion.div>
      </div>

      {/* Date Navigation */}
      <div className="flex items-center  gap-2 ">
        <button
          onClick={handlePrevDate}
          className="p-2 bg-gray-200 rounded-lg dark:bg-neutral-800 dark:border-neutral-700"
        >
          <FaCaretLeft fontSize={22} />
        </button>
        <input
          type="date"
          value={currentDate}
          onChange={handleDateChange}
          className="p-2 border rounded-lg dark:bg-neutral-800 dark:border-neutral-700"
        />
        <button
          onClick={handleNextDate}
          className="p-2 bg-gray-200 rounded-lg dark:bg-neutral-800 dark:border-neutral-700"
        >
          <FaCaretRight fontSize={22} />
        </button>
        <button
          onClick={handleToday}
          className="p-2 bg-gray-200 rounded-lg dark:bg-neutral-800 dark:border-neutral-700"
        >
          Today
        </button>
      </div>

      {/* Add Record Section */}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-12 gap-2">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            className="col-span-12 lg:col-span-6 border-2 dark:border-0 dark:bg-neutral-900 rounded-lg p-4 flex flex-col gap-4"
          >
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold">Task Name</label>
              <input
                type="text"
                name="taskName"
                value={formData.taskName}
                onChange={handleInputChange}
                className="p-2 border rounded-lg dark:bg-neutral-800 dark:border-neutral-700"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold">Sub Task Name</label>
              <input
                type="text"
                name="subTaskName"
                value={formData.subTaskName}
                onChange={handleInputChange}
                className="p-2 border rounded-lg dark:bg-neutral-800 dark:border-neutral-700"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="p-2 border rounded-lg dark:bg-neutral-800 dark:border-neutral-700"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1 }}
            className="col-span-12 lg:col-span-6 border-2 dark:border-0 dark:bg-neutral-900 rounded-lg p-4 flex flex-col gap-4"
          >
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold">Duration (hours)</label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                className="p-2 border rounded-lg dark:bg-neutral-800 dark:border-neutral-700"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold">Remark</label>
              <select
                name="remark"
                value={formData.remark}
                onChange={handleInputChange}
                className="p-2 border rounded-lg dark:bg-neutral-800 dark:border-neutral-700"
              >
                <option value="0">Pending</option>
                <option value="1">Completed</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold">Project</label>
              <select
                name="project"
                value={formData.project}
                onChange={handleInputChange}
                className="p-2 border rounded-lg dark:bg-neutral-800 dark:border-neutral-700"
              >
                <option value="">Choose value</option>
                {projects.map((project) => (
                  <option key={project._id} value={project._id}>
                    {project.projectname}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="mt-2 p-2 bg-blue-500 text-white rounded-lg dark:bg-blue-700"
            >
              Add Record
            </button>
          </motion.div>
        </div>
      </form>

      {/* Timesheet Records */}
      <div className="m">
        {error && <div className="text-red-500">{error}</div>}
        {timesheetData[currentDate] && timesheetData[currentDate].length > 0 ? (
          <div className="flex flex-col overflow-scroll h-[78vh] md:h-fit scrollbar-hide">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="hidden lg:grid grid-cols-12 mb-2 gap-2 px-2 py-3 bg-sky-100 dark:bg-neutral-800 rounded-md font-bold"
            >
              <div className="col-span-1">Sr.No</div>
              <div className="col-span-2">Project Name</div>
              <div className="col-span-2">Task</div>
              <div className="col-span-2">Subtask</div>
              <div className="col-span-3">Description</div>
              <div className="col-span-1">Duration</div>
              <div className="col-span-1">Remark</div>
            </motion.div>

            {timesheetData[currentDate].map((record, index) => (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                key={index}
                className={`bg-sky-50 dark:bg-neutral-900 p-2 rounded-md grid grid-cols-12 gap-2 items-start ${
                  index !== 0 ? "mt-2" : ""
                }`}
              >
                <div className="flex col-span-12 lg:col-span-1 justify-between items-center">
                  <h2 className="flex lg:hidden">Sr.No - </h2>
                  <h2 className="py-1.5 px-3 rounded-md bg-sky-100 dark:bg-neutral-950">
                    {index + 1}
                  </h2>
                </div>
                <div className="flex col-span-12 lg:col-span-2 justify-between items-center">
                  <h2 className="flex lg:hidden">Project Name - </h2>
                  <h2>{record.project.projectname}</h2>
                </div>
                <div className="flex col-span-12 lg:col-span-2 justify-between items-center">
                  <h2 className="flex lg:hidden">Task - </h2>
                  <h2>{record.taskName}</h2>
                </div>
                <div className="flex col-span-12 lg:col-span-2 justify-between items-center">
                  <h2 className="flex lg:hidden">Subtask - </h2>
                  <h2>{record.subTaskName}</h2>
                </div>
                <div className="flex col-span-12 lg:col-span-3 justify-between items-center">
                  <h2 className="flex lg:hidden">Description - </h2>
                  <h2>{record.description}</h2>
                </div>
                <div className="flex col-span-12 lg:col-span-1 justify-between items-center">
                  <h2 className="flex lg:hidden">Duration - </h2>
                  <h2>{record.duration} hours</h2>
                </div>
                <div className="flex col-span-12 lg:col-span-1 justify-between items-center">
                  <h2 className="flex lg:hidden">Remark - </h2>
                  <h2
                    className={`lg:text-xs py-1 font-bold lg:my-1.5 bg-${
                      record.remark === "0" ? "yellow" : "green"
                    }-200 text-${
                      record.remark === "0" ? "yellow" : "green"
                    }-600 flex items-center justify-center px-2 rounded-md`}
                  >
                    {record.remark === "0" ? "Pending" : "Completed"}
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
            className="flex flex-col md:flex-row gap-10 md:gap-0 items-center bg-sky-50 dark:bg-neutral-900 rounded-md p-5 "
          >
            <div className="md:w-1/2 flex justify-center flex-col items-center gap-4">
              <h2 className="text-lg font-bold">
                No Records for {currentDate}
              </h2>
              <div className="flex items-center gap-3">
                <h2>Try For</h2>
                <button
                  onClick={handleToday}
                  className="bg-sky-800 text-white font-bold py-2 px-4 rounded-md"
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
