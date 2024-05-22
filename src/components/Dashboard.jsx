import React from "react";
import Greeting from "./dashboard/Greeting";
import Calendar from "./dashboard/Calendar";
import Bodycards from "./dashboard/Bodycards";
import { motion } from "framer-motion";

export default function dashboard() {
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
            className=" col-span-12 xl:col-span-3 pb-4 md:pb-4 mb-16 sm:mt-0 md:-mt-9 lg:-mt-9 xl:mt-0 2xl:-mt-4 md:row-span-2 xl:row-span-12 bg-white dark:bg-neutral-950 dark:text-white rounded-md 2xl:fixed 2xl:right-2 2xl:top-24"
          >
            <Calendar />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: -1 }}
            transition={{ duration: 0.8 }}
            className=" col-span-12 xl:col-span-9 xl:mt-20 2xl:mt-24 row-span-12 mb-10 "
          >
            <Bodycards />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
