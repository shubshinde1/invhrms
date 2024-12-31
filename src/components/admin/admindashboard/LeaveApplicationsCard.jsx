import React, { useState, useEffect } from "react";
import ApiendPonits from "../../../api/APIEndPoints.json";

const LeaveApplicationsCard = () => {
  const token = localStorage.getItem("accessToken");
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-4">
      {/* Header Row */}
      <div className="grid grid-cols-9 gap-4 text-sm font-semibold bg-gray-200 dark:bg-gray-800 p-2 rounded-md">
        <div>Employee Name</div>
        <div>Leave Type</div>
        <div>Holiday Name</div>
        <div>From</div>
        <div>Total Days</div>
        <div>Status</div>
      </div>

      {/* Data Rows */}
      <div className="space-y-2">
        {leaveHistory.map((record) => (
          <div
            key={record._id}
            className="grid grid-cols-9 gap-4 p-2 bg-white dark:bg-neutral-900 rounded-md shadow"
          >
            <div>{record.employee_name || "-"}</div>
            <div>{record.leavetype || "-"}</div>
            <div>{record.holidayname || "-"}</div>
            <div>{record.fromdate || "-"}</div>
            <div>{record.totaldays || "-"}</div>
            <div>
              {record.applicationstatus === 0
                ? "Pending"
                : record.applicationstatus === 1
                ? "Approved"
                : "Declined"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeaveApplicationsCard;
