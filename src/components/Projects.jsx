import React, { useState } from "react";
import { TablePagination, InputBase } from "@mui/material";
import data from "../dummydata/MasterClientsProjects.json";
import { motion } from "framer-motion";
import { MdOutlineAddCircle } from "react-icons/md";
import Tooltip from "@mui/material/Tooltip";
import { Link, useNavigate } from "react-router-dom";
import { IoEye } from "react-icons/io5";

export default function Projects() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(0); // Reset page when search query changes
  };

  const filteredData = data.filter((client) =>
    client.projects.some((project) =>
      Object.values(project).some(
        (value) =>
          typeof value === "string" &&
          value.toLowerCase().includes(searchQuery.toLowerCase())
      )
    )
  );

  const totalRows = filteredData.length;
  const displayRows =
    rowsPerPage > 0
      ? filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      : filteredData;

  return (
    <div className="w-[96vw] md:w-auto flex flex-col gap-2">
      <div className="bg-white dark:bg-neutral-950 dark:text-white rounded-md  px-2 py-1 flex  items-center justify-between sticky top-0">
        <div className="flex items-center">
          <div className=" bg-sky-50 dark:bg-neutral-900 mr-2  flex  h-full py-1 rounded-md items-center">
            <InputBase
              placeholder="Search by Client Name, Id "
              className=" md:w-96 euclid ml-2 p-1"
              value={searchQuery}
              onChange={handleSearchChange}
              inputProps={{ style: { fontSize: 14 } }}
            />
          </div>
          <Link
            to="/projects/addproject"
            className="bg-sky-50 dark:bg-neutral-900 rounded-md p-3 flex items-center gap-2"
          >
            <Tooltip title="Add Project" placement="top" arrow>
              <div>
                <MdOutlineAddCircle fontSize={20} />
              </div>
            </Tooltip>
          </Link>
        </div>
        <div className=" -m-1 p-1.5 ">
          <div className=" bg-sky-50 dark:bg-neutral-900 rounded-md ">
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
              component="div"
              count={filteredData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              className="dark:text-white"
            />
          </div>
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col gap-2 bg-white dark:bg-neutral-950 p-2 rounded-md dark:text-white text-black ">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ul className="grid grid-cols-12 gap-2 px-2 py-3 bg-sky-100 dark:bg-neutral-800 rounded-md font-bold">
                <li className="col-span-1">Project Id</li>
                <li className="col-span-3">Project Name</li>
                <li className="col-span-2">Business Name</li>
                <li className="col-span-1">Status</li>
                <li className="col-span-1">Start Date</li>
                <li className="col-span-1">Deadline</li>
                <li className="col-span-2">Assigned To</li>
                <li className="col-span-1">Action</li>
              </ul>
            </motion.div>
          </div>
          <div>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-2"
            >
              {displayRows.map((client) =>
                client.projects.map((project) => (
                  <div
                    key={project.projectid}
                    className="group grid grid-cols-12 gap-2 px-2 py-1 bg-sky-50 dark:bg-neutral-900 rounded-md items-center"
                  >
                    <div className="col-span-1 ">{project.projectid}</div>
                    <div className="col-span-3 ">{project.projectname}</div>
                    <div className="col-span-2 ">{client.businessname}</div>
                    <div className="col-span-1 ">
                      {project.status === 0 ? (
                        <span className="text-red-600 bg-red-200 px-2 py-1 rounded-md text-xs font-bold euclid">
                          Pending
                        </span>
                      ) : project.status === 1 ? (
                        <span className="text-orange-600 bg-orange-200 px-2 py-1 rounded-md text-xs font-bold euclid">
                          In Progress
                        </span>
                      ) : project.status === 2 ? (
                        <span className="text-green-500 bg-green-200 px-2 py-1 rounded-md text-xs font-bold euclid">
                          Completed
                        </span>
                      ) : (
                        <span className=" bg-sky-50 dark:bg-neutral-950 px-2 py-1 rounded-md text-xs font-bold euclid">
                          Not Found
                        </span>
                      )}
                    </div>
                    <div className="col-span-1 ">{project.receiveddate}</div>
                    <div className="col-span-1 ">{project.deadline}</div>
                    <div className="col-span-2 ">{project.associate}</div>
                    <div className="col-span-1 ">
                      <Link to={`/projects/viewproject/${project.projectid}`}>
                        <button className="hover:bg-[#dbd6fc] hover:dark:bg-neutral-950 rounded-md p-2">
                          <IoEye className="text-xl" />
                        </button>
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
