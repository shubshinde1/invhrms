import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import { TextField } from "@mui/material";
import Calendar from "../../custom/Calendar";
import axios from "axios";
import MenuTabs from "../../pim/Menutabs";
import classNames from "classnames";
import { createGlobalStyle } from "styled-components";
import { makeStyles } from "@mui/styles";
import { IoIosRemove, IoIosAdd } from "react-icons/io";
import { FaSave, FaSadTear } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import ApiendPonits from "../../../../src/api/APIEndPoints.json";
import { FaCaretLeft, FaCaretRight } from "react-icons/fa";
import { motion } from "framer-motion";
import NotFound from "../../../assets/images/norecordfound.svg";
import { FaCalculator } from "react-icons/fa6";
import Tooltip from "@mui/material/Tooltip";
import { BsEmojiHeartEyesFill } from "react-icons/bs";
import { MdFestival } from "react-icons/md";

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

const RefillLeaves = () => {
  const classes = useStyles();
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const currentDate = new Date();

  const [totalHolidays, setTotalHolidays] = useState(0);
  const [totalmandatoryHolidays, setTotalMandatoryHolidays] = useState(0);
  const [totaloptionalHolidays, setTotalOptionalHolidays] = useState(0);
  const [totalweekendHolidays, setTotalWeekendHolidays] = useState(0);

  const { userData } = useContext(AuthContext);

  const [optionalHoliday, setOptionalHoliday] = useState([]);
  const [mandatoryHoliday, setMandatoryHoliday] = useState([]);
  const [weekendHoliday, setWeekendHoliday] = useState([]);
  const [holidayData, setHolidayData] = useState(null);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("accessToken");
  const employee_id = userData.employeeData._id;
  const [showAddHolidays, setShowAddHolidays] = useState(false);

  const handleHolidayChange = (setState, state) => (e, index) => {
    const { name, value } = e.target;
    const updatedHolidays = [...state];
    updatedHolidays[index] = { ...updatedHolidays[index], [name]: value };
    setState(updatedHolidays);
  };

  const handleDateChange = (setState, state) => (newDate, index) => {
    const updatedHolidays = [...state];
    updatedHolidays[index] = { ...updatedHolidays[index], date: newDate };
    setState(updatedHolidays);
  };

  const handleAddHoliday = (type) => {
    const holiday = { name: "", date: "", greeting: "" };
    if (type === "optional") {
      setOptionalHoliday([...optionalHoliday, holiday]);
    } else if (type === "mandatory") {
      setMandatoryHoliday([...mandatoryHoliday, holiday]);
    } else if (type === "weekend") {
      setWeekendHoliday([...weekendHoliday, holiday]);
    }
  };

  const handleRemoveHoliday = (type, index) => {
    if (type === "optional") {
      setOptionalHoliday(optionalHoliday.filter((_, i) => i !== index));
    } else if (type === "mandatory") {
      setMandatoryHoliday(mandatoryHoliday.filter((_, i) => i !== index));
    } else if (type === "weekend") {
      setWeekendHoliday(weekendHoliday.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        ApiendPonits.addholidays,
        {
          optionalholiday: optionalHoliday,
          mandatoryholiday: mandatoryHoliday,
          weekendHoliday: weekendHoliday,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Holidays added successfully.");
      location.reload();
    } catch (error) {
      setError("Error adding holidays. Please try again.");
      //   console.error(error);
    }
  };

  useEffect(() => {
    const getHolidaysList = async () => {
      try {
        const response = await fetch(ApiendPonits.viewholidays, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            employee_id,
          }),
        });
        const data = await response.json();
        if (data.success) {
          const currentYearHolidays = {
            mandatoryholiday: data.holidays.mandatoryholiday.filter(
              (holiday) => new Date(holiday.date).getFullYear() === year
            ),
            optionalholiday:
              data.holidays.optionalholiday.optionalholidaylist.filter(
                (holiday) => new Date(holiday.date).getFullYear() === year
              ),
            weekendHoliday: data.holidays.weekendHoliday.filter(
              (holiday) => new Date(holiday.date).getFullYear() === year
            ),
          };
          setHolidayData(currentYearHolidays);
          //   setHolidayData(data.holidays);
        } else {
          setError("Failed to fetch holidays.");
        }
      } catch (error) {
        setError("Error fetching holidays. Please try again.");
        // console.error(error);
      }
    };

    getHolidaysList();
  }, [employee_id, token, year]);

  const handlePrevYear = () => {
    setYear(year - 1);
  };

  const handleNextYear = () => {
    setYear(year + 1);
  };

  //   console.log(holidayData);

  const daysRemaining = (date1, date2) => {
    const diffTime = date1 - date2; // Difference in milliseconds
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convert to days and round up
    return diffDays;
  };

  useEffect(() => {
    if (holidayData) {
      const total =
        holidayData.mandatoryholiday.length +
        holidayData.optionalholiday.length;
      // holidayData.weekendHoliday.length;
      const totalMandatoryHolidays = holidayData.mandatoryholiday.length;
      const totalOptionalHolidays = holidayData.optionalholiday.length;
      const totalWeekendHolidays = holidayData.weekendHoliday.length;
      setTotalHolidays(total);
      setTotalMandatoryHolidays(totalMandatoryHolidays);
      setTotalOptionalHolidays(totalOptionalHolidays);
      setTotalWeekendHolidays(totalWeekendHolidays);
    }
  }, [holidayData]);

  const combinedHolidays =
    holidayData &&
    holidayData.mandatoryholiday &&
    holidayData.optionalholiday &&
    holidayData.weekendHoliday
      ? [
          ...holidayData.mandatoryholiday.map((holiday) => ({
            ...holiday,
            type: "Mandatory",
          })),
          ...holidayData.optionalholiday.map((holiday) => ({
            ...holiday,
            type: "Optional",
          })),
          ...holidayData.weekendHoliday.map((holiday) => ({
            ...holiday,
            type: "Weekend",
          })),
        ]
      : [];

  // Sort holidays by date
  combinedHolidays.sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div>
      <div className="z-10 sticky top-0">
        <MenuTabs />
      </div>

      <div className="bg-white dark:bg-neutral-950 shadow-md rounded-md p-2 dark:text-white flex flex-col gap-2 h-full mb-16 ">
        <div className="grid grid-cols-11 sm:grid-cols-12 lg:grid-cols-12 gap-2">
          {/* total */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="col-span-12 sm:col-span-6 lg:col-span-3 border-2 dark:border-0 dark:bg-neutral-900 rounded-md p-2 flex flex-col gap-3"
          >
            <div className="flex items-center gap-2">
              <div className="bg-sky-200  rounded-md p-2">
                <FaCalculator fontSize={20} className="text-sky-600" />
              </div>
              <h2 className="font-bold">Total Holidays</h2>
            </div>
            <h2 className="flex items-end justify-end">
              <span className="text-4xl font-bold text-gray-300 cursor-pointer">
                <Tooltip title="Total" placement="top" arrow>
                  <span>{totalHolidays}</span>
                </Tooltip>
              </span>
            </h2>
          </motion.div>

          {/* Mandatory Holidays */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="col-span-6 lg:col-span-3 border-2 dark:border-0 dark:bg-neutral-900 rounded-md p-2 flex flex-col gap-3"
          >
            <div className="flex items-center gap-2">
              <div className="bg-orange-100 rounded-md p-2">
                <MdFestival fontSize={20} className="text-orange-500" />
              </div>
              <h2 className="font-bold">Mandatory Holidays</h2>
            </div>
            <h2 className="flex items-end justify-end">
              <span className="text-4xl font-bold text-gray-300 cursor-pointer">
                <Tooltip title="Total" placement="top" arrow>
                  <span>{totalmandatoryHolidays}</span>
                </Tooltip>
              </span>
            </h2>
          </motion.div>

          {/* Optional Holidays */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0 }}
            className="col-span-12 sm:col-span-6 lg:col-span-3 border-2 dark:border-0 dark:bg-neutral-900 rounded-md p-2 flex flex-col gap-3"
          >
            <div className="flex items-center gap-2">
              <div className="bg-green-100 rounded-md p-2">
                <BsEmojiHeartEyesFill
                  fontSize={20}
                  className="text-green-500"
                />
              </div>
              <h2 className="font-bold">Optional Holidays</h2>
            </div>
            <h2 className="flex items-end justify-end">
              <span className="text-4xl font-bold text-gray-300 cursor-pointer">
                <Tooltip title="Total" placement="top" arrow>
                  <span>{totaloptionalHolidays}</span>
                </Tooltip>
              </span>
            </h2>
          </motion.div>

          {/* Weekend Holidays */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="col-span-6 lg:col-span-3 border-2 dark:border-0 dark:bg-neutral-900 rounded-md p-2 flex flex-col gap-3"
          >
            <div className="flex items-center gap-2">
              <div className="bg-red-100 rounded-md p-2">
                <FaSadTear fontSize={20} className="text-red-500" />
              </div>
              <h2 className="font-bold">Weekend Holidays</h2>
            </div>
            <h2 className="flex items-end justify-end">
              <span className="text-4xl font-bold text-gray-300 cursor-pointer">
                <Tooltip title="Total" placement="top" arrow>
                  <span>{totalweekendHolidays}</span>
                </Tooltip>
              </span>
            </h2>
          </motion.div>
        </div>

        {!showAddHolidays && (
          <div>
            {holidayData && (
              <div className="">
                <div className=" z-10 flex flex-col gap-2">
                  <div className="flex items-center gap-2 justify-between select-none">
                    <div className="flex gap-2 items-center">
                      <div
                        onClick={handlePrevYear}
                        className="p-2 bg-sky-100 dark:bg-neutral-800 rounded-md duration-500 flex items-center justify-center"
                      >
                        <FaCaretLeft fontSize={20} />
                      </div>
                      <div className="text-base font-semibold bg-sky-100 dark:dark:bg-neutral-800 py-1.5 px-2.5 rounded-md ">
                        {year}
                      </div>
                      <div
                        onClick={handleNextYear}
                        className="p-2 bg-sky-100 dark:bg-neutral-800 rounded-md duration-500 flex items-center justify-center"
                      >
                        <FaCaretRight fontSize={20} />
                      </div>
                    </div>
                    <button
                      className="text-blue-500 rounded-md hover:bg-blue-500/15 hover:font-bold hover:px-2.5 py-1 duration-300"
                      onClick={() => setShowAddHolidays(true)}
                    >
                      Add holidays for {year + 1}
                    </button>
                  </div>

                  <div className="bg-sky-100 dark:bg-neutral-800 px-2 py-3 rounded-md font-bold">
                    <ul className="grid grid-cols-12">
                      <li className="col-span-3">Holiday type</li>
                      <li className="col-span-3">Holiday Name</li>
                      <li className="col-span-3">Holiday Date</li>
                      <li className="col-span-3">Greeting</li>
                    </ul>
                  </div>

                  {holidayData && (
                    <>
                      {combinedHolidays.length > 0 && (
                        <div className="flex flex-col gap-1">
                          {combinedHolidays.map((holiday) => (
                            <div
                              key={holiday._id}
                              className="bg-sky-50 dark:bg-neutral-900 p-2 rounded-md"
                            >
                              <ul className="grid grid-cols-12">
                                <li className="col-span-3">{holiday.type}</li>
                                <li className="col-span-3">{holiday.name}</li>
                                <li className="col-span-3">
                                  {(() => {
                                    const holidayDate = new Date(holiday.date); // Convert holiday.date to Date object
                                    const today = new Date(); // Current date
                                    const eventDateString =
                                      holidayDate.toDateString(); // Convert holidayDate to a readable string
                                    const todayString = today.toDateString(); // Convert today to a readable string

                                    if (eventDateString === todayString) {
                                      return (
                                        <div className="flex items-center gap-2">
                                          <div className="w-32">
                                            {eventDateString}
                                          </div>
                                          <div
                                            // className={`flex items-center gap-2 p-2 font-bold py-1 rounded-md text-xs bg-orange-500/15 text-orange-500 ${
                                            //   holiday.type === "Mandatory"
                                            //     ? "bg-orange-500/15 text-orange-500"
                                            //     : "bg-orange-500/15 text-orange-500"
                                            // }`}
                                            className="flex items-center gap-2 p-2 font-bold py-1 rounded-md text-xs bg-orange-500/15 text-orange-500"
                                          >
                                            <span>Today</span>
                                            <span className="relative flex h-1.5 w-1.5 items-center justify-center">
                                              <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-orange-400"></span>
                                              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-orange-500"></span>
                                            </span>
                                          </div>
                                        </div>
                                      );
                                    } else if (holidayDate > today) {
                                      const daysDifference = daysRemaining(
                                        holidayDate,
                                        today
                                      );
                                      return (
                                        <div className="flex items-center gap-2">
                                          <div className="w-32">
                                            {eventDateString}
                                          </div>
                                          <div className="bg-green-500/15 px-1.5 py-0.5 rounded-md text-green-500 text-xs">
                                            In {daysDifference} d
                                          </div>
                                        </div>
                                      );
                                    } else {
                                      return (
                                        <div className="flex items-center gap-2">
                                          <div className="w-32">
                                            {eventDateString}
                                          </div>
                                          <span className="bg-red-500/15 px-1.5 py-0.5 rounded-md text-red-500 text-xs">
                                            Old
                                          </span>
                                        </div>
                                      ); // Show the date if it's not in the future
                                    }
                                  })()}
                                </li>
                                <li className="col-span-3">
                                  {holiday.greeting || "NA"}
                                </li>
                              </ul>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {showAddHolidays && (
          <div className="bg-white dark:bg-neutral-950 shadow-md rounded-md p- dark:text-white z-10">
            <div className="grid grid-cols-1 gap-2">
              <div className="flex items-center gap-2 justify-between">
                <h2 className="text-lg font-semibold ">
                  Holidays for {currentYear + 1}
                </h2>
                <div className="flex gap-2">
                  <div
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    className="bg-blue-500/15 hover:bg-blue-500/30 p-1.5 rounded-md text-blue-500 duration-500 flex items-center gap-1 hover:font-bold cursor-default"
                  >
                    <FaSave fontSize={20} />
                    <span>Save</span>
                  </div>
                  <div
                    onClick={() => setShowAddHolidays(false)}
                    className="bg-red-500/15 hover:bg-red-500/30 p-1.5 rounded-md text-red-500 duration-500 flex items-center gap-1 hover:font-bold cursor-default"
                  >
                    <IoClose fontSize={20} />
                    <span>Close</span>
                  </div>
                </div>
              </div>

              <div className="bg-sky-50 dark:bg-neutral-900 p-2 rounded-md">
                <div className="flex gap-2 items-center justify-between">
                  <h2 className="text-base font-semibold ">
                    Mandatory Holidays
                  </h2>
                  <div
                    onClick={() => handleAddHoliday("mandatory")}
                    className="bg-green-500/15 rounded-md cursor-pointer w-fit p-1 text-green-600"
                  >
                    <IoIosAdd fontSize={25} />
                  </div>
                </div>
                {mandatoryHoliday.map((holiday, index) => (
                  <div
                    key={index}
                    className="flex flex-col lg:flex-row gap-2 items-center"
                  >
                    <Calendar
                      onDateChange={(newDate) =>
                        handleDateChange(setMandatoryHoliday, mandatoryHoliday)(
                          newDate,
                          index
                        )
                      }
                      className="mb-2"
                    />
                    <TextField
                      className={classNames(
                        "p-2 border rounded-lg dark:bg-neutral-800 dark:border-neutral-700",
                        classes.root
                      )}
                      id="name"
                      name="name"
                      label="Holiday Name"
                      variant="outlined"
                      margin="dense"
                      value={holiday.name}
                      onChange={(e) =>
                        handleHolidayChange(
                          setMandatoryHoliday,
                          mandatoryHoliday
                        )(e, index)
                      }
                      autoComplete="off"
                    />
                    <TextField
                      className={classNames(
                        "p-2 border rounded-lg dark:bg-neutral-800 dark:border-neutral-700",
                        classes.root
                      )}
                      id="greeting"
                      variant="outlined"
                      margin="dense"
                      label="Greeting"
                      name="greeting"
                      value={holiday.greeting}
                      onChange={(e) =>
                        handleHolidayChange(
                          setMandatoryHoliday,
                          mandatoryHoliday
                        )(e, index)
                      }
                      autoComplete="off"
                    />
                    <div
                      variant="outlined"
                      color="secondary"
                      onClick={() => handleRemoveHoliday("mandatory", index)}
                      className="bg-red-400/15 p-2.5 mt-1 rounded-md text-red-500 cursor-pointer hover:bg-red-500/20"
                    >
                      <IoIosRemove fontSize={30} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-sky-50 dark:bg-neutral-900 p-2 rounded-md">
                <div className="flex gap-2 items-center justify-between">
                  <h2 className="text-base font-semibold ">
                    Optional Holidays
                  </h2>
                  <div
                    onClick={() => handleAddHoliday("optional")}
                    className="bg-green-500/15 rounded-md cursor-pointer w-fit p-1 text-green-600"
                  >
                    <IoIosAdd fontSize={25} />
                  </div>
                </div>
                {optionalHoliday.map((holiday, index) => (
                  <div
                    key={index}
                    className="flex flex-col lg:flex-row gap-2 items-center"
                  >
                    <Calendar
                      onDateChange={(newDate) =>
                        handleDateChange(setOptionalHoliday, optionalHoliday)(
                          newDate,
                          index
                        )
                      }
                      className="bg-red-400"
                    />
                    <TextField
                      className={classNames(
                        "p-2 border rounded-lg dark:bg-neutral-800 dark:border-neutral-700",
                        classes.root
                      )}
                      id="name"
                      name="name"
                      label="Holiday Name"
                      variant="outlined"
                      margin="dense"
                      value={holiday.name}
                      onChange={(e) =>
                        handleHolidayChange(
                          setOptionalHoliday,
                          optionalHoliday
                        )(e, index)
                      }
                      required
                      autoComplete="off"
                    />
                    <TextField
                      className={classNames(
                        "p-2 border rounded-lg dark:bg-neutral-800 dark:border-neutral-700",
                        classes.root
                      )}
                      id="greeting"
                      variant="outlined"
                      margin="dense"
                      label="Greeting"
                      name="greeting"
                      value={holiday.greeting}
                      onChange={(e) =>
                        handleHolidayChange(
                          setOptionalHoliday,
                          optionalHoliday
                        )(e, index)
                      }
                      autoComplete="off"
                    />
                    <div
                      variant="outlined"
                      color="secondary"
                      onClick={() => handleRemoveHoliday("optional", index)}
                      className="bg-red-400/15 p-2.5 mt-1 rounded-md text-red-500 cursor-pointer hover:bg-red-500/20"
                    >
                      <IoIosRemove fontSize={30} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-sky-50 dark:bg-neutral-900 p-2 rounded-md">
                <div className="flex gap-2 items-center justify-between">
                  <h2 className="text-base font-semibold ">Weekend Holidays</h2>
                  <div
                    onClick={() => handleAddHoliday("weekend")}
                    className="bg-green-500/15 rounded-md cursor-pointer w-fit p-1 text-green-600"
                  >
                    <IoIosAdd fontSize={25} />
                  </div>
                </div>
                {weekendHoliday.map((holiday, index) => (
                  <div
                    key={index}
                    className="flex flex-col lg:flex-row gap-2 items-center"
                  >
                    <Calendar
                      onDateChange={(newDate) =>
                        handleDateChange(setWeekendHoliday, weekendHoliday)(
                          newDate,
                          index
                        )
                      }
                      className="mb-2"
                    />
                    <TextField
                      className={classNames(
                        "p-2 border rounded-lg dark:bg-neutral-800 dark:border-neutral-700",
                        classes.root
                      )}
                      id="name"
                      variant="outlined"
                      margin="dense"
                      label="Holiday Name"
                      name="name"
                      value={holiday.name}
                      onChange={(e) =>
                        handleHolidayChange(setWeekendHoliday, weekendHoliday)(
                          e,
                          index
                        )
                      }
                      autoComplete="off"
                    />
                    <TextField
                      className={classNames(
                        "p-2 border rounded-lg dark:bg-neutral-800 dark:border-neutral-700",
                        classes.root
                      )}
                      id="greeting"
                      variant="outlined"
                      margin="dense"
                      label="Greeting"
                      name="greeting"
                      value={holiday.greeting}
                      onChange={(e) =>
                        handleHolidayChange(setWeekendHoliday, weekendHoliday)(
                          e,
                          index
                        )
                      }
                      autoComplete="off"
                    />
                    <div
                      variant="outlined"
                      color="secondary"
                      onClick={() => handleRemoveHoliday("weekend", index)}
                      className="bg-red-400/15 p-2.5 mt-1 rounded-md text-red-500 cursor-pointer hover:bg-red-500/20"
                    >
                      <IoIosRemove fontSize={30} />
                    </div>
                  </div>
                ))}
              </div>

              {error && (
                <div>
                  <p className="text-red-500">{error}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RefillLeaves;
