import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import clientAvatar from "../../assets/images/clientAvatar.png";
import Tooltip from "@mui/material/Tooltip";
import { motion } from "framer-motion";
import { IoEye } from "react-icons/io5";
import { IoIosAddCircle } from "react-icons/io";
import { FaExternalLinkAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

import { FaGithub } from "react-icons/fa6";
import { FaExternalLinkSquareAlt } from "react-icons/fa";
import { FaLink } from "react-icons/fa";
import { RiJavascriptFill, RiReactjsLine } from "react-icons/ri";
import { CgFigma } from "react-icons/cg";
import {
  SiAdobeillustrator,
  SiAdobephotoshop,
  SiAdobexd,
  SiMui,
  SiHtml5,
  SiCss3,
  SiTailwindcss,
  SiExpress,
  SiMongodb,
  SiDocker,
  SiJirasoftware,
} from "react-icons/si";
import { TbBrandNodejs } from "react-icons/tb";
import { IoLogoVercel } from "react-icons/io5";
import { BsGitlab } from "react-icons/bs";
import { PiAngularLogoFill } from "react-icons/pi";

function ViewClient() {
  const location = useLocation();
  const [client, setClient] = useState(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const clientData = searchParams.get("client");

    if (clientData) {
      setClient(JSON.parse(decodeURIComponent(clientData)));
    }
  }, [location.search]);

  const technologyIcons = {
    Figma: CgFigma,
    "Adobe XD": SiAdobexd,
    "Node js": TbBrandNodejs,
    "React js": RiReactjsLine,
    "Angular js": PiAngularLogoFill,
  };

  return (
    <div className=" mx-auto pb-20 ">
      {client ? (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:flex flex-col gap-2 rounded-md bg-white dark:bg-neutral-950 dark:text-white p-2"
        >
          <div className="p-2 ">
            <div className="flex flex-col gap-3 font-semibold">
              <div className="grid grid-cols-12 justify-between">
                <div className="col-span-10 xl:col-span-3 flex gap-4 ">
                  <img
                    src={clientAvatar}
                    width={100}
                    className="rounded-md"
                    alt="Clientlogo"
                  />
                  <div className="flex flex-col gap-1 items-start justify-end">
                    <p className="text-lg font-semibold ">
                      {client.businessname}
                    </p>
                    <p className="text-sm font-normal">{client.clientname}</p>
                  </div>
                </div>
                <div className="col-span-12 xl:col-span-8 order-3 flex flex-col xl:flex-row xl:items-end gap-4 xl:gap-10 mt-5 xl:mt-0">
                  {/* <div className="">
                    <p className="text-sm text-neutral-500">Client Name</p>
                    <p className="text-sm">{client.clientname}</p>
                  </div> */}
                  <div className="flex xl:flex-col justify-between">
                    <p className="text-sm text-neutral-500">Client ID</p>
                    <p className="text-sm">{client.clientid}</p>
                  </div>
                  <div className="flex xl:flex-col justify-between">
                    <p className="text-sm text-neutral-500">Phone No</p>
                    <p className="text-sm">{client.phone}</p>
                  </div>
                  <div className="flex xl:flex-col justify-between">
                    <p className="text-sm text-neutral-500">Email ID</p>
                    <p className="text-sm">{client.email}</p>
                  </div>
                  <div className="flex xl:flex-col justify-between">
                    <p className="text-sm text-neutral-500">GST No</p>
                    <p className="text-sm">{client.gstn}</p>
                  </div>
                  <div className="flex xl:flex-col justify-between">
                    <p className="text-sm text-neutral-500">No Of Projects</p>
                    <p className="text-sm">{client.projects.length}</p>
                  </div>
                </div>
                <div className="col-span-2 xl:col-span-1 xl:order-3 flex gap-2 xl:items-end justify-end">
                  <Tooltip title="View Contract" placement="top" arrow>
                    <div className="bg-sky-50 dark:bg-neutral-900 rounded-md cursor-pointer h-fit p-2 m-0">
                      <IoEye fontSize={20} />
                    </div>
                  </Tooltip>
                  <Tooltip title="Add Project" placement="top" arrow>
                    <div className="bg-sky-50 dark:bg-neutral-900 rounded-md cursor-pointer h-fit p-2 m-0">
                      <IoIosAddCircle fontSize={20} />
                    </div>
                  </Tooltip>
                </div>
              </div>
            </div>
          </div>
          <hr className="mt-3 text-red-600" />
          <div className=" rounded-md bg-white dark:bg-neutral-950  lg:ml-0 mt-3">
            <ul className="flex flex-col md:flex-row md:grid grid-cols-12 gap-2">
              {client.projects.map((project, index) => (
                <li
                  key={index}
                  className=" bg-sky-50 dark:bg-neutral-900 p-4 rounded-md md:col-span-6 xl:col-span-4 group"
                >
                  <div className="flex items-center justify-between group-hover:dark:bg-neutral-800 group-hover:bg-sky-100 group-hover:rounded-md group-hover:duration-500 p-2.5">
                    <div className="flex items-center gap-2">
                      <h2 className=" font-semibold group-hover:ml-2 group-hover:duration-300 group-hover:ease-in">
                        {index + 1} - {project.projectname}
                      </h2>
                    </div>
                    <div className="hidden group-hover:flex cursor-pointer mr-2">
                      <Link
                        to={{
                          pathname: `/projects/viewproject/${project.projectid}`, // Include project ID in the URL
                        }}
                      >
                        <FaExternalLinkAlt />
                      </Link>
                    </div>
                  </div>
                  <div className="flex flex-col md:grid grid-cols-2 gap-3 mt-3">
                    <div className="text-sm">
                      <p className="text-sm font-medium text-neutral-500">
                        Project ID
                      </p>
                      <p className="font-normal">{project.projectid}</p>
                    </div>
                    <div className="text-sm flex flex-col gap-0">
                      <p className="text-sm font-medium text-neutral-500">
                        Status
                      </p>
                      {/* <p className="font-normal">{project.associate}</p> */}
                      <Tooltip title="Work Status" placement="top" arrow>
                        <span
                          className={` px-2 py-1 rounded-md font-bold text-[0.750rem]  cursor-pointer w-fit ${
                            project.status === 0
                              ? "bg-red-200 text-red-400"
                              : project.status === 1
                              ? "bg-yellow-100 text-yellow-400"
                              : "bg-green-200 text-green-400"
                          }`}
                        >
                          {project.status === 0
                            ? "Pending"
                            : project.status === 1
                            ? "In Progress"
                            : "Completed"}
                        </span>
                      </Tooltip>
                    </div>
                    <div className="text-sm">
                      <p className="text-sm font-medium text-neutral-500">
                        Start Date
                      </p>
                      <p className="font-normal">{project.receiveddate}</p>
                    </div>
                    <div className="text-sm">
                      <p className="text-sm font-medium text-neutral-500">
                        Technologies
                      </p>
                      <div className="flex flex-wrap gap-1 mt-0.5">
                        {Object.keys(project.details)
                          .flatMap((teamKey) =>
                            project.details[teamKey].associates.flatMap(
                              (associate) => associate.technologies
                            )
                          )
                          .slice(0, 4) // Only take the first four technologies
                          .map((tech, techIdx) => {
                            // Check if the technology exists in the mapping object
                            const IconComponent = technologyIcons[tech];
                            if (IconComponent) {
                              // If the icon exists, render it with custom styling
                              return (
                                <Tooltip title={tech} placement="top" arrow>
                                  <div
                                    key={techIdx}
                                    className="icon-wrapper bg-sky-100 dark:text-white text-neutral-600 hover:text-blue-600 dark:hover:text-blue-600 cursor-pointer  dark:bg-neutral-950 p-1.5 rounded-md"
                                  >
                                    <IconComponent className="icon text-xl " />
                                    {/* Add custom styling here */}
                                  </div>
                                </Tooltip>
                              );
                            } else {
                              // If the icon doesn't exist, render the technology name
                              return (
                                <span
                                  key={techIdx}
                                  className="bg-gray-200 dark:bg-neutral-950 px-2 py-1 text-xs rounded-md"
                                >
                                  {tech}
                                </span>
                              );
                            }
                          })}
                        {/* Display remaining count */}
                        {Object.keys(project.details).flatMap((teamKey) =>
                          project.details[teamKey].associates.flatMap(
                            (associate) => associate.technologies
                          )
                        ).length > 4 && (
                          <span className="bg-gray-200 dark:bg-neutral-950 flex items-center p-2 text-xs rounded-md">
                            +
                            {Object.keys(project.details).flatMap((teamKey) =>
                              project.details[teamKey].associates.flatMap(
                                (associate) => associate.technologies
                              )
                            ).length - 4}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      ) : (
        <p>No client data found</p>
      )}
    </div>
  );
}

export default ViewClient;
