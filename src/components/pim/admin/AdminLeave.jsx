import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import { motion } from "framer-motion";
import { FaCalculator } from "react-icons/fa6";
import { BiSolidHappyHeartEyes } from "react-icons/bi";
import { MdFestival } from "react-icons/md";
import Tooltip from "@mui/material/Tooltip";
import ApiendPonits from "../../../../src/api/APIEndPoints.json";
import OpenCalendar from "../../../components/custom/OpenCalendar";
import { FaSave, FaSadTear } from "react-icons/fa";
import { useParams } from "react-router-dom";
// import ApplyLeave from "./ApplyLeave";
import LeaveHistory from "./EmployeeLeaveHistory";
import { FaCalendarAlt, FaListAlt } from "react-icons/fa";
import { RiRefreshLine } from "react-icons/ri";

const AdminLeave = () => {
  const { _id } = useParams(); // Get the employee ID from URL params
  const { userData } = useContext(AuthContext);
  const employee_id = _id;
  const token = localStorage.getItem("accessToken");

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
  const [loading, setLoading] = useState(false); // Track loading state
  const [message, setMessage] = useState("");

  const [holidays, setHolidays] = useState({
    mandatoryholiday: [],
    optionalholiday: [],
    weekendHoliday: [],
    leaves: {},
  });

  const [activeTab, setActiveTab] = useState("calendar");

  const [error, setError] = useState(null);

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
        (holidays.optionalholiday?.total > 0
          ? holidays.optionalholiday?.total
          : 0) +
        (holidays.leaves?.total || 0);

      const allRemainings =
        holidays.leaves?.available +
        remainingMandatoryHolidays +
        (holidays.optionalholiday?.available > 0
          ? holidays.optionalholiday?.available
          : 0);

      setAllTotalLeaves(totalHolidays);
      setAllRemaining(allRemainings);

      setHolidays({
        mandatoryholiday: mandatoryHolidayCurrentYear,
        optionalholiday: holidays.optionalholiday?.optionalholidaylist || [],
        weekendHoliday: weekendHolidayCurrentYear,
        // leaves: holidays.leaves,
      });

      // console.log({
      //   mandatoryHolidayCurrentYear,
      //   optionalHolidayCurrentYear,
      //   weekendHolidayCurrentYear,
      //   totalHolidays,
      // });
    } catch (error) {
      setError(error.message || "Error fetching holidays. Please try again.");
      console.error(error);
    }
  };

  useEffect(() => {
    if (employee_id) {
      getLeaveRecord();
    }
  }, [employee_id]);

  const syncleavelabalce = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${ApiendPonits.baseUrl}${ApiendPonits.endpoints.updateleavebalancefornewemp}`,
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
        getLeaveRecord();
        setMessage("Fetched");
      } else {
        // setErrors(data.msg || "Failed to fetch leave history.");
      }
    } catch (error) {
      // setErrors(error.message || "Error fetching leave history.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-neutral-950 rounded-md dark:text-white p-2 flex flex-col gap-2 mb-16">
      <div
        className={`grid gap-2 ${
          totalOptionalHoliday > 0
            ? "grid-cols-1 xl:grid-cols-5"
            : "grid-cols-2 xl:grid-cols-4"
        }`}
      >
        {/* Total Leaves */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className=" border-2 dark:border-0 dark:bg-neutral-900 rounded-md p-2 flex flex-col gap-3"
        >
          <div className="flex items-center gap-2">
            <div className="bg-sky-500/15 rounded-md p-2">
              <FaCalculator fontSize={20} className="text-sky-600" />
            </div>
            <h2 className="font-bold">Total Leaves</h2>
          </div>
          <h2 className="flex items-end justify-end">
            <span className="text-4xl font-bold text-gray-300 cursor-pointer">
              <Tooltip title="Available" placement="top" arrow>
                <span>{allRemaining}</span>
              </Tooltip>
            </span>
            /
            <span className="cursor-pointer">
              <Tooltip title="Total" placement="top" arrow>
                <span>{allTotalLeaves}</span>
              </Tooltip>
            </span>
          </h2>
        </motion.div>

        {/* Leaves Holidays */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className=" border-2 dark:border-0 dark:bg-neutral-900 rounded-md p-2 flex flex-col gap-3 group"
        >
          <div className="flex items-center gap-2">
            <div className="bg-green-500/15 rounded-md p-2">
              <BiSolidHappyHeartEyes fontSize={20} className="text-green-500" />
            </div>
            <h2 className="font-bold">Leaves</h2>
          </div>
          <div className="flex items-end justify-between">
            <button
              onClick={syncleavelabalce}
              className="bg-sky-50 dark:bg-neutral-950 dark:hover:bg-neutral-800 hover:bg-sky-100 p-1.5 rounded-md  flex items-center gap-1 text-xs"
            >
              <RiRefreshLine
                fontSize={15}
                className={loading ? "animate-spin" : ""}
              />
              <span>Sync</span>
            </button>
            <h2 className="flex items-end justify-end">
              {/* <span className="text-4xl font-bold text-gray-300 cursor-pointer">
              <Tooltip title="Consumed" placement="top" arrow>
                <span>{consumedLeaves}</span>
              </Tooltip>
            </span>
            / */}
              <span className="text-4xl font-bold text-gray-300 cursor-pointer">
                <Tooltip title="Available" placement="top" arrow>
                  <span>{availableLeaves}</span>
                </Tooltip>
              </span>
              /
              <span className="cursor-pointer">
                <Tooltip title="Total" placement="top" arrow>
                  <span>{totalLeaves}</span>
                </Tooltip>
              </span>
            </h2>
          </div>
        </motion.div>

        {/* Mandatory Holidays */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className=" border-2 dark:border-0 dark:bg-neutral-900 rounded-md p-2 flex flex-col gap-3"
        >
          <div className="flex items-center gap-2">
            <div className="bg-pink-500/15 rounded-md p-2">
              <MdFestival fontSize={20} className="text-pink-500" />
            </div>
            <h2 className="font-bold">Mandatory Holidays</h2>
          </div>
          <h2 className="flex items-end justify-end">
            <span className="text-4xl font-bold text-gray-300 cursor-pointer">
              <Tooltip title="Remaining" placement="top" arrow>
                <span>{remainingMandatoryHoliday}</span>
              </Tooltip>
            </span>
            /
            <span className="cursor-pointer">
              <Tooltip title="Total" placement="top" arrow>
                <span>{totalMandatoryHoliday}</span>
              </Tooltip>
            </span>
          </h2>
        </motion.div>

        {/* Optional Holidays */}
        {totalOptionalHoliday > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className=" border-2 dark:border-0 dark:bg-neutral-900 rounded-md p-2 flex flex-col gap-3"
          >
            <div className="flex items-center gap-2">
              <div className="bg-yellow-500/15 rounded-md p-2">
                <FaCalculator fontSize={20} className="text-yellow-500" />
              </div>
              <h2 className="font-bold">Optional Holidays</h2>
            </div>
            <h2 className="flex items-end justify-end">
              <span className="text-4xl font-bold text-gray-300 cursor-pointer">
                <Tooltip title="Available" placement="top" arrow>
                  <span>{availableOptionalHoliday}</span>
                </Tooltip>
              </span>
              /
              <span className="cursor-pointer">
                <Tooltip title="Total" placement="top" arrow>
                  <span>{totalOptionalHoliday}</span>
                </Tooltip>
              </span>
            </h2>
          </motion.div>
        ) : (
          ""
        )}

        {/* Weekend Holidays */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className=" border-2 dark:border-0 dark:bg-neutral-900 rounded-md p-2 flex flex-col gap-3"
        >
          <div className="flex items-center gap-2">
            <div className="bg-red-500/15 rounded-md p-2">
              <FaSadTear fontSize={20} className="text-red-500" />
            </div>
            <h2 className="font-bold">Weekend Holidays</h2>
          </div>
          <h2 className="flex items-end justify-end">
            <span className="text-4xl font-bold text-gray-300 cursor-pointer">
              <Tooltip title="Remaining" placement="top" arrow>
                <span>{remainingWeekendHoliday}</span>
              </Tooltip>
            </span>
            /
            <span className="cursor-pointer">
              <Tooltip title="Total" placement="top" arrow>
                <span>{totalWeekendHoliday}</span>
              </Tooltip>
            </span>
          </h2>
        </motion.div>
      </div>

      <div className="">
        <LeaveHistory getLeaveRecord={getLeaveRecord} />
      </div>
    </div>
  );
};

export default AdminLeave;
