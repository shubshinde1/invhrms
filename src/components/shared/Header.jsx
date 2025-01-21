import React, { useState, useContext, useEffect, useRef } from "react";
import { AuthContext } from "../../contexts/AuthContext";

import { IoNotifications, IoPerson } from "react-icons/io5";
import { RiSettingsFill } from "react-icons/ri";
import { Popover, Transition, Menu } from "@headlessui/react";
import { Fragment } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { DASHBOARD_SIDEBAR_LINKS } from "../../lib/consts/navigation";
import classNames from "classnames";
import LogoutMenuItem from "./LogoutMenuItem"; // Import the LogoutMenuItem component
import { TbMoonFilled } from "react-icons/tb";
import { MdLightMode } from "react-icons/md";
import { motion } from "framer-motion";
import userprofile from "../../assets/images/clientAvatar.png";
import { FaCaretDown } from "react-icons/fa6";
import ApiendPonits from "../../api/APIEndPoints.json";
import { Tooltip } from "@mui/material";

export default function Header({ handleThemeSwitch, theme }) {
  const { userData } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [rotate, setRotate] = React.useState(false);
  const [visible, setVisible] = useState(false);
  const [profile, setProfile] = useState(null);
  const [hasprofile, setHasProfile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("accessToken");
  const userName = userData?.employeeData.name;
  const auth = userData?.employeeData.auth;

  // const profileUrl = userData?.employeeData?.profile;

  // setProfile(profileUrl);
  const empid = userData?.employeeData._id;
  // console.log(empid);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${ApiendPonits.baseUrl}${ApiendPonits.endpoints.viewProfile}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ Employee_id: empid }),
          }
        );

        const data = await response.json();

        if (response.ok) {
          setProfile(data.data.profileUrl);
          setHasProfile(true);
        } else {
          setProfile(demoprofile);
          setHasProfile(false);
        }
      } catch (err) {
        setError(err.message);
        setTimeout(() => setError(""), 4000);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userData, token]);

  const getTitle = () => {
    const currentPath = location.pathname;

    // Search for the current path in the main links array
    const currentLink = DASHBOARD_SIDEBAR_LINKS.find(
      (link) => link.path === currentPath
    );

    if (currentLink) {
      // If current path is found in main links array, return its label
      return currentLink.label;
    } else {
      for (const link of DASHBOARD_SIDEBAR_LINKS) {
        if (link.subItems) {
          const subItem = link.subItems.find(
            (subLink) => subLink.path === currentPath
          );
          if (subItem) {
            return subItem.label; // Return the label of the subItem
          }
        }
      }
    }

    return "View Employee"; // Return default title if no match is found
  };

  return (
    <div className=" my-2 mr-2 ml-16 md:m-2 py-2 pl-2 dark:bg-neutral-950 bg-white dark:text-white h-12 md:h-auto rounded-md flex justify-between items-center">
      <div className="font-bold">{getTitle()}</div>
      <div className="">
        <div className="flex items-center gap-2 text-sm">
          <div>
            <button
              className={classNames(
                "bg-sky-50 dark:bg-neutral-900 rounded-md p-1 text-sm flex items-center gap-1",
                rotate && ""
              )}
              onClick={() => {
                handleThemeSwitch();
              }}
            >
              <div
                className={classNames(
                  "p-1",
                  theme !== "dark" && "z-10 rounded-md text-green-400 "
                )}
                onClick={() => setVisible(!visible)}
              >
                <div>
                  <MdLightMode
                    size={20}
                    className={classNames("", theme === "dark" && "opacity-50")}
                  />
                </div>
              </div>
              <div
                className={classNames(
                  "p-1",
                  theme === "dark" && "z-10 rounded-md text-green-400"
                )}
                onClick={() => setVisible(visible)}
              >
                <div>
                  <TbMoonFilled
                    size={20}
                    className={classNames(
                      "",

                      theme !== "dark" && "opacity-50"
                    )}
                  />
                </div>
              </div>
              {!visible && (
                <motion.div
                  initial={{ x: 20 }}
                  animate={{ x: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 30,
                  }}
                  className="dark:hidden bg-white  w-7 h-7 rounded-md -z-0 inline-block absolute"
                ></motion.div>
              )}
              {!visible && (
                <motion.div
                  initial={{ x: -20 }}
                  animate={{ x: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 30,
                  }}
                  className="hidden dark:bg-neutral-600 dark:ml-8 w-7 h-7 rounded-md -z-0 dark:inline-block absolute"
                ></motion.div>
              )}
            </button>
          </div>

          <Menu as="div" className="relative">
            <div>
              <Menu.Button className="flex align-middle">
                {/* <Tooltip title={userName} placement="bottom" className="" arrow> */}
                <div className="flex items-center gap- bg-sky-50 dark:bg-neutral-900  rounded-md ">
                  <div className="flex items-center gap-1 p-1 sm:pr-2">
                    <FaCaretDown fontSize={17} />
                    <span className=" hidden sm:flex font-semibold text-xs">
                      {userName}
                    </span>
                  </div>
                  <img
                    src={profile ? profile : userprofile}
                    alt=""
                    className="h-9 w-9 rounded-md bg-top bg-no-repeat "
                  />
                </div>
                {/* </Tooltip> */}
              </Menu.Button>
            </div>
            <Transition
              className="z-50 flex flex-col gap-1"
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="origin-top-right absolute -right-5 z-10 m-2.5 w-52 md:mt-5 mt-4 bg-white dark:bg-neutral-950 dark:border border-neutral-600 rounded-md shadow-lg p-2">
                {(auth === 0 || auth === 2 || auth === 3) && (
                  <Menu.Item>
                    {({ active }) => (
                      <div
                        className={classNames(
                          active &&
                            "bg-sky-50 dark:bg-neutral-900 cursor-pointer rounded-md flex items-center",
                          "px-3 py-2 flex"
                        )}
                        onClick={() => navigate("/myprofile")}
                      >
                        <IoPerson fontSize={18} />
                        <span className="ml-3">View Profile</span>
                      </div>
                    )}
                  </Menu.Item>
                )}

                {/* <Menu.Item>
                  {({ active }) => (
                    <div
                      className={classNames(
                        active &&
                          "bg-sky-50 dark:bg-neutral-900 cursor-pointer rounded-md flex items-center",
                        "px-3 py-2 flex"
                      )}
                      onClick={() => navigate("/myprofile")}
                    >
                      <RiSettingsFill fontSize={18} />
                      <span className="ml-3">Settings</span>
                    </div>
                  )}
                </Menu.Item> */}
                <LogoutMenuItem />
                <Menu.Item>
                  <div className="order-2 md:order-1 py-2 px-3 rounded-md bg-blue-100 dark:bg-neutral-900 flex items-center gap-1">
                    <div>As {auth === 0 ? "an" : "a"}</div>
                    <div className="font-bold">
                      {auth === 0 ? (
                        <div className="text-orange-700">Employee</div>
                      ) : auth === 2 ? (
                        <div className="text-blue-700">HR</div>
                      ) : auth === 3 ? (
                        <div className="text-purple-700">Manager</div>
                      ) : (
                        <div className="text-green-700">Admin</div>
                      )}
                    </div>
                  </div>
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
          <div className=""></div>
        </div>
      </div>
    </div>
  );
}
