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

const TimesheetCalendar = ({
  mandatoryholiday = [],
  optionalholiday = [],
  weekendHoliday = [],
  records = [],
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
  const [timesheetRecords, setTimesheetRecords] = useState(records);

  const classes = useStyles();

  useEffect(() => {
    setCurrentDate(new Date(currentDate).toISOString().split("T")[0]);
  }, [currentDate]);

  const formatFullDate = (date) => {
    const options = { year: "numeric", month: "short", day: "2-digit" };
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
    const details = timesheetRecords.filter(
      (record) =>
        new Date(record.date).getDate() === day + 1 &&
        new Date(record.date).getMonth() === currentMonth &&
        new Date(record.date).getFullYear() === currentYear
    );
    setHolidayDetails(details);
    setSelectedDate(formatFullDate(new Date(currentYear, currentMonth, day)));
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedDate(null);
  };

  return (
    <div className="select-none flex flex-col xl:flex-row justify-between xl:h-[67.5vh] items-start">
      {showCalendar && (
        <div className="justify-en w-full z-10 h-full p-2 border dark:border-none border-gray-300 rounded-lg bg-white dark:bg-neutral-900 dark:border-neutral-700 shadow-lg flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2 h-ful">
            <div className="flex items-center gap-2">
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
          </div>
          <div className="grid grid-cols-7 gap-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
              (day, index) => (
                <div
                  key={index}
                  className="text-center font-semibold text-gray-500 dark:text-gray-300"
                >
                  {day}
                </div>
              )
            )}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateString = formatDate(
                new Date(currentYear, currentMonth, day)
              );
              const holidayDetails = getHolidayDetails(day);
              const backgroundClass = timesheetRecords.some(
                (record) => formatDate(new Date(record.date)) === dateString
              )
                ? "bg-blue-500/20"
                : "";
              return (
                <div
                  key={i}
                  className={classNames(
                    "flex flex-col items-center justify-center h-12 w-12 cursor-pointer rounded-full hover:bg-blue-200/30 transition-all duration-200 text-gray-700 dark:text-gray-200",
                    {
                      "bg-red-500 text-white dark:bg-red-400":
                        holidayDetails.length > 0,
                      [backgroundClass]: backgroundClass,
                    }
                  )}
                  onClick={() => handleDateClick(day)}
                >
                  {day}
                  {holidayDetails.length > 0 && (
                    <span className="text-xs">
                      {holidayDetails.map((holiday, idx) => (
                        <span key={idx} className="block">
                          {holiday.name}
                        </span>
                      ))}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
      {drawerOpen && (
        <Drawer anchor="bottom" open={drawerOpen} onClose={handleCloseDrawer}>
          <div className="p-4 flex flex-col gap-2 dark:text-white bg-sky-100 dark:bg-neutral-900 rounded-t-2xl h-[50vh]">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">{selectedDate}</h2>
              <IconButton onClick={handleCloseDrawer}>
                <MdClose />
              </IconButton>
            </div>
            {holidayDetails.map((record, idx) => (
              <div key={idx} className="mt-4">
                <p>
                  <strong>Project:</strong> {record.projectName}
                </p>
                <p>
                  <strong>Task:</strong> {record.taskName}
                </p>
                <p>
                  <strong>Sub-Task:</strong> {record.subTaskName}
                </p>
                <p>
                  <strong>Description:</strong> {record.description}
                </p>
                <p>
                  <strong>Duration:</strong> {record.duration}
                </p>
                <p>
                  <strong>Remark:</strong> {record.remark}
                </p>
              </div>
            ))}
          </div>
        </Drawer>
      )}
    </div>
  );
};

export default TimesheetCalendar;
