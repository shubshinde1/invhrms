import React, { useState, useEffect } from "react";
import empdata from "../../dummydata/leaveData.json";
import classNames from "classnames";
import { useParams } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import { TextField, InputLabel } from "@mui/material";
import ArrowDropDownRoundedIcon from "@mui/icons-material/ArrowDropDownRounded";
import { motion } from "framer-motion";
import { FaCalculator } from "react-icons/fa6";
import { MdSick } from "react-icons/md";
import { BiSolidHappyHeartEyes } from "react-icons/bi";
import { FaHandHoldingHeart } from "react-icons/fa6";
import { MdFestival } from "react-icons/md";
import Tooltip from "@mui/material/Tooltip";

import { makeStyles } from "@mui/styles";
import { createGlobalStyle } from "styled-components";

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
  },
});

const GlobalStyles = createGlobalStyle`
.MuiPaper-root{
  border-radius:10px;
} 
.MuiList-root {
  height: auto;
} 
.MuiMenuItem-root {
    font-family: Euclid;
    font-size: 14px;
    font-weight: bold;
    margin: auto 8px;
    border-radius: 7px;
  }
  .MuiMenuItem-root:hover {
    background-color:#e0f2fe;
    padding-left: 15px;
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

const data = empdata;

export default function Leave() {
  const classes = useStyles();
  const { empid } = useParams();
  const [filterValue, setFilterValue] = useState("all");

  const [totalLeaves, setTotalLeaves] = useState(0);
  const [Leaves, setLeaves] = useState(0);
  const [remainingLeaves, setRemainingLeaves] = useState(0);
  const [leavesRemaining, setLeavesRemaining] = useState(0);
  const [remainingMandatoryHolidays, setremainingMandatoryHolidays] =
    useState(0);
  const [elapsedLeaves, setElapsedLeaves] = useState(0);

  const [totalHolidays, setTotalHolidays] = useState(0);
  const [mandatoryHolidays, setMandatoryHolidays] = useState(0);
  const [totalmandatoryHolidays, settotalmandatoryHolidays] = useState(0);
  const [optionalHolidays, setOptionalHolidays] = useState(0);
  const [avaiableOptionalHoliday, setavaiableOptionalHoliday] = useState(0);
  const [remainingHolidays, setRemainingHolidays] = useState(0);
  const [elapsedHolidays, setElapsedHolidays] = useState(0);

  const [leaveData, setLeaveData] = useState(null);

  const [filteredLeavesCount, setFilteredLeavesCount] = useState(0);

  const employeeData = data.filter((emp) => emp.empid === empid);

  const totalLeavesOfMonth = employeeData.reduce((total, row) => {
    const leaveKeys = Object.keys(row.attendance);
    const totalLeavesForEmployee = leaveKeys.reduce((acc, key) => {
      return acc + row.attendance[key].noofleaves;
    }, 0);
    return total + totalLeavesForEmployee;
  }, 0);

  useEffect(() => {
    let totalLeave = 0;
    let Leave = 0;

    let remainingLeave = 0;
    let leavesRemaining = 0;

    let optionalHoliday = 0;
    let avaiableOptionalHoliday = 0;

    let totalmandatoryHolidays = 0;
    let remainingMandatoryHolidays = 0;

    let elapsedLeave = 0;
    let totalHoliday = 0;
    let mandatoryHoliday = 0;
    let remainingHoliday = 0;
    let elapsedHoliday = 0;

    employeeData.forEach((emp) => {
      totalLeave += emp.leavedata.totalLeaves.total;
      Leave += emp.leavedata.Leaves.total;
      leavesRemaining += emp.leavedata.Leaves.remaining;
      remainingLeave += emp.leavedata.totalLeaves.remaining;
      elapsedLeave += emp.leavedata.totalLeaves.elapsed;

      totalHoliday += emp.leavedata.holidays.total;
      mandatoryHoliday += emp.leavedata.holidays.mandatory;
      optionalHoliday += emp.leavedata.optional.total;
      avaiableOptionalHoliday += emp.leavedata.optional.remaining;
      totalmandatoryHolidays += emp.leavedata.mandatory.total;
      remainingMandatoryHolidays += emp.leavedata.mandatory.remaining;
      remainingHoliday += emp.leavedata.holidays.remaining;
      elapsedHoliday += emp.leavedata.holidays.elapsed;
    });

    setTotalLeaves(totalLeave);
    setLeaves(Leave);
    setRemainingLeaves(remainingLeave);
    setavaiableOptionalHoliday(avaiableOptionalHoliday);
    setLeavesRemaining(leavesRemaining);
    setremainingMandatoryHolidays(remainingMandatoryHolidays);
    setElapsedLeaves(elapsedLeave);

    setTotalHolidays(totalHoliday);
    setMandatoryHolidays(mandatoryHoliday);
    settotalmandatoryHolidays(totalmandatoryHolidays);
    setOptionalHolidays(optionalHoliday);
    setRemainingHolidays(remainingHoliday);
    setElapsedHolidays(elapsedHoliday);

    const filteredLeaves = employeeData.reduce((total, emp) => {
      return (
        total +
        Object.values(emp.attendance)
          .filter((leave) => filterData(leave))
          .reduce((acc, leave) => acc + leave.noofleaves, 0)
      );
    }, 0);
    setFilteredLeavesCount(filteredLeaves);
  }, [employeeData, filterValue]);

  const handleChangeFilter = (event) => {
    setFilterValue(event.target.value);
  };

  const filterData = (leave) => {
    const leaveDate = new Date(leave.from);
    const currentDate = new Date();
    switch (filterValue) {
      case "currentmonth":
        return (
          leaveDate.getMonth() === currentDate.getMonth() &&
          leaveDate.getFullYear() === currentDate.getFullYear()
        );
      case "last3months":
        return leaveDate >= new Date().setMonth(currentDate.getMonth() - 3);
      case "last6months":
        return leaveDate >= new Date().setMonth(currentDate.getMonth() - 6);
      case "last1year":
        return (
          leaveDate >= new Date().setFullYear(currentDate.getFullYear() - 1)
        );
      default:
        return true;
    }
  };

  return (
    <div>
      <Paper
        sx={{ overflow: "hidden" }}
        className="md:w-[100%] w-[calc(100vw-0.8rem)] h-[90%] top-24"
      >
        <div className="p-2 grid grid-cols-11 sm:grid-cols-12 lg:grid-cols-12 gap-2">
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
              <h2 className="font-bold">Total Leaves</h2>
            </div>
            <h2 className="flex items-end justify-end">
              <span className="text-4xl font-bold text-gray-300 cursor-pointer">
                <Tooltip title="Available" placement="top" arrow>
                  <span>{remainingLeaves}</span>
                </Tooltip>
              </span>
              /
              <span className="cursor-pointer">
                <Tooltip title="Total" placement="top" arrow>
                  <span>{totalLeaves}</span>
                </Tooltip>
              </span>
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="col-span-6 lg:col-span-3 border-2 dark:border-0 dark:bg-neutral-900 rounded-md p-2 flex flex-col gap-3"
          >
            <div className="flex items-center gap-2">
              <div className="bg-green-100 rounded-md p-2">
                <BiSolidHappyHeartEyes
                  fontSize={20}
                  className="text-green-500"
                />
              </div>
              <h2 className="font-bold">Leaves</h2>
            </div>
            <h2 className="flex items-end justify-end">
              <span className="text-4xl font-bold text-gray-300 cursor-pointer">
                <Tooltip title="Available" placement="top" arrow>
                  <span>{leavesRemaining}</span>
                </Tooltip>
              </span>
              /
              <span className="cursor-pointer">
                <Tooltip title="Total" placement="top" arrow>
                  <span>{Leaves}</span>
                </Tooltip>
              </span>
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="col-span-6 lg:col-span-3 border-2 dark:border-0 dark:bg-neutral-900 rounded-md p-2 flex flex-col gap-3"
          >
            <div className="flex items-center gap-2">
              <div className="bg-pink-100 rounded-md p-2">
                <MdFestival fontSize={20} className="text-pink-500" />
              </div>
              <h2 className="font-bold">Mandatory Holidays</h2>
            </div>
            <h2 className="flex items-end justify-end">
              <span className="text-4xl font-bold text-gray-300 cursor-pointer">
                <Tooltip title="Mandatory" placement="top" arrow>
                  <span>{remainingMandatoryHolidays}</span>
                </Tooltip>
              </span>
              /
              <span className="cursor-pointer">
                <Tooltip title="Total" placement="top" arrow>
                  <span>{totalmandatoryHolidays}</span>
                </Tooltip>
              </span>
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0 }}
            className="col-span-12 lg:col-span-3 border-2 dark:border-0 dark:bg-neutral-900 rounded-md p-2 flex flex-col gap-3"
          >
            <div className="flex items-center gap-2">
              <div className="bg-yellow-100 rounded-md p-2">
                <MdFestival fontSize={20} className="text-yellow-500" />
              </div>
              <h2 className="font-bold">Optional Holidays</h2>
            </div>
            <h2 className="flex items-end justify-end">
              <span className="text-4xl font-bold text-gray-300 cursor-pointer">
                <Tooltip title="Optional" placement="top" arrow>
                  <span>{avaiableOptionalHoliday}</span>
                </Tooltip>
              </span>
              /
              <span className="cursor-pointer">
                <Tooltip title="Total" placement="top" arrow>
                  <span>{optionalHolidays}</span>
                </Tooltip>
              </span>
            </h2>
          </motion.div>
        </div>
        <div className="mx-2 gap-2  items-center justify-between grid grid-cols-12 ">
          <FormControl
            variant="outlined"
            margin="dense"
            className={classNames(
              "col-span-12 sm:col-span-4 xl:col-span-2",
              classes.root
            )}
          >
            <InputLabel id="leaves-period" className="w-52">
              Leaves Period
            </InputLabel>
            <Select
              labelId="leaves-period"
              id="leaves-period"
              name="Leaves Period"
              value={filterValue}
              onChange={handleChangeFilter}
              label="Leaves Period"
              IconComponent={(props) => (
                <span>
                  <ArrowDropDownRoundedIcon
                    {...props}
                    sx={{
                      fontSize: 40,
                      // backgroundColor: "#CBCBCB",
                      borderRadius: 2,
                    }}
                  />
                </span>
              )}
            >
              <GlobalStyles />
              <MenuItem value="all">All Records</MenuItem>
              <MenuItem value="currentmonth">Current Month</MenuItem>
              <MenuItem value="last3months">Last 3 Months</MenuItem>
              <MenuItem value="last6months">Last 6 Months</MenuItem>
              <MenuItem value="last1year">Last 1 Year</MenuItem>
            </Select>
          </FormControl>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="m-2 pr-4 flex flex-col ">
            <div className="hidden lg:grid grid-cols-12 mb-2 gap-2 px-2 py-3 bg-sky-100 dark:bg-neutral-800 rounded-md font-bold">
              <div className="col-span-2">Leave Type</div>
              <div className="col-span-2">Reason</div>
              <div className="col-span-1">From</div>
              <div className="col-span-1">To</div>
              <div className="col-span-2">No. of Leaves</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Approved By</div>
            </div>

            <div className="flex flex-col overflow-scroll h-[78vh] 2xl:h-[50vh] scrollbar-hide">
              {employeeData.map((emp) =>
                Object.values(emp.attendance)
                  .filter((leave) => filterData(leave))
                  .map((leave, index) => (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      key={index}
                      className={`bg-sky-50 dark:bg-neutral-900 p-2 rounded-md grid grid-cols-12 gap-2 items-start ${
                        index !== 0 ? "mt-2" : ""
                      }`}
                    >
                      <div className="col-span-2">{leave.leavetype}</div>
                      <div className="col-span-2">{leave.reason}</div>
                      <div className="col-span-1">
                        {new Date(leave.from).toLocaleDateString()}
                      </div>
                      <div className="col-span-1">
                        {new Date(leave.to).toLocaleDateString()}
                      </div>
                      <div className="col-span-2">{leave.noofleaves}</div>
                      <div className="col-span-2">
                        {leave.status === 0 ? (
                          <span className="text-red-600 text-xs font-bold bg-red-200 py-1 px-2 rounded-md">
                            Declined
                          </span>
                        ) : leave.status === 1 ? (
                          <span className="text-green-600 text-xs font-bold bg-green-200 py-1 px-2 rounded-md">
                            Approved
                          </span>
                        ) : (
                          <span className="text-orange-600 text-xs font-bold bg-orange-200 py-1 px-2 rounded-md">
                            Pending
                          </span>
                        )}
                      </div>
                      <div className="col-span-2">{leave.approvedby}</div>
                    </motion.div>
                  ))
              )}
              <div className="mt-2 px-4 py-4 font-bold w-full bg-sky-50 dark:bg-neutral-800 rounded-md flex flex-row justify-between sm:justify-start">
                <h2 className="sm:w-2/5">
                  {filterValue === "all"
                    ? "Total Leaves Until"
                    : `Total Leaves in ${filterValue}`}
                </h2>
                <h5 className="sm:ml-16 md:ml-16 lg:ml-32">
                  {filteredLeavesCount}
                </h5>
              </div>
            </div>
          </div>
        </motion.div>
      </Paper>
    </div>
  );
}
