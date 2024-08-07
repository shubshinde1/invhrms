import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaCalculator } from "react-icons/fa6";
import { BiSolidHappyHeartEyes } from "react-icons/bi";
import { MdFestival } from "react-icons/md";
import Tooltip from "@mui/material/Tooltip";

const UserLeave = () => {
  return (
    <div className="bg-neutral-950 rounded-md dark:text-white">
      <div className="p-2 grid grid-cols-11 sm:grid-cols-12 lg:grid-cols-12 gap-2">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="col-span-12 sm:col-span-6 lg:col-span-3 border-2 dark:border-0 dark:bg-neutral-900 rounded-md p-2 flex flex-col gap-3"
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
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="col-span-6 lg:col-span-3 border-2 dark:border-0 dark:bg-neutral-900 rounded-md p-2 flex flex-col gap-3"
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
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="col-span-6 lg:col-span-3 border-2 dark:border-0 dark:bg-neutral-900 rounded-md p-2 flex flex-col gap-3"
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
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0 }}
          className="col-span-12 lg:col-span-3 border-2 dark:border-0 dark:bg-neutral-900 rounded-md p-2 flex flex-col gap-3"
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
      </div>
    </div>
  );
};

export default UserLeave;
