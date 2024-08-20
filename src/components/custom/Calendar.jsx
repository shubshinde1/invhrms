import React, { useState, useEffect } from "react";
import { FormControl, Select, MenuItem } from "@mui/material";
import { IoToday } from "react-icons/io5";
import { FaCaretLeft, FaCaretRight } from "react-icons/fa";
import { createGlobalStyle } from "styled-components";
import { makeStyles } from "@mui/styles";
import classNames from "classnames";

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

const Calendar = ({ onDateChange }) => {
  const classes = useStyles();
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentDate, setCurrentDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: "numeric", month: "long", year: "numeric" };
    return date.toLocaleDateString("en-GB", options);
  };

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
    onDateChange(newDate.toISOString().split("T")[0]); // Pass selected date to parent component
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

  return (
    <div className="relative z-20">
      <div
        onClick={() => setShowCalendar(!showCalendar)}
        className="bg-sky-50 dark:bg-neutral-800 dark:border-neutral-700 rounded-md mt-1"
      >
        <input
          type="text"
          value={formatDate(currentDate)}
          className=" px-3 py-3.5 border rounded-md bg-sky-50 dark:bg-neutral-800 dark:border-neutral-700 cursor-pointer "
          readOnly
        />
        <IoToday
          className="text-stone-500 dark:text-stone-300 absolute top-4 right-4"
          fontSize={20}
        />
      </div>

      {showCalendar && (
        <div className="absolute -ml-5 md:ml-0 z-10 mt-2 p-4 border border-gray-300 rounded-md bg-sky-100 dark:bg-neutral-900 dark:border-neutral-700 shadow-lg">
          <div className="flex items-center justify-between mb-4 gap-2">
            <button
              onClick={() => handleMonthChange(-1)}
              className="p-2 bg-sky-50 rounded-md dark:bg-neutral-800 dark:border-neutral-700 mt-1 group"
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
                  "p-2 border rounded-md dark:bg-neutral-800 dark:border-neutral-700 h-10",
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
                  "p-2 border rounded-md dark:bg-neutral-800 dark:border-neutral-700 h-10",
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
              className="p-2 bg-sky-50 rounded-md dark:bg-neutral-800 dark:border-neutral-700 mt-1 group"
            >
              <FaCaretRight
                fontSize={23}
                className="group-hover:translate-x-1 duration-300"
              />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="font-semibold">
                {day}
              </div>
            ))}
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
  );
};

export default Calendar;
