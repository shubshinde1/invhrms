import React, { useState, useEffect, useContext } from "react";
import { IoLogIn, IoLogOut } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";

const ONE_HOUR_IN_SECONDS = 3600;
const NINE_HOURS_IN_SECONDS = 9 * ONE_HOUR_IN_SECONDS;

export default function Greeting() {
  const { userData } = useContext(AuthContext);

  const navigate = useNavigate();

  const [isPunchedIn, setIsPunchedIn] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [remainingTime, setRemainingTime] = useState(NINE_HOURS_IN_SECONDS);
  const [punchInTime, setPunchInTime] = useState(null);
  const [punchOutTime, setPunchOutTime] = useState(null);

  useEffect(() => {
    const storedStartTime = sessionStorage.getItem("startTime");
    const storedPunchInTime = sessionStorage.getItem("punchInTime");
    const storedPunchOutTime = sessionStorage.getItem("punchOutTime");
    if (storedStartTime) {
      const currentTime = Date.now();
      const elapsedTime = Math.floor(
        (currentTime - parseInt(storedStartTime, 10)) / 1000
      );
      if (elapsedTime < NINE_HOURS_IN_SECONDS) {
        setStartTime(parseInt(storedStartTime, 10));
        setRemainingTime(NINE_HOURS_IN_SECONDS - elapsedTime);
        setIsPunchedIn(true);
      } else {
        sessionStorage.removeItem("startTime");
      }
    }
    if (storedPunchInTime) {
      setPunchInTime(
        new Date(parseInt(storedPunchInTime, 10)).toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
        })
      );
    }
    if (storedPunchOutTime) {
      setPunchOutTime(
        new Date(parseInt(storedPunchOutTime, 10)).toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
        })
      );
    }
  }, []);

  useEffect(() => {
    let timer;
    if (isPunchedIn) {
      const interval = setInterval(() => {
        setRemainingTime((prevTime) => {
          if (prevTime <= 0) {
            clearInterval(timer);
            setIsPunchedIn(false);
            sessionStorage.removeItem("startTime");
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
      timer = interval;
    }
    return () => clearInterval(timer);
  }, [isPunchedIn]);

  const handleClick = async () => {
    const mark = isPunchedIn ? "Out" : "In";
    const endpoint = "http://localhost:3000/api/attendance";
    const token = localStorage.getItem("accessToken");

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          employee_id: userData.employeeData._id,
          mark,
        }),
      });

      const data = await response.json();
      console.log(data);

      if (data.success) {
        const currentTime = Date.now();
        if (mark === "In") {
          sessionStorage.setItem("startTime", currentTime);
          setStartTime(currentTime);
          sessionStorage.setItem("punchInTime", currentTime);
          setPunchInTime(
            new Date(currentTime).toLocaleTimeString([], {
              hour: "numeric",
              minute: "2-digit",
            })
          );
          setIsPunchedIn(true);
        } else {
          sessionStorage.setItem("punchOutTime", currentTime);
          setPunchOutTime(
            new Date(currentTime).toLocaleTimeString([], {
              hour: "numeric",
              minute: "2-digit",
            })
          );
          setIsPunchedIn(false);
          sessionStorage.removeItem("startTime");
          sessionStorage.removeItem("punchInTime");
        }
      } else {
        const error = data.msg;
        localStorage.removeItem("accessToken");
        navigate("/login");
        return error;
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const progressBarWidth =
    ((NINE_HOURS_IN_SECONDS - remainingTime) / NINE_HOURS_IN_SECONDS) * 100;

  const formatTime = (timeInSeconds) => {
    const hours = Math.floor(timeInSeconds / ONE_HOUR_IN_SECONDS);
    const minutes = Math.floor((timeInSeconds % ONE_HOUR_IN_SECONDS) / 60);
    return `${hours}h ${minutes}m`;
  };

  const completedHours = Math.floor(
    (NINE_HOURS_IN_SECONDS - remainingTime) / ONE_HOUR_IN_SECONDS
  );
  const completedMinutes = Math.floor(
    ((NINE_HOURS_IN_SECONDS - remainingTime) % ONE_HOUR_IN_SECONDS) / 60
  );

  return (
    <div className="">
      <div className="flex flex-col md:flex-row justify-between ">
        <div className="md:w-1/2 flex flex-col md:justify-between">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl md:text-2xl font-bold text-[#3C5EFE]">
              Good Morning {userData ? userData.employeeData.name : ""}
            </h2>
            <h2>You have 24 new tasks. It's a lot of work today!</h2>
          </div>
          <Link to="/Task">
            <button className="bg-[#5336FD] px-4 py-2 text-white rounded-md mt-5 hidden md:flex">
              View Tasks
            </button>
          </Link>
        </div>
        <div className="flex flex-col items-start md:items-end  md:w-1/2 mt-5 md:mt-0">
          <div className="flex items-center gap-2">
            <button
              className={`px-2 py-1.5 rounded-md flex items-center gap-1 text-xs font-bold hover:bg-sky-50  ${
                isPunchedIn ? "text-red-500" : "text-green-500"
              } text-green-500 bg-sky-100 dark:bg-gray-800 transition-all duration-1000`}
              onClick={handleClick}
            >
              {isPunchedIn ? (
                <>
                  Punch Out <IoLogOut fontSize={20} />
                </>
              ) : (
                <>
                  Punch In <IoLogIn fontSize={20} />
                </>
              )}
            </button>
          </div>
          <div className="w-full sm:w-2/3 mt-4">
            <div className="flex justify-between text-xs">
              <span className="flex flex-col items-end">
                {completedHours}h {completedMinutes}m Completed
              </span>
              <span className="flex flex-col items-end">
                {formatTime(remainingTime)} Remaining
              </span>
            </div>
            <div className="bg-sky-100 dark:bg-gray-800 mt-2 h-5 rounded-md flex justify-start relative overflow-hidden">
              <div
                className="absolute h-full bg-[#5336FD] transition-width duration-1000"
                style={{
                  width: `${progressBarWidth}%`,
                  borderRadius: "inherit",
                }}
              ></div>
            </div>
            <div className="flex justify-between text-xs mt-2">
              <span>In - {punchInTime || "-- : --"}</span>
              <span>Out - {punchOutTime || "-- : --"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
