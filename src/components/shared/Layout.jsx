import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { motion } from "framer-motion";

const Layout = ({ handleThemeSwitch, theme }) => {
  return (
    <div className="bg-[#D9D9D9] dark:bg-neutral-900 flex flex-row h-screen w-screen overflow-hidden">
      <Sidebar className="z-10" theme={theme} />
      <div className="flex-1">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Header
            theme={theme}
            handleThemeSwitch={handleThemeSwitch}
            className="z-50"
          />
        </motion.div>
        <div className="px-2 overflow-scroll h-[98vh] scrollbar-hide">
          {<Outlet className="z-40" theme={theme} />}
        </div>
      </div>
    </div>
  );
};

export default Layout;
