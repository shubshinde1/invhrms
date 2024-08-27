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

  const getLeaveRecord = async () => {
    try {
      const response = await fetch(ApiendPonits.viewleaverecords, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          employee_id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || "Failed to fetch leave records.");
      }

      const data = await response.json();
      const { holidays } = data;
      const currentYear = new Date().getFullYear();
      const today = new Date();

      const filterCurrentYear = (arr) =>
        arr.filter((item) => new Date(item.date).getFullYear() === currentYear);

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

  useEffect(() => {
    if (employee_id) {
      getLeaveRecord();
    }
  }, [employee_id, token]);
  return (
    <div className="">
      <div className="">
        <div className="grid grid-cols-12 md:grid-rows-12 xl:h-screen gap-2 md:mb-28 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className=" col-span-12 xl:col-span-9 h-fit bg-white dark:bg-neutral-950 dark:text-white p-4 rounded-md "
          >
            <Greeting />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            // className=" col-span-12 xl:col-span-3 pb-4 md:pb-4 mb-16 sm:mt-0 md:-mt-9 lg:-mt-9 xl:mt-0 2xl:-mt-7 md:row-span-2 xl:row-span-12 bg-white dark:bg-neutral-950 dark:text-white rounded-md 2xl:fixed 2xl:right-2 2xl:top-24"
            className="col-span-12  xl:col-span-3 -mt-2 md:-mt-20 lg:-mt-[5.7rem] xl:-mt-2"
          >
            <DashCalendar
              mandatoryholiday={holidays.mandatoryholiday}
              optionalholiday={holidays.optionalholiday}
              weekendHoliday={holidays.weekendHoliday}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: -1 }}
            transition={{ duration: 0.8 }}
            className=" col-span-12 xl:col-span-9 row-span-12 mb-1 xl:mt-24 2xl:mt-[7.2rem] mt-16"
          >
            <Bodycards />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
