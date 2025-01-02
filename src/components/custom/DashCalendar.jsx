import React, { useState, useEffect } from "react";
import {
  FormControl,
  Select,
  MenuItem,
  Drawer,
  IconButton,
} from "@mui/material";
import { FaCaretLeft, FaCaretRight } from "react-icons/fa";
import { createGlobalStyle } from "styled-components";
import { makeStyles } from "@mui/styles";
import classNames from "classnames";
import { BsInfoSquareFill } from "react-icons/bs";
import { MdClose } from "react-icons/md";

const GlobalStyles = createGlobalStyle`
.MuiPaper-root {
  height: fit-content;
  border-radius: 10px;
}
.MuiMenuItem-root {
  font-family: Euclid;
  font-size: 14px;
  font-weight: bold;
  margin: 5px 8px;
  border-radius: 7px;
}
.MuiMenuItem-root:hover {
  background-color: #e0f2fe;
  padding-left: 14px;
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

const DashCalendar = ({
  mandatoryholiday = [],
  optionalholiday = [],
  weekendHoliday = [],
  onDateChange,
}) => {
  const [showCalendar, setShowCalendar] = useState(true);
  const [currentDate, setCurrentDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [holidayDetails, setHolidayDetails] = useState([]);

  const classes = useStyles();

  useEffect(() => {
    setCurrentDate(new Date(currentDate).toISOString().split("T")[0]);
  }, [currentDate]);

  const formatFullDate = (date) => {
    const options = {
      weekday: "long",
      // day: "2-digit",
      // month: "short",
      // year: "2-digit",
    };
    return new Date(date).toLocaleDateString("en-US", options);
  };

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
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
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const years = Array.from({ length: 20 }, (_, i) => currentYear - 10 + i);

  const formatDate = (date) => {
    const d = new Date(date);
    return d.toISOString().split("T")[0];
  };

  const getHolidayDetails = (day) => {
    const date = formatDate(new Date(currentYear, currentMonth, day + 1));
    const holidayDetails = [];
    mandatoryholiday.forEach((h) => {
      if (formatDate(h.date) === date)
        holidayDetails.push({
          type: "mandatory",
          name: h.name,
          greeting: h.greeting,
        });
    });
    optionalholiday.forEach((h) => {
      if (formatDate(h.date) === date)
        holidayDetails.push({
          type: "optional",
          name: h.name,
          greeting: h.greeting,
        });
    });
    weekendHoliday.forEach((h) => {
      if (formatDate(h.date) === date)
        holidayDetails.push({
          type: "weekend",
          name: h.name,
          greeting: h.greeting,
        });
    });
    return holidayDetails;
  };

  const handleDateClick = (day) => {
    const details = getHolidayDetails(day);
    setHolidayDetails(details);
    setSelectedDate(formatFullDate(new Date(currentYear, currentMonth, day)));
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedDate(null);
  };

  const allHolidays = [
    ...mandatoryholiday.map((h) => ({ ...h, type: "mandatory" })),
    ...optionalholiday.map((h) => ({ ...h, type: "optional" })),
    ...weekendHoliday.map((h) => ({ ...h, type: "weekend" })),
  ];

  const upcomingHolidays = allHolidays
    .filter((holiday) => new Date(holiday.date) > new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date));
  // .slice(0, 5);

  const holidayColors = {
    mandatory: "bg-pink-500",
    optional: "bg-yellow-500",
    weekend: "bg-red-500",
  };

  const formatFullDateindd = (date) => {
    const options = { day: "numeric" };
    return new Date(date).toLocaleDateString("en-US", options);
  };
  const formatFullDateinmm = (date) => {
    const options = { month: "short" };
    return new Date(date).toLocaleDateString("en-US", options);
  };

  return (
    <div className="select-none h-screen overflow-y-scroll scrollbar-hide pb-20">
      {showCalendar && (
        <div className="w-full z-10 p-2 h-full overflow-y-scroll scrollbar-hide  border dark:border-none border-gray-300 rounded-lg bg-white dark:text-white dark:bg-neutral-950 dark:border-neutral-700 shadow-lg flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
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
                >
                  <GlobalStyles />
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
                >
                  <GlobalStyles />
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
          <div className="grid grid-cols-7 gap-1">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="font-semibold text-center hover:bg-neutral-800 py-0.5 rounded-md mb-2"
              >
                {day}
              </div>
            ))}
            {Array.from({ length: firstDay }).map((_, index) => (
              <div key={index} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, day) => (
              <div
                key={day}
                onClick={() => handleDateClick(day + 1)}
                className={classNames(
                  "group p-2 rounded-md hover:bg-sky-50 dark:hover:bg-neutral-800 relative border dark:border-neutral-900 border-sky-100 text-center",
                  {
                    "bg-blue-500/15 text-blue-600 font-bold":
                      new Date(currentDate).getDate() === day + 1 &&
                      new Date(currentDate).getMonth() === currentMonth &&
                      new Date(currentDate).getFullYear() === currentYear,
                    "bg-green-500/1 font-bold text-green-500 fontb":
                      new Date(currentYear, currentMonth, day + 1).getDay() ===
                        0 ||
                      new Date(currentYear, currentMonth, day + 1).getDay() ===
                        6,
                  }
                )}
              >
                {day + 1}
                <div className="flex items-center justify-center gap-1 ">
                  {getHolidayDetails(day + 1).length > 0 && (
                    <div className="w-1.5 h-1.5 group-hover:w-full duration-300 flex items-center justify-center bg-blue-500 text-white rounded-full">
                      <span className="text-[0.5rem] font-bold hidden">
                        {getHolidayDetails(day + 1).length}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-2 h-ful overflow-y-scroll scrollbar-hide">
            <h3 className="text-sm font-semibold mb-2">Upcoming Holidays</h3>
            <div className="flex flex-col gap-2 mb h-fit overflow-y-scroll scrollbar-hide">
              {upcomingHolidays.map((holiday, index) => (
                <div
                  key={index}
                  className={classNames(
                    "p-2 rounded-md dark:bg-neutral-900/45 bg-sky-50 hover:bg-sky-100 dark:hover:bg-neutral-900 group"
                  )}
                >
                  <div className="flex gap-2 justify-between items-start">
                    <div className="flex gap-3 items-center">
                      <div className="dark:bg-neutral-950 bg-white group-hover:shadow-xl py-1 px-4 rounded-md flex flex-col items-center">
                        <div className="text-xl font-bold">
                          {formatFullDateindd(holiday.date)}
                        </div>
                        <div className="text-xs">
                          {formatFullDateinmm(holiday.date)}
                        </div>
                        <div
                          className={`w-2 group-hover:w-full duration-500 h-1 rounded-md my-1 ${
                            holidayColors[holiday.type] || "bg-gray-500"
                          }`}
                        ></div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="text-sm font-semibold">
                          {holiday.name}
                        </div>
                        <div className="text-xs">
                          {formatFullDate(holiday.date)}
                        </div>
                      </div>
                    </div>
                    <div
                      className={classNames({
                        "bg-red-500/20 text-red-500 text-xs font-semibold px-1 rounded-md":
                          holiday.type === "weekend",
                        "bg-yellow-500/20 text-yellow-500 text-xs font-semibold px-1 rounded-md":
                          holiday.type === "optional",
                        "bg-pink-500/20 text-pink-500 text-xs font-semibold px-1 rounded-md":
                          holiday.type === "mandatory",
                        // Default or other conditions can be added here
                      })}
                    >
                      {holiday.type}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile view holiday details drawer */}
      <Drawer
        anchor="bottom"
        open={drawerOpen}
        onClose={handleCloseDrawer}
        className="backdrop-blur-sm"
      >
        <div className="p-4 flex flex-col gap-2 dark:text-white bg-sky-100 dark:bg-neutral-900 rounded-t-2xl h-[50vh]">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold ">{selectedDate}</h2>
            <IconButton onClick={handleCloseDrawer}>
              <MdClose fontSize={24} className="dark:text-white " />
            </IconButton>
          </div>
          {holidayDetails.length > 0 ? (
            holidayDetails.map((holiday, index) => (
              <div
                key={index}
                className={classNames({
                  "bg-pink-500/20 text-pink-500 px-2 py-1 rounded-md":
                    holiday.type === "mandatory",
                  "bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded-md":
                    holiday.type === "optional",
                  "bg-red-500/20 text-red-500 px-2 py-1 rounded-md":
                    holiday.type === "weekend",
                })}
              >
                <strong>{holiday.greeting || holiday.name}</strong>
              </div>
            ))
          ) : (
            <div>No holidays on this date.</div>
          )}
        </div>
      </Drawer>
    </div>
  );
};

export default DashCalendar;
