import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import Loading from "../Loading";
import { FaCaretDown, FaSyncAlt } from "react-icons/fa"; // Import the refresh icon
import { RiRefreshLine } from "react-icons/ri";
import { MdDelete } from "react-icons/md";
import { motion } from "framer-motion";

import NotFound from "../../assets/images/norecordfound.svg";

const LeaveHistory = () => {
  const { userData } = useContext(AuthContext);
  const token = localStorage.getItem("accessToken");
  const employee_id = userData?.employeeData._id;

  const [leavehistory, setLeaveHistory] = useState([]);
  const [errors, setErrors] = useState("");
  const [expandedIndex, setExpandedIndex] = useState(null); // Track the expanded card
  const [loading, setLoading] = useState(false); // Track loading state

  const formatDate = (dateString) => {
    const options = { weekday: "short", day: "2-digit", month: "short" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const getLeaveHistory = async () => {
    setLoading(true); // Start loading
    try {
      const response = await fetch(
        "http://localhost:3000/api/leaveapplicationhistory",
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
        "http://localhost:3000/api/deleteleaveapplication", // Assuming this is your delete endpoint
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            applicationId,
            employee_id,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setLeaveHistory((prevHistory) =>
          prevHistory.filter((record) => record._id !== applicationId)
        );
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

  return (
    <div className="p-2 bg-sky-50 dark:bg-neutral-900 rounded-md h-[67.5vh] overflow-hidden pb-12">
      <div className="flex justify-between items-center mb-2">
        {/* <h2 className="text-lg font-bold">Leave History</h2> */}
        <button
          onClick={getLeaveHistory}
          className="bg-white dark:bg-neutral-800/30 dark:hover:bg-neutral-800/70 hover:bg-sky-100 p-1.5 rounded-md"
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
            leavehistory.length > 8
              ? "grid gap-2 md:grid-cols-2 dark:bg-neutral-900 h-full overflow-y-scroll scrollbrhdn"
              : "grid gap-2 md:grid-cols-2 dark:bg-neutral-900 h-fit overflow-y-scroll scrollbrhdn"
          }
        >
          {[...leavehistory].reverse().map((record, index) => (
            <div
              key={index}
              className="bg-white flex flex-col gap-2 dark:bg-neutral-800 rounded-xl shadow-md p-2 border border-gray-200 dark:border-neutral-700 h-fit"
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
    </div>
  );
};

export default LeaveHistory;
