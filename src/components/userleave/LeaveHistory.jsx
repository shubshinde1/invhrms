import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import Loading from "../Loading";

const LeaveHistory = () => {
  const { userData } = useContext(AuthContext);
  const token = localStorage.getItem("accessToken");
  const employee_id = userData?.employeeData._id;

  const [leavehistory, setLeaveHistory] = useState([]);
  const [errors, setErrors] = useState("");

  const getLeaveHistory = async () => {
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
    }
  };

  useEffect(() => {
    if (employee_id) {
      getLeaveHistory();
    }
  }, [employee_id, token]);

  return (
    <div className="p-2 bg-sky-50 dark:bg-neutral-900 rounded-md">
      {errors && <div className="text-red-500 ">{errors}</div>}
      {leavehistory.length === 0 ? (
        <div className="">
          <Loading />
        </div>
      ) : (
        <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3 dark:bg-neutral-900 ">
          {leavehistory.map((record, index) => (
            <div
              key={index}
              className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-2 border border-gray-200 dark:border-neutral-700"
            >
              <h3 className="text-lg font-semibold mb-2">
                {record.leavetype === "Optional holiday"
                  ? "Optional Holiday"
                  : `${record.leavesubtype}`}
              </h3>
              <div className="text-sm">
                <p>
                  <strong>From Date:</strong>{" "}
                  {new Date(record.fromdate).toLocaleDateString()}
                </p>
                <p>
                  <strong>To Date:</strong>{" "}
                  {new Date(record.todate).toLocaleDateString()}
                </p>
                {/* <p>
                  <strong>Leave Type:</strong> {record.leavetype}
                </p> */}
                <p>
                  <strong>Leave Subtype:</strong> {record.leavesubtype || "N/A"}
                </p>
                <p>
                  <strong>Holiday Name:</strong> {record.holidayname || "N/A"}
                </p>
                <p>
                  <strong>Reason:</strong> {record.reason || "N/A"}
                </p>
                <p>
                  <strong>Application Status:</strong>{" "}
                  {record.applicationstatus === 0
                    ? "Pending"
                    : record.applicationstatus === 1
                    ? "Approved"
                    : "Rejected"}
                </p>
                <p>
                  <strong>Total Days:</strong> {record.totaldays}
                </p>
                <p>
                  <strong>Half Day:</strong> {record.halfday ? "Yes" : "No"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LeaveHistory;
