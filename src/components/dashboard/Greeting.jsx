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
      const response = await fetch(ApiendPonits.getattendancehistory, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ employee_id }),
      });

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
    } finally {
      setLoading(false);
    }
  };

  const calculateProgress = (attendanceRecords) => {
    if (attendanceRecords.length === 0) return;

    const record = attendanceRecords[0];
    const intime = new Date(record.intime).getTime();
    const now = new Date().getTime();

    const elapsedSeconds = Math.max(0, Math.floor((now - intime) / 1000));
    const remainingSeconds = Math.max(0, totalSeconds - elapsedSeconds);

    setProgress({ elapsed: elapsedSeconds, remaining: remainingSeconds });
  };

  const handlePunchButtonClick = async () => {
    const mark = isPunchedIn ? "Out" : "In";
    const endpoint = ApiendPonits.attendance;

    try {
      let inlocation = null;
      let outlocation = null;

      if (mark === "In" || mark === "Out") {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        const { latitude, longitude } = position.coords;
        if (mark === "In") {
          inlocation = { latitude, longitude };
          // sessionStorage.setItem("intime", new Date().toISOString());
        } else {
          outlocation = { latitude, longitude };
        }
      }

      const response = await fetch(endpoint, {
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
      });

      const data = await response.json();
      console.log(data.attendance);

      if (response.ok) {
        setMessage(`${mark === "In" ? "Punch In" : "Punch Out"} Successfully`);
        setTimeout(() => setMessage(""), 4000);
        if (mark === "In") {
          getAttendanceHistory(); // Refresh attendance records
        }
      } else {
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
      setError(error.message || "An error occurred. Please try again.");
      setTimeout(() => setError(""), 4000);
    }
  };

  const hasTodaysAttendance = currentDateAttendance.length > 0;
  const isPunchedIn =
    hasTodaysAttendance &&
    currentDateAttendance.some((record) => record.attendancestatus === 0);

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

  const getFirstName = (fullName) => {
    return fullName?.split(" ")[0] || "User";
  };

  const ProgressBar = ({ progress }) => {
    const progressBarWidth = (progress.elapsed / totalSeconds) * 100;

    return (
      <div className="w-full md:w-2/3 mt-4">
        <div className="flex justify-between text-xs">
          <span className="flex flex-col items-end ">
            {formatTime(progress.elapsed)} Completed
          </span>
          <span className="flex flex-col items-end">
            {formatTime(progress.remaining)} Remaining
          </span>
        </div>
        <div className="bg-sky-100 dark:bg-blue-200/10 mt-2 h-5 rounded-md flex justify-start relative overflow-hidden">
          <div
            className="absolute h-full bg-indigo-600  transition-[width] duration-1000"
            style={{
              width: `${progressBarWidth}%`,
              borderRadius: "inherit",
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
                  { hour: "2-digit", minute: "2-digit" }
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
  }, [
    employee_id,
    token,
    calculateProgress,
    handlePunchButtonClick,
    ProgressBar,
  ]);

  return (
    <div className="md:grid grid-cols-12 flex flex-col gap-10 md:gap-2">
      <div className="col-span-12 md:col-span-6">
        <h1 className="text-blue-500 text-2xl font-bold">
          {getGreetingMessage()}, {getFirstName(userData?.employeeData.name)}!
        </h1>
      </div>

      <div className="col-span-12 md:col-span-6 flex flex-col items-start md:items-end ">
        <div className="flex items-center gap-2">
          {loading ? null : hasTodaysAttendance ? (
            isPunchedIn ? (
              <button
                className="px-2 py-1.5 rounded-md flex items-center gap-1 text-xs font-bold hover:bg-sky-50 text-red-500 bg-sky-100 dark:bg-gray-800 transition-all duration-1000"
                onClick={handlePunchButtonClick}
              >
                Punch Out <IoLogOut fontSize={20} />
              </button>
            ) : (
              <button
                className="px-2 py-1.5 rounded-md flex items-center gap-1 text-xs font-bold hover:bg-sky-50 text-green-500 bg-sky-100 dark:bg-gray-800 transition-all duration-1000"
                onClick={handlePunchButtonClick}
              >
                Punch In <IoLogIn fontSize={20} />
              </button>
            )
          ) : (
            <button
              className="px-2 py-1.5 rounded-md flex items-center gap-1 text-xs font-bold hover:bg-sky-50 text-green-500 bg-sky-100 dark:bg-gray-800 transition-all duration-1000"
              onClick={handlePunchButtonClick}
            >
              Punch In <IoLogIn fontSize={20} />
            </button>
          )}
        </div>
        <Link
          to="/Attendance"
          className="flex items-center text-xs text-blue-500 py-0.5 hover:px-1 rounded-md cursor-pointer duration-300 mt-1 hover:bg-blue-500/15"
        >
          <h3>History</h3>
          <FaCaretRight />
        </Link>
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
