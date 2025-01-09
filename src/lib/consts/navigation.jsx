// src/lib/consts/navigation.jsx
import { FaAddressBook } from "react-icons/fa";
import { IoPersonAdd } from "react-icons/io5";
import { FaCalendarCheck, FaCalendarDays } from "react-icons/fa6";
import { RiServiceFill } from "react-icons/ri";
import { HiMiniCodeBracketSquare } from "react-icons/hi2";
import { RiShieldUserFill } from "react-icons/ri";
import { BsPeopleFill } from "react-icons/bs";
import { FaBusinessTime } from "react-icons/fa6";
import { TbLayoutDashboardFilled } from "react-icons/tb";
import { HiUser } from "react-icons/hi2";

export const DASHBOARD_SIDEBAR_LINKS = [
  {
    key: "dashboard",
    label: "Dashboard",
    path: "/",
    icon: <TbLayoutDashboardFilled />,
    allowedAuth: [0, 1], // both employee and admin can access
  },
  {
    key: "Pim",
    label: "PIM",
    path: "/pim",
    icon: <BsPeopleFill />,
    allowedAuth: [1], // only admin can access
    subItems: [
      {
        key: "employeelist",
        label: "Employee List",
        path: "/pim/employeelist",
        icon: <FaAddressBook />,
        allowedAuth: [1], // only admin can access
      },
      // {
      //   key: "employee",
      //   label: "Add Employee",
      //   path: "/pim/addemployee",
      //   icon: <IoPersonAdd />,
      //   allowedAuth: [1], // only admin can access
      // },
      {
        key: "leave",
        label: "Add Holidays",
        path: "/pim/addholidays",
        icon: <IoPersonAdd />,
        allowedAuth: [1], // only admin can access
      },
    ],
  },
  {
    key: "clients",
    label: "Clients",
    path: "/clients",
    icon: <RiServiceFill />,
    allowedAuth: [1], // only admin can access
  },
  {
    key: "projects",
    label: "Projects",
    path: "/projects",
    icon: <HiMiniCodeBracketSquare />,
    allowedAuth: [1], // only admin can access
  },
  // {
  //   key: "user",
  //   label: "User",
  //   path: "/user",
  //   icon: <RiShieldUserFill />,
  //   allowedAuth: [1], // only admin can access
  // },
  {
    key: "timesheet",
    label: "Timesheet",
    path: "/timesheet",
    icon: <FaBusinessTime />,
    allowedAuth: [0], // user only
  },
  {
    key: "Attendance",
    label: "Attendance",
    path: "/Attendance",
    icon: <FaCalendarDays />,
    allowedAuth: [0], // user only
  },
  {
    key: "leave",
    label: "Leave",
    path: "/leave",
    icon: <FaCalendarCheck />,
    allowedAuth: [0], // user only
  },
  {
    key: "profile",
    label: "Profile",
    path: "/myprofile",
    icon: <HiUser />,
    allowedAuth: [0], // user only
  },
];

export const DASHBOARD_SIDEBAR_BOTTOM_LINKS = [
  //   {
  //     key: "setting",
  //     label: "Settings",
  //     path: "/setting",
  //     icon: <RiSettingsFill />,
  //   },
];

export const getFilteredLinks = (auth) => {
  return DASHBOARD_SIDEBAR_LINKS.filter((link) =>
    link.allowedAuth.includes(auth)
  ).map((link) => {
    if (link.subItems) {
      link.subItems = link.subItems.filter((subItem) =>
        subItem.allowedAuth.includes(auth)
      );
    }
    return link;
  });
};
