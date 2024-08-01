import React from "react";
import { NavLink, useLocation } from "react-router-dom";

const MenuTabs = () => {
  const location = useLocation();

  return (
    <div className="bg-white dark:bg-neutral-950 dark:text-white rounded-md p-2 sticky top-0 mb-2 z-0">
      <ul className="flex gap-2">
        <li
          className={` text-sm px-3 py-1.5 rounded-md ${
            location.pathname === "/pim/employeelist"
              ? "bg-[#5336FD] text-white font-bold "
              : "bg-sky-50 dark:bg-neutral-800"
          }`}
        >
          <NavLink to="/pim/employeelist">Employee List</NavLink>
        </li>
        <li
          className={` text-sm px-3 py-1.5 rounded-md ${
            location.pathname === "/pim/addemployee"
              ? "bg-[#5336FD] text-white font-bold"
              : "bg-sky-50 dark:bg-neutral-800"
          }`}
        >
          <NavLink to="/pim/addemployee">Add Employee</NavLink>
        </li>
        <li
          className={` text-sm px-3 py-1.5 rounded-md ${
            location.pathname === "/pim/addleave"
              ? "bg-[#5336FD] text-white font-bold"
              : "bg-sky-50 dark:bg-neutral-800"
          }`}
        >
          <NavLink to="/pim/addleave">Add Leaves</NavLink>
        </li>
      </ul>
    </div>
  );
};

export default MenuTabs;
