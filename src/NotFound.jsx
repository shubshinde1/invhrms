import React from "react";
import { Link } from "react-router-dom";
import logoLight from "../src/assets/images/invezza-logo.png";
import logoDark from "../src/assets/images/invezza-logo-darkmode.png";
import { FaLongArrowAltLeft } from "react-icons/fa";

const NotFound = ({ theme }) => {
  // Determine which logo to use based on the theme
  const logo = theme === "dark" ? logoDark : logoLight;

  return (
    <div className="min-h-screen flex flex-col items-center justify-between py-28 text-center dark:bg-black bg-sky-50">
      <img src={logo} alt="Invezza Logo" className="mt-6 h-12" />
      <div className="text-9xl font-bold text-[#2563eb]">
        <h1>404</h1>
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
  );
};

export default NotFound;
