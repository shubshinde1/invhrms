import React, { useState, useEffect } from "react";
import { FaCaretDown, FaSyncAlt } from "react-icons/fa"; // Import the refresh icon
import { RiRefreshLine } from "react-icons/ri";
import { MdDelete } from "react-icons/md";
import { motion } from "framer-motion";
import classNames from "classnames";
import { FaCalendarDays } from "react-icons/fa6";
import { FaStopwatch } from "react-icons/fa6";
import { FaCalendarCheck } from "react-icons/fa6";
import { FaCalendarXmark } from "react-icons/fa6";
import ApiendPonits from "../../../../src/api/APIEndPoints.json";
import { useParams } from "react-router-dom";
import { FaCaretLeft, FaCaretRight } from "react-icons/fa";
import { FaFilterCircleXmark } from "react-icons/fa6";
import { CgArrowsExchange } from "react-icons/cg";
import { IoMdSave } from "react-icons/io";
import { IoClose } from "react-icons/io5";

import AdminLeave from "./AdminLeave";

import NotFound from "../../../assets/images/norecordfound.svg";
import { button } from "@nextui-org/theme";

const EmployeeLeaveHistory = (Id, getLeaveRecord) => {
  const { _id } = useParams();

  const token = localStorage.getItem("accessToken");
  const employee_id = _id;

  const [leavehistory, setLeaveHistory] = useState([]);
  const [errors, setErrors] = useState("");
  const [expandedIndex, setExpandedIndex] = useState(null); // Track the expanded card
  const [loading, setLoading] = useState(false); // Track loading state
  const [selectedMonth, setSelectedMonth] = useState("all"); // Track selected month
  const [selectedStatus, setSelectedStatus] = useState("all"); // Track selected status
  const [message, setMessage] = useState("");
  const [formOpen, setFormOpen] = useState(null); // Track which record's form is open

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
        setTimeout(() => setErrors(""), 4000);
      }
    } catch (error) {
      setErrors(error.message || "Error fetching leave history.");
      setTimeout(() => setErrors(""), 4000);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    if (employee_id) {
      getLeaveHistory();
    }
  }, [employee_id, token]);

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
      if (record.applicationstatus === 0) acc.pending += 1;
      if (record.applicationstatus === 1) acc.approved += 1;
      if (record.applicationstatus === 2) acc.declined += 1;
      return acc;
    },
    { all: 0, pending: 0, approved: 0, declined: 0 }
  );

  // Add functions to switch to next and previous months.
  const handlePreviousMonth = () => {
    setSelectedMonth((prevMonth) => {
      if (prevMonth === "all" || prevMonth === "1") {
        return "12";
      }
      return (parseInt(prevMonth, 10) - 1).toString();
    });
  };

  const handleNextMonth = () => {
    setSelectedMonth((prevMonth) => {
      if (prevMonth === "all" || prevMonth === "12") {
        return "1";
      }
      return (parseInt(prevMonth, 10) + 1).toString();
    });
  };

  // Function to clear all filters
  const clearFilters = () => {
    setSelectedMonth("all");
    setSelectedStatus("all");
  };

  const toggleMoreInfo = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const handleFormOpen = (index) => {
    setFormOpen(index);
  };

  const handleSave = async (recordId, status) => {
    try {
      const response = await fetch(
        `${ApiendPonits.baseUrl}${ApiendPonits.endpoints.approveleave}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            employee_id: employee_id,
            application_id: recordId,
            applicationstatus: status,
          }),
        }
      );
      const data = await response.json();
      console.log(data);

      if (data.success) {
        getLeaveHistory();
        // location.reload();
        setMessage("Status Changes Succefullly!");
        setTimeout(() => setMessage(""), 4000);
      } else {
        setErrors(data.msg || "Failed to fetch leave history.");
        setTimeout(() => setErrors(""), 4000);
      }
    } catch (error) {
      setErrors(error.message || "Error fetching leave history.");
      setTimeout(() => setErrors(""), 4000);
    } finally {
      setFormOpen(null);
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="p-2 border dark:border-none dark:bg-neutral-900 rounded-md h-[67.5vh] overflow-hidden pb-12">
      <div className="flex gap-2 items-start justify-between mb-2">
        <div className="flex flex-wrap gap-2 items-center">
          <div className=" flex gap-1 bg-sky-100 dark:bg-neutral-950 p-1 rounded-md text-xs w-fit">
            {/* Month Filter Dropdown */}

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
              {selectedStatus === "all" ? `All ${statusCounts.all}` : ""}
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
              {selectedStatus == 0 ? `Pending ${statusCounts.pending}` : ""}
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
              {selectedStatus == 1 ? `Approved ${statusCounts.approved}` : ""}
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
              {selectedStatus == 2 ? `Declined ${statusCounts.declined}` : ""}
            </button>
          </div>
          <div className=" flex gap-1 items-center">
            <button
              onClick={handlePreviousMonth}
              className="p-1.5 bg-sky-100 dark:bg-neutral-950 text-white rounded-md group"
            >
              <FaCaretLeft
                fontSize={20}
                className="group-hover:-translate-x-1 duration-300 text-black dark:text-white"
              />
            </button>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-1.5 py-2 rounded-md bg-sky-100 dark:bg-neutral-950 text-xs"
            >
              <option value="all">All</option>
              <option value="1">January</option>
              <option value="2">February</option>
              <option value="3">March</option>
              <option value="4">April</option>
              <option value="5">May</option>
              <option value="6">June</option>
              <option value="7">July</option>
              <option value="8">August</option>
              <option value="9">September</option>
              <option value="10">October</option>
              <option value="11">November</option>
              <option value="12">December</option>
            </select>
            <button
              onClick={handleNextMonth}
              className="p-1.5 bg-sky-100 dark:bg-neutral-950 text-white rounded-md group"
            >
              <FaCaretRight
                fontSize={20}
                className="group-hover:translate-x-1 duration-300 text-black dark:text-white"
              />
            </button>
            <div className="col-span-12 md:col-span-4 w-fit bg-sky-100 dark:bg-neutral-950 p-2 rounded-md flex items-center">
              <button onClick={clearFilters}>
                <FaFilterCircleXmark fontSize={15} />
              </button>
            </div>
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
          <div className="md:w-1/2 flex justify-center">
            <img
              src={NotFound}
              alt="No records found"
              className="w-[25vh] opacity-50 dark:invert"
            />
          </div>
          <div className="md:w-1/2 flex flex-col gap-2 items-center">
            <h1 className="text-center text-xl text-neutral-800 dark:text-neutral-100 font-semibold">
              No Leave History Found
            </h1>
            <p className="text-neutral-500 dark:text-neutral-300 text-center text-sm">
              You haven’t applied for any leave yet.
            </p>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full h-full relative overflow-auto scrollbrhdn rounded-lg flex flex-col gap-2"
        >
          {/* Custom grid layout for leave history */}
          <div className="hidden md:grid grid-cols-12 gap-2 bg-sky-100 dark:bg-neutral-800 px-2 py-3 rounded-md font-semibold">
            <div className="col-span-2">Leave Type</div>
            <div className="col-span-2">Reason</div>
            <div className="col-span-2">From</div>
            <div className="col-span-2">To</div>
            <div className="col-span-1">Total</div>
            <div className="col-span-3">Status</div>
          </div>
          {[...filterHistory()].reverse().map((record, index) => (
            <div className="" key={index}>
              {/* desktop */}
              <div
                key={index}
                className="hidden md:grid col-span-12  grid-cols-12 gap-2 bg-sky-50 dark:bg-neutral-950 px-2 py-3 rounded-md font-semibold group"
              >
                <div className="col-span-2">{record.leavetype}</div>
                <div className="col-span-2">{record.reason}</div>
                <div className="col-span-2">{record.fromdate}</div>
                <div className="col-span-2">{record.todate}</div>
                <div className="col-span-1">{record.totaldays}</div>
                <div className="col-span-3 flex items-center gap-1 ">
                  <div>
                    {/* <span className={getStatusClass(record.applicationstatus)}>
                      {record.applicationstatus === 0
                        ? "Pending"
                        : record.applicationstatus === 1
                        ? "Approved"
                        : "Declined"}
                    </span> */}
                    {formOpen === index ? (
                      <div className=" flex flex- bg-sky-200 dark:bg-neutral-800 p-1  rounded-md items-center gap-1 text-xs ">
                        {/* <button
                          onClick={() => handleSave(record._id, 0)}
                          className="bg-yellow-600/15 text-yellow-500 hover:bg-yellow-500/25 py-1 px-2 rounded-md w-full"
                        >
                          Pending
                        </button> */}
                        <button
                          onClick={() => handleSave(record._id, 1)}
                          className="bg-green-500/15 text-green-500 hover:bg-green-500/25 py-1 px-2 rounded-md w-full"
                        >
                          Approved
                        </button>
                        <button
                          onClick={() => handleSave(record._id, 2)}
                          className="bg-red-500/15 text-red-500 hover:bg-red-500/25 py-1 px-2 rounded-md w-full"
                        >
                          Declined
                        </button>
                        <button
                          onClick={() => setFormOpen(null)}
                          className="p-1 bg-sky-100 dark:bg-neutral-900 text-red-500 rounded-md flex items-center"
                        >
                          <IoClose fontSize={16} />
                        </button>
                      </div>
                    ) : (
                      <span
                        className={getStatusClass(record.applicationstatus)}
                      >
                        {record.applicationstatus === 0
                          ? "Pending"
                          : record.applicationstatus === 1
                          ? "Approved"
                          : "Declined"}
                      </span>
                    )}
                  </div>

                  {formOpen === index ? (
                    ""
                  ) : (
                    <button
                      onClick={() => handleFormOpen(index)}
                      className="p-1 bg-sky-200 dark:bg-neutral-900 dark:text-white dark:hover:text-blue-500 hover:text-blue-500 rounded-md group-hover:opacity-100 opacity-0"
                    >
                      <CgArrowsExchange fontSize={15} />
                    </button>
                  )}
                </div>
              </div>
              {/* mobile */}
              <div className="">
                <div
                  key={index}
                  className="bg-white flex md:hidden flex-col gap-2 dark:bg-neutral-800 rounded-xl p-2 border border-gray-200 dark:border-neutral-700 h-fit"
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
                    {/* <p className={getStatusClass(record.applicationstatus)}>
                      {record.applicationstatus === 0
                        ? "Pending"
                        : record.applicationstatus === 1
                        ? "Approved"
                        : "Declined"}
                    </p> */}

                    <div className="col-span-3 flex items-center gap-1 ">
                      <div>
                        {/* <span className={getStatusClass(record.applicationstatus)}>
                      {record.applicationstatus === 0
                        ? "Pending"
                        : record.applicationstatus === 1
                        ? "Approved"
                        : "Declined"}
                    </span> */}
                        {formOpen === index ? (
                          <div className=" flex flex- bg-sky-100 dark:bg-neutral-900 p-1  rounded-md items-center gap-1 text-xs ">
                            <button
                              onClick={() => handleSave(record._id, 0)}
                              className="bg-yellow-600/15 text-yellow-500 hover:bg-yellow-500/25 py-1 px-2 rounded-md w-full"
                            >
                              Pending
                            </button>
                            <button
                              onClick={() => handleSave(record._id, 1)}
                              className="bg-green-500/15 text-green-500 hover:bg-green-500/25 py-1 px-2 rounded-md w-full"
                            >
                              Approved
                            </button>
                            <button
                              onClick={() => handleSave(record._id, 2)}
                              className="bg-red-500/15 text-red-500 hover:bg-red-500/25 py-1 px-2 rounded-md w-full"
                            >
                              Declined
                            </button>
                            <button
                              onClick={() => setFormOpen(null)}
                              className="p-1 bg-sky-100 dark:bg-neutral-900 text-red-500 rounded-md flex items-center"
                            >
                              <IoClose fontSize={16} />
                            </button>
                          </div>
                        ) : (
                          <span
                            className={getStatusClass(record.applicationstatus)}
                          >
                            {record.applicationstatus === 0
                              ? "Pending"
                              : record.applicationstatus === 1
                              ? "Approved"
                              : "Declined"}
                          </span>
                        )}
                      </div>

                      {formOpen === index ? (
                        ""
                      ) : (
                        <button
                          onClick={() => handleFormOpen(index)}
                          className="p-1 bg-sky-100 dark:bg-neutral-900 dark:text-white dark:hover:text-blue-500 hover:text-blue-500 rounded-md "
                        >
                          <CgArrowsExchange fontSize={15} />
                        </button>
                      )}
                    </div>
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
                              : "text-gray-300"
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
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {message && (
        <div className="absolute bg-green-600 right-2 bottom-2 p-2 text-white rounded-md z-40">
          {message}
        </div>
      )}

      {errors && (
        <div className="absolute bg-red-600 right-2 bottom-2 p-2 text-white rounded-md z-40">
          {errors}
        </div>
      )}
    </div>
  );
};

export default EmployeeLeaveHistory;
