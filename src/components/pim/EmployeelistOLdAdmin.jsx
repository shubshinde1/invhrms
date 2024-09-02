import React, { useState } from "react";
import { Link } from "react-router-dom";
import Menutabs from "./Menutabs";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
import { IoEye } from "react-icons/io5";
import { FaUserEdit } from "react-icons/fa";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { FaFilterCircleXmark } from "react-icons/fa6";
import ArrowDropDownRoundedIcon from "@mui/icons-material/ArrowDropDownRounded";
import { makeStyles } from "@mui/styles";
import { createGlobalStyle } from "styled-components";
import classNames from "classnames";
import { motion } from "framer-motion";
import leaveData from "../../dummydata/leaveData.json";
import Tooltip from "@mui/material/Tooltip";
import { red } from "@mui/material/colors";

const useStyles = makeStyles({
  root: {
    "& .MuiInputLabel-root": {
      fontFamily: "euclid",
      fontSize: 14,
      paddingTop: -2.5,
      fontWeight: "bold",
    },
    "& .MuiTableCell-root": {
      fontFamily: "euclid",
      fontSize: 14,
      paddingTop: -2.5,
      fontWeight: "bold",
    },
    "& .MuiInputLabel-root.Mui-focused": {
      fontWeight: "bold",
      fontSize: 15,
    },
    "& .MuiInputBase-root": {
      border: "0 none",
      borderRadius: 7,
      height: 50,
      width: "100%",
      overflow: "hidden",
    },
    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
      borderColor: "transparent",
    },
    "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "transparent",
    },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "gray",
    },
    "& .Muilplaceholder": {
      fontFamily: "euclid",
      fontSize: 10,
    },
    "& .MuiOutlinedInput-input": {
      fontFamily: "euclid-medium",
      fontSize: 14,
    },
    "& ::placeholder": {
      fontSize: 12,
    },
    display: "block",
    width: "100%",
  },
});

const GlobalStyles = createGlobalStyle`
.MuiPaper-root{
  border-radius:10px;
} 
.MuiList-root {
  height: 215px;
} 
.MuiMenuItem-root {
    font-family: Euclid;
    font-size: 14px;
    font-weight: bold;
    margin: auto 8px;
    border-radius: 7px;
    margin-top:5px;
  }
  .MuiMenuItem-root:hover {
    background-color:#e0f2fe;
    padding-left: 15px;
  }
  .MuiMenuItem-root:hover {
    transition-duration: 0.2s;
  }

  ::-webkit-scrollbar {
    display: none;
    -ms-overflow-style: none;
    scrollbar-width: none;
    
}
`;

const rows = leaveData;
const edata = leaveData[0].empid;

export default function StickyHeadTable() {
  const classes = useStyles();
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(edata);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [filters, setFilters] = React.useState({
    empid: "",
    ename: "",
    status: "",
    designation: "",
  });

  const handleChangeFilter = (event) => {
    const { name, value } = event.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      empid: "",
      ename: "",
      status: "",
      designation: "",
    });
  };

  const designations = Array.from(new Set(rows.map((row) => row.designation)));
  const statuses = Array.from(new Set(rows.map((row) => row.status)));

  const filteredRows = React.useMemo(() => {
    return rows.filter((row) => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true; // If filter value is empty, return true
        if (key === "designation") {
          // For designation, check if the row value contains the filter value
          return row[key].toLowerCase().includes(value.toLowerCase());
        } else if (key === "status") {
          // For status, check if the row value matches the filter value
          return row[key].toLowerCase() === value.toLowerCase();
        } else {
          // For other fields, check if the row value starts with the filter value
          return row[key].toLowerCase().startsWith(value.toLowerCase());
        }
      });
    });
  }, [filters]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handlePreview = (empid, ename, designation, jdate, status) => {
    console.log("Row Data:", { empid, ename, designation, jdate, status });
    setSelectedEmployeeId(edata);
  };

  const employeeParams = {
    empid: rows.empid,
    ename: rows.ename,
    designation: rows.designation,
    jdate: rows.jdate,
    status: rows.status,
  };
  return (
    <div>
      <Menutabs />
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className=""
      >
        <Paper className="md:w-[100%] w-[calc(100vw-0.8rem)] h-[100vh] md:h-[90%] top-22 p-2 flex flex-col gap-1">
          <div className=" gap-2 flex-col items-center grid grid-cols-12 -mt-2">
            <TextField
              className={classNames(
                "col-span-12 sm:col-span-6 xl:col-span-2 text-xs ",
                classes.root
              )}
              id="empid"
              name="empid"
              label="Employee ID"
              value={filters.empid}
              onChange={handleChangeFilter}
              variant="outlined"
              margin="dense"
            />

            <TextField
              className={classNames(
                "col-span-12 sm:col-span-6 xl:col-span-2 py-0",
                classes.root
              )}
              id="ename"
              name="ename"
              label="Employee Name"
              value={filters.ename}
              onChange={handleChangeFilter}
              variant="outlined"
              margin="dense"
            />
            <FormControl
              variant="outlined"
              margin="dense"
              className={classNames(
                "col-span-12 sm:col-span-6 xl:col-span-2",
                classes.root
              )}
            >
              <InputLabel id="status-label" className="w-52 ">
                Status
              </InputLabel>
              <Select
                labelId="status-label"
                id="status"
                name="status"
                value={filters.status}
                onChange={handleChangeFilter}
                label="Status"
                IconComponent={(props) => (
                  <span>
                    <ArrowDropDownRoundedIcon
                      {...props}
                      sx={{
                        fontSize: 40,
                        borderRadius: 2,
                      }}
                    />
                  </span>
                )}
              >
                <GlobalStyles />
                <MenuItem value="">
                  <span className="w-4 h-2 mr-2 rounded-full bg-gray-400"></span>
                  All
                </MenuItem>
                {statuses.map((statuse) => (
                  <MenuItem key={statuse} value={statuse.toLowerCase()}>
                    <span
                      className={classNames("w-4 h-2 mr-2 rounded-full", {
                        "bg-green-500 ": statuse.toLowerCase() === "active",
                        "bg-red-500 ": statuse.toLowerCase() === "inactive",
                      })}
                    ></span>
                    {statuse}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl
              variant="outlined"
              margin="dense"
              className={classNames(
                "col-span-12 sm:col-span-6 xl:col-span-2",
                classes.root
              )}
            >
              <InputLabel id="designation-label" className="w-52">
                Designation
              </InputLabel>
              <Select
                labelId="designation-label"
                id="designation"
                name="designation"
                value={filters.designation}
                onChange={handleChangeFilter}
                label="Designation"
                IconComponent={(props) => (
                  <span>
                    <ArrowDropDownRoundedIcon
                      {...props}
                      sx={{
                        fontSize: 40,
                        borderRadius: 2,
                      }}
                    />
                  </span>
                )}
              >
                <GlobalStyles />
                <MenuItem value="">All</MenuItem>
                {designations.map((designation) => (
                  <MenuItem
                    key={designation}
                    value={designation.toLowerCase()}
                    className="bg-sky-50 dark:bg-neutral-950 "
                  >
                    {designation}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <div className="col-span-12 md:col-span-4 flex items-center justify-start ">
              <button
                className="bg-sky-50 dark:bg-neutral-900 mt-1 h-12 px-4 rounded-md w-fit"
                onClick={handleClearFilters}
              >
                <FaFilterCircleXmark
                  variant="outlined"
                  className="h-11 cursor-pointer text-xl"
                />
              </button>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, 100]}
                component="div"
                count={filteredRows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                style={{ paddingRight: "0px" }}
                className="scrollbar-hide dark:text-white bg-sky-50 dark:bg-neutral-900 h-12 mt-1 ml-2 rounded-md flex items-center"
              />
            </div>
          </div>
          <div className="overflow-auto rounded-md">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ul className="grid grid-cols-12 gap-2 px-2 py-3 bg-sky-100 dark:bg-neutral-800 rounded-md font-bold">
                <li className="col-span-2 ">Employee ID</li>
                <li className="col-span-2 ">Employee Name</li>
                <li className="col-span-3 ">Designation</li>
                <li className="col-span-2 ">Joining Date</li>
                <li className="col-span-2 ">Status</li>
                <li className="col-span-1 ">Actions</li>
              </ul>
            </motion.div>

            <div className="flex flex-col overflow-auto scrollbar-hide mt-2">
              {filteredRows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, rowIndex) => (
                  <motion.div
                    key={row.empid}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: rowIndex * 0.1 }}
                    className={`bg-sky-50 dark:bg-neutral-900 p-2 rounded-md grid grid-cols-12 gap-2 items-center ${
                      rowIndex !== 0 ? "mt-2" : ""
                    }`}
                  >
                    <div className="col-span-2 py-2 ">{row.empid}</div>
                    <Tooltip
                      title={row.mark ? "Present" : "Absent"}
                      placement="left"
                      arrow
                      className="col-span-2 py-2 flex flex-row gap-2 cursor-pointer"
                    >
                      <Link
                        className=""
                        to={{
                          pathname: `/pim/view/${
                            row.empid
                          }/${encodeURIComponent(
                            row.ename
                          )}/${encodeURIComponent(
                            row.designation
                          )}/${encodeURIComponent(
                            row.jdate
                          )}/${encodeURIComponent(row.status)}`,
                          state: { ...employeeParams.empid },
                        }}
                      >
                        {row.mark === 0 ? (
                          <span className="bg-red-300 text-xs items-center flex font-bold text-red-700 px-1.5 rounded-md">
                            A
                          </span>
                        ) : row.mark === 1 ? (
                          <span className="bg-green-300 text-xs items-center flex font-bold text-green-700 px-1.5 rounded-md">
                            P
                          </span>
                        ) : null}
                        {row.ename}
                      </Link>
                    </Tooltip>
                    <div className="col-span-3 py-2 ">{row.designation}</div>
                    <div className="col-span-2 py-2 ">{row.jdate}</div>
                    <div className="col-span-2 py-2 ">
                      <div className="flex items-center gap-2">
                        <div
                          className={`rounded-full w-2 h-2 ${
                            row.mark ? "bg-green-600" : "bg-red-600"
                          }`}
                        ></div>
                        <span className="ml-2">{row.status}</span>
                      </div>
                    </div>
                    <div className="col-span-1 py- text-gray-800 dark:text-gray-300">
                      <div className="flex gap-2 items-center">
                        <Tooltip
                          title={`View ${row.ename}`}
                          placement="top"
                          arrow
                        >
                          <Link
                            className="hover:bg-[#dbd6fc] hover:dark:bg-neutral-950 rounded-md p-2"
                            to={{
                              pathname: `/pim/view/${
                                row.empid
                              }/${encodeURIComponent(
                                row.ename
                              )}/${encodeURIComponent(
                                row.designation
                              )}/${encodeURIComponent(
                                row.jdate
                              )}/${encodeURIComponent(row.status)}`,
                              state: { ...employeeParams.empid },
                            }}
                          >
                            <IoEye className="text-lg text-gray-800 dark:text-gray-300" />
                          </Link>
                        </Tooltip>
                        |
                        <Tooltip
                          title={`Edit ${row.ename}`}
                          placement="top"
                          arrow
                        >
                          <Link
                            className="hover:bg-[#dbd6fc] hover:dark:bg-neutral-950 rounded-md p-2"
                            to={{
                              pathname: `/pim/edit/${
                                row.empid
                              }/${encodeURIComponent(
                                row.ename
                              )}/${encodeURIComponent(
                                row.designation
                              )}/${encodeURIComponent(
                                row.jdate
                              )}/${encodeURIComponent(row.status)}`,
                            }}
                          >
                            <FaUserEdit className="text-lg text-gray-800 dark:text-gray-300" />
                          </Link>
                        </Tooltip>
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>
        </Paper>
      </motion.div>
    </div>
  );
}
