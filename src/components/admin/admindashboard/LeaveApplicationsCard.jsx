import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BsFillCaretRightFill } from "react-icons/bs";
import userprofile from "../../../assets/images/clientAvatar.png";
import {
  TbLayoutAlignLeftFilled,
  TbLayoutAlignRightFilled,
} from "react-icons/tb";
import { leapfrog } from "ldrs";
import ApiendPonits from "../../../api/APIEndPoints.json";
import { FaCaretLeft, FaCaretRight } from "react-icons/fa";
import { RiRefreshLine } from "react-icons/ri";

const LeaveApplicationsCard = () => {
  const token = localStorage.getItem("accessToken");
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date()); // New state for selected date
  const navigate = useNavigate();

  // Format the date to "YYYY-MM-DD"
  const formatDate = (date) => {
    return date.toISOString().split("T")[0];
  };

  const fetchLeaveRecords = async () => {
    try {
      const response = await fetch(
        `${ApiendPonits.baseUrl}${ApiendPonits.endpoints.allleaveapplications}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || "Failed to fetch leave records.");
      }

      const data = await response.json();

      console.log("data");
      console.log(data);

      // Filter leaveHistory to only include applications with the selected date
      const filteredLeaveHistory = data.leaveHistory.filter((record) =>
        record.createdAt.startsWith(formatDate(selectedDate))
      );

      setLeaveHistory(filteredLeaveHistory);
    } catch (error) {
      setError(
        error.message || "Error fetching leave records. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch leave records whenever the selectedDate changes
  useEffect(() => {
    fetchLeaveRecords();
  }, [selectedDate, token]);

  const handleViewClick = (employeeId) => {
    navigate(`/pim/employee-details/${employeeId}`, {
      state: { activeTab: "Leave" }, // Pass "Leave" as the default active tab
    });
  };

  const handlePrevDate = () => {
    setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() - 1)));
  };

  const handleNextDate = () => {
    setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() + 1)));
  };

  const ResetFiletr = () => {
    fetchLeaveRecords();
    setSelectedDate(new Date());
  };

  const getFormattedDate = (selectedDate) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const formattedToday = formatDate(today);
    const formattedYesterday = formatDate(yesterday);

    if (formatDate(selectedDate) === formattedToday) {
      return "Today"; // Return "Today" if the selected date is today
    } else if (formatDate(selectedDate) === formattedYesterday) {
      return "Yesterday"; // Return "Yesterday" if the selected date is yesterday
    } else {
      return formatDate(selectedDate); // Return the actual selected date if it's neither today nor yesterday
    }
  };

  const isToday = formatDate(selectedDate) === formatDate(new Date());

  return (
    <div className="w-full bg-white border-2 dark:border-none dark:bg-neutral-900 p-2 h-full rounded-md flex flex-col gap-2">
      {/* new btn */}
      <div className="flex gap-2 bg-sky-50 dark:bg-neutral-950 p-1 h-fit rounded-lg flex-col w-full items-center justify-between">
        <h3 className="ml-2 font-extrabold">Leave Applications</h3>
        <div className="flex justify-between items-center gap-1">
          <button
            onClick={handlePrevDate}
            className="p-1 bg-sky-100 hover:bg-sky-200 rounded-lg dark:bg-neutral-900 dark:hover:bg-neutral-900 dark:border-neutral-700 group"
          >
            <FaCaretLeft
              fontSize={23}
              className="group-hover:-translate-x-1 duration-300"
            />
          </button>

          <h3 className="w-28 text-sm text-center font-semibold py-1.5 px-2 bg-sky-100 hover:bg-sky-200 rounded-lg dark:bg-neutral-900 dark:hover:bg-neutral-900 dark:border-neutral-700 group">
            {getFormattedDate(selectedDate)}
          </h3>

          <button
            onClick={handleNextDate}
            disabled={isToday}
            className="p-1 bg-sky-100 hover:bg-sky-200 rounded-lg dark:bg-neutral-900 dark:hover:bg-neutral-900 dark:border-neutral-700 group"
          >
            <FaCaretRight
              fontSize={23}
              className="group-hover:translate-x-1 duration-300"
            />
          </button>

          {/* {!isToday && ( */}
          <button
            onClick={ResetFiletr}
            className="p-1 bg-sky-100 hover:bg-sky-200 rounded-lg dark:bg-neutral-900 dark:hover:bg-neutral-900 dark:border-neutral-700 group"
          >
            <RiRefreshLine
              fontSize={23}
              className="group-hover:-rotate-90 duration-300"
            />
          </button>
          {/* // )} */}
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col justify-center items-center gap-2 h-full overflow-y-scroll scrollbar-hide">
          <l-leapfrog size="40" speed="2.5" color="#285999"></l-leapfrog>
        </div>
      ) : (
        <div className="h-full">
          {error || leaveHistory.length === 0 ? (
            <div className="flex flex-col justify-center items-center gap-2 h-full overflow-y-scroll scrollbar-hide">
              No Leave Applications Found for {formatDate(selectedDate)}
            </div>
          ) : (
            <div className="flex flex-col gap-2 h-full overflow-y-scroll scrollbar-hide">
              {leaveHistory.map((record) => (
                <div
                  key={record._id}
                  className="p-2 bg-sky-50 dark:bg-neutral-950 rounded-md flex flex-row gap-2 group "
                >
                  <div className="flex flex-col gap-3 w-full">
                    <div className="flex items-center gap-2 justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={
                            record.employee_profileUrl
                              ? record.employee_profileUrl
                              : userprofile
                          }
                          alt={`${record.employee_name}'s profile`}
                          className="w-8 h-8 rounded-lg object-cover"
                        />
                        <div>
                          {record.employee_name
                            ? `${record.employee_name.split(" ")[0]} ${
                                record.employee_name.split(" ")[1]?.charAt(0) ||
                                ""
                              }`
                            : "-"}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 justify-between">
                        <div>
                          {record.applicationstatus === 0 ? (
                            <div className="bg-orange-500/20 w-fit px-2 py-1 rounded-md text-orange-500 font-bold text-xs">
                              Pending
                            </div>
                          ) : record.applicationstatus === 1 ? (
                            <div className="bg-green-500/20 w-fit px-2 py-1 rounded-md text-green-500 font-bold text-xs">
                              Approved
                            </div>
                          ) : (
                            <div className="bg-red-500/20 w-fit px-2 py-1 rounded-md text-red-500 font-bold text-xs">
                              Declined
                            </div>
                          )}
                        </div>
                        <div className="bg-blue-500/20 w-fit px-2 py-1 rounded-md text-blue-500 font-bold text-xs">
                          <div>{record.totaldays || "-"} d</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 justify-between w-full">
                      <div className="w-full">
                        {record.holidayname ? (
                          <div className="flex gap-2 justify-between ">
                            <div className="font-bold">
                              {record.holidayname}
                            </div>
                            <div>{record.leavetype}</div>
                          </div>
                        ) : (
                          ""
                        )}
                        <div className="font-bold">{record.leavesubtype}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 justify-between">
                      <div className="flex items-center gap-1">
                        <TbLayoutAlignLeftFilled className="text-green-500" />
                        {record.fromdate || "-"}
                      </div>
                      <div className="flex items-center gap-1">
                        <TbLayoutAlignRightFilled className="text-blue-500" />
                        {record.todate || "-"}
                      </div>
                    </div>
                  </div>

                  <div
                    onClick={() => handleViewClick(record.employee_id)}
                    className=" items-center justify-center gap-2 font-bold hidden group-hover:flex cursor-pointer duration-500 px-1 rounded-r-xl rounded-l-md dark:bg-neutral-900 dark:hover:bg-neutral-800 bg-sky-100 hover:bg-sky-200"
                  >
                    <BsFillCaretRightFill fontSize={20} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LeaveApplicationsCard;
