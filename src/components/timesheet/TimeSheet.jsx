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
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
} from "@mui/material";
import classNames from "classnames";
import { createGlobalStyle } from "styled-components";
import { makeStyles } from "@mui/styles";
import ArrowDropDownRoundedIcon from "@mui/icons-material/ArrowDropDownRounded";
import { FaSave } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { MdDelete, MdEdit } from "react-icons/md";
import { FaFaceFrownOpen } from "react-icons/fa6";
import Loading from "../Loading";
import ApiendPonits from "../../api/APIEndPoints.json";
import { IoToday } from "react-icons/io5";
import TruncatedTextWithTooltip from "../custom/TruncatedTextWithTooltip";

const GlobalStyles = createGlobalStyle`
.MuiPaper-root{
  height:fit-content;
  border-radius:10px;
} 
  .MuiMenuItem-root {
    font-family: Euclid;
    font-size: 14px;
    font-weight: bold;
    margin: 5px 8px;
    border-radius: 7px;
  }
  .MuiMenuItem-root:hover {
    background-color:#e0f2fe;
    padding-left: 14px;
  }
  .MuiMenuItem-root:hover {
    transition-duration: 0.2s;
  }

  ::-webkit-scrollbar {
    display: none;
    -ms-overflow-style: none;
    scrollbar-width: none;
}
`;

const useStyles = makeStyles({
  root: {
    "& .MuiInputLabel-root": {
      fontFamily: "euclid",
      fontSize: 14,
      paddingTop: -2.5,
      fontWeight: "bold",
    },
    "& .MuiInputLabel-root.Mui-focused": {
      fontWeight: "bold",
      fontSize: 15,
    },
    "& .MuiInputBase-root": {
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
    display: "block",
    width: "100%",
    fontFamily: "euclid-medium",
  },
});

export default function TimeSheet({ record, index }) {
  const classes = useStyles();

  const token = localStorage.getItem("accessToken");
  const { userData } = useContext(AuthContext);
  const [currentDate, setCurrentDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [timesheetData, setTimesheetData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [projects, setProjects] = useState([]);

  const [isEditing, setIsEditing] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [taskDetails, setTaskDetails] = useState({
    taskName: "",
    subTaskName: "",
    description: "",
    duration: "",
    remark: "",
    project: "",
  });

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const [datesFromApi, setDatesFromApi] = useState([]);

  useEffect(() => {
    const fetchTimesheetDates = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${ApiendPonits.baseUrl}${ApiendPonits.endpoints.gettimesheetday}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              employee_id: eid.toString(),
            }),
          }
        );
        setLoading(false);
        const data = await response.json();
        if (data.success) {
          const parsedDates = data.dates.map((dateStr) =>
            new Date(dateStr).toDateString()
          );
          setDatesFromApi(new Set(parsedDates));
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

    fetchTimesheetDates();
  }, []);

  useEffect(() => {
    setCurrentDate(new Date(currentDate).toISOString().split("T")[0]);
  }, [currentDate]);

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const handleDateClick = (day) => {
    const newDate = new Date(currentYear, currentMonth, day + 1, 12); // Setting time to noon
    setCurrentDate(newDate.toISOString().split("T")[0]);
    setShowCalendar(false);
  };

  const handleMonthChange = (direction) => {
    const newDate = new Date(currentYear, currentMonth + direction, 1);
    setCurrentMonth(newDate.getMonth());
    setCurrentYear(newDate.getFullYear());
  };

  const handleMonthSelectorChange = (event) => {
    setCurrentMonth(parseInt(event.target.value));
  };

  const handleYearSelectorChange = (event) => {
    setCurrentYear(parseInt(event.target.value));
  };

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const years = Array.from({ length: 20 }, (_, i) => currentYear - 10 + i);

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

  const eid = userData?.employeeData?._id;

  // Fetch timesheet data on component mount and date change
  useEffect(() => {
    const fetchTimesheetData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${ApiendPonits.baseUrl}${ApiendPonits.endpoints.gettimesheet}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              employee_id: eid.toString(),
              date: currentDate,
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
          `${ApiendPonits.baseUrl}${ApiendPonits.endpoints.getprojectdetails}`,
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

      const response = await fetch(
        `${ApiendPonits.baseUrl}${ApiendPonits.endpoints.filltimesheet}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );
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
        setError(data.errors || data.msg);
        setTimeout(() => {
          setError([]);
        }, 4500);
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
    return (
      <div>
        <Loading />
      </div>
    );
  }

  const handleDeleteClick = async (event) => {
    const buttonValue = event.currentTarget.value;

    let timesheetId;
    timesheetData[currentDate].forEach((record) => {
      if (buttonValue) {
        // console.log(buttonValue);
        timesheetId = record.timesheet_id;
        // console.log(record);
      }
    });

    if (!timesheetId) {
      // console.log("Timesheet ID not found for the given task ID");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");

      const response = await fetch(
        `${ApiendPonits.baseUrl}${ApiendPonits.endpoints.deletetimesheet}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            timesheetId: timesheetId,
            taskId: buttonValue,
            date: currentDate,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        location.reload();
      } else {
        setError(data.errors || data.msg);
        setTimeout(() => {
          setError([]);
        }, 4500);
      }
    } catch (error) {
      // console.log("Failed to delete timesheet", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = async (event) => {
    const buttonValue = event.currentTarget.value;

    let timesheetId;
    timesheetData[currentDate].forEach((record) => {
      if (record._id === buttonValue) {
        timesheetId = record.timesheet_id; // Assuming timesheet_id is a string here
        setCurrentTask(record); // Set the current task to pre-fill the form
        setTaskDetails({
          taskName: record.taskName || "",
          subTaskName: record.subTaskName || "",
          description: record.description || "",
          duration: record.duration || "",
          remark: record.remark || "",
          project: record.project || "",
        });
      }
    });

    if (!timesheetId) {
      // console.log("Timesheet ID not found for the given task ID");
      return;
    }

    setIsEditing(true);
  };

  const checkDate = formData.date;

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");

      // console.log("Submitting data:", {
      //   timesheet_id: currentTask?.timesheet_id,
      //   task_id: currentTask?._id,
      //   ...taskDetails,
      // });

      const response = await fetch(
        `${ApiendPonits.baseUrl}${ApiendPonits.endpoints.updatetimesheet}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            timesheet_id: currentTask?.timesheet_id,
            task_id: currentTask?._id,
            date: checkDate,
            ...taskDetails,
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        // console.log("Timesheet updated successfully", data);
        setIsEditing(false);
        location.reload();
      } else {
        setError(data.errors || data.msg);
        setTimeout(() => {
          setError([]);
        }, 4500);
      }
    } catch (error) {
      // console.log("Error updating timesheet", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: "numeric", month: "long", year: "numeric" };
    return date.toLocaleDateString("en-GB", options);
  };

  return (
    <div className="bg-white dark:bg-neutral-950 dark:text-white p-2 rounded-lg shadow-lg mb-14 flex flex-col gap-2">
      {/* Stats Sections */}
      <div className="grid grid-cols-12 gap-2">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.1 }}
          className="col-span-6 lg:col-span-3 border-2 dark:border-0 dark:bg-neutral-900 rounded-lg p-2 flex flex-col gap-3"
        >
          <div className="flex items-center gap-2">
            <div className="bg-sky-200 dark:bg-sky-500/15 rounded-lg p-2">
              <SiTask fontSize={20} className="text-sky-600" />
            </div>
            <h2 className="font-bold text-lg">Total Tasks</h2>
          </div>
          <h2 className="flex items-end justify-end text-4xl font-bold text-gray-700 dark:text-gray-300">
            <Tooltip title="No of tasks" placement="top" arrow>
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
            <div className="bg-green-200 dark:bg-green-500/15 rounded-lg p-2">
              <FaSquareCheck fontSize={20} className="text-green-500" />
            </div>
            <h2 className="font-bold text-lg">Completed Tasks</h2>
          </div>
          <h2 className="flex items-end justify-end text-4xl font-bold text-gray-700 dark:text-gray-300">
            <Tooltip title="No of tasks" placement="top" arrow>
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
            <div className="bg-orange-200 dark:bg-orange-500/15 rounded-lg p-2">
              <TbTimelineEventFilled
                fontSize={20}
                className="text-orange-600"
              />
            </div>
            <h2 className="font-bold text-lg">Pending Tasks</h2>
          </div>
          <h2 className="flex items-end justify-end text-4xl font-bold text-gray-700 dark:text-gray-300">
            <Tooltip title="No of tasks" placement="top" arrow>
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
            <div className="bg-pink-200 dark:bg-pink-500/15 rounded-lg p-2">
              <IoTimer fontSize={20} className="text-pink-600" />
            </div>
            <h2 className="font-bold text-lg">Total Time</h2>
          </div>
          <h2 className="flex items-end justify-end text-4xl font-bold text-gray-700 dark:text-gray-300">
            <Tooltip title="Today's Time" placement="top" arrow>
              <div>
                {totalDuration < 0.5 ? (
                  totalDuration
                ) : (
                  <span>
                    {totalDuration < 1 ? (
                      <span>
                        30<span className="text-sm"> Min</span>
                      </span>
                    ) : (
                      <span>
                        {totalDuration > 1 ? (
                          <span>
                            {totalDuration}
                            <span className="text-sm "> Hours</span>
                          </span>
                        ) : (
                          <span>
                            {totalDuration}
                            <span className="text-sm "> Hour</span>
                          </span>
                        )}
                      </span>
                    )}
                  </span>
                )}
              </div>
            </Tooltip>
          </h2>
        </motion.div>
      </div>

      {/* Date Navigation */}
      <div className="flex items-center  gap-2 ">
        <button
          onClick={handlePrevDate}
          className="p-2 bg-sky-100 rounded-lg dark:bg-neutral-800 dark:border-neutral-700"
        >
          <FaCaretLeft fontSize={22} />
        </button>
        <div className="relative">
          <div
            onClick={() => setShowCalendar(!showCalendar)}
            onChange={(e) => setCurrentDate(e.target.value)}
          >
            <input
              type="text"
              value={formatDate(currentDate)}
              className="p-2 border rounded-lg bg-sky-100 dark:bg-neutral-800 dark:border-neutral-700 cursor-pointer"
              readOnly
            />
            <IoToday
              className="text-blue-500 absolute top-2 right-1.5"
              fontSize={20}
            />
          </div>

          {showCalendar && (
            <div className="absolute -ml-5 md:ml-0  z-10 mt-2 p-4 border border-gray-300 rounded-lg bg-sky-100 dark:bg-neutral-900 dark:border-neutral-700 shadow-lg">
              <div className="flex items-center justify- mb-4 gap-2">
                <button
                  onClick={() => handleMonthChange(-1)}
                  className="p-2 bg-sky-50 rounded-lg dark:bg-neutral-800 dark:border-neutral-700 mt-1 group"
                >
                  <FaCaretLeft
                    fontSize={23}
                    className="group-hover:-translate-x-1 duration-300"
                  />
                </button>
                <div className="flex  gap-2 ">
                  <FormControl
                    variant="outlined"
                    margin="dense"
                    className={classNames(
                      "p-2 border rounded-lg dark:bg-neutral-800 dark:border-neutral-700 h-10",
                      classes.root
                    )}
                  >
                    {/* <InputLabel id="month-label" className="w">
                      Month
                    </InputLabel> */}
                    <Select
                      labelId="month-label"
                      id="month"
                      name="month"
                      // label="Month"
                      IconComponent={(props) => (
                        <ArrowDropDownRoundedIcon
                          {...props}
                          sx={{
                            fontSize: 40,
                            borderRadius: 1,
                          }}
                        />
                      )}
                      value={currentMonth}
                      onChange={handleMonthSelectorChange}
                    >
                      <GlobalStyles />
                      <MenuItem value="">Choose value</MenuItem>
                      {months.map((month, index) => (
                        <MenuItem key={index} value={index}>
                          {month}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl
                    variant="outlined"
                    margin="dense"
                    className={classNames(
                      "p-2 border rounded-lg dark:bg-neutral-800 dark:border-neutral-700 h-10",
                      classes.root
                    )}
                  >
                    {/* <InputLabel id="year-label" className="w-52">
                      Year
                    </InputLabel> */}
                    <Select
                      labelId="year-label"
                      id="year"
                      name="year"
                      // label="Year"
                      IconComponent={(props) => (
                        <ArrowDropDownRoundedIcon
                          {...props}
                          sx={{
                            fontSize: 40,
                            borderRadius: 1,
                          }}
                        />
                      )}
                      value={currentYear}
                      onChange={handleYearSelectorChange}
                    >
                      <GlobalStyles />
                      <MenuItem value="">Choose value</MenuItem>
                      {years.map((year) => (
                        <MenuItem key={year} value={year}>
                          {year}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
                <button
                  onClick={() => handleMonthChange(1)}
                  className="p-2 bg-sky-50 rounded-lg dark:bg-neutral-800 dark:border-neutral-700 mt-1 group"
                >
                  <FaCaretRight
                    fontSize={23}
                    className="group-hover:translate-x-1 duration-300"
                  />
                </button>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day) => (
                    <div key={day} className="font-semibold">
                      {day}
                    </div>
                  )
                )}
                {Array.from({ length: firstDay }).map((_, index) => (
                  <div key={index} />
                ))}
                {Array.from({ length: daysInMonth }).map((_, day) => (
                  <div
                    key={day}
                    onClick={() => handleDateClick(day)}
                    className={classNames(
                      "p-2 cursor-pointer rounded-md hover:bg-sky-50 dark:hover:bg-neutral-800",
                      {
                        "bg-blue-500/15 text-blue-600 font-bold":
                          new Date(currentDate).getDate() === day + 1 &&
                          new Date(currentDate).getMonth() === currentMonth &&
                          new Date(currentDate).getFullYear() === currentYear,
                        "bg-green-300 dark:bg-green-600/15 text-green-600 font-bold":
                          datesFromApi.has(
                            new Date(
                              currentYear,
                              currentMonth,
                              day + 1
                            ).toDateString()
                          ),
                      }
                    )}
                  >
                    {day + 1}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <button
          onClick={handleNextDate}
          className="p-2 bg-sky-100 rounded-lg dark:bg-neutral-800 dark:border-neutral-700"
        >
          <FaCaretRight fontSize={22} />
        </button>
        <button
          onClick={handleToday}
          className="p-2 bg-sky-100 rounded-lg dark:bg-neutral-800 dark:border-neutral-700 flex items-center gap-2 "
        >
          Today
        </button>
      </div>

      {/* Add Record Section */}
      <form onSubmit={handleSubmit}>
        <div className="">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-12 gap-2 border-2 dark:border-0 dark:bg-neutral-900 rounded-lg p-2 items-start"
          >
            <div className="flex flex-col gap-2 col-span-12 sm:col-span-6 lg:col-span-4">
              <FormControl
                variant="outlined"
                margin="dense"
                className={classNames(
                  "p-2 border rounded-lg dark:bg-neutral-800 dark:border-neutral-700",
                  classes.root
                )}
              >
                <InputLabel id="project-label" className="w-52">
                  Project
                </InputLabel>
                <Select
                  labelId="project-label"
                  id="project"
                  name="project"
                  label="Project"
                  IconComponent={(props) => (
                    <ArrowDropDownRoundedIcon
                      {...props}
                      sx={{
                        fontSize: 40,
                        borderRadius: 1,
                      }}
                    />
                  )}
                  value={formData.project}
                  onChange={handleInputChange}
                >
                  <GlobalStyles />
                  <MenuItem value="">Choose value</MenuItem>
                  {projects.map((project) => (
                    <MenuItem key={project._id} value={project._id}>
                      {project.projectname}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div className="relative flex flex-col gap-2 col-span-12 sm:col-span-6 lg:col-span-4">
              <TextField
                className={classNames(
                  "p-2 border rounded-lg dark:bg-neutral-800 dark:border-neutral-700",
                  classes.root
                )}
                id="taskName"
                name="taskName"
                label="Task Name"
                variant="outlined"
                margin="dense"
                value={formData.taskName}
                onChange={handleInputChange}
                autoComplete="off"
                inputProps={{ maxLength: 50 }}
              />
              <div className="absolute text-xs bottom-2 right-2 text-gray-500 mt-1">
                {50 - formData.taskName.length}/50
              </div>
            </div>
            <div className="relative flex flex-col gap-2 col-span-12 sm:col-span-6 lg:col-span-4">
              <TextField
                className={classNames(
                  "p-2 border rounded-lg dark:bg-neutral-800 dark:border-neutral-700",
                  classes.root
                )}
                id="subTaskName"
                name="subTaskName"
                label="Sub Task Name"
                variant="outlined"
                margin="dense"
                value={formData.subTaskName}
                onChange={handleInputChange}
                autoComplete="off"
                inputProps={{ maxLength: 100 }}
              />
              <div className="absolute text-xs bottom-2 right-2 text-gray-500 mt-1">
                {100 - formData.subTaskName.length}/100
              </div>
            </div>
            <div className="relative flex flex-col gap-2 col-span-12 sm:col-span-6 lg:col-span-6">
              <textarea
                name="description"
                value={formData.description}
                rows={2}
                placeholder="description"
                onChange={handleInputChange}
                inputProps={{ maxLength: 250 }}
                className="px-2 py-1 mt-2 border rounded-lg bg-sky-50 dark:bg-neutral-800 dark:border-neutral-700"
              />
              <div className="absolute text-xs bottom-2 right-2 text-gray-500 mt-1">
                {250 - formData.description.length}/250
              </div>
            </div>
            <div className="flex flex-col gap-2 col-span-12 sm:col-span-6 lg:col-span-2">
              {/* <TextField
                className={classNames(
                  "p-2 border rounded-lg dark:bg-neutral-800 dark:border-neutral-700",
                  classes.root
                )}
                id="duration"
                name="duration"
                label="Duration"
                variant="outlined"
                margin="dense"
                value={formData.duration}
                onChange={handleInputChange}
                autoComplete="off"
              /> */}
              <FormControl
                variant="outlined"
                margin="dense"
                className={classNames(
                  "p-2 border rounded-lg dark:bg-neutral-800 dark:border-neutral-700",
                  classes.root
                )}
              >
                <InputLabel id="duration-label" className="w-52">
                  Duration
                </InputLabel>
                <Select
                  labelId="duration-label"
                  id="duration"
                  name="duration"
                  label="Duration"
                  IconComponent={(props) => (
                    <ArrowDropDownRoundedIcon
                      {...props}
                      sx={{
                        fontSize: 40,
                        borderRadius: 1,
                      }}
                    />
                  )}
                  value={formData.duration}
                  onChange={handleInputChange}
                >
                  <GlobalStyles />
                  <MenuItem value="0.5">30 Min</MenuItem>
                  <MenuItem value="1">1 Hour</MenuItem>
                  <MenuItem value="1.5">1 Hour 30 Min</MenuItem>
                  <MenuItem value="2">2 Hour</MenuItem>
                  <MenuItem disabled>Duration Limit is 2hr max</MenuItem>
                  {/* <MenuItem value="2.5">2 Hour 30 Min</MenuItem>
                  <MenuItem value="3">3 Hour</MenuItem> */}
                </Select>
              </FormControl>
            </div>
            <div className="flex flex-col gap-2 col-span-12 sm:col-span-6 lg:col-span-2">
              <FormControl
                variant="outlined"
                margin="dense"
                className={classNames(
                  "p-2 border rounded-lg dark:bg-neutral-800 dark:border-neutral-700",
                  classes.root
                )}
              >
                <InputLabel id="remark-label" className="w-52">
                  Remark
                </InputLabel>
                <Select
                  labelId="remark-label"
                  id="remark"
                  name="remark"
                  label="Remark"
                  IconComponent={(props) => (
                    <ArrowDropDownRoundedIcon
                      {...props}
                      sx={{
                        fontSize: 40,
                        borderRadius: 1,
                      }}
                    />
                  )}
                  value={formData.remark}
                  onChange={handleInputChange}
                >
                  <GlobalStyles />
                  <MenuItem value="">Choose Status</MenuItem>
                  <MenuItem value="0" className="flex gap-2">
                    <span className="w-3 h-2 bg-red-500 rounded-md"></span>
                    Pending
                  </MenuItem>
                  <MenuItem value="1" className="flex gap-2">
                    <span className="w-3 h-2 bg-green-500 rounded-md"></span>
                    Completed
                  </MenuItem>
                </Select>
              </FormControl>
            </div>
            <button
              className="col-span-12 sm:col-span-12 lg:col-span-2 mt-1.5 px-2 py-3.5 bg-blue-500/15 text-blue-500 font-bold text-[1rem] rounded-lg   flex items-center justify-center gap-2"
              type="submit"
            >
              <FaSave fontSize={20} />
              Save
            </button>
          </motion.div>
        </div>
      </form>

      {/* Timesheet Records */}
      <div className="">
        {error && (
          <div className="absolute bottom-0 right-0 m-4 flex flex-col gap-2 z-50">
            {(Array.isArray(error) ? error : [error]).map((err, index) => (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 6000,
                  damping: 30,
                  duration: 0.3,
                }}
                key={index}
                className="font-bold bg-red-300 dark:bg-black dark:border-2 border-red-950/45 p-3 rounded-lg flex items-center gap-2"
              >
                <div className="text-red-600 p-1 rounded-lg">
                  <FaFaceFrownOpen fontSize={22} />
                </div>
                {err.msg || err}
              </motion.div>
            ))}
          </div>
        )}

        {timesheetData[currentDate] && timesheetData[currentDate].length > 0 ? (
          <div className="flex flex-col overflow-scroll h-[78vh] md:h-fit scrollbar-hide">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="hidden lg:grid grid-cols-12 mb-2 gap-2 px-2 py-3 bg-sky-100 dark:bg-neutral-800 rounded-md font-bold"
            >
              <div className="col-span-1">Sr.No</div>
              <div className="col-span-1">Project Name</div>
              <div className="col-span-2">Task</div>
              <div className="col-span-2">Subtask</div>
              <div className="col-span-3">Description</div>
              <div className="col-span-1">Duration</div>
              <div className="col-span-1">Remark</div>
              <div className="col-span-1">Action</div>
            </motion.div>

            {timesheetData[currentDate].map((record, index) => (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                key={index}
                className={`bg-sky-100 dark:bg-neutral-900 p-2 rounded-md grid grid-cols-12 gap-2 items-center ${
                  index !== 0 ? "mt-2" : ""
                }`}
              >
                {isEditing && currentTask?._id === record?._id ? (
                  // Render the form if editing the current record
                  <form onSubmit={handleFormSubmit} className="col-span-12">
                    <div className="grid grid-cols-12 gap-2">
                      <div className="flex col-span-12 lg:col-span-1 justify-between items-center">
                        <h2 className="flex lg:hidden">Sr.No - </h2>
                        <h2 className="py-1.5 px-3 rounded-md bg-sky-100 dark:bg-neutral-950">
                          {index + 1}
                        </h2>
                      </div>

                      <div className=" col-span-12 lg:col-span-1">
                        <FormControl
                          variant="outlined"
                          margin="dense"
                          className={classNames(
                            "p-2 border rounded-lg dark:bg-neutral-800 dark:border-neutral-700",
                            classes.root
                          )}
                        >
                          <InputLabel id="project-label" className="w-52">
                            Project
                          </InputLabel>
                          <Select
                            labelId="project-label"
                            id="project"
                            name="project"
                            label="Project"
                            IconComponent={(props) => (
                              <ArrowDropDownRoundedIcon
                                {...props}
                                sx={{
                                  fontSize: 40,
                                  borderRadius: 1,
                                }}
                              />
                            )}
                            value={taskDetails.project}
                            onChange={(e) =>
                              setTaskDetails({
                                ...taskDetails,
                                project: e.target.value,
                              })
                            }
                            required
                          >
                            <GlobalStyles />
                            <MenuItem value="">Choose value</MenuItem>
                            {projects.map((project) => (
                              <MenuItem key={project._id} value={project._id}>
                                {project.projectname}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </div>

                      <div className=" col-span-12 lg:col-span-2">
                        <TextField
                          className={classNames(
                            "p-2 border rounded-lg dark:bg-red-800 dark:border-neutral-700",
                            classes.root
                          )}
                          id="taskName"
                          name="taskName"
                          label="Task Name"
                          variant="outlined"
                          margin="dense"
                          value={taskDetails.taskName}
                          onChange={(e) =>
                            setTaskDetails({
                              ...taskDetails,
                              taskName: e.target.value,
                            })
                          }
                          required
                          autoComplete="off"
                        />
                      </div>

                      <div className=" col-span-12 lg:col-span-2">
                        <TextField
                          className={classNames(
                            "p-2 border rounded-lg dark:bg-neutral-800 dark:border-neutral-700",
                            classes.root
                          )}
                          id="subTaskName"
                          name="subTaskName"
                          label="Sub Task Name"
                          variant="outlined"
                          margin="dense"
                          value={taskDetails.subTaskName}
                          onChange={(e) =>
                            setTaskDetails({
                              ...taskDetails,
                              subTaskName: e.target.value,
                            })
                          }
                          autoComplete="off"
                        />
                      </div>

                      <div className=" col-span-12 lg:col-span-3">
                        <textarea
                          name="description"
                          rows={2}
                          placeholder="description"
                          value={taskDetails.description}
                          onChange={(e) =>
                            setTaskDetails({
                              ...taskDetails,
                              description: e.target.value,
                            })
                          }
                          required
                          className="px-2 py-1 mt-2 w-full border rounded-lg dark:bg-neutral-800 dark:border-neutral-700"
                        />
                      </div>

                      <div className=" col-span-12 lg:col-span-1">
                        {/* <TextField
                          className={classNames(
                            "p-2 border rounded-lg dark:bg-neutral-800 dark:border-neutral-700",
                            classes.root
                          )}
                          id="duration"
                          name="duration"
                          label="Duration"
                          variant="outlined"
                          margin="dense"
                          value={taskDetails.duration}
                          onChange={(e) =>
                            setTaskDetails({
                              ...taskDetails,
                              duration: e.target.value,
                            })
                          }
                          required
                          autoComplete="off"
                        /> */}
                        <FormControl
                          variant="outlined"
                          margin="dense"
                          className={classNames(
                            "p-2 border rounded-lg dark:bg-neutral-800 dark:border-neutral-700",
                            classes.root
                          )}
                        >
                          <InputLabel id="duration-label" className="w-52">
                            Duration
                          </InputLabel>
                          <Select
                            labelId="duration-label"
                            id="duration"
                            name="duration"
                            label="Duration"
                            IconComponent={(props) => (
                              <ArrowDropDownRoundedIcon
                                {...props}
                                sx={{
                                  fontSize: 40,
                                  borderRadius: 1,
                                }}
                              />
                            )}
                            value={taskDetails.duration}
                            onChange={(e) =>
                              setTaskDetails({
                                ...taskDetails,
                                duration: e.target.value,
                              })
                            }
                            required
                          >
                            <GlobalStyles />
                            <MenuItem value="0.5">30 Min</MenuItem>
                            <MenuItem value="1">1 Hour</MenuItem>
                            <MenuItem value="1.5">1 Hour 30 Min</MenuItem>
                            <MenuItem value="2">2 Hour</MenuItem>
                            <MenuItem disabled>
                              Duration Limit is 2hr max
                            </MenuItem>
                            {/* <MenuItem value="2.5">2 Hour 30 Min</MenuItem>
                            <MenuItem value="3">3 Hour</MenuItem> */}
                          </Select>
                        </FormControl>
                      </div>

                      <div className=" col-span-12 lg:col-span-1">
                        <FormControl
                          variant="outlined"
                          margin="dense"
                          className={classNames(
                            "p-2 border rounded-lg dark:bg-neutral-800 dark:border-neutral-700",
                            classes.root
                          )}
                        >
                          <InputLabel id="remark-label" className="w-52">
                            Remark
                          </InputLabel>
                          <Select
                            labelId="remark-label"
                            id="remark"
                            name="remark"
                            label="Remark"
                            IconComponent={(props) => (
                              <ArrowDropDownRoundedIcon
                                {...props}
                                sx={{
                                  fontSize: 40,
                                  borderRadius: 1,
                                }}
                              />
                            )}
                            value={taskDetails.remark}
                            onChange={(e) =>
                              setTaskDetails({
                                ...taskDetails,
                                remark: e.target.value,
                              })
                            }
                            required
                          >
                            <GlobalStyles />
                            <MenuItem value="">Choose Status</MenuItem>
                            <MenuItem value="0" className="flex gap-2">
                              <span className="w-3 h-2 bg-red-500 rounded-md"></span>
                              Pending
                            </MenuItem>
                            <MenuItem value="1" className="flex gap-2">
                              <span className="w-3 h-2 bg-green-500 rounded-md"></span>
                              Completed
                            </MenuItem>
                          </Select>
                        </FormControl>
                      </div>

                      <div className="flex gap-2 col-span-12 lg:col-span-1 items-center">
                        <button
                          type="submit"
                          className="bg-blue-500/15 text-blue-500 font-bold p-1.5 h-fit rounded-md "
                        >
                          <FaSave />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsEditing(false);
                            // Optionally reset taskDetails to its initial state if needed
                          }}
                          className="bg-red-500/15 text-red-500 font-bold p-1.5 h-fit rounded-md "
                        >
                          <IoClose />
                        </button>
                      </div>
                    </div>
                  </form>
                ) : (
                  // Render the existing content if not editing
                  <>
                    <div className="flex col-span-12 lg:col-span-1 justify-between items-center">
                      <h2 className="flex lg:hidden">Sr.No - </h2>
                      <h2 className="py-1.5 px-3 rounded-md bg-sky-100 dark:bg-neutral-950">
                        {index + 1}
                      </h2>
                    </div>
                    <div className="flex col-span-12 lg:col-span-1 justify-between items-center">
                      <h2 className="flex lg:hidden">Project Name - </h2>
                      <h2>{record.project.projectname}</h2>
                    </div>
                    <div className="flex col-span-12 lg:col-span-2 justify-between items-center">
                      <h2 className="flex lg:hidden">Task - </h2>
                      <h2>
                        <TruncatedTextWithTooltip
                          text={record.taskName}
                          maxLength={10}
                        />
                      </h2>
                    </div>
                    <div className="flex col-span-12 lg:col-span-2 justify-between items-center">
                      <h2 className="flex lg:hidden">Subtask - </h2>
                      <h2>
                        <TruncatedTextWithTooltip
                          text={record.subTaskName}
                          maxLength={10}
                        />
                      </h2>
                    </div>
                    <div className="flex col-span-12 lg:col-span-3 justify-between items-center">
                      <h2 className="flex lg:hidden">Description - </h2>
                      <h2>
                        <TruncatedTextWithTooltip
                          text={record.description}
                          maxLength={40}
                        />
                      </h2>
                    </div>
                    <div className="flex col-span-12 lg:col-span-1 justify-between items-center">
                      <h2 className="flex lg:hidden">Duration - </h2>
                      <h2>
                        {record.duration < 1 ? (
                          <span>
                            30 <span className="text-sm">Min</span>
                          </span>
                        ) : (
                          <span>
                            {record.duration}
                            <span className="text-sm"> Hour</span>
                          </span>
                        )}
                      </h2>
                    </div>
                    <div className="flex col-span-12 lg:col-span-1 justify-between items-center">
                      <h2 className="flex lg:hidden">Remark - </h2>
                      <h2
                        className={`lg:text-xs py-1 font-bold lg:my-1.5 flex items-center justify-center px-2 rounded-md ${
                          record.remark === "0"
                            ? "bg-red-500/20 text-red-600"
                            : "bg-green-500/20 text-green-600"
                        }`}
                      >
                        {record.remark === "0" ? "Pending" : "Completed"}
                      </h2>
                    </div>
                    <div className="flex gap-2 col-span-12 lg:col-span-1 items-center">
                      <button
                        value={record?._id} // Ensure record._id is not undefined
                        onClick={handleEditClick}
                        className="bg-blue-500/15 text-blue-500 font-bold p-1.5 rounded-md"
                      >
                        <MdEdit />
                      </button>
                      <button
                        value={record?._id} // Ensure record._id is not undefined
                        onClick={handleDeleteClick}
                        className="bg-red-500/15 text-red-500 font-bold p-1.5 rounded-md"
                      >
                        <MdDelete />
                      </button>
                    </div>
                  </>
                )}
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
