import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import ApiendPonits from "../../api/APIEndPoints.json";

const ProjectBriefforemp = () => {
  const { userData } = useContext(AuthContext);
  const token = userData?.asscessToken;
  const userdata = userData?.employeeData;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [timesheetData, setTimesheetData] = useState({});
  const [currentDate, setCurrentDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  useEffect(() => {
    setCurrentDate(new Date(currentDate).toISOString().split("T")[0]);
  }, [currentDate]);

  useEffect(() => {
    const fetchTimesheetData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${ApiendPonits.baseUrl}${ApiendPonits.endpoints.viewTimesheet}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              employee_id: userdata._id,
            }),
          }
        );
        setLoading(false);
        const data = await response.json();
        console.log(data.data);

        if (data.success) {
          setTimesheetData(data.data);
          setError(null);
        } else {
          setError(data.msg);
        }
      } catch (error) {
        setError("Failed to fetch timesheet data");
      } finally {
        setLoading(false);
      }
    };

    fetchTimesheetData();
  }, [userData?.employeeData?._id]);

  return <div>{timesheetData[0]?.empid}</div>;
};

export default ProjectBriefforemp;
