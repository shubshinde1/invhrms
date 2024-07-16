// src/lib/consts/navigation.jsx
import { FaAddressBook } from "react-icons/fa";
import { MdSpaceDashboard } from "react-icons/md";
import { IoPersonAdd } from "react-icons/io5";
import { RiServiceFill } from "react-icons/ri";
import { HiMiniCodeBracketSquare } from "react-icons/hi2";
import { RiShieldUserFill } from "react-icons/ri";
import { BsPeopleFill } from "react-icons/bs";

export const DASHBOARD_SIDEBAR_LINKS = [
  {
    key: "dashboard",
    label: "Dashboard",
    path: "/",
    icon: <MdSpaceDashboard />,
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
      {
        key: "employee",
        label: "Add Employee",
        path: "/pim/addemployee",
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
  {
    key: "user",
    label: "User",
    path: "/user",
    icon: <RiShieldUserFill />,
    allowedAuth: [1], // only admin can access
  },
];

export const DASHBOARD_SIDEBAR_BOTTOM_LINKS = [
  //   {
  //     key: "setting",
  //     label: "Settings",
  //     path: "/setting",
  //     icon: <RiSettingsFill />,
  //   },
  //   {
  //     key: "logout",
  //     label: "Log out",
  //     path: "/logout",
  //     icon: <IoExit />,
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
