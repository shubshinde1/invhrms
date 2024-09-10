import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../contexts/AuthContext"; // Adjust the import path as needed
import ApiendPonits from "../../../src/api/APIEndPoints.json";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
} from "@mui/material";
import classNames from "classnames";
import { createGlobalStyle } from "styled-components";
import { makeStyles } from "@mui/styles";
import ArrowDropDownRoundedIcon from "@mui/icons-material/ArrowDropDownRounded";
import Calendar from "../custom/Calendar"; // Import the Calendar component
import { motion } from "framer-motion";
import { FaFaceFrownOpen } from "react-icons/fa6";

const GlobalStyles = createGlobalStyle`
.MuiPaper-root{
  height:fit-content;
  border-radius:10px;
} 
  .MuiMenuItem-root {
    font-family: Euclid;
    font-size: 14px;
    font-weight: bold;
    margin: 5px 8px;
    border-radius: 7px;
  }
  .MuiMenuItem-root:hover {
    background-color:#e0f2fe;
    padding-left: 14px;
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

const useStyles = makeStyles({
  root: {
    "& .MuiInputLabel-root": {
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
    fontFamily: "euclid-medium",
  },
});

const ApplyLeave = () => {
  const classes = useStyles();

  const { userData } = useContext(AuthContext);
  const token = localStorage.getItem("accessToken");

  const [leaveType, setLeaveType] = useState("leave");
  const [holidayList, setHolidayList] = useState([]);
  const [selectedHolidayDate, setSelectedHolidayDate] = useState(""); // New state for selected holiday date
  const [formData, setFormData] = useState({
    fromdate: "",
    todate: "",
    leavetype: "leave",
    leavesubtype: "",
    holidayname: "",
    reason: "",
    halfday: false,
  });
  const [errors, setErrors] = useState([]);
  const [message, setMessage] = useState("");

  const employee_id = userData?.employeeData._id;

  // Fetch optional holiday list if needed
  const fetchHolidayList = async () => {
    try {
      const response = await fetch(ApiendPonits.getoptionalholidaylist, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          employee_id,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setHolidayList(data.holidays.optionalholiday?.optionalholidaylist);
      }
    } catch (error) {
      // console.error("Failed to fetch holidays:", error);
    }
  };

  useEffect(() => {
    if (employee_id) {
      fetchHolidayList();
    }
  }, [token, employee_id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Update selected holiday date if a holiday is selected
    if (name === "holidayname") {
      const selectedHoliday = holidayList.find(
        (holiday) => holiday.name === value
      );
      setSelectedHolidayDate(selectedHoliday?.date || "");
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleDateChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const errorList = [];

    if (!formData.leavetype) {
      errorList.push("Leave Type is required");
    }

    if (formData.leavetype === "leave") {
      if (!formData.fromdate) {
        errorList.push("From Date is required");
      }
      if (!formData.todate) {
        errorList.push("To Date is required");
      }
      if (formData.fromdate > formData.todate) {
        errorList.push("From Date must be before or equal to To Date.");
      }
    }

    if (formData.leavetype === "leave" && !formData.leavesubtype) {
      errorList.push("Leave Subtype is required");
    }

    if (formData.leavetype === "Optional holiday" && !formData.holidayname) {
      errorList.push("Holiday Name is required");
    }

    setErrors(errorList);

    // Clear errors after 4 seconds
    if (errorList.length > 0) {
      setTimeout(() => setErrors([]), 4000);
    }

    return errorList.length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const response = await fetch(ApiendPonits.leaveapplication, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          employee_id,
        }),
      });
      const result = await response.json();
      if (result.success) {
        setFormData({
          fromdate: "",
          todate: "",
          leavetype: "leave",
          leavesubtype: "",
          holidayname: "",
          reason: "",
          halfday: false,
        });
        if (formData.leavetype === "leave") {
          setMessage("Leave application submitted successfully!");
        } else {
          setMessage("Holiday Leave application submitted successfully!");
        }
        setErrors([]); // Clear errors on successful submission
        setSelectedHolidayDate(""); // Reset the selected holiday date
        setTimeout(() => setMessage(""), 4000);
      } else {
        setErrors([result.message]); // Show error message from the API
        setTimeout(() => setErrors([]), 4000); // Hide errors after 4 seconds
      }
    } catch (error) {
      // console.error("Error submitting leave application:", error);
      setMessage("Failed to apply leave");
      setErrors(["Failed to apply leave"]); // Show general error message
      setTimeout(() => setMessage(""), 4000);
      setTimeout(() => setErrors([]), 4000); // Hide errors after 4 seconds
    }
  };

  return (
    <div className="container mx-auto p-2 bg-white border  dark:border-none dark:bg-neutral-900 rounded-md">
      {/* <h1 className="text-xl font-bold mb-4">Apply for Leave</h1> */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <div className="flex flex-col gap-2 col-span-12 sm:col-span-6 lg:col-span-4">
          <FormControl
            variant="outlined"
            margin="dense"
            className={classNames(
              "p-2 border rounded-lg dark:bg-neutral-800 dark:border-neutral-700",
              classes.root
            )}
          >
            <InputLabel id="leavetype-label" className="w-52">
              Leave Type
            </InputLabel>
            <Select
              labelId="leavetype-label"
              id="leavetype"
              name="leavetype"
              label="Leave Type"
              IconComponent={(props) => (
                <ArrowDropDownRoundedIcon
                  {...props}
                  sx={{
                    fontSize: 40,
                    borderRadius: 1,
                  }}
                />
              )}
              value={formData.leavetype}
              onChange={handleChange}
            >
              <GlobalStyles />
              <MenuItem value="">Choose value</MenuItem>
              <MenuItem value="leave">Leave</MenuItem>
              <MenuItem value="Optional holiday">Optional holiday</MenuItem>
            </Select>
          </FormControl>
        </div>

        {formData.leavetype === "leave" && (
          <>
            <div className="flex flex-col gap-2 col-span-12 sm:col-span-6 lg:col-span-4">
              <FormControl
                variant="outlined"
                margin="dense"
                className={classNames(
                  "p-2 border rounded-lg dark:bg-neutral-800 dark:border-neutral-700",
                  classes.root
                )}
              >
                <InputLabel id="leavesubtype-label" className="w-52">
                  Leave Subtype
                </InputLabel>
                <Select
                  labelId="leavesubtype-label"
                  id="leavesubtype"
                  name="leavesubtype"
                  label="Leave Subtype"
                  IconComponent={(props) => (
                    <ArrowDropDownRoundedIcon
                      {...props}
                      sx={{
                        fontSize: 40,
                        borderRadius: 1,
                      }}
                    />
                  )}
                  value={formData.leavesubtype}
                  onChange={handleChange}
                >
                  <GlobalStyles />
                  <MenuItem value="Sick Leave">Sick Leave</MenuItem>
                  <MenuItem value="Casual Leave">Casual Leave</MenuItem>
                  <MenuItem value="Vacation Leave">Vacation Leave</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div className="flex flex-col md:flex-row gap-2 justify-between z-0">
              <div className="w-full">
                <label>From</label>
                <Calendar
                  selectedDate={formData.fromdate}
                  onDateChange={(value) => handleDateChange("fromdate", value)}
                />
              </div>

              <div className="w-full">
                <label>To</label>
                <Calendar
                  selectedDate={formData.todate}
                  onDateChange={(value) => handleDateChange("todate", value)}
                />
              </div>
            </div>
          </>
        )}

        {formData.leavetype === "Optional holiday" && (
          <div>
            <FormControl
              variant="outlined"
              margin="dense"
              className={classNames(
                "p-2 border rounded-lg dark:bg-neutral-800 dark:border-neutral-700",
                classes.root
              )}
            >
              <InputLabel id="holidayname-label" className="w-52">
                Holiday Name
              </InputLabel>
              <Select
                labelId="holidayname-label"
                id="holidayname"
                name="holidayname"
                label="Holiday Name"
                IconComponent={(props) => (
                  <ArrowDropDownRoundedIcon
                    {...props}
                    sx={{
                      fontSize: 40,
                      borderRadius: 1,
                    }}
                  />
                )}
                value={formData.holidayname}
                onChange={handleChange}
              >
                <GlobalStyles />
                <MenuItem value="">Choose holiday</MenuItem>
                {/* {holidayList.map((holiday) => (
                  <MenuItem key={holiday._id} value={holiday.name}>
                    {holiday.name}
                  </MenuItem>
                ))} */}
                {holidayList
                  .filter((holiday) => {
                    // Get today's date (without time)
                    const today = new Date();
                    today.setHours(0, 0, 0, 0); // Remove the time part

                    // Convert the holiday date to a JavaScript Date object
                    const holidayDate = new Date(holiday.date); // Assuming holiday.date is in a valid format like 'YYYY-MM-DD'

                    // Return only holidays that are today or in the future
                    return holidayDate >= today;
                  })
                  .map((holiday) => (
                    <MenuItem key={holiday._id} value={holiday.name}>
                      {holiday.name}
                    </MenuItem>
                  ))}
              </Select>
              {errors.holidayname && (
                <span className="text-red-600">{errors.holidayname}</span>
              )}
            </FormControl>
            <div className="mt-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {selectedHolidayDate
                  ? `Holiday Date: ${selectedHolidayDate}`
                  : ""}
              </p>
            </div>
          </div>
        )}

        {formData.leavetype === "leave" && (
          <div className="flex items-center">
            <input
              id="halfday-switch"
              type="checkbox"
              name="halfday"
              checked={formData.halfday}
              onChange={handleChange}
              className="hidden peer"
            />
            <label
              htmlFor="halfday-switch"
              className="flex items-center cursor-pointer space-x-2"
            >
              <span
                className={`relative inline-flex items-center cursor-pointer w-10 h-6 dark:bg-neutral-600 bg-gray-300 rounded-full transition-colors duration-300 ease-in-out ${
                  formData.halfday ? "bg-indigo-600 dark:bg-indigo-600" : ""
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-4 h-4 dark:bg-stone-300 bg-white rounded-full shadow-lg transform transition-transform duration-300 ease-in-out ${
                    formData.halfday ? "translate-x-4" : ""
                  }`}
                />
              </span>
              <span className="">
                {formData.halfday ? "Half Day" : "Full Day"}
              </span>
            </label>
          </div>
        )}

        {formData.leavetype === "leave" && (
          <div>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              placeholder="Reason"
              rows="4"
              // required
              className="w-full p-2 border rounded-lg dark:bg-neutral-800 dark:border-neutral-700"
            />
            {errors.reason && (
              <span className="text-red-600">{errors.reason}</span>
            )}
          </div>
        )}

        <button
          type="submit"
          className=" p-2 bg-blue-500/15 text-blue-500 font-bold rounded-lg w-full text-base"
        >
          Submit Application
        </button>
        {message && (
          <div className="absolute bg-green-600 right-2 bottom-2 p-2 text-white rounded-md z-40">
            {message}
          </div>
        )}
        {errors.length > 0 && (
          <div className="absolute right-2 bottom-2 flex flex-col gap-2 z-40">
            {errors.map((error, index) => (
              <div key={index} className="text-white bg-red-600 rounded-md p-2">
                {error}
              </div>
            ))}
          </div>
        )}
      </form>
    </div>
  );
};

export default ApplyLeave;
