import React, { useState, useEffect } from "react";
import empdata from "./leaveData.json";
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

  const [totalSickLeave, setTotalSickLeave] = useState(0);
  const [totalPrivilegeLeave, setTotalPrivilegeLeave] = useState(0);
  const [totalCasualLeave, setTotalCasualLeave] = useState(0);
  const [totalHoliday, setTotalHoliday] = useState(0);
  const [remainingSickLeave, setRemainingSickLeave] = useState(0);
  const [elapsedSickLeave, setElapsedSickLeave] = useState(0);
  const [remainingPrivilegeLeave, setRemainingPrivilegeLeave] = useState(0);
  const [elapsedPrivilegeLeave, setElapsedPrivilegeLeave] = useState(0);
  const [remainingCasualLeave, setRemainingCasualLeave] = useState(0);
  const [elapsedCasualLeave, setElapsedCasualLeave] = useState(0);
  const [remainingHoliday, setRemainingHoliday] = useState(0);
  const [elapsedHoliday, setElapsedHoliday] = useState(0);
  const [totalAllLeaves, setTotalAllLeaves] = useState(0);
  const [totalAllLeavesRemaining, setTotalAllLeavesRemaining] = useState(0);
  const [totalAllLeavesElapsed, setTotalAllLeavesElapsed] = useState(0);

  const [leaveData, setLeaveData] = useState(null);

  const employeeData = data.filter((emp) => emp.empid === empid);

  const totalLeavesOfMonth = employeeData.reduce((total, row) => {
    const leaveKeys = Object.keys(row.attendance);
    const totalLeavesForEmployee = leaveKeys.reduce((acc, key) => {
      return acc + row.attendance[key].noofleaves;
    }, 0);
    return total + totalLeavesForEmployee;
  }, 0);

  useEffect(() => {
    let sickLeave = 0;
    let privilegeLeave = 0;
    let casualLeave = 0;
    let holiday = 0;

    employeeData.forEach((emp) => {
      sickLeave += emp.leavedata.sickleave.total;
      privilegeLeave += emp.leavedata.privilegeleave.total;
      casualLeave += emp.leavedata.casualleave.total;
      holiday += emp.leavedata.holiday.total;
    });

    setTotalSickLeave(sickLeave);
    setTotalPrivilegeLeave(privilegeLeave);
    setTotalCasualLeave(casualLeave);
    setTotalHoliday(holiday);

    let remainingSick = 0;
    let elapsedSick = 0;
    let remainingPrivilege = 0;
    let elapsedPrivilege = 0;
    let remainingCasual = 0;
    let elapsedCasual = 0;
    let remainingHoliday = 0;
    let elapsedHoliday = 0;

    employeeData.forEach((emp) => {
      remainingSick += emp.leavedata.sickleave.remaining;
      elapsedSick += emp.leavedata.sickleave.elapsed;
      remainingPrivilege += emp.leavedata.privilegeleave.remaining;
      elapsedPrivilege += emp.leavedata.privilegeleave.elapsed;
      remainingCasual += emp.leavedata.casualleave.remaining;
      elapsedCasual += emp.leavedata.casualleave.elapsed;
      remainingHoliday += emp.leavedata.holiday.remaining;
      elapsedHoliday += emp.leavedata.holiday.elapsed;
    });

    setRemainingSickLeave(remainingSick);
    setElapsedSickLeave(elapsedSick);
    setRemainingPrivilegeLeave(remainingPrivilege);
    setElapsedPrivilegeLeave(elapsedPrivilege);
    setRemainingCasualLeave(remainingCasual);
    setElapsedCasualLeave(elapsedCasual);
    setRemainingHoliday(remainingHoliday);
    setElapsedHoliday(elapsedHoliday);

    setTotalAllLeaves(sickLeave + privilegeLeave + casualLeave + holiday);
    setTotalAllLeavesRemaining(
      remainingSick + remainingPrivilege + remainingCasual + remainingHoliday
    );
    setTotalAllLeavesElapsed(
      elapsedSick + elapsedPrivilege + elapsedCasual + elapsedHoliday
    );
  }, [employeeData]);

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
        <div className="p-2 grid grid-cols-11 sm:grid-cols-12 lg:grid-cols-10 gap-2">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="col-span-12 sm:col-span-6 lg:col-span-2 border-2 dark:border-0 dark:bg-neutral-900 rounded-md p-2 flex flex-col gap-3"
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
                  {totalAllLeavesRemaining}
                </Tooltip>
              </span>
              /
              <span className="cursor-pointer">
                <Tooltip title="Total" placement="top" arrow>
                  {totalAllLeaves}
                </Tooltip>
              </span>
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="col-span-6 lg:col-span-2 border-2 dark:border-0 dark:bg-neutral-900 rounded-md p-2 flex flex-col gap-3"
          >
            <div className="flex items-center gap-2">
              <div className="bg-green-100 rounded-md p-2">
                <BiSolidHappyHeartEyes
                  fontSize={20}
                  className="text-green-500"
                />
              </div>
              <h2 className="font-bold">Casual Leave</h2>
            </div>
            <h2 className="flex items-end justify-end">
              <span className="text-4xl font-bold text-gray-300 cursor-pointer">
                <Tooltip title="Available" placement="top" arrow>
                  {remainingCasualLeave}
                </Tooltip>
              </span>
              /
              <span className="cursor-pointer">
                <Tooltip title="Total" placement="top" arrow>
                  {totalCasualLeave}
                </Tooltip>
              </span>
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="col-span-6 lg:col-span-2 border-2 dark:border-0 dark:bg-neutral-900 rounded-md p-2 flex flex-col gap-3"
          >
            <div className="flex items-center gap-2">
              <div className="bg-orange-100 rounded-md p-2">
                <MdSick fontSize={20} className="text-orange-500" />
              </div>
              <h2 className="font-bold">Sick Leave</h2>
            </div>
            <h2 className="flex items-end justify-end">
              <span className="text-4xl font-bold text-gray-300 cursor-pointer">
                <Tooltip title="Available" placement="top" arrow>
                  {remainingSickLeave}
                </Tooltip>
              </span>
              /
              <span className="cursor-pointer">
                <Tooltip title="Total" placement="top" arrow>
                  {totalSickLeave}
                </Tooltip>
              </span>
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="col-span-6 lg:col-span-2 border-2 dark:border-0 dark:bg-neutral-900 rounded-md p-2 flex flex-col gap-3"
          >
            <div className="flex items-center gap-2">
              <div className="bg-red-100 rounded-md p-2">
                <FaHandHoldingHeart fontSize={20} className="text-red-500" />
              </div>
              <h2 className="font-bold">Privilege Leave</h2>
            </div>
            <h2 className="flex items-end justify-end">
              <span className="text-4xl font-bold text-gray-300 cursor-pointer">
                <Tooltip title="Available" placement="top" arrow>
                  {remainingPrivilegeLeave}
                </Tooltip>
              </span>
              /
              <span className="cursor-pointer">
                <Tooltip title="Total" placement="top" arrow>
                  {totalPrivilegeLeave}
                </Tooltip>
              </span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="col-span-6 lg:col-span-2 border-2 dark:border-0 dark:bg-neutral-900 rounded-md p-2 flex flex-col gap-3"
          >
            <div className="flex items-center gap-2">
              <div className="bg-yellow-100 rounded-md p-2">
                <MdFestival fontSize={20} className="text-yellow-500" />
              </div>
              <h2 className="font-bold">Holiday</h2>
            </div>
            <h2 className="flex items-end justify-end">
              <span className="text-4xl font-bold text-gray-300 cursor-pointer">
                <Tooltip title="Available" placement="top" arrow>
                  {remainingHoliday}
                </Tooltip>
              </span>
              /
              <span className="cursor-pointer">
                <Tooltip title="Total" placement="top" arrow>
                  {totalHoliday}
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
          <TableContainer
            component={Paper}
            sx={{ boxShadow: "none" }}
            className="m-2 pr-4 scrollbar-hide"
          >
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell
                    align="left"
                    style={{
                      // backgroundColor: "#f0f9ff",
                      fontWeight: "bold",
                      fontFamily: "Euclid",
                    }}
                  >
                    Leave Type
                  </TableCell>
                  <TableCell
                    align="left"
                    style={{
                      // backgroundColor: "#f0f9ff",
                      fontWeight: "bold",
                      fontFamily: "Euclid",
                    }}
                  >
                    Reason
                  </TableCell>
                  <TableCell
                    align="left"
                    style={{
                      // backgroundColor: "#f0f9ff",
                      fontWeight: "bold",
                      fontFamily: "Euclid",
                    }}
                  >
                    From
                  </TableCell>
                  <TableCell
                    align="left"
                    style={{
                      // backgroundColor: "#f0f9ff",
                      fontWeight: "bold",
                      fontFamily: "Euclid",
                    }}
                  >
                    To
                  </TableCell>

                  <TableCell
                    align="left"
                    style={{
                      // backgroundColor: "#f0f9ff",
                      fontWeight: "bold",
                      fontFamily: "Euclid",
                      width: 150,
                    }}
                  >
                    No. of Leaves
                  </TableCell>

                  <TableCell
                    align="left"
                    style={{
                      // backgroundColor: "#f0f9ff",
                      fontWeight: "bold",
                      fontFamily: "Euclid",
                    }}
                  >
                    Status
                  </TableCell>
                  <TableCell
                    align="left"
                    style={{
                      // backgroundColor: "#f0f9ff",
                      fontWeight: "bold",
                      fontFamily: "Euclid",
                    }}
                  >
                    Approved By
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {employeeData.map((emp) =>
                  Object.values(emp.attendance)
                    .filter((leave) => filterData(leave))
                    .map((leave, index) => (
                      <TableRow key={index}>
                        <TableCell style={{ fontFamily: "Euclid" }}>
                          {leave.leavetype}
                        </TableCell>
                        <TableCell style={{ fontFamily: "Euclid" }}>
                          {leave.reason}
                        </TableCell>
                        <TableCell style={{ fontFamily: "Euclid" }}>
                          {new Date(leave.from).toLocaleDateString()}
                        </TableCell>
                        <TableCell style={{ fontFamily: "Euclid" }}>
                          {new Date(leave.to).toLocaleDateString()}
                        </TableCell>

                        <TableCell style={{ fontFamily: "Euclid" }}>
                          {leave.noofleaves}
                        </TableCell>

                        <TableCell>
                          {leave.status === 0 ? (
                            <span className="text-red-600 euclid text-xs font-bold bg-red-200 py-1 px-2 rounded-md">
                              Declined
                            </span>
                          ) : leave.status === 1 ? (
                            <span className="text-green-600 euclid text-xs font-bold bg-green-200 py-1 px-2 rounded-md">
                              Approved
                            </span>
                          ) : (
                            <span className="text-orange-600 euclid text-xs font-bold bg-orange-200 py-1 px-2 rounded-md">
                              Pending
                            </span>
                          )}
                        </TableCell>

                        <TableCell>{leave.approvedby}</TableCell>
                      </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
            <div className="px-4 py-4 font-bold w-full bg-sky-50 dark:bg-neutral-900 flex flex-row justify-between sm:justify-start">
              <h2 className=" sm:w-3/5 ">Total Leaves in Last</h2>
              <h5 className="sm:ml-16 md:ml-16 lg:-ml-2">
                {totalLeavesOfMonth}
              </h5>
            </div>
          </TableContainer>
        </motion.div>
      </Paper>
    </div>
  );
}
