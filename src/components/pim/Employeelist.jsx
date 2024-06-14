import React, { useState } from "react";
import { Link } from "react-router-dom";
import Menutabs from "./Menutabs";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
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

const columns = [
  { id: "empid", label: "Employee ID", minWidth: 120 },
  { id: "ename", label: "Employee Name", minWidth: 120 },
  { id: "designation", label: "Designation", minWidth: 120 },
  { id: "jdate", label: "Joining Date", minWidth: 120 },
  { id: "status", label: "Status", minWidth: 120 },
  { id: "actions", label: "Actions", minWidth: 80 },
];

function createData(empid, ename, designation, mark, jdate, status) {
  return { empid, ename, designation, mark, jdate, status };
}

const rows = leaveData;
const edata = leaveData[0].empid;

export default function StickyHeadTable({
  empid,
  ename,
  designation,
  jdate,
  status,
}) {
  const classes = useStyles();
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(edata);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
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
      <Menutabs className="" />
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className=""
      >
        <Paper
          sx={{ overflow: "" }}
          className="md:w-[100%] w-[calc(100vw-0.8rem)] h-[100vh] md:h-[90%] top-24 mb-4 "
        >
          <div className="m-2 gap-2 flex-col items-center grid grid-cols-12 ">
            <TextField
              className={classNames(
                "col-span-12 sm:col-span-6 xl:col-span-2 text-xs",
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
                "col-span-12 sm:col-span-6 xl:col-span-2 py-1",
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

            <div className="col-span-12 md:col-span-4 flex items-center justify-between ">
              <button
                className="bg-sky-50 dark:bg-neutral-800 md:mt-1 px-4 rounded-md w-fit"
                onClick={handleClearFilters}
              >
                <FaFilterCircleXmark
                  variant="outlined"
                  className="h-11 cursor-pointer text-xl"
                />
              </button>
              <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={filteredRows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                style={{ paddingRight: "5px" }}
                className="scrollbar-hide dark:text-white"
              />
            </div>
          </div>
          <TableContainer
            sx={{ maxHeight: 530 }}
            className="m-2 pr-4 pb-2 scrollbar-hide rounded-md"
          >
            <Table stickyHeader aria-label="sticky table">
              <TableHead className="tablehead">
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align="left"
                      style={{
                        minWidth: column.minWidth,
                        fontWeight: "Bold",
                        fontFamily: "Euclid",
                      }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow
                      key={row.empid}
                      hover
                      role="checkbox"
                      tabIndex={-1}
                    >
                      {columns.map((column) => (
                        <TableCell
                          key={column.id}
                          align="left"
                          className="px-4 py-2"
                          style={{
                            fontFamily: "Euclid",
                          }}
                        >
                          {column.id !== "actions" ? (
                            column.id === "ename" ? (
                              <Tooltip
                                title={row.mark ? "Present" : "Absent"}
                                placement="left"
                                arrow
                              >
                                <Link
                                  className="flex items-center  cursor-pointer"
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
                                  <div
                                    className={`mr-3 rounded-md px-1.5 py-0.5 w-fit flex justify-center text-[.7rem] euclid-bold font-bold ${
                                      row.mark
                                        ? "bg-green-200 text-green-600"
                                        : "bg-red-200 text-red-600"
                                    }`}
                                  >
                                    {row.mark ? "P" : "A"}
                                  </div>
                                  <span>{row[column.id]}</span>
                                </Link>
                              </Tooltip>
                            ) : column.id === "status" ? (
                              <div className="flex items-center">
                                <span
                                  className={classNames(
                                    "w-2.5 h-2.5 rounded-full mr-2",
                                    {
                                      "bg-green-500":
                                        row.status.toLowerCase() === "active",
                                      "bg-red-500":
                                        row.status.toLowerCase() === "inactive",
                                    }
                                  )}
                                ></span>
                                {row.status}
                              </div>
                            ) : (
                              row[column.id]
                            )
                          ) : (
                            <div className="flex items-center gap-2">
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
                                  <FaUserEdit className="text-xl" />
                                </Link>
                              </Tooltip>
                              {" | "}
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
                                  <IoEye className="text-xl" />
                                </Link>
                              </Tooltip>
                            </div>
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </motion.div>
    </div>
  );
}
