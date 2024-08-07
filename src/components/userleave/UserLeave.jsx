import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { motion } from "framer-motion";
import { FaCalculator } from "react-icons/fa6";
import { BiSolidHappyHeartEyes } from "react-icons/bi";
import { MdFestival } from "react-icons/md";
import Tooltip from "@mui/material/Tooltip";
const token = localStorage.getItem("accessToken");
import ApiendPonits from "../../../src/api/APIEndPoints.json";

const UserLeave = () => {
  const { userData } = useContext(AuthContext);
  const employee_id = userData?.employeeData._id;

  const [totalLeaves, setTotalLeaves] = useState(0);
  const [availableLeaves, setAvailableLeaves] = useState(0);
  const [consumedLeaves, setConsumedLeaves] = useState(0);
  const [totalMandatoryHoliday, setTotalMandatoryHoliday] = useState(0);
  const [totalOptionalHoliday, setTotalOptionalHoliday] = useState(0);
  const [availableOptionalHoliday, setAvailableOptionalHoliday] = useState(0);
  const [totalWeekendHoliday, setTotalWeekendHoliday] = useState(0);

  const [error, setError] = useState(null);

  //   useEffect(() => {
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
      const data = await response.json();
      if (data.success) {
        setTotalLeaves(data.leaves?.total || 0);
        setAvailableLeaves(data.leaves?.available || 0);
        setConsumedLeaves(data.leaves?.consume || 0);
        setTotalMandatoryHoliday(data.mandatoryholiday?.length || 0);
        setTotalOptionalHoliday(
          data.optionalholiday?.optionalholidaylist?.length || 0
        );
        setAvailableOptionalHoliday(data.optionalholiday?.available || 0);
        setTotalWeekendHoliday(data.weekendHoliday?.length || 0);
        console.log(data.holidays);
      } else {
        setError("Failed to fetch holidays.");
      }
    } catch (error) {
      setError("Error fetching holidays. Please try again.");
      console.error(error);
    }
  };

  getLeaveRecord();
  //   }, [employee_id, token]);
  return (
    <div className="bg-neutral-950 rounded-md dark:text-white">
      <div className="p-2 grid grid-cols-12 xl:grid-cols-5 gap-2">
        {/* Total Leaves Holidays */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="col-span-6 lg:col-span-4 xl:col-span-1 border-2 dark:border-0 dark:bg-neutral-900 rounded-md p-2 flex flex-col gap-3"
        >
          <div className="flex items-center gap-2">
            <div className="bg-sky-200  rounded-md p-2">
              <FaCalculator fontSize={20} className="text-sky-600" />
            </div>
            <h2 className="font-bold">Total Leaves</h2>
          </div>
          <h2 className="flex items-end justify-end">
            <span className="text-4xl font-bold text-gray-300 cursor-pointer">
              <Tooltip title="Available" placement="top" arrow>
                <span>20</span>
              </Tooltip>
            </span>
            /
            <span className="cursor-pointer">
              <Tooltip title="Total" placement="top" arrow>
                <span>20</span>
              </Tooltip>
            </span>
          </h2>
        </motion.div>
        {/* Leaves Holidays */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="col-span-6 lg:col-span-4 xl:col-span-1 border-2 dark:border-0 dark:bg-neutral-900 rounded-md p-2 flex flex-col gap-3"
        >
          <div className="flex items-center gap-2">
            <div className="bg-green-100 rounded-md p-2">
              <BiSolidHappyHeartEyes fontSize={20} className="text-green-500" />
            </div>
            <h2 className="font-bold">Leaves</h2>
          </div>
          <h2 className="flex items-end justify-end">
            <span className="text-4xl font-bold text-gray-300 cursor-pointer">
              <Tooltip title="Available" placement="top" arrow>
                <span>0</span>
              </Tooltip>
            </span>
            /
            <span className="cursor-pointer">
              <Tooltip title="Total" placement="top" arrow>
                <span>20</span>
              </Tooltip>
            </span>
          </h2>
        </motion.div>
        {/* Mandatory Holidays*/}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="col-span-6 lg:col-span-4 xl:col-span-1 border-2 dark:border-0 dark:bg-neutral-900 rounded-md p-2 flex flex-col gap-3"
        >
          <div className="flex items-center gap-2">
            <div className="bg-pink-100 rounded-md p-2">
              <MdFestival fontSize={20} className="text-pink-500" />
            </div>
            <h2 className="font-bold">Mandatory Holidays</h2>
          </div>
          <h2 className="flex items-end justify-end">
            <span className="text-4xl font-bold text-gray-300 cursor-pointer">
              <Tooltip title="Mandatory" placement="top" arrow>
                <span>20</span>
              </Tooltip>
            </span>
            /
            <span className="cursor-pointer">
              <Tooltip title="Total" placement="top" arrow>
                <span>20</span>
              </Tooltip>
            </span>
          </h2>
        </motion.div>
        {/* Optional Holidays */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0 }}
          className="col-span-6 lg:col-span-4 xl:col-span-1 border-2 dark:border-0 dark:bg-neutral-900 rounded-md p-2 flex flex-col gap-3"
        >
          <div className="flex items-center gap-2">
            <div className="bg-yellow-100 rounded-md p-2">
              <MdFestival fontSize={20} className="text-yellow-500" />
            </div>
            <h2 className="font-bold">Optional Holidays</h2>
          </div>
          <h2 className="flex items-end justify-end">
            <span className="text-4xl font-bold text-gray-300 cursor-pointer">
              <Tooltip title="Optional" placement="top" arrow>
                <span>20</span>
              </Tooltip>
            </span>
            /
            <span className="cursor-pointer">
              <Tooltip title="Total" placement="top" arrow>
                <span>20</span>
              </Tooltip>
            </span>
          </h2>
        </motion.div>
        {/* Weekend Holidays */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0 }}
          className="col-span-6 lg:col-span-4 xl:col-span-1 border-2 dark:border-0 dark:bg-neutral-900 rounded-md p-2 flex flex-col gap-3"
        >
          <div className="flex items-center gap-2">
            <div className="bg-yellow-100 rounded-md p-2">
              <MdFestival fontSize={20} className="text-yellow-500" />
            </div>
            <h2 className="font-bold">Weekend Holidays</h2>
          </div>
          <h2 className="flex items-end justify-end">
            <span className="text-4xl font-bold text-gray-300 cursor-pointer">
              <Tooltip title="Optional" placement="top" arrow>
                <span>20</span>
              </Tooltip>
            </span>
            /
            <span className="cursor-pointer">
              <Tooltip title="Total" placement="top" arrow>
                <span>20</span>
              </Tooltip>
            </span>
          </h2>
        </motion.div>
      </div>
    </div>
  );
};

export default UserLeave;
