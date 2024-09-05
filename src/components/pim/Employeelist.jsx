import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MenuTabs from "./Menutabs";
import { motion } from "framer-motion";
import { FaFilterCircleXmark } from "react-icons/fa6";
import { TiFlash } from "react-icons/ti";
import { IoFlashOff } from "react-icons/io5";
import { HiUsers } from "react-icons/hi2";
import ApiendPonits from "../../api/APIEndPoints.json";
import { IoEye } from "react-icons/io5";
import Tooltip from "@mui/material/Tooltip";
import AttendanceChart from "../dashboard/AttendanceChart";
import Loading from "../Loading";

const Employeelist = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fetchemployee, setFetchEmployee] = useState([]);
  const [filters, setFilters] = useState({
    searchQuery: "",
    status: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Number of items per page

  const token = localStorage.getItem("accessToken");
  const navigate = useNavigate();

  // Fetch employee details
  useEffect(() => {
    const fetchEmployeeList = async () => {
      setLoading(true);
      try {
        const response = await fetch(ApiendPonits.employeeList, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (response.ok) {
          setFetchEmployee(data.data);
        } else {
          throw new Error("Failed to fetch employees");
        }
      } catch (err) {
        setError(err.message);
        setTimeout(() => setError(""), 4000);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeList();
  }, [token]);

  // Fetch employee attendance records and update employee list
  useEffect(() => {
    const fetchAttendanceEmployeeList = async () => {
      if (fetchemployee.length === 0) return; // Skip if employees are not loaded yet

      try {
        const response = await fetch(
          ApiendPonits.getAllEmployeeAttendanceRecords,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();

        if (response.ok) {
          // Create a mapping of employee_id to attendancestatus
          const attendanceStatusMap = data.attendance.reduce((map, record) => {
            map[record.employee_id] = record.attendancestatus;
            return map;
          }, {});

          // Update employee list with attendancestatus
          const updatedEmployeeList = fetchemployee.map((employee) => ({
            ...employee,
            attendancestatus:
              attendanceStatusMap[employee._id] ||
              attendanceStatusMap[employee._id],
          }));

          console.log(updatedEmployeeList);

          setFetchEmployee(updatedEmployeeList);
        } else {
          throw new Error("Failed to fetch attendance records");
        }
      } catch (err) {
        setError(err.message);
        setTimeout(() => setError(""), 4000);
      }
    };

    fetchAttendanceEmployeeList();
  }, [token, fetchemployee.length]);

  const handleClearFilters = () => {
    setFilters({
      searchQuery: "",
      status: "",
    });
    setCurrentPage(1); // Reset to first page after clearing filters
  };

  const filteredEmployees = fetchemployee.filter((employee) => {
    // Use optional chaining and default to empty string if undefined
    const lowerCaseQuery = (filters.searchQuery || "").toLowerCase();
    const statusMatch =
      filters.status === "" || employee.status?.toString() === filters.status;
    const searchMatch =
      (employee.empid?.toString() || "").includes(lowerCaseQuery) ||
      (employee.name?.toLowerCase() || "").includes(lowerCaseQuery) ||
      (employee.designation?.toLowerCase() || "").includes(lowerCaseQuery);

    return statusMatch && searchMatch;
  });

  // Pagination logic
  const indexOfLastEmployee = currentPage * itemsPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - itemsPerPage;
  const currentEmployees = filteredEmployees.slice(
    indexOfFirstEmployee,
    indexOfLastEmployee
  );
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const totalEmployees = fetchemployee.length;
  const activeEmployees = fetchemployee.filter(
    (emp) => emp.status === 1
  ).length;
  const inactiveEmployees = fetchemployee.filter(
    (emp) => emp.status === 0
  ).length;

  const handleViewClick = (employeeId) => {
    navigate(`/pim/employee-details/${employeeId}`); // Navigate to employee details page
  };

  // if (loading) return <Loading />;

  return (
    <div className="dark:text-white">
      <MenuTabs />

      <div className="bg-white dark:bg-neutral-950 p-2 rounded-md flex flex-col gap-2 mb-14">
        <div className="grid grid-cols-4 sm:grid-cols-3 gap-2">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="col-span-full sm:col-span-1 bg-none border-2 dark:border-none flex
            flex-col gap-4 dark:bg-neutral-800 p-2 rounded-md"
          >
            <div className="flex items-center gap-2">
              <div className="bg-indigo-500/20  rounded-md p-2">
                <HiUsers fontSize={20} className="text-indigo-600" />
              </div>
              <h2 className="font-bold">Total Employees</h2>
            </div>
            <div className="text-4xl font-bold text-gray-300 flex justify-end">
              {totalEmployees}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="col-span-2 sm:col-span-1 bg-none border-2 dark:border-none flex flex-col
            gap-4 dark:bg-neutral-800 p-2 rounded-md"
          >
            <div className="flex items-center gap-2">
              <div className="bg-green-500/20  rounded-md p-2">
                <TiFlash fontSize={20} className="text-green-600" />
              </div>
              <h2 className="font-bold">Active Employees</h2>
            </div>
            <div className="text-4xl font-bold text-gray-300 flex justify-end">
              {activeEmployees}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="col-span-2 sm:col-span-1 bg-none border-2 dark:border-none flex flex-col
            gap-4 dark:bg-neutral-800 p-2 rounded-md"
          >
            <div className="flex items-center gap-2">
              <div className="bg-red-500/20  rounded-md p-2">
                <IoFlashOff fontSize={20} className="text-red-600" />
              </div>
              <h2 className="font-bold">Inactive Employees</h2>
            </div>
            <div className="text-4xl font-bold text-gray-300 flex justify-end">
              {inactiveEmployees}
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-12 items-end gap-2">
          <div className="col-span-full sm:col-span-6 lg:col-span-4 flex flex-col ">
            {/* <label className="mb-1 font-semibold">
              Search by Employee ID, Name, or Designation
            </label> */}
            <input
              type="text"
              value={filters.searchQuery}
              onChange={(e) =>
                setFilters({ ...filters, searchQuery: e.target.value })
              }
              className="p-2 rounded-md shadow-md bg-sky-50 dark:bg-neutral-900"
              placeholder="Search by Employee ID, Name, or Designation"
            />
          </div>

          <div className="col-span-6 sm:col-span-3 lg:col-span-3 flex gap-2  ">
            <div className="flex space-x-1 bg-sky-100 dark:bg-neutral-900 p-1.5 rounded-md w-fit">
              <button
                onClick={() => setFilters({ ...filters, status: "" })}
                className={`p-1 rounded-md text-xs  flex items-center gap-0.5 font-semibold ${
                  filters.status === ""
                    ? "bg-indigo-500/20 text-indigo-500"
                    : " dark:text-white"
                }`}
              >
                <HiUsers fontSize={18} />
                {filters.status === "" ? "All" : ""}
                {/* All */}
              </button>
              <button
                onClick={() => setFilters({ ...filters, status: "1" })}
                className={`p-1 rounded-md text-xs  flex items-center gap-0.5 font-semibold ${
                  filters.status === "1"
                    ? "bg-green-500/20 text-green-500"
                    : " dark:text-white"
                }`}
              >
                <TiFlash fontSize={18} />
                {filters.status === "1" ? "Active" : ""}
                {/* Active */}
              </button>
              <button
                onClick={() => setFilters({ ...filters, status: "0" })}
                className={`p-1 rounded-md text-xs  flex items-center gap-0.5 font-semibold ${
                  filters.status === "0"
                    ? "bg-red-500/20 text-red-500 "
                    : " dark:text-white"
                }`}
              >
                <IoFlashOff fontSize={15} />
                {filters.status === "0" ? "Inactive" : ""}
                {/* Inactive */}
              </button>
            </div>

            <div className="col-span-1 flex">
              <button
                onClick={handleClearFilters}
                className="px-2 py-1.5 bg-sky-50 dark:bg-neutral-900 hover:dark:bg-neutral-800 rounded-md shadow-sm"
              >
                <FaFilterCircleXmark fontSize={18} />
              </button>
            </div>
          </div>

          <div className="col-span-6 sm:col-span-3 lg:col-span-5 flex justify-end items-center gap-2 ">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={`px-3 py-1.5 rounded-md shadow-sm ${
                  currentPage === index + 1
                    ? "bg-indigo-500/20 text-indigo-500"
                    : "bg-sky-50 dark:bg-neutral-800"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Table layout for larger screens */}
        {loading ? (
          <Loading />
        ) : (
          <div className="hidden md:block dark:text-white h-[30rem] overflow-y-scroll scrollbrhdn ">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-12 bg-sky-100 dark:bg-neutral-800 px-2 py-3 rounded-md">
                <div className="col-span-1 font-semibold">E_ID</div>
                <div className="col-span-3 font-semibold">Employee Name</div>
                <div className="col-span-2 font-semibold">Designation</div>
                <div className="col-span-2 font-semibold">Joining Date</div>
                <div className="col-span-2 font-semibold">Status</div>
                <div className="col-span-2 font-semibold">Action</div>
              </div>
            </motion.div>

            <div className="flex flex-col gap-2 mt-2">
              {currentEmployees.map((employee, rowIndex) => (
                <motion.div
                  key={employee._id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: rowIndex * 0.1 }}
                  className="grid grid-cols-12 bg-sky-50 dark:bg-neutral-900 px-2 py-3 rounded-md gap-2"
                >
                  <div className="col-span-1">{employee.empid}</div>
                  <div className="col-span-3 flex items-center gap-1">
                    <div
                      className={` px-2 py-1 text-center rounded-md w-fit h-fit text-xs font-semibold ${
                        employee.attendancestatus === 1
                          ? "bg-green-500/20 text-green-500"
                          : employee.attendancestatus === 0
                          ? "bg-red-500/20 text-red-500"
                          : employee.attendancestatus === 2
                          ? "bg-yellow-500/20 text-yellow-500"
                          : "bg-red-500/20 text-red-500"
                      }`}
                    >
                      {employee.attendancestatus === 1
                        ? "P" // Present
                        : employee.attendancestatus === 0 ||
                          !employee.attendancestatus
                        ? "A" // Absent
                        : employee.attendancestatus === 2
                        ? "H" // Half Day
                        : "-"}{" "}
                    </div>
                    <div>{employee.name}</div>
                  </div>
                  <div className="col-span-2">{employee.designation}</div>
                  <div className="col-span-2">{employee.dateofjoining}</div>
                  <div
                    className={`col-span-2 p-1 text-center rounded-md w-fit h-fit text-xs ${
                      employee.status === 1
                        ? "bg-green-500/20 text-green-500"
                        : "bg-red-500/20 text-red-500"
                    }`}
                  >
                    {employee.status === 1 ? (
                      <span className="flex items-center text-green-500">
                        <TiFlash fontSize={18} /> Active
                      </span>
                    ) : (
                      <span className="flex items-center gap-0.5 text-red-500">
                        <IoFlashOff fontSize={15} /> Inactive
                      </span>
                    )}
                  </div>

                  <div className="col-span-2">
                    <Tooltip
                      title={"View " + employee.name}
                      placement="top"
                      arrow
                    >
                      <button
                        onClick={() => handleViewClick(employee._id)}
                        className="hover:bg-blue-500/20 p-1.5 rounded-md text-blue-500 "
                      >
                        <IoEye fontSize={17} />
                      </button>
                    </Tooltip>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Card layout for smaller screens */}
        {loading ? (
          <Loading />
        ) : (
          <div className="md:hidden flex flex-col gap-2 mt-2">
            {currentEmployees.map((employee, rowIndex) => (
              <motion.div
                key={employee._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: rowIndex * 0.1 }}
                className="bg-sky-50 dark:bg-neutral-900 px-4 py-6 rounded-md shadow-md"
              >
                <div className="font-semibold text-lg flex items-center gap-1 justify-between">
                  <div>{employee.name}</div>
                  <div className="flex gap-2 items-center">
                    <div
                      className={`text-sm text-center py-1 px-2 rounded-md w-fit ${
                        employee.attendancestatus === 1
                          ? "bg-green-500/20 text-green-500"
                          : employee.attendancestatus === 0
                          ? "bg-red-500/20 text-red-500"
                          : employee.attendancestatus === 2
                          ? "bg-yellow-500/20 text-yellow-500"
                          : "bg-red-500/20 text-red-500"
                      }`}
                    >
                      {employee.attendancestatus === 1
                        ? "P" // Present
                        : employee.attendancestatus === 0 ||
                          !employee.attendancestatus
                        ? "A" // Absent
                        : employee.attendancestatus === 2
                        ? "H" // Half Day
                        : "-"}{" "}
                    </div>
                    <div
                      className={`text-sm text-center p-1 rounded-md w-fit ${
                        employee.status === 1
                          ? "bg-green-500/20 text-green-500"
                          : "bg-red-500/20 text-red-500"
                      }`}
                    >
                      {employee.status === 1 ? (
                        <span className="flex items-center text-green-500">
                          <TiFlash fontSize={18} /> Active
                        </span>
                      ) : (
                        <span className="flex items-center gap-0.5 text-red-500">
                          <IoFlashOff fontSize={15} /> Inactive
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-sm text-gray-700 dark:text-gray-300 flex gap-1 justify-between">
                  <div>Employee ID</div>
                  <div>{employee.empid}</div>
                </div>
                <div className="text-sm text-gray-700 dark:text-gray-300 flex gap-1 justify-between">
                  <div>Designation</div>
                  <div>{employee.designation}</div>
                </div>
                <div className="text-sm text-gray-700 dark:text-gray-300 flex gap-1 justify-between">
                  <div>Joining Date</div>
                  <div>{employee.dateofjoining}</div>
                </div>

                <div className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                  <button
                    onClick={() => handleViewClick(employee._id)}
                    className="bg-blue-500/20 p-1.5 rounded-md text-blue-500"
                  >
                    <IoEye fontSize={17} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Employeelist;
