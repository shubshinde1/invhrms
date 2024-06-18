import React from "react";
import { useParams } from "react-router-dom";
import projectData from "../../dummydata/MasterClientsProjects.json";
import { FaFolderOpen } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import Projectimg from "../../assets/images/clientAvatar.png";
import { FaGithub } from "react-icons/fa6";
import { FaExternalLinkSquareAlt } from "react-icons/fa";
import { FaLink } from "react-icons/fa";
import Tooltip from "@mui/material/Tooltip";
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

export default function ViewProject() {
  const { projectId } = useParams();

  const teamDisplayNames = {
    UI: "UI",
    "Front End": "Front End",
    "Back End": "Back End",
    Testing: "Tester",
    DevOps: "DevOps Engineer",
    // Add more mappings as needed
  };

  const technologyIcons = {
    Figma: CgFigma,
    "Adobe XD": SiAdobexd,
    "Node js": TbBrandNodejs,
    "React js": RiReactjsLine,
    "Angular js": PiAngularLogoFill,
  };

  // Find the project that matches the projectId from the URL parameter
  const project = projectData
    .flatMap((client) => client.projects)
    .find((project) => project.projectid === parseInt(projectId));

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <div className="bg-white dark:bg-neutral-950 dark:text-white p-2 rounded-md mb-20">
      <div className="flex gap-2 items-center ">
        <div className="flex gap-2 items-center">
          <FaFolderOpen />
          <Link to="/projects" className="hover:text-blue-400">
            <h2>View Projects</h2>
          </Link>
        </div>
        {">"}
        <div>
          <p className="text-blue-400">{project.projectname}</p>
        </div>
      </div>
      <div className="mt-5 grid grid-cols-12 gap-2">
        <div className="bg-sky-50 dark:bg-neutral-900 col-span-12 xl:col-span-3 p-2 rounded-md flex flex-col gap-10">
          <div>
            <img src={Projectimg} className="rounded-md w-1/4 xl:w-1/2" />
            <div className="mt-2">
              <div className="flex flex-col ">
                <p className="text-xl">{project.projectname}</p>
                <p>Id - {projectId}</p>
                <p>{project.businessname}</p>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="w-fit bg-sky-100 dark:bg-neutral-950 p-2 rounded-md text-lg flex items-center gap-2 justify-center group">
              <FaGithub fontSize={20} className="group-hover:text-purple-900" />
            </button>
            <button className="w-fit bg-sky-100 dark:bg-neutral-950 p-2 rounded-md text-lg flex items-center gap-2 justify-center group">
              <FaLink fontSize={18} className="group-hover:text-blue-600" />
            </button>
          </div>
        </div>
        <div className="bg-sky-50 dark:bg-neutral-900 col-span-12 xl:col-span-9 p-2 rounded-md flex flex-col justify-between">
          <div>
            <p className="text-lg font-bold">Description</p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
              faucibus sollicitudin mauris, sit amet tempor tortor interdum nec.
              Integer aliquam, libero id finibus ultricies, nulla dui suscipit
              elit, non suscipit velit velit a tellus. Vestibulum at justo nec
              mauris lacinia posuere. Morbi at velit ex. Nam vehicula, arcu vel
              condimentum aliquet, magna libero tempor lacus, id condimentum
              quam justo ut sem. Nulla facilisi. Fusce posuere urna vel elit
              placerat, sed malesuada dui sollicitudin. Morbi nec arcu nec ex
              viverra gravida sed et quam. Pellentesque habitant morbi tristique
              senectus et netus et malesuada fames ac turpis egestas. Sed at
              arcu pretium, bibendum dolor at, tristique magna. Integer gravida
              ante nec lectus sollicitudin, ac pharetra dui bibendum. Donec at
              neque ac justo gravida interdum. Cras at risus lectus. Sed varius
              nisl vitae massa ullamcorper dignissim. Vivamus commodo semper
              eros.
            </p>
          </div>
          <div className="grid grid-cols-12 lg:flex gap-4 mt-4 lg:mt-0">
            {/* <div className="col-span-6 bg-sky-100 dark:bg-neutral-950 p-4 rounded-md">
              <p className="text-neutral-500">Client ID</p>
              <p className="text-base">{project.clientid}</p>
            </div> */}
            <div className="col-span-6 bg-sky-100 dark:bg-neutral-950 px-4 py-2 rounded-md flex items-center gap-2">
              <p className="text-neutral-500">Start Date</p>
              <hr className="w-[1px] py-2 h-full border-0 bg-neutral-500 rounded-full" />
              <p className="">{project.receiveddate}</p>
            </div>
            {/* <div className="col-span-6 bg-sky-100 dark:bg-neutral-950 p-4 rounded-md">
              <p className="text-neutral-500">Deadline</p>
              <p className="text-base">{project.deadline}</p>
            </div> */}
            <div className="col-span-6 bg-sky-100 dark:bg-neutral-950 px-4 py-2 rounded-md flex items-center gap-2">
              <p className="text-neutral-500">Status</p>
              <hr className="w-[1px] py-2 h-full border-0 bg-neutral-500 rounded-full" />
              {/* <p className="text-base">{project.status}</p> */}
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
            {/* <div className="col-span-12 bg-sky-100 dark:bg-neutral-950 p-4 rounded-md">
              <p className="text-neutral-500">Associate</p>
              <p className="text-base">{project.associate}</p>
            </div> */}
            {/* <div className="col-span-12 bg-sky-100 dark:bg-neutral-950 p-4 rounded-md">
              <p className="text-neutral-500">Remark</p>
              <p className="text-base">{project.remark}</p>
            </div> */}
          </div>
        </div>
        <div className="bg-sky-50 dark:bg-neutral-900 col-span-12 p-2 rounded-md">
          <div>
            <p className="text-lg font-bold">Team</p>
            {/* <div className="grid grid-cols-10 gap-2  mt-2">
              <div className="col-span-2 dark:bg-neutral-950 rounded-md p-2 flex flex-col gap-2">
                <div className="flex flex-col lg:flex-row gap-2">
                  <img src={Projectimg} className="rounded-md w-1/4 xl:w-1/3" />
                  <div>
                    <h2 className="text-base">Shubham Shinde</h2>
                    <p className="text-neutral-500">UI Designer</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className=" flex justify-between bg-neutral-900 p-2 rounded-md">
                    <h2>UI</h2>
                    <ul className="flex gap-1 flex-wrap">
                      <li className="bg-neutral-950 p-1.5 rounded-md w-fit">
                        <CgFigma />
                      </li>
                      <li className="bg-neutral-950 p-1.5 rounded-md w-fit">
                        <SiAdobexd />
                      </li>
                      <li className="bg-neutral-950 p-1.5 rounded-md w-fit">
                        <SiAdobeillustrator />
                      </li>
                      <li className="bg-neutral-950 p-1.5 rounded-md w-fit">
                        <SiAdobephotoshop />
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-span-2 dark:bg-neutral-950 rounded-md p-2 flex flex-col gap-2">
                <div className="flex flex-col lg:flex-row gap-2">
                  <img src={Projectimg} className="rounded-md w-1/4 xl:w-1/3" />
                  <div>
                    <h2 className="text-base">Shubham Shinde</h2>
                    <p className="text-neutral-500">Front End Developer</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className=" flex justify-between bg-neutral-900 p-2 rounded-md">
                    <h2>Front-End</h2>
                    <ul className="flex gap-1 flex-wrap">
                      <li className="bg-neutral-950 p-1.5 rounded-md w-fit">
                        <RiJavascriptFill />
                      </li>
                      <li className="bg-neutral-950 p-1.5 rounded-md w-fit">
                        <RiReactjsLine />
                      </li>
                      <li className="bg-neutral-950 p-1.5 rounded-md w-fit">
                        <SiHtml5 />
                      </li>
                      <li className="bg-neutral-950 p-1.5 rounded-md w-fit">
                        <IoLogoVercel />
                      </li>
                    </ul>
                  </div>
                  <div className=" flex justify-between bg-neutral-900 p-2 rounded-md">
                    <h2>Styling</h2>
                    <ul className="flex gap-1 flex-wrap">
                      <li className="bg-neutral-950 p-1.5 rounded-md w-fit">
                        <SiCss3 />
                      </li>
                      <li className="bg-neutral-950 p-1.5 rounded-md w-fit">
                        <SiTailwindcss />
                      </li>
                      <li className="bg-neutral-950 p-1.5 rounded-md w-fit">
                        <SiMui />
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-span-2 dark:bg-neutral-950 rounded-md p-2 flex flex-col gap-2">
                <div className="flex flex-col lg:flex-row gap-2">
                  <img src={Projectimg} className="rounded-md w-1/4 xl:w-1/3" />
                  <div>
                    <h2 className="text-base">Shubham Shinde</h2>
                    <p className="text-neutral-500">Back End Developer</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className=" flex justify-between bg-neutral-900 p-2 rounded-md">
                    <h2>Back-End</h2>
                    <ul className="flex gap-1 flex-wrap">
                      <li className="bg-neutral-950 p-1.5 rounded-md w-fit">
                        <TbBrandNodejs />
                      </li>
                      <li className="bg-neutral-950 p-1.5 rounded-md w-fit">
                        <SiExpress />
                      </li>
                      <li className="bg-neutral-950 p-1.5 rounded-md w-fit">
                        <IoLogoVercel />
                      </li>
                    </ul>
                  </div>
                  <div className=" flex justify-between bg-neutral-900 p-2 rounded-md">
                    <h2>Database</h2>
                    <ul className="flex gap-1 flex-wrap">
                      <li className="bg-neutral-950 p-1.5 rounded-md w-fit">
                        <SiMongodb />
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-span-2 dark:bg-neutral-950 rounded-md p-2 flex flex-col gap-2">
                <div className="flex flex-col lg:flex-row gap-2">
                  <img src={Projectimg} className="rounded-md w-1/4 xl:w-1/3" />
                  <div>
                    <h2 className="text-base">Shubham Shinde</h2>
                    <p className="text-neutral-500">Tester</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className=" flex justify-between bg-neutral-900 p-2 rounded-md">
                    <h2>Testing</h2>
                    <ul className="flex gap-1 flex-wrap">
                      <li className="bg-neutral-950 p-1.5 rounded-md w-fit">
                        <SiDocker />
                      </li>
                      <li className="bg-neutral-950 p-1.5 rounded-md w-fit">
                        <FaGithub />
                      </li>
                      <li className="bg-neutral-950 p-1.5 rounded-md w-fit">
                        <SiJirasoftware />
                      </li>
                      <li className="bg-neutral-950 p-1.5 rounded-md w-fit">
                        <BsGitlab />
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-span-2 dark:bg-neutral-950 rounded-md p-2 flex flex-col gap-2">
                <div className="flex flex-col lg:flex-row gap-2">
                  <img src={Projectimg} className="rounded-md w-1/4 xl:w-1/3" />
                  <div>
                    <h2 className="text-base">Shubham Shinde</h2>
                    <p className="text-neutral-500">DevOps Engineer</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className=" flex justify-between bg-neutral-900 p-2 rounded-md">
                    <h2>DevOps</h2>
                    <ul className="flex gap-1 flex-wrap">
                      <li className="bg-neutral-950 p-1.5 rounded-md w-fit">
                        <SiDocker />
                      </li>
                      <li className="bg-neutral-950 p-1.5 rounded-md w-fit">
                        <FaGithub />
                      </li>
                      <li className="bg-neutral-950 p-1.5 rounded-md w-fit">
                        <SiJirasoftware />
                      </li>
                      <li className="bg-neutral-950 p-1.5 rounded-md w-fit">
                        <BsGitlab />
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div> */}
            <div className="flex flex-col gap-2">
              <div className="grid grid-cols-12 gap-4 bg-neutral-800 px-2 py-3 rounded-md">
                <div className="col-span-1 ">
                  <h2>Sr.No</h2>
                </div>
                <div className="col-span-2 ">
                  <h2>Team</h2>
                </div>
                <div className="col-span-3 ">
                  <h2>Associates</h2>
                </div>
                <div className="col-span-3 ">
                  <h2>Role</h2>
                </div>
                <div className="col-span-3 ">
                  <h2>Technologies</h2>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                {Object.keys(project.details).map((teamKey, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-12 gap-4 bg-neutral-950 px-2 py-3 rounded-md"
                  >
                    <div className="col-span-1">
                      <h2 className="bg-neutral-900 px-2.5 py-1 rounded-md w-fit">
                        {index + 1}
                      </h2>
                    </div>
                    <div className="col-span-2">
                      <h2>{teamKey}</h2>
                    </div>
                    <div className="col-span-3 flex flex-col gap-5">
                      {/* Iterate over associates in the team */}
                      {project.details[teamKey].associates.map(
                        (associate, associateIndex) => (
                          <div key={associateIndex}>
                            <h2>{associate.associatename}</h2>
                          </div>
                        )
                      )}
                    </div>
                    <div className="col-span-3 flex flex-col gap-5">
                      {/* Iterate over associates in the team */}
                      {project.details[teamKey].associates.map(
                        (associate, associateIndex) => (
                          <div key={associateIndex}>
                            <h2>{associate.role}</h2>
                          </div>
                        )
                      )}
                    </div>
                    <div className="col-span-3">
                      <div className="flex flex-col gap-2">
                        {/* Iterate over associates in the team */}
                        {project.details[teamKey].associates.map(
                          (associate, associateIndex) => (
                            <ul
                              key={associateIndex}
                              className="flex gap-2 flex-wrap"
                            >
                              {/* Iterate over technologies of the current associate */}
                              {associate.technologies.map(
                                (technology, technologyIndex) => {
                                  const IconComponent =
                                    technologyIcons[technology];
                                  return (
                                    <Tooltip
                                      title={technology}
                                      placement="top"
                                      arrow
                                    >
                                      <li
                                        key={technologyIndex}
                                        className="bg-neutral-900 p-2 rounded-md w-fit cursor-pointer hover:text-blue-600"
                                      >
                                        {IconComponent && <IconComponent />}
                                      </li>
                                    </Tooltip>
                                  );
                                }
                              )}
                            </ul>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
