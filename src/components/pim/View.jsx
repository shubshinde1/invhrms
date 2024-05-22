import React, { useRef } from "react";
import { useParams } from "react-router-dom";
import { FaUserAlt } from "react-icons/fa";
import { HiDocumentDownload } from "react-icons/hi";
import { motion } from "framer-motion";

export default function ViewEmployee() {
  const { empid, ename, designation, jdate, status } = useParams();
  const [firstName, lastName] = decodeURIComponent(ename).split(" ");
  const emailSuffix = "@invezzatech.com";
  const email = `${firstName.toLowerCase()}${lastName.toLowerCase()}${emailSuffix}`;
  const contentRef = useRef(null);

  // const { empid } = useParams();
  // console.log("Employee ID:", empid);

  return (
    <div className="">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div
          ref={contentRef}
          className="bg-white dark:bg-neutral-950 dark:text-white rounded-md p-2 flex flex-col md:flex-col gap-2  mb-16 md:mb-20"
        >
          <div className=" flex flex-col md:flex-row gap-2 ">
            <div className="md:w-1/2 bg-blue-50 dark:bg-neutral-900 p-2 rounded-md group">
              <h1 className="font-bold p-2 group-hover:bg-sky-100 group-hover:dark:bg-neutral-950 group-hover:duration-500 rounded-md w-fit">
                Personal Information
              </h1>
              <div className="flex flex-row  items-center mt-2 gap-5 md:gap-10">
                <div className=" p-4 rounded-md">
                  <FaUserAlt className="text-gray-300 text-7xl md:text-8xl" />
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex overflow-hidden">
                    <label className="w-28 md:w-64">First Name</label>
                    <h1>{firstName}</h1>
                  </div>
                  <div className="flex overflow-hidden">
                    <label className="w-28 md:w-64">Last Name </label>
                    <h1>{lastName}</h1>
                  </div>
                  <div className="flex overflow-hidden">
                    <label className="w-28 md:w-64">Date of birth </label>
                    <h1>{decodeURIComponent(jdate)}</h1>
                  </div>
                  <div className="flex overflow-hidden">
                    <label className="w-28 md:w-64">Gender </label>
                    <h1>Male</h1>
                  </div>
                  <div className="flex overflow-hidden">
                    <label className="w-28 md:w-64">Marital status</label>
                    <h1>Married</h1>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:w-1/2 bg-blue-50 dark:bg-neutral-900 p-2 rounded-md group">
              <h1 className="font-bold p-2 group-hover:bg-sky-100 group-hover:dark:bg-neutral-950 group-hover:duration-500  rounded-md w-fit">
                Contact Information
              </h1>
              <div className="flex flex-col gap-2 mt-2">
                <div className="flex overflow-hidden">
                  <label className="w-28 md:w-64">Address</label>
                  <h1>Pune, MH, India, 411045</h1>
                </div>
                <div className="flex overflow-hidden">
                  <label className="w-28 md:w-64">Email Id</label>
                  <a href={`mailto:${email}`}>{email}</a>
                </div>
                <div className="flex overflow-hidden">
                  <label className="w-28 md:w-64">Phone No</label>
                  <h1>9874561236</h1>
                </div>
                <div className="flex overflow-hidden">
                  <label className="w-28 md:w-64">Emergency Contacts</label>
                  <h1>9850078945</h1>
                </div>
                <div className="flex overflow-hidden">
                  <label className="w-28 md:w-64">Marital status</label>
                  <h1>Married</h1>
                </div>
              </div>
            </div>
          </div>

          <div className=" flex flex-col md:flex-row gap-2 ">
            <div className="md:w-1/2 bg-blue-50 dark:bg-neutral-900 p-2 rounded-md group">
              <h1 className="font-bold p-2 group-hover:bg-sky-100 group-hover:dark:bg-neutral-950 group-hover:duration-500 rounded-md w-fit">
                Employement Information
              </h1>
              <div className="flex flex-col gap-2 mt-2">
                <div className="flex overflow-hidden">
                  <label className="w-28 md:w-64">Employee ID </label>
                  <h1>{empid}</h1>
                </div>
                <div className="flex overflow-hidden">
                  <label className="w-28 md:w-64">Name </label>
                  <h1>{decodeURIComponent(ename)}</h1>
                </div>
                <div className="flex overflow-hidden">
                  <label className="w-28 md:w-64">Joining Date </label>
                  <h1>{decodeURIComponent(jdate)}</h1>
                </div>
                <div className="flex overflow-hidden">
                  <label className="w-28 md:w-64">Status </label>
                  <h1>{decodeURIComponent(status)}</h1>
                </div>
                <div className="flex overflow-hidden">
                  <label className="w-28 md:w-64">Designation </label>
                  <h1>{decodeURIComponent(designation)}</h1>
                </div>
                <div className="flex overflow-hidden">
                  <label className="w-28 md:w-64">Department </label>
                  <h1>Information Technology</h1>
                </div>
                <div className="flex overflow-hidden">
                  <label className="w-28 md:w-64">Reporting To </label>
                  <h1>Swapnil Patil</h1>
                </div>
              </div>
            </div>

            <div className="md:w-1/2 bg-blue-50 dark:bg-neutral-900 p-2 rounded-md group">
              <h1 className="font-bold  p-2 group-hover:bg-sky-100 group-hover:dark:bg-neutral-950 group-hover:duration-500 rounded-md w-fit">
                Contact Information
              </h1>
              <div className="flex flex-col gap-2 mt-2">
                <div className="flex overflow-hidden">
                  <label className="w-28 md:w-64">First Name</label>
                  <h1>{firstName}</h1>
                </div>
                <div className="flex overflow-hidden">
                  <label className="w-28 md:w-64">Last Name </label>
                  <h1>{lastName}</h1>
                </div>
                <div className="flex overflow-hidden">
                  <label className="w-28 md:w-64">Date of birth </label>
                  <h1>{decodeURIComponent(jdate)}</h1>
                </div>
                <div className="flex overflow-hidden">
                  <label className="w-28 md:w-64">Gender </label>
                  <h1>Male</h1>
                </div>
                <div className="flex overflow-hidden">
                  <label className="w-28 md:w-64">Marital status</label>
                  <h1>Married</h1>
                </div>
              </div>
            </div>
          </div>

          <div className=" flex flex-col md:flex-row md:gap-5">
            <div className="w-full bg-blue-50 dark:bg-neutral-900 p-2 rounded-md group">
              <h1 className="font-bold  p-2 group-hover:bg-sky-100 group-hover:dark:bg-neutral-950 group-hover:duration-500 rounded-md w-fit">
                Work Experience Information
              </h1>
              <h1 className="mt-3">Experience 1</h1>
              <div className="flex md:flex-row flex-col gap-2 mt-2">
                <div className="md:w-1/2 flex flex-col gap-2">
                  <div className="flex overflow-hidden">
                    <label className="w-28 md:w-64">Job Title </label>
                    <h1>{decodeURIComponent(designation)}</h1>
                  </div>
                  <div className="flex overflow-hidden">
                    <label className="w-28 md:w-64">Company Name</label>
                    <h1>Something</h1>
                  </div>
                  <div className="flex overflow-hidden">
                    <label className="w-28 md:w-64">Compnay Website </label>
                    <a href="https://something.com">Something vt Ltd</a>
                  </div>
                  <div className="flex overflow-hidden">
                    <label className="w-28 md:w-64">Location </label>
                    <h1>Pune</h1>
                  </div>
                  <div className="flex overflow-hidden">
                    <label className="w-28 md:w-64">Employeement Type </label>
                    <h1>Full-Time</h1>
                  </div>
                </div>

                <div className="md:w-1/2 flex flex-col gap-2">
                  <div className="flex overflow-hidden">
                    <label className="w-28 md:w-64">Start Date </label>
                    <h1>{decodeURIComponent(jdate)}</h1>
                  </div>
                  <div className="flex overflow-hidden">
                    <label className="w-28 md:w-64">End Date </label>
                    <h1>{decodeURIComponent(jdate)}</h1>
                  </div>
                  <div className="flex overflow-hidden">
                    <label className="w-28 md:w-64">Job Description </label>
                    <h1>Contrary to popular belief,</h1>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute right-5 bottom-5">
          <button className="bg-[#5336FD] text-white p-2 rounded-md mt-4 z-50">
            <HiDocumentDownload className="text-3xl" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
