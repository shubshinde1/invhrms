import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  InputBase,
} from "@mui/material";
import { styled } from "@mui/system";
import data from "../dummydata/MasterClientsProjects.json";
import { motion } from "framer-motion";
import { makeStyles } from "@mui/styles";
import classNames from "classnames";
import { MdOutlineAddCircle } from "react-icons/md";
import Tooltip from "@mui/material/Tooltip";
import { Link, useNavigate } from "react-router-dom";
import { IoEye } from "react-icons/io5";

const SearchInput = styled(InputBase)({
  borderRadius: "7px",
  padding: "6px 8px",
  marginRight: "16px",
  fontFamily: "Euclid",
  "& input": {
    fontSize: ".9rem",
  },
});

const useStyles = makeStyles({
  root: {
    "& .MuiTableCell-root": {
      fontFamily: "euclid",
      fontWeight: "bold",
    },
  },

  searchContainer: {
    borderRadius: 7,
    display: "flex",
    alignItems: "center",
  },
  searchInput: {
    fontFamily: "euclid",
    marginLeft: 7,
    padding: 2,
  },
});

export default function Projects() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const classes = useStyles();

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

  return (
    <div className="w-[96vw] md:w-auto">
      <div className="bg-white dark:bg-neutral-950 dark:text-white rounded-md  px-2 py-1 flex  items-center justify-between sticky top-0">
        <div className="flex items-center">
          <div
            className={`${classes.searchContainer} bg-sky-50 dark:bg-neutral-900 mr-2  flex  h-full py-1 `}
          >
            <InputBase
              placeholder="Search by Client Name, Id "
              className={`${classes.searchInput} md:w-96`}
              value={searchQuery}
              onChange={handleSearchChange}
              inputProps={{ style: { fontSize: 14 } }}
            />
          </div>
          <Link
            to="/projects/addproject"
            className="bg-sky-50 dark:bg-neutral-900 rounded-md p-2.5 flex items-center gap-2"
          >
            <Tooltip title="Add Project" placement="top" arrow>
              <div>
                <MdOutlineAddCircle fontSize={20} />
              </div>
            </Tooltip>
          </Link>
        </div>
        <div className="">
          <TablePagination
            rowsPerPageOptions={[10, 25, { label: "All", value: -1 }]}
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
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <TableContainer
          component={Paper}
          style={{ maxHeight: "100%" }}
          className="scrollbar-hide mt-2 h-[85vh] md:h-[79vh] p-2 "
        >
          <Table className="rounded-md">
            <TableHead className="sticky top-0 ">
              <TableRow className={classNames("bg-sky-50 ", classes.root)}>
                <TableCell>Project Id</TableCell>
                <TableCell>Project Name</TableCell>
                <TableCell>Business Name</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>Deadline</TableCell>
                <TableCell>Assigned To</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody className={`${classNames(classes.bodyroot)} `}>
              {(rowsPerPage > 0
                ? filteredData.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                : filteredData
              ).map((client) =>
                client.projects.map((project) => (
                  <TableRow key={project.projectid} className="">
                    <TableCell>{project.projectid}</TableCell>
                    <TableCell>{project.projectname}</TableCell>
                    <TableCell>{client.businessname}</TableCell>
                    <TableCell>
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
                    </TableCell>
                    <TableCell>{project.receiveddate}</TableCell>
                    <TableCell>{project.deadline}</TableCell>
                    <TableCell>{project.associate}</TableCell>
                    <TableCell>
                      <Link to={`/projects/viewproject/${project.projectid}`}>
                        <button className="hover:bg-[#dbd6fc] hover:dark:bg-neutral-950 rounded-md p-2">
                          <IoEye className="text-xl" />
                        </button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </motion.div>
    </div>
  );
}
