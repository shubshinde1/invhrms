import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CgArrowsExchangeAlt } from "react-icons/cg";
import userprofile from "../../../assets/images/clientAvatar.png";
import {
  TbLayoutAlignLeftFilled,
  TbLayoutAlignRightFilled,
} from "react-icons/tb";

import { leapfrog } from "ldrs";

import ApiendPonits from "../../../api/APIEndPoints.json";

const LeaveApplicationsCard = () => {
  const token = localStorage.getItem("accessToken");
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getLeaveRecord = async () => {
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

        setLeaveHistory(data.leaveHistory);
      } catch (error) {
        setError(
          error.message || "Error fetching leave records. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    getLeaveRecord();
  }, [token]);

  if (loading) {
    return (
      <div className="text-center h-full">
        <l-leapfrog size="40" speed="2.5" color="#285999"></l-leapfrog>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  const handleViewClick = (employeeId) => {
    navigate(`/pim/employee-details/${employeeId}`, {
      state: { activeTab: "Leave" }, // Pass "Leave" as the default active tab
    });
  };

  return (
    <div className="w-full bg-white border-2 dark:border-none dark:bg-neutral-900 p-2 rounded-md flex flex-col gap-2">
      Leave Applications
      <div className="flex flex-col gap-2 h-[25.5rem] overflow-y-scroll scrollbar-hide">
        {leaveHistory.map((record) => (
          <div
            key={record._id}
            className="p-2 bg-sky-50 dark:bg-neutral-950 rounded-md flex flex-col gap-1"
          >
            <div className="flex items-center gap-2 justify-between">
              {/* <div>Employee Name</div> */}
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
                <div>{record.employee_name || "-"}</div>
              </div>
              <div className="flex items-center gap-2 justify-between">
                {/* <div>Status</div> */}
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
              </div>
            </div>
            <div className="flex items-center gap-2 justify-between">
              {/* <div>Leave Type</div> */}
              <div>{record.leavetype || "-"}</div>
            </div>
            <div className="flex items-center gap-2 justify-between">
              {/* <div>Holiday Name</div> */}
              <div>{record.holidayname || "-"}</div>
            </div>
            <div className="flex items-center gap-2 justify-between">
              {/* <div>From</div> */}
              <div className="flex items-center gap-1">
                <TbLayoutAlignLeftFilled className="text-green-500" />
                {record.fromdate || "-"}
              </div>
              <div className="flex items-center gap-1">
                <TbLayoutAlignRightFilled className="text-blue-500" />
                {record.todate || "-"}
              </div>
            </div>
            <div className="flex items-center gap-2 justify-between">
              {/* <div>Total Days</div> */}
              <div>Total {record.totaldays || "-"} Days</div>
            </div>

            <div
              onClick={() => handleViewClick(record.employee_id)}
              className="mt-3 flex items-center justify-center gap-2 text-blue-300 hover:text-blue-500 font-bold  cursor-pointer bg-blue-100 dark:bg-blue-800/20 p-2 rounded-md hover:bg-blue-200 dark:hover:bg-blue-700/20 transition"
            >
              <CgArrowsExchangeAlt fontSize={20} />
              <span className="text-sm font-medium">View Details</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeaveApplicationsCard;
