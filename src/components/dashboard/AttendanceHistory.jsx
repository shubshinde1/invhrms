import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { FaCaretLeft, FaCaretRight } from "react-icons/fa";
import { motion } from "framer-motion";
import {
  FaCalendarDays,
  FaCircleCheck,
  FaCircleXmark,
  FaCircleHalfStroke,
} from "react-icons/fa6";
import ApiendPonits from "../../api/APIEndPoints.json";
import CustomDropdown from "../custom/CustomDropdown";

function msToTime(duration) {
  let milliseconds = parseInt((duration % 1000) / 100),
    seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60),
    hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;

  return hours + ":" + minutes + ":" + seconds;
}

const AttendanceHistory = () => {
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [filteredAttendance, setFilteredAttendance] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState("");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [monthName, setMonthName] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [currentDate, setCurrentDate] = useState(new Date());
  // const [yearOptions, setYearOptions] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(""); // State for attendance status filter
  // const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  // const years = Array.from({ length: 20 }, (_, i) => currentYear - 10 + i);

  const currentYr = new Date().getFullYear();
  const prevYear = currentYr - 1;

  const { userData } = useContext(AuthContext);
  const token = localStorage.getItem("accessToken");
  const employee_id = userData?.employeeData._id;

  const getAttendanceHistory = async () => {
    setLoading(true); // Start loading
    try {
      const response = await fetch(ApiendPonits.getattendancehistory, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ employee_id }),
      });
      const data = await response.json();

      if (response.ok) {
        setAttendanceHistory(data.attendance);
        // setYearOptions([
        //   ...new Set(
        //     data.attendance.map((record) => new Date(record.date).getFullYear())
        //   ),
        // ]);
        filterByMonthYear(
          data.attendance,
          selectedMonth,
          selectedYear,
          selectedStatus
        );
      } else {
        setErrors(data.message || "Failed to fetch attendance history.");
      }
    } catch (error) {
      setErrors(error.message || "Error fetching attendance history.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const filterByMonthYear = (records, month, year, status) => {
    const filtered = records.filter((record) => {
      const recordDate = new Date(record.date);
      const matchesDate =
        recordDate.getFullYear() === year && recordDate.getMonth() === month;
      const matchesStatus =
        status === "" || record.attendancestatus === parseInt(status, 10);
      return matchesDate && matchesStatus;
    });
    setFilteredAttendance(filtered);
  };

  const calculateStats = () => {
    const totalWorkingDays = filteredAttendance.length;
    const presentDays = filteredAttendance.filter(
      (record) => record.attendancestatus === 1
    ).length;
    const absentDays = filteredAttendance.filter(
      (record) => record.attendancestatus === 0
    ).length;
    const halfDays = filteredAttendance.filter(
      (record) => record.attendancestatus === 2
    ).length;

    return { totalWorkingDays, presentDays, absentDays, halfDays };
  };

  const handleMonthChange = (event) => {
    const month = parseInt(event.target.value, 10);
    setSelectedMonth(month);
    setCurrentMonth(new Date(selectedYear, month, 1));
    filterByMonthYear(attendanceHistory, month, selectedYear, selectedStatus);
  };

  const handleYearChange = (event) => {
    const year = parseInt(event.target.value, 10);
    setSelectedYear(year);
    setCurrentMonth(new Date(year, selectedMonth, 1));
    filterByMonthYear(attendanceHistory, selectedMonth, year, selectedStatus);
  };

  const handleStatusChange = (value) => {
    setSelectedStatus(value);
    filterByMonthYear(attendanceHistory, selectedMonth, selectedYear, value);
  };
  // Status options
  const statusOptions = ["All", "Absent", "Present", "Half Day"];

  const statusOptionsMap = {
    All: "",
    Absent: "0",
    Present: "1",
    "Half Day": "2",
  };

  const handlePrevMonth = () => {
    let newMonth = currentMonth.getMonth() - 1;
    let newYear = currentMonth.getFullYear();

    // If navigating to the previous month would go beyond the previous year
    if (newMonth < 0) {
      newMonth = 11;
      newYear -= 1;
    }

    // Ensure the new year is within the range of the previous year and the current year
    if (newYear < prevYear) {
      newYear = prevYear;
      newMonth = 11; // December of the previous year
    }

    const newDate = new Date(newYear, newMonth, 1);
    setCurrentMonth(newDate);
    setSelectedMonth(newMonth);
    setSelectedYear(newYear);
    filterByMonthYear(attendanceHistory, newMonth, newYear, selectedStatus);
  };

  const handleNextMonth = () => {
    let newMonth = currentMonth.getMonth() + 1;
    let newYear = currentMonth.getFullYear();

    // If navigating to the next month would go beyond the current year
    if (newMonth > 11) {
      newMonth = 0;
      newYear += 1;
    }

    // Ensure the new year is within the range of the previous year and the current year
    if (newYear > currentYr) {
      newYear = currentYr;
      newMonth = 0; // January of the current year
    }

    const newDate = new Date(newYear, newMonth, 1);
    setCurrentMonth(newDate);
    setSelectedMonth(newMonth);
    setSelectedYear(newYear);
    filterByMonthYear(attendanceHistory, newMonth, newYear, selectedStatus);
  };

  useEffect(() => {
    if (employee_id) {
      getAttendanceHistory();
    }
  }, [employee_id, token]);

  useEffect(() => {
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    setMonthName(`${monthNames[selectedMonth]} ${selectedYear}`);
  }, [selectedMonth, selectedYear]);

  const getStatusClasses = (status) => {
    switch (status) {
      case 0:
        return "bg-red-500/15 text-red-500"; // Absent
      case 1:
        return "bg-green-500/15 text-green-500"; // Present
      case 2:
        return "bg-yellow-500/15 text-yellow-500"; // Half Day
      case 3:
        return "bg-pink-500/15 text-pink-500"; // Half Day
      default:
        return "bg-gray-200/15 text-gray-500"; // Default
    }
  };

  // Calculate statistics
  const { totalWorkingDays, presentDays, absentDays, halfDays } =
    calculateStats();

  const monthOptions = Array.from({ length: 12 }, (_, i) =>
    new Date(0, i).toLocaleString("default", {
      month: "short",
    })
  );

  const currentYear = new Date().getFullYear();
  const yearOptions = [currentYear.toString(), (currentYear - 1).toString()];

  return (
    <div className="dark:text-white bg-white dark:bg-neutral-950 p-2 rounded-md">
      {loading ? (
        <p>Loading...</p>
      ) : errors ? (
        <p className="text-red-500">{errors}</p>
      ) : (
        <div className="flex flex-col gap-2">
          {/* Grid Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.1 }}
              className="border-2 dark:border-0 dark:bg-neutral-900 p-2 rounded-md text-center flex flex-col gap-3"
            >
              <div className="flex items-center gap-2">
                <div className="bg-orange-200 dark:bg-orange-500/15 rounded-lg p-2 w-fit">
                  <FaCalendarDays fontSize={18} className="text-orange-600 " />
                </div>

                <h3 className="font-semibold">Total Working Days</h3>
              </div>
              <div className="flex justify-end">
                <h4 className=" font-bold text-4xl">{totalWorkingDays}</h4>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="border-2 dark:border-0 dark:bg-neutral-900 p-2 rounded-md text-center flex flex-col gap-3"
            >
              <div className="flex items-center gap-2">
                <div className="bg-green-200 dark:bg-green-500/15 rounded-lg p-2 w-fit">
                  <FaCircleCheck fontSize={18} className="text-green-600 " />
                </div>

                <h3 className="font-semibold">Present Days</h3>
              </div>
              <div className="flex justify-end">
                <h4 className=" font-bold text-4xl">{presentDays}</h4>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="border-2 dark:border-0 dark:bg-neutral-900 p-2 rounded-md text-center flex flex-col gap-3"
            >
              <div className="flex items-center gap-2">
                <div className="bg-red-200 dark:bg-red-500/15 rounded-lg p-2 w-fit">
                  <FaCircleXmark fontSize={18} className="text-red-600 " />
                </div>

                <h3 className="font-semibold">Absent Days</h3>
              </div>
              <div className="flex justify-end">
                <h4 className=" font-bold text-4xl">{absentDays}</h4>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="border-2 dark:border-0 dark:bg-neutral-900 p-2 rounded-md text-center flex flex-col gap-3"
            >
              <div className="flex items-center gap-2">
                <div className="bg-orange-200 dark:bg-orange-500/15 rounded-lg p-2 w-fit">
                  <FaCircleHalfStroke
                    fontSize={18}
                    className="text-orange-600 "
                  />
                </div>

                <h3 className="font-semibold">Half Days</h3>
              </div>
              <div className="flex justify-end">
                <h4 className=" font-bold text-4xl">{halfDays}</h4>
              </div>
            </motion.div>
          </div>

          {/* Month and Year Dropdown */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevMonth}
              className="p-1 bg-sky-50 dark:bg-neutral-900 text-white rounded-md group"
            >
              <FaCaretLeft
                fontSize={20}
                className="group-hover:-translate-x-1 duration-300 text-black dark:text-white"
              />
            </button>
            <div className="flex items-center gap-2">
              <CustomDropdown
                label="Month"
                options={monthOptions}
                selectedValue={selectedMonth}
                onChange={(value) => {
                  setSelectedMonth(value);
                  handleMonthChange({ target: { value } });
                }}
              />
              <CustomDropdown
                label="Year"
                options={yearOptions}
                selectedValue={yearOptions.indexOf(selectedYear.toString())}
                onChange={(value) => {
                  const selectedYearValue = parseInt(yearOptions[value]);
                  setSelectedYear(selectedYearValue);
                  handleYearChange({ target: { value: selectedYearValue } });
                }}
              />
            </div>
            <button
              onClick={handleNextMonth}
              className="p-1 bg-sky-50 dark:bg-neutral-900 text-white rounded-md group"
            >
              <FaCaretRight
                fontSize={20}
                className="group-hover:translate-x-1 duration-300 text-black dark:text-white"
              />
            </button>
            {/* <CustomDropdown
              label="Status"
              options={statusOptions}
              selectedValue={statusOptions.indexOf(
                Object.keys(statusOptionsMap).find(
                  (key) => statusOptionsMap[key] === selectedStatus
                ) || "All"
              )}
              onChange={(value) => {
                handleStatusChange(statusOptionsMap[statusOptions[value]]);
              }}
            /> */}
            <div className="flex flex-wrap gap-2 text-xs font-semibold bg-neutral-900 p-1 rounded-md">
              <button
                onClick={() => handleStatusChange("")}
                className={`px-1.5 py-1 rounded-md flex items-center gap-1 ${
                  selectedStatus === "" ? "bg-blue-500/15 text-blue-500" : ""
                }`}
              >
                <FaCalendarDays fontSize={15} />
                {selectedStatus === "" ? "All" : ""}
              </button>
              <button
                onClick={() => handleStatusChange(1)}
                className={`px-1.5 py-1 rounded-md flex items-center gap-1 ${
                  selectedStatus === 1 ? "bg-green-500/15 text-green-500" : ""
                }`}
              >
                <FaCircleCheck fontSize={15} />
                {selectedStatus === 1 ? "Present" : ""}
              </button>
              <button
                onClick={() => handleStatusChange(0)}
                className={`px-1.5 py-1 rounded-md flex items-center gap-1 ${
                  selectedStatus === 0 ? "bg-red-500/15 text-red-500" : ""
                }`}
              >
                <FaCircleXmark fontSize={15} />
                {selectedStatus === 0 ? "Absent" : ""}
              </button>
              <button
                onClick={() => handleStatusChange(2)}
                className={`px-1.5 py-1 rounded-md flex items-center gap-1 ${
                  selectedStatus === 2 ? "bg-yellow-500/15 text-yellow-500" : ""
                }`}
              >
                <FaCircleHalfStroke fontSize={15} />
                {selectedStatus === 2 ? "Half Day" : ""}
              </button>
            </div>
          </div>

          {filteredAttendance.length === 0 ? (
            <p>No attendance records found for {monthName}.</p>
          ) : (
            <div className="flex flex-col sm:gap-2">
              {/* Grid View for larger screens */}
              <div className="hidden sm:grid sm:grid-cols-11 gap-4 bg-sky-100 dark:bg-neutral-800 p-2 rounded-md">
                <div className="font-semibold">Sr. No.</div>
                <div className="col-span-2 font-semibold">Date</div>
                <div className="col-span-2 font-semibold">In Time</div>
                <div className="col-span-2 font-semibold">Out Time</div>
                <div className="col-span-2 font-semibold">Total Hours</div>
                <div className="col-span-2 font-semibold">Status</div>
              </div>

              <div className="flex flex-col gap-2">
                {filteredAttendance.map((record, index) => (
                  <div
                    key={record._id}
                    className="hidden sm:grid sm:grid-cols-11 gap-4 bg-sky-50 dark:bg-neutral-900 p-2 rounded-md items-center"
                  >
                    <div className="">{index + 1}</div> {/* Serial number */}
                    <div className="col-span-2">{record.date}</div>
                    <div className="col-span-2">
                      {new Date(record.intime).toLocaleTimeString()}
                    </div>
                    <div className="col-span-2">
                      {record.outtime
                        ? new Date(record.outtime).toLocaleTimeString()
                        : "00:00:00"}
                    </div>
                    <div className="col-span-2">
                      {record.totalhrs ? msToTime(record.totalhrs) : "00:00:00"}
                    </div>
                    <div
                      className={`col-span-2 p-1 font-semibold text-xs rounded-md w-fit h-fit ${getStatusClasses(
                        record.attendancestatus
                      )}`}
                    >
                      {record.attendancestatus === 0
                        ? "Absent"
                        : record.attendancestatus === 1
                        ? "Present"
                        : record.attendancestatus === 2
                        ? "Half Day"
                        : "Week Off"}
                    </div>
                  </div>
                ))}
              </div>

              {/* Card View for smaller screens */}
              <div className="mb-16 sm:mb-0 flex flex-col gap-2">
                {filteredAttendance.map((record, index) => (
                  <div
                    key={record._id}
                    className="sm:hidden bg-white dark:bg-neutral-900 p-2 rounded-md"
                  >
                    <div className="font-semibold text-lg hidden sm:flex">
                      Record {index + 1}
                    </div>
                    <div className="m">
                      <div className="flex justify-between">
                        <span className="font-semibold">Date:</span>
                        <span>{record.date}</span>
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="font-semibold">In Time:</span>
                        <span>
                          {new Date(record.intime).toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="font-semibold">Out Time:</span>
                        <span>
                          {record.outtime
                            ? new Date(record.outtime).toLocaleTimeString()
                            : "00:00:00"}
                        </span>
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="font-semibold">Total Hours:</span>
                        <span>
                          {record.totalhrs
                            ? msToTime(record.totalhrs)
                            : "00:00:00"}
                        </span>
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="font-semibold">Status:</span>
                        <span
                          className={`p-1 font-semibold text-xs rounded-md ${getStatusClasses(
                            record.attendancestatus
                          )}`}
                        >
                          {record.attendancestatus === 0
                            ? "Absent"
                            : record.attendancestatus === 1
                            ? "Present"
                            : "Half Day"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AttendanceHistory;
