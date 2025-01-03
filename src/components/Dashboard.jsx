import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";
import Greeting from "./dashboard/Greeting";
import DashCalendar from "../components/custom/DashCalendar";
import Bodycards from "./dashboard/Bodycards";
import { motion } from "framer-motion";
import ApiendPonits from "../../src/api/APIEndPoints.json";

export default function dashboard() {
  const { userData } = useContext(AuthContext);
  const employee_id = userData?.employeeData._id;
  const token = localStorage.getItem("accessToken");
  const [error, setError] = useState(null);

  const [totalLeaves, setTotalLeaves] = useState(0);
  const [availableLeaves, setAvailableLeaves] = useState(0);
  const [consumedLeaves, setConsumedLeaves] = useState(0);
  const [totalMandatoryHoliday, setTotalMandatoryHoliday] = useState(0);
  const [totalOptionalHoliday, setTotalOptionalHoliday] = useState(0);
  const [availableOptionalHoliday, setAvailableOptionalHoliday] = useState(0);
  const [totalWeekendHoliday, setTotalWeekendHoliday] = useState(0);
  const [remainingMandatoryHoliday, setRemainingMandatoryHoliday] = useState(0);
  const [remainingWeekendHoliday, setRemainingWeekendHoliday] = useState(0);
  const [allTotalLeaves, setAllTotalLeaves] = useState(0);
  const [allRemaining, setAllRemaining] = useState(0);

  const [holidays, setHolidays] = useState({
    mandatoryholiday: [],
    optionalholiday: [],
    weekendHoliday: [],
    leaves: {},
  });
  useEffect(() => {
    const getLeaveRecord = async () => {
      try {
        const response = await fetch(
          `${ApiendPonits.baseUrl}${ApiendPonits.endpoints.viewleaverecords}`,
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

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.msg || "Failed to fetch leave records.");
        }

        const data = await response.json();

        const { holidays } = data;
        const currentYear = new Date().getFullYear();
        const today = new Date();

        const filterCurrentYear = (arr) =>
          arr.filter(
            (item) => new Date(item.date)
            // .getFullYear() === currentYear
          );

        const mandatoryHolidayCurrentYear = filterCurrentYear(
          holidays.mandatoryholiday || []
        );
        const optionalHolidayCurrentYear = filterCurrentYear(
          holidays.optionalholiday?.optionalholidaylist || []
        );
        const weekendHolidayCurrentYear = filterCurrentYear(
          holidays.weekendHoliday || []
        );

        const remainingMandatoryHolidays = mandatoryHolidayCurrentYear.filter(
          (holiday) => new Date(holiday.date) > today
        ).length;

        const remainingWeekendHolidays = weekendHolidayCurrentYear.filter(
          (holiday) => new Date(holiday.date) > today
        ).length;

        setTotalLeaves(holidays.leaves?.total || 0);
        setAvailableLeaves(holidays.leaves?.available || 0);
        setConsumedLeaves(holidays.leaves?.consume || 0);
        setTotalMandatoryHoliday(mandatoryHolidayCurrentYear.length || 0);
        setTotalOptionalHoliday(holidays.optionalholiday?.total || 0);
        setAvailableOptionalHoliday(holidays.optionalholiday?.available || 0);
        setTotalWeekendHoliday(weekendHolidayCurrentYear.length || 0);
        setRemainingMandatoryHoliday(remainingMandatoryHolidays);
        setRemainingWeekendHoliday(remainingWeekendHolidays);

        const totalHolidays =
          mandatoryHolidayCurrentYear.length +
          holidays.optionalholiday?.total +
          weekendHolidayCurrentYear.length +
          (holidays.leaves?.total || 0);

        const allRemainings =
          holidays.leaves?.available +
          remainingMandatoryHolidays +
          holidays.optionalholiday?.available +
          remainingWeekendHolidays;

        setAllTotalLeaves(totalHolidays);
        setAllRemaining(allRemainings);

        setHolidays({
          mandatoryholiday: mandatoryHolidayCurrentYear,
          optionalholiday: holidays.optionalholiday?.optionalholidaylist || [],
          weekendHoliday: weekendHolidayCurrentYear,
          // leaves: holidays.leaves,
        });
      } catch (error) {
        setError(error.message || "Error fetching holidays. Please try again.");
        console.error(error);
      }
    };

    getLeaveRecord();
  }, [employee_id, token]);

  // <motion.div
  //           initial={{ opacity: 0, y: 15 }}
  //           animate={{ opacity: 1, y: 0 }}
  //           transition={{ duration: 0.5 }}

  return (
    <div className="h-full min-h-screen flex flex-col">
      <div className="grid grid-cols-12 gap-2 ">
        <div className="col-span-12 lg:col-span-9 flex flex-col gap-2">
          <div className="bg-white dark:bg-neutral-950 rounded-md p-2 dark:text-white">
            <Greeting />
          </div>
          <div>
            <Bodycards />
          </div>
        </div>
        <div className="col-span-12 lg:col-span-3 ">
          <DashCalendar
            mandatoryholiday={holidays.mandatoryholiday}
            optionalholiday={holidays.optionalholiday}
            weekendHoliday={holidays.weekendHoliday}
          />
        </div>
      </div>
    </div>
  );
}
