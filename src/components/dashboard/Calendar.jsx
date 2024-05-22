import * as React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { makeStyles } from "@mui/styles";
// import { TiArrowSortedUp } from "react-icons/ti";

// Custom styles
const useStyles = makeStyles({
  root: {
    "& .MuiPickersCalendarHeader-label": {
      fontFamily: "euclid",
      fontSize: 14,
      fontWeight: "bold",
    },
    "& .MuiPickersDay-root": {
      fontFamily: "euclid",
      fontSize: 12,
      fontWeight: "bold",
      borderRadius: 6,
    },
    "& :hover.MuiPickersDay-root": {
      // backgroundColor: "#f0f9ff",
      // color: "white",
    },
    "& :focus.Mui-selected": {
      backgroundColor: "#3C5EFE",
      color: "white",
    },
    "& .MuiPickersDay-today": {
      backgroundColor: "#3C5EFE",
      color: "white",
      boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
    },
    "& :hover.MuiPickersDay-today": {
      backgroundColor: "#3C5EFE",
      color: "white",
    },
    "& .MuiPickersYear-yearButton": {
      borderRadius: 6,
    },
    "& .MuiPickersYear-yearButton ": {
      fontFamily: "euclid",
      fontSize: 14,
    },
    "& .MuiDayCalendar-weekDayLabel": {
      fontFamily: "euclid",
      fontSize: 13,
      fontWeight: "bold",
      // color: "black",
      borderRadius: 6,
      cursor: "pointer",
    },
    // "& .MuiPickersSlideTransition-root": {
    // },
    display: "block",
    width: "100%",
    fontFamily: "Euclid-medium",
  },
});

export default function Calendar() {
  const classes = useStyles();

  return (
    <div className=" flex flex-col  sm:flex-row xl:flex-col justify-start items-start sm:items-stretch sm:justify-between xl:justify-normal ">
      <div className="w-full">
        <LocalizationProvider
          dateAdapter={AdapterDayjs}
          className="dark:text-white"
        >
          <DateCalendar className={`${classes.root} dark:text-white `} />
        </LocalizationProvider>
        
      </div>
      <div className="sm:mr-5 sm:mt-4 xl:mt-2 w-full px-4 sm:w-1/2 xl:w-full">
        <div className="">
          <h2 className=" font-bold ">Upcoming Holidays</h2>
          <div className="mt-2 flex flex-col gap-3 ">
            <div className="flex flex-row items-center gap-5 p-2 rounded-md hover:bg-sky-50 dark:hover:bg-neutral-700 cursor-pointer">
              <div className="flex flex-col relative items-center justify-start bg-sky-50 dark:bg-neutral-900  rounded-md p-3   after:w-8  after:absolute after:h-1.5 after:bg-[#3C5EFE] after:-bottom-0 after:rounded-sm ">
                <h2 className="font-bold">Mar</h2>
                <h2>25</h2>
              </div>
              <div className="flex flex-col gap-1">
                <h2 className="text-base font-bold">Holi</h2>
                <h2>25 - March - 2024 (Monday)</h2>
              </div>
            </div>

            <div className="flex flex-row items-center gap-5 p-2 rounded-md hover:bg-sky-50 dark:hover:bg-neutral-700 cursor-pointer">
              <div className="flex flex-col relative items-center justify-start bg-sky-50 dark:bg-neutral-900  rounded-md p-3 after:w-8  after:absolute after:h-1.5 after:bg-blue-200 dark:after:bg-neutral-600 after:-bottom-0 after:rounded-sm">
                <h2 className="font-bold">Mar</h2>
                <h2>25</h2>
              </div>
              <div className="flex flex-col gap-1">
                <h2 className="text-base font-bold">Holi</h2>
                <h2>25 - March - 2024 (Monday)</h2>
              </div>
            </div>

            <div className="flex flex-row items-center gap-5 p-2 rounded-md hover:bg-sky-50 dark:hover:bg-neutral-700 cursor-pointer">
              <div className="flex flex-col relative items-center justify-start bg-sky-50 dark:bg-neutral-900  rounded-md p-3 after:w-8  after:absolute after:h-1.5 after:bg-blue-200 dark:after:bg-neutral-600 after:-bottom-0 after:rounded-sm">
                <h2 className="font-bold">Mar</h2>
                <h2>25</h2>
              </div>
              <div className="flex flex-col gap-1">
                <h2 className="text-base font-bold">Holi</h2>
                <h2>25 - March - 2024 (Monday)</h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
