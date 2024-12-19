import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import Loading from "../Loading";
import { FaCaretDown, FaSyncAlt } from "react-icons/fa"; // Import the refresh icon
import { RiRefreshLine } from "react-icons/ri";
import { MdDelete } from "react-icons/md";
import { motion } from "framer-motion";
import {
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
import { FaCalendarDays } from "react-icons/fa6";
import { FaStopwatch } from "react-icons/fa6";
import { FaCalendarCheck } from "react-icons/fa6";
import { FaCalendarXmark } from "react-icons/fa6";
import ApiendPonits from "../../../src/api/APIEndPoints.json";

import NotFound from "../../assets/images/norecordfound.svg";

const GlobalStyles = createGlobalStyle`
.MuiPaper-root{
  height:fit-content;
  border-radius:10px;
} 
  .MuiMenuItem-root {
    font-family: Euclid;
    font-size: 13px;
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

const LeaveHistory = () => {
  const classes = useStyles();

  const { userData } = useContext(AuthContext);
  const token = localStorage.getItem("accessToken");
  const employee_id = userData?.employeeData._id;

  const [leavehistory, setLeaveHistory] = useState([]);
  const [errors, setErrors] = useState("");
  const [expandedIndex, setExpandedIndex] = useState(null); // Track the expanded card
  const [loading, setLoading] = useState(false); // Track loading state
  const [selectedMonth, setSelectedMonth] = useState("all"); // Track selected month
  const [selectedStatus, setSelectedStatus] = useState("all"); // Track selected status
  const [message, setMessage] = useState("");

  const formatDate = (dateString) => {
    const options = { weekday: "short", day: "2-digit", month: "short" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const getLeaveHistory = async () => {
    setLoading(true); // Start loading
    try {
      const response = await fetch(
        `${ApiendPonits.baseUrl}${ApiendPonits.endpoints.employeeleavehistory}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            employee_id,
          }),
        }
      );
      const data = await response.json();

      if (data.success) {
        setLeaveHistory(data.leavehistory);
      } else {
        setErrors(data.msg || "Failed to fetch leave history.");
      }
    } catch (error) {
      setErrors(error.message || "Error fetching leave history.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    if (employee_id) {
      getLeaveHistory();
    }
  }, [employee_id, token]);

  const handleDelete = async (applicationId) => {
    try {
      const response = await fetch(
        `${ApiendPonits.baseUrl}${ApiendPonits.endpoints.deleteleaveapplication}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            applicationId,
            Employee_id: employee_id,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setLeaveHistory((prevHistory) =>
          prevHistory.filter((record) => record._id !== applicationId)
        );
        setMessage("Record Deleted Succesfully");
        setTimeout(() => setMessage(""), 4000);
      } else {
        setErrors(data.msg || "Failed to delete leave application.");
      }
    } catch (error) {
      setErrors(error.message || "Error deleting leave application.");
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 0:
        return "py-1 px-2 rounded-md text-xs bg-yellow-500/20 text-yellow-500 font-semibold";
      case 1:
        return "py-1 px-2 rounded-md text-xs bg-green-500/20 text-green-500 font-semibold";
      case 2:
        return "py-1 px-2 rounded-md text-xs bg-red-500/20 text-red-500 font-semibold";
      default:
        return "";
    }
  };

  const toggleMoreInfo = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const filterHistory = () => {
    return leavehistory.filter((record) => {
      const recordMonth = new Date(record.fromdate).getMonth() + 1; // Months are 0-based
      const recordStatus = record.applicationstatus;

      const monthFilter =
        selectedMonth === "all" || parseInt(selectedMonth, 10) === recordMonth;
      const statusFilter =
        selectedStatus === "all" ||
        parseInt(selectedStatus, 10) === recordStatus;

      return monthFilter && statusFilter;
    });
  };

  // Count the statuses
  const statusCounts = leavehistory.reduce(
    (acc, record) => {
      acc.all += 1;
      if (record.applicationstatus === 0) acc.awaiting += 1;
      if (record.applicationstatus === 1) acc.approved += 1;
      if (record.applicationstatus === 2) acc.declined += 1;
      return acc;
    },
    { all: 0, awaiting: 0, approved: 0, declined: 0 }
  );

  return (
    <div className="p-2 border dark:border-none dark:bg-neutral-900 rounded-md h-[67.5vh] overflow-hidden pb-12">
      <div className="flex gap-2 items-start justify-between mb-2">
        {/* <h2 className="text-lg font-bold">Leave History</h2> */}

        <div className="flex gap-2 items-center">
          {/* <FormControl
            variant="outlined"
            margin="dense"
            className={classNames(
              "p-2 border rounded-lg dark:bg-neutral-800 dark:border-neutral-700",
              classes.root
            )}
          >
            <InputLabel id="Month-label" className="w-fit">
              Month
            </InputLabel>
            <Select
              labelId="Month-label"
              id="Month"
              name="Month"
              label="Month"
              IconComponent={(props) => (
                <ArrowDropDownRoundedIcon
                  {...props}
                  sx={{
                    fontSize: 40,
                    borderRadius: 1,
                  }}
                />
              )}
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              <GlobalStyles />
              <MenuItem value="all">All Months</MenuItem>
              {[...Array(12).keys()].map((month) => (
                <MenuItem key={month + 1} value={month + 1}>
                  {new Date(0, month).toLocaleString("default", {
                    month: "long",
                  })}
                </MenuItem>
              ))}
            </Select>
          </FormControl> */}

          {/* <FormControl
            variant="outlined"
            margin="dense"
            className={classNames(
              "p-2 border rounded-lg dark:bg-neutral-800 dark:border-neutral-700",
              classes.root
            )}
          >
            <InputLabel id="Status-label" className="w-fit">
              Status
            </InputLabel>
            <Select
              labelId="Status-label"
              id="Status"
              name="Status"
              label="Status"
              IconComponent={(props) => (
                <ArrowDropDownRoundedIcon
                  {...props}
                  sx={{
                    fontSize: 40,
                    borderRadius: 1,
                  }}
                />
              )}
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <GlobalStyles />
              <MenuItem value="all">All Statuses</MenuItem>
              <MenuItem value="0">Awaiting</MenuItem>
              <MenuItem value="1">Approved</MenuItem>
              <MenuItem value="2">Declined</MenuItem>
            </Select>
          </FormControl> */}
          <div className="flex gap-1 bg-sky-100 dark:bg-neutral-950 p-1 rounded-md text-xs">
            <button
              onClick={() => setSelectedStatus("all")}
              className={classNames(
                "px-1.5 py-1 rounded-md h-fit  flex items-end gap-1",
                selectedStatus === "all"
                  ? "bg-neutral-500/15 text-blue-500 font-semibold flex items-center"
                  : "hover:bg-sky-50 dark:hover:bg-neutral-900"
              )}
            >
              <FaCalendarDays fontSize={15} />
              {/* {selectedStatus === "all" ? "All" : ""} */}
              {selectedStatus === "all" ? `All ${statusCounts.all}` : ""}
              {/* <span className="text-xs">{statusCounts.all}</span> */}
            </button>
            <button
              onClick={() => setSelectedStatus("0")}
              className={classNames(
                "px-1.5 py-1 rounded-md h-fit  flex items-center gap-1",
                selectedStatus === "0"
                  ? "bg-neutral-500/15 text-yellow-500 font-semibold flex items-center"
                  : "hover:bg-sky-50 dark:hover:bg-neutral-900"
              )}
            >
              <FaStopwatch fontSize={15} />
              {/* {selectedStatus == 0 ? "Awaiting" : ""} */}
              {selectedStatus == 0 ? `Awaiting ${statusCounts.awaiting}` : ""}
              {/* <span className="text-xs">{statusCounts.awaiting}</span> */}
            </button>
            <button
              onClick={() => setSelectedStatus("1")}
              className={classNames(
                "px-1.5 py-1 rounded-md h-fit  flex items-cente gap-1",
                selectedStatus === "1"
                  ? "bg-neutral-500/15 text-green-500 font-semibold flex items-center"
                  : "hover:bg-sky-50 dark:hover:bg-neutral-900"
              )}
            >
              <FaCalendarCheck fontSize={15} />
              {/* {selectedStatus == 1 ? "Approved" : ""} */}
              {selectedStatus == 1 ? `Approved ${statusCounts.approved}` : ""}
              {/* <span className="text-xs">{statusCounts.approved}</span> */}
            </button>
            <button
              onClick={() => setSelectedStatus("2")}
              className={classNames(
                "px-1.5 py-1 rounded-md h-fit  flex items-center gap-1",
                selectedStatus === "2"
                  ? "bg-neutral-500/15 text-red-500 font-semibold flex items-center"
                  : "hover:bg-sky-50 dark:hover:bg-neutral-900"
              )}
            >
              <FaCalendarXmark fontSize={15} />
              {/* {selectedStatus == 2 ? "Declined" : ""} */}
              {selectedStatus == 2 ? `Declined ${statusCounts.declined}` : ""}
              {/* <span className="text-xs">{statusCounts.declined}</span> */}
            </button>
          </div>
        </div>
        <button
          onClick={getLeaveHistory}
          className="bg-sky-50 dark:bg-neutral-950 dark:hover:bg-neutral-800 hover:bg-sky-100 p-1.5 rounded-md"
        >
          <RiRefreshLine
            fontSize={20}
            className={loading ? "animate-spin" : ""}
          />
        </button>
      </div>

      {leavehistory.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row gap-10 md:gap-0 items-center bg-sky-50 dark:bg-neutral-900 rounded-md p-5 h-full"
        >
          <div className="md:w-1/2 flex justify-center flex-col items-center gap-4">
            <h2 className="text-lg font-bold">No Records Found</h2>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img src={NotFound} className="w-2/3" alt="No Records Found" />
          </div>
        </motion.div>
      ) : (
        <div
          // className="grid gap-2 md:grid-cols-2 dark:bg-neutral-900 h-full overflow-y-scroll scrollbrhdn"
          className={
            filterHistory().length > 8
              ? "grid gap-2 md:grid-cols-2 dark:bg-neutral-900 h-full overflow-y-scroll scrollbrhdn"
              : "grid gap-2 md:grid-cols-2 dark:bg-neutral-900 h-fit overflow-y-scroll scrollbrhdn"
          }
        >
          {[...filterHistory()].reverse().map((record, index) => (
            <div
              key={index}
              className="bg-white flex flex-col gap-2 dark:bg-neutral-800 rounded-xl  p-2 border border-gray-200 dark:border-neutral-700 h-fit"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xs">
                  {record.totaldays === 0.5
                    ? "Half"
                    : record.totaldays === 1
                    ? "Full"
                    : record.totaldays}{" "}
                  Day
                </h3>
                <p className={getStatusClass(record.applicationstatus)}>
                  {record.applicationstatus === 0
                    ? "Awaiting"
                    : record.applicationstatus === 1
                    ? "Approved"
                    : "Declined"}
                </p>
              </div>
              <div className="flex gap-2 items-end justify-between">
                <div className="flex flex-col gap-1">
                  <h3 className="text-base font-semibold">
                    {record.fromdate === record.todate
                      ? formatDate(record.fromdate)
                      : `${formatDate(record.fromdate)} - ${formatDate(
                          record.todate
                        )}`}
                  </h3>
                  <div className="flex items-center gap-0.5 text-xs">
                    <h3
                      className={
                        record.leavetype === "Optional holiday"
                          ? "text-blue-300"
                          : record.leavesubtype === "Sick Leave"
                          ? "text-red-300"
                          : record.leavesubtype === "Casual Leave"
                          ? "text-yellow-200"
                          : record.leavesubtype === "Vacation Leave"
                          ? "text-green-300"
                          : "text-gray-300" // Default color for any other leave types
                      }
                    >
                      {record.leavetype === "Optional holiday"
                        ? "Optional Holiday"
                        : `${record.leavesubtype}`}
                    </h3>
                    {record.leavetype === "Optional holiday" ? "/" : ""}
                    <h3>
                      {record.holidayname ? (
                        <span className="">{record.holidayname}</span>
                      ) : (
                        record.holidayname
                      )}
                    </h3>
                  </div>
                </div>
                <div className="flex gap-1">
                  {record.applicationstatus === 0 ? (
                    <button
                      className="bg-sky-50 dark:bg-neutral-900/30 dark:hover:bg-neutral-900/70 hover:bg-sky-100 p-2  rounded-md"
                      onClick={() => handleDelete(record._id)}
                    >
                      <MdDelete />
                    </button>
                  ) : (
                    ""
                  )}
                  {record.leavetype === "Optional holiday" ? (
                    ""
                  ) : (
                    <div>
                      <button
                        onClick={() => toggleMoreInfo(index)}
                        className="bg-sky-50 dark:bg-neutral-900/30 dark:hover:bg-neutral-900/70 hover:bg-sky-100 p-1 rounded-md"
                      >
                        <FaCaretDown
                          fontSize={20}
                          className={
                            expandedIndex === index
                              ? "rotate-180 duration-300 "
                              : "rotate-0 duration-300"
                          }
                        />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {expandedIndex === index && (
                <p>
                  {record.leavetype === "Optional holiday" ? (
                    ""
                  ) : (
                    <div>
                      <strong>Cause - </strong>{" "}
                      {record.reason || (
                        <span className="text-xs">Not Mentioned</span>
                      )}
                    </div>
                  )}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
      {message && (
        <div className="absolute bg-green-600 right-2 bottom-2 p-2 text-white rounded-md z-40">
          {message}
        </div>
      )}
    </div>
  );
};

export default LeaveHistory;
