import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import ApiendPonits from "../../../api/APIEndPoints.json";
import { useParams } from "react-router-dom";
import { FaCaretLeft, FaCaretRight } from "react-icons/fa";
import Tooltip from "@mui/material/Tooltip";
import NotFound from "../../../assets/images/norecordfound.svg";
import { motion } from "framer-motion";
import { IoTimer } from "react-icons/io5";
import { MdTimelapse } from "react-icons/md";
import { SiTask } from "react-icons/si";
import { FaSquareCheck } from "react-icons/fa6";
import { TbTimelineEventFilled } from "react-icons/tb";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Drawer,
  Slider,
  IconButton,
} from "@mui/material";
import classNames from "classnames";
import { createGlobalStyle } from "styled-components";
import { makeStyles } from "@mui/styles";
import ArrowDropDownRoundedIcon from "@mui/icons-material/ArrowDropDownRounded";
import { FaSave } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { MdDelete, MdEdit } from "react-icons/md";
import { FaFaceFrownOpen } from "react-icons/fa6";
import Loading from "../../Loading";
import { IoToday } from "react-icons/io5";
import TimesheetCalendar from "./TimesheetCalendar";
import { MdClose } from "react-icons/md";
import { RiRefreshLine } from "react-icons/ri";
import TruncatedTextWithTooltip from "../../custom/TruncatedTextWithTooltip";

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

const AdminTimeSheet = ({ Id, record, index }) => {
  const { _id } = useParams();

  const classes = useStyles();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const token = localStorage.getItem("accessToken");
  const { userData } = useContext(AuthContext);
  const [currentDate, setCurrentDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [timesheetData, setTimesheetData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const [datesFromApi, setDatesFromApi] = useState(new Set());
  const [timesheetDurations, setTimesheetDurations] = useState({});
  const [showMore, setShowMore] = useState(false);

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
              employee_id: _id,
            }),
          }
        );
        setLoading(false);
        const data = await response.json();

        if (data.success) {
          // Convert API dates to a Set of formatted strings
          const parsedDates = new Set(
            data.dates.map((dateStr) => new Date(dateStr).toDateString())
          );
          setDatesFromApi(parsedDates);
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

  const fetchTimesheetDurationByDate = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${ApiendPonits.baseUrl}${ApiendPonits.endpoints.getTimesheetdurationbydate}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            employee_id: _id,
            year: currentYear,
          }),
        }
      );
      setLoading(false);
      const data = await response.json();

      if (data.success) {
        // Process the API response
        const durationsMap = {};
        const parsedDates = new Set();

        data.data.forEach(({ date, totalDuration }) => {
          const formattedDate = new Date(date).toDateString();
          durationsMap[formattedDate] = totalDuration; // Store duration keyed by date
          parsedDates.add(formattedDate); // Store the date in the parsed set
        });

        setTimesheetDurations(durationsMap);
        setDatesFromApi(parsedDates);
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
  useEffect(() => {
    fetchTimesheetDurationByDate();
  }, [currentYear]);

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
    setDrawerOpen(true);
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
              employee_id: _id,
              date: currentDate,
            }),
          }
        );
        setLoading(false);
        const data = await response.json();

        if (data.success) {
          setTimesheetData(data.data || {});
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
    const today = new Date();

    setCurrentDate(today.toISOString().split("T")[0]);

    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
  };

  // Handle form input change
  // const handleInputChange = (event) => {
  //   const { name, value } = event.target;
  //   setFormData({
  //     ...formData,
  //     [name]: value,
  //   });
  // };

  // Handle form submission
  // const handleSubmit = async (event) => {
  //   event.preventDefault();
  //   try {
  //     setLoading(true);
  //     const token = localStorage.getItem("accessToken");

  //     const response = await fetch(
  //       `${ApiendPonits.baseUrl}${ApiendPonits.endpoints.filltimesheet}`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`,
  //         },
  //         body: JSON.stringify(formData),
  //       }
  //     );
  //     const data = await response.json();
  //     if (data.success) {
  //       setTimesheetData((prevData) => ({
  //         ...prevData,
  //         [formData.date]: [...(prevData[formData.date] || []), formData],
  //       }));
  //       setFormData({
  //         employee_id: userData?.employeeData?._id,
  //         date: currentDate,
  //         taskName: "",
  //         subTaskName: "",
  //         description: "",
  //         duration: "",
  //         remark: "",
  //         project: "",
  //       });
  //       setError(null);
  //       location.reload();
  //     } else {
  //       setError(data.errors || data.msg);
  //       setTimeout(() => {
  //         setError([]);
  //       }, 4500);
  //     }
  //   } catch (error) {
  //     setError("Failed to submit form");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

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

  const checkDate = formData.date;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: "numeric", month: "long", year: "numeric" };
    return date.toLocaleDateString("en-GB", options);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setShowMore(false);
    // setSelectedDate(null);
  };

  const toggleShowMore = () => {
    setShowMore(!showMore);
  };

  return (
    <div className="bg-white dark:bg-neutral-950 p-2 rounded-md flex flex-col gap-2 text-black dark:text-white h-full max-h-full">
      {/* Stats Sections */}
      <div className="grid grid-cols-12 gap-2 h-fit">
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
            <h2 className="font-bold text-sm md:text-lg">Total Tasks</h2>
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
            <h2 className="font-bold text-sm md:text-lg">Completed Tasks</h2>
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
            <h2 className="font-bold text-sm md:text-lg">Pending Tasks</h2>
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
            <h2 className="font-bold text-sm md:text-lg">Total Time</h2>
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
      <div className="flex items-cente gap-2 h-full">
        <div className="relative w-full h-full">
          <div className="w-full h-full p-2 border border-gray-300 rounded-lg bg-white dark:bg-neutral-900 dark:border-neutral-700  shadow-lg flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2 ">
              <div className="flex items-center justify-betwee gap-2 ">
                <button
                  onClick={() => handleMonthChange(-1)}
                  className="p-2 bg-sky-50 rounded-lg dark:bg-neutral-800 dark:border-neutral-700 mt-1 group"
                >
                  <FaCaretLeft
                    fontSize={23}
                    className="group-hover:-translate-x-1 duration-300"
                  />
                </button>
                <div className="flex gap-2">
                  <FormControl
                    variant="outlined"
                    margin="dense"
                    className={classNames(
                      "p-2 border rounded-lg dark:bg-neutral-800 dark:border-neutral-700 h-10",
                      classes.root
                    )}
                  >
                    <Select
                      labelId="month-label"
                      id="month"
                      name="month"
                      value={currentMonth}
                      onChange={handleMonthSelectorChange}
                      IconComponent={(props) => (
                        <ArrowDropDownRoundedIcon
                          {...props}
                          sx={{
                            fontSize: 40,
                            borderRadius: 1,
                          }}
                        />
                      )}
                    >
                      <GlobalStyles />
                      {/* <MenuItem value="">Choose value</MenuItem> */}
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
                    <Select
                      labelId="year-label"
                      id="year"
                      name="year"
                      value={currentYear}
                      onChange={handleYearSelectorChange}
                      IconComponent={(props) => (
                        <ArrowDropDownRoundedIcon
                          {...props}
                          sx={{
                            fontSize: 40,
                            borderRadius: 1,
                          }}
                        />
                      )}
                    >
                      <GlobalStyles />
                      {/* <MenuItem value="">Choose value</MenuItem> */}
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
                <button
                  onClick={handleToday}
                  className="p-2 mt-1 bg-sky-50 rounded-lg dark:bg-neutral-800 dark:border-neutral-700 flex items-center gap-2"
                >
                  Today
                </button>
              </div>
              {/* <button
                onClick={fetchTimesheetDurationByDate}
                className="bg-sky-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 hover:bg-sky-100 p-1.5 rounded-md"
              >
                <RiRefreshLine
                  fontSize={20}
                  className={loading ? "animate-spin" : ""}
                />
              </button> */}
            </div>
            <div className="grid grid-cols-7 gap-1 bg-sky-50 dark:bg-neutral-950 p-2 rounded-md overflow-y-scroll scrollbar-hide h-full">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div
                  key={day}
                  className="font-semibold text-center p-1 hover:bg-sky-100 dark:hover:bg-neutral-800 rounded-md"
                >
                  {day}
                </div>
              ))}
              {Array.from({ length: firstDay }).map((_, index) => (
                <div key={index} />
              ))}
              {Array.from({ length: daysInMonth }).map((_, day) => {
                const date = new Date(currentYear, currentMonth, day + 1); // Create Date object for each day
                const formattedDate = date.toDateString(); // Convert to a formatted date string (e.g., "Thu Dec 19 2024")

                const isGreenBg = datesFromApi.has(formattedDate); // Check if this date has a timesheet
                const duration = timesheetDurations[formattedDate] || 0;

                // Ensure currentDate is a Date object
                const currentDateObject = new Date(currentDate);
                const isCurrentDate =
                  formattedDate === currentDateObject.toDateString();

                return (
                  <div
                    key={day}
                    onClick={isGreenBg ? () => handleDateClick(day) : undefined}
                    className={classNames(
                      "p-1 md:p-2 cursor-pointer rounded-md h-full w-full border dark:border-neutral-800 flex flex-col gap-2 justify-between",
                      {
                        "bg-blue-500/20 text-blue-500 font-bold border border-blue-500/20":
                          isCurrentDate,
                        "bg-green-500/20 text-green-500 font-bold border border-green-500/20":
                          isGreenBg && !isCurrentDate,
                        "hover:bg-sky-100 dark:hover:bg-neutral-800 border border-blue-200 dark:border-neutral-700":
                          !isGreenBg,
                      }
                    )}
                  >
                    <span>{day + 1}</span>
                    {isGreenBg && duration > 0 && (
                      <div className="relative w-full h-ful flex items-center gap-2 justify-betwee">
                        <div className="text-sm  text-gray-700 dark:text-gray-300 flex items-center gap-1 w-1/3">
                          <MdTimelapse
                            size={20}
                            className={classNames("text-2xl", {
                              "text-red-500": duration < 2.5,
                              "text-orange-500":
                                duration >= 2.5 && duration <= 5,
                              "text-yellow-500":
                                duration > 5 && duration <= 7.5,
                              "text-green-500": duration > 7.5,
                            })}
                          />
                          {duration}h
                        </div>
                        <div className=" w-full hidden md:block">
                          <div className="flex my-2 items-center justify-between">
                            <div className="w-full bg-white rounded-lg h-2.5 dark:bg-neutral-700 ">
                              <div
                                className={classNames(
                                  "h-2.5 rounded-lg max-w-full",
                                  {
                                    "bg-red-500": duration < 2.5,
                                    "bg-orange-500":
                                      duration >= 2.5 && duration <= 5,
                                    "bg-yellow-500":
                                      duration > 5 && duration <= 7.5,
                                    "bg-green-500": duration > 7.5,
                                  }
                                )}
                                style={{
                                  width: `${(duration / 10) * 100}%`,
                                }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Timesheet Records in Drawer */}
      <Drawer
        anchor="bottom"
        open={drawerOpen}
        onClose={handleCloseDrawer}
        className="backdrop-blur-sm"
      >
        <div className="p-4 flex flex-col gap-2 dark:text-white bg-sky-50 dark:bg-neutral-900 rounded-t-2xl h-[50vh]">
          <div className="hidde">
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

            {timesheetData[currentDate] &&
            timesheetData[currentDate].length > 0 ? (
              <div className="flex flex-col overflow-scroll h-[78vh] md:h-full scrollbar-hide">
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
                  <div className="col-span-4">Description</div>
                  <div className="col-span-1">Duration</div>
                  <div className="col-span-1">Remark</div>
                  {/* <div className="col-span-1">Action</div> */}
                </motion.div>
                {timesheetData[currentDate].map((record, index) => (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 * index }}
                    key={index}
                    className={`bg-sky-100 dark:bg-neutral-950 p-2 rounded-md grid grid-cols-12 gap-2 items-center ${
                      index !== 0 ? "mt-2" : ""
                    }`}
                  >
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
                    <div className="flex col-span-12 lg:col-span-4 justify-between items-center">
                      <h2 className="flex lg:hidden">Description - </h2>
                      <h2>
                        {/* {showMore
                          ? record.description
                          : record.description?.slice(0, 50)}
                        {record.description?.length > 50 && (
                          <button
                            onClick={toggleShowMore}
                            className="text-blue-500 hover:underline ml-1"
                          >
                            {showMore ? "Show Less" : "Show More"}
                          </button>
                        )} */}
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
                            : record.remark === "1"
                            ? "bg-orange-500/20 text-orange-600"
                            : "bg-green-500/20 text-green-600"
                        }`}
                      >
                        {record.remark === "0"
                          ? "Pending"
                          : record.remark === "1"
                          ? "In Progress"
                          : "Completed"}
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
                className="flex flex-col md:flex-row gap-10 md:gap-0 items-center bg-white dark:bg-neutral-900 rounded-md p-5 "
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
                  <img
                    src={NotFound}
                    className="w-1/2"
                    alt="No Records Found"
                  />
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default AdminTimeSheet;
