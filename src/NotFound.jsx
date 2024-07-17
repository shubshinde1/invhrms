import React from "react";
import { Link } from "react-router-dom";
import logoLight from "../src/assets/images/invezza-logo.png";
import logoDark from "../src/assets/images/invezza-logo-darkmode.png";
import pageNotFound from "../src/assets/images/404.svg";
import { FaLongArrowAltLeft } from "react-icons/fa";

const NotFound = ({ theme }) => {
  // Determine which logo to use based on the theme
  const logo = theme === "dark" ? logoDark : logoLight;

  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-5 bg-sky-50 dark:bg-black min-h-screen">
      <div className="flex items-center justify-center ">
        <img src={pageNotFound} alt="" className="w-1/2" />
      </div>
      <div className="  flex flex-col md:items-start items-center justify-center gap-5 text-center md:text-left w-4/5 md:w-1/2 lg:px-28">
        <img src={logo} alt="Invezza Logo" className="mt-6 h-12" />
        <div className="text-9xl font-bold text-[#2563eb]">
          <p className="mt-4 text-base lg:text-xl font-bold text-black dark:text-white">
            Sorry, the page you are looking for doesn't exist.
            <br />
            <span className="text-sm font-normal">
              Go out, take a run around the block or tap the button below.
            </span>
          </p>
        </div>

        <Link
          to="/"
          className=" px-4 py-2 dark:bg-neutral-600 bg-neutral-700 text-white rounded-lg flex justify-center items-center hover:bg-blue-500 dark:hover:bg-blue-500 font-bold duration-500 group"
        >
          <FaLongArrowAltLeft
            fontSize={20}
            className="mr-2 duration-200 group-hover:rotate-45 "
          />{" "}
          Go To Home Page
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
