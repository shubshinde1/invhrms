import React from "react";
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
import userprofile from "../../assets/images/profilepic.png";

export default function Header({ handleThemeSwitch, theme }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [rotate, setRotate] = React.useState(false);

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
    <div className="my-2 mr-2 ml-16 md:m-2 py-2 pl-2 dark:bg-neutral-950 bg-white dark:text-white h-12 md:h-auto rounded-md flex justify-between items-center">
      <div className="font-bold">{getTitle()}</div>
      <div className="">
        <div className="flex items-center gap-2 text-sm">
          <Popover className="relative">
            {({ open }) => (
              <>
                <Popover.Button
                  className={classNames(
                    open && "bg-sky-50",
                    "bg-sky-50 hover:dark:bg-neutral-900 dark:bg-neutral-900 duration-500 p-2 rounded-md cursor-pointer focus:outline-none"
                  )}
                >
                  <IoNotifications fontSize={20} />
                </Popover.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-200"
                  enterFrom="opacity-0 translate-y-1"
                  enterTo="opacity-100 translate-y-0"
                  leave="transition ease-in duration-150"
                  leaveFrom="opacity-100 translate-y-0"
                  leaveTo="opacity-0 translate-y-1"
                >
                  <Popover.Panel className="absolute md:-right-2 right-0 z-10 md:m-2.5 md:w-52 w-[50vw] md:mt-5 mt-4">
                    <div className="bg-white dark:bg-neutral-950 dark:border rounded-md shadow-lg p-3">
                      this is the panel
                    </div>
                  </Popover.Panel>
                </Transition>
              </>
            )}
          </Popover>

          {/* dark/light mode toggle */}
          <div className="flex md:hidden">
            {/* <div> */}
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
                  theme !== "dark" && "bg-white rounded-md text-green-400"
                )}
              >
                <MdLightMode
                  size={20}
                  className={classNames("", theme === "dark" && "opacity-50")}
                />
              </div>
              <div
                className={classNames(
                  "p-1",
                  theme === "dark" && "bg-neutral-600 rounded-md text-green-400"
                )}
              >
                <TbMoonFilled
                  size={20}
                  className={classNames(
                    "",

                    theme !== "dark" && "opacity-50"
                  )}
                />
              </div>
            </button>
          </div>

          <Menu as="div" className="relative">
            <div>
              <Menu.Button className="flex align-middle">
                <div
                  className="h-9 w-9 rounded-md bg-top bg-no-repeat"
                  style={{
                    backgroundImage: `url(${userprofile})`,
                  }}
                >
                  <span className="sr-only">Shubham Shinde</span>
                </div>
              </Menu.Button>
            </div>
            <Transition
              className="z-50"
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="origin-top-right absolute -right-5 z-10 m-2.5 w-52 md:mt-5 mt-4 bg-white dark:bg-neutral-950 dark:border rounded-md shadow-lg p-2">
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
                      <RiSettingsFill fontSize={18} />
                      <span className="ml-3">Settings</span>
                    </div>
                  )}
                </Menu.Item>
                <LogoutMenuItem />
              </Menu.Items>
            </Transition>
          </Menu>
          <div className=""></div>
        </div>
      </div>
    </div>
  );
}
