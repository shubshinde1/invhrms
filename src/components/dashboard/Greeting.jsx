import React, { useState, useEffect, useContext } from "react";
import { IoLogIn, IoLogOut } from "react-icons/io5";
import { AuthContext } from "../../contexts/AuthContext";
import ApiendPonits from "../../api/APIEndPoints.json";
import { Link } from "react-router-dom";
import { FaCaretRight } from "react-icons/fa6";

export default function Greeting() {
  const token = localStorage.getItem("accessToken");
  const { userData } = useContext(AuthContext);
  const employee_id = userData?.employeeData._id;

  const [currentDateAttendance, setCurrentDateAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [progress, setProgress] = useState({ elapsed: 0, remaining: 0 });

  const totalSeconds = 9 * 3600; // 9 hours in seconds

  const getAttendanceHistory = async () => {
    try {
      const response = await fetch(
        `${ApiendPonits.baseUrl}${ApiendPonits.endpoints.getattendancehistory}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ employee_id }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch attendance history");
      }

      const data = await response.json();
      const today = new Date().toISOString().split("T")[0]; // Get current date in YYYY-MM-DD format

      const todaysAttendance = data.attendance.filter(
        (record) => record.date === today
      );

      setCurrentDateAttendance(todaysAttendance);
      calculateProgress(todaysAttendance);
    } catch (error) {
      console.error("Error fetching attendance history:", error);
      setError("Unable to fetch attendance history. Please try again later.");
      setTimeout(() => setError(""), 4000);
    } finally {
      setLoading(false);
    }
  };

  const calculateProgress = (attendanceRecords) => {
    if (attendanceRecords.length === 0 || !attendanceRecords[0]?.intime) {
      setProgress({ elapsed: 0, remaining: totalSeconds });
      return;
    }

    const record = attendanceRecords[0];
    const intime = new Date(record.intime).getTime();
    const now = Date.now();

    const elapsedSeconds = Math.max(0, Math.floor((now - intime) / 1000));
    const remainingSeconds = Math.max(0, totalSeconds - elapsedSeconds);

    setProgress({ elapsed: elapsedSeconds, remaining: remainingSeconds });
  };

  const handlePunchButtonClick = async () => {
    const mark = isPunchedIn ? "Out" : "In";

    try {
      let inlocation = null;
      let outlocation = null;

      // Get geolocation data
      if (mark === "In" || mark === "Out") {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        const { latitude, longitude } = position.coords;
        if (mark === "In") {
          inlocation = { latitude, longitude };
        } else {
          outlocation = { latitude, longitude };
        }
      }

      // Send request to mark attendance
      const response = await fetch(
        `${ApiendPonits.baseUrl}${ApiendPonits.endpoints.attendance}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            employee_id: userData.employeeData._id,
            mark,
            inlocation,
            outlocation,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Success message
        setMessage(`${mark === "In" ? "Punch In" : "Punch Out"} Successfully`);
        setTimeout(() => setMessage(""), 4000);

        // Refresh attendance records
        await getAttendanceHistory();
      } else {
        // Handle errors
        if (!token) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("@secure.s.userData");
        }
        const error =
          data.message || "An error occurred while processing your request.";
        setError(error);
        setTimeout(() => setError(""), 4000);
      }
    } catch (error) {
      // Handle exceptions
      setError(error.message || "An error occurred. Please try again.");
      setTimeout(() => setError(""), 4000);
    }
  };

  const hasTodaysAttendance = currentDateAttendance.length > 0;
  const isPunchedIn =
    hasTodaysAttendance &&
    currentDateAttendance.some((record) => record.attendancestatus === 1);

  const formatTime = (timeInSeconds) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const getGreetingMessage = () => {
    const hours = new Date().getHours();
    if (hours < 12) return "Good Morning";
    if (hours < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const getFirstName = (fullName) => fullName?.split(" ")[0] || "User";

  const ProgressBar = ({ progress }) => {
    const progressBarWidth = (progress.elapsed / totalSeconds) * 100;

    return (
      <div className="w-full mt-4">
        <div className="flex justify-between text-xs">
          <span>{formatTime(progress.elapsed)} Completed</span>
          <span>{formatTime(progress.remaining)} Remaining</span>
        </div>
        <div className="bg-sky-100 dark:bg-blue-200/10 mt-2 h-5 rounded-md flex relative overflow-hidden">
          <div
            className="absolute h-full bg-indigo-600 transition-[width] duration-1000"
            style={{
              width: `${progressBarWidth}%`,
            }}
          ></div>
        </div>
        <div className="flex justify-between text-xs mt-2">
          <span>
            In -{" "}
            {currentDateAttendance[0]?.intime
              ? new Date(currentDateAttendance[0].intime).toLocaleTimeString(
                  [],
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                )
              : "--:--"}
          </span>
          <span>
            Out -{" "}
            {currentDateAttendance[0]?.outtime
              ? new Date(currentDateAttendance[0].outtime).toLocaleTimeString(
                  [],
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                )
              : "--:--"}
          </span>
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (employee_id && token) {
      getAttendanceHistory();
    }
  }, [employee_id, token]);

  return (
    <div className="  flex flex-col gap-10 md:gap-2 h-full">
      <div className="  flex flex-col items-start justify-between h-full md:items-end md:p-2">
        <div className="flex items-start gap-2 w-full justify-between">
          <h1 className="text-blue-500 md:text-2xl text-base  font-bold">
            {getGreetingMessage()}, {getFirstName(userData?.employeeData.name)}!
          </h1>
          <div className="flex flex-col items-end">
            {loading ? null : hasTodaysAttendance ? (
              <button
                className={`px-2 py-1.5 rounded-md  flex items-center gap-1 text-xs font-bold  ${
                  isPunchedIn
                    ? "text-red-500 bg-red-500/20 hover:bg-red-500/30"
                    : "text-green-500 bg-green-500/20 hover:bg-green-500/30"
                }`}
                onClick={handlePunchButtonClick}
              >
                {isPunchedIn ? "Punch Out" : "Punch In"}{" "}
                {isPunchedIn ? (
                  <IoLogOut fontSize={20} />
                ) : (
                  <IoLogIn fontSize={20} />
                )}
              </button>
            ) : (
              <button
                className="px-2 py-1.5 rounded-md flex items-center gap-1 text-xs font-bold hover:bg-green-500/30 text-green-500 bg-green-500/20"
                onClick={handlePunchButtonClick}
              >
                Punch In <IoLogIn fontSize={20} />
              </button>
            )}
            <Link
              to="/Attendance"
              className="flex w-fit items-center text-xs text-blue-500 py-0.5 hover:px-1 rounded-md cursor-pointer duration-300 mt-1 hover:bg-blue-500/15"
            >
              <h3>History</h3>
              <FaCaretRight />
            </Link>
          </div>
        </div>

        <ProgressBar progress={progress} />
      </div>

      {message && (
        <div className="absolute bottom-4 right-4 bg-green-500 text-white p-3 rounded-md z-10">
          {message}
        </div>
      )}
      {error && (
        <div className="absolute bottom-4 right-4 bg-red-500 text-white p-3 rounded-md z-10">
          {error}
        </div>
      )}
    </div>
  );
}
