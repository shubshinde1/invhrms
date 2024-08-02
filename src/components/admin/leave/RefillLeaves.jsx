import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import { TextField, Button } from "@mui/material";
import Calendar from "../../custom/Calendar";
import axios from "axios";
import MenuTabs from "../../pim/Menutabs";
import classNames from "classnames";
import { createGlobalStyle } from "styled-components";
import { makeStyles } from "@mui/styles";
import { IoIosRemove, IoIosAdd } from "react-icons/io";
import { FaSave } from "react-icons/fa";
import ApiendPonits from "../../../../src/api/APIEndPoints.json";

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

const RefillLeaves = () => {
  const classes = useStyles();

  const { userData } = useContext(AuthContext);

  const [optionalHoliday, setOptionalHoliday] = useState([]);
  const [mandatoryHoliday, setMandatoryHoliday] = useState([]);
  const [weekendHoliday, setWeekendHoliday] = useState([]);
  const [holidayData, setHolidayData] = useState(null);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("accessToken");
  const employee_id = userData.employeeData._id;

  const handleHolidayChange = (setState, state) => (e, index) => {
    const { name, value } = e.target;
    const updatedHolidays = [...state];
    updatedHolidays[index] = { ...updatedHolidays[index], [name]: value };
    setState(updatedHolidays);
  };

  const handleDateChange = (setState, state) => (newDate, index) => {
    const updatedHolidays = [...state];
    updatedHolidays[index] = { ...updatedHolidays[index], date: newDate };
    setState(updatedHolidays);
  };

  const handleAddHoliday = (type) => {
    const holiday = { name: "", date: "", greeting: "" };
    if (type === "optional") {
      setOptionalHoliday([...optionalHoliday, holiday]);
    } else if (type === "mandatory") {
      setMandatoryHoliday([...mandatoryHoliday, holiday]);
    } else if (type === "weekend") {
      setWeekendHoliday([...weekendHoliday, holiday]);
    }
  };

  const handleRemoveHoliday = (type, index) => {
    if (type === "optional") {
      setOptionalHoliday(optionalHoliday.filter((_, i) => i !== index));
    } else if (type === "mandatory") {
      setMandatoryHoliday(mandatoryHoliday.filter((_, i) => i !== index));
    } else if (type === "weekend") {
      setWeekendHoliday(weekendHoliday.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        ApiendPonits.addholidays,
        {
          optionalholiday: optionalHoliday,
          mandatoryholiday: mandatoryHoliday,
          weekendHoliday: weekendHoliday,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Holidays added successfully.");
      location.reload();
    } catch (error) {
      setError("Error adding holidays. Please try again.");
      console.error(error);
    }
  };

  useEffect(() => {
    const getHolidaysList = async () => {
      try {
        const response = await fetch(ApiendPonits.viewholidays, {
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
          setHolidayData(data.holidays);
        } else {
          setError("Failed to fetch holidays.");
        }
      } catch (error) {
        setError("Error fetching holidays. Please try again.");
        console.error(error);
      }
    };

    getHolidaysList();
  }, [employee_id, token]);

  return (
    <div>
      <div className="z-50 sticky top-0">
        <MenuTabs />
      </div>

      {/* New Section for Showing Holidays */}
      <div>
        {holidayData && (
          <div className="bg-white dark:bg-neutral-950 shadow-md rounded-md p-2 dark:text-white z-10 mb-16 flex flex-col gap-2">
            <h2 className="text-lg font-semibold mb-4">Holidays List</h2>

            <div className="bg-neutral-900 px-2 py-3 rounded-md">
              <ul className="grid grid-cols-12">
                <li className="col-span-3">Holiday type</li>
                <li className="col-span-3">Holiday Name</li>
                <li className="col-span-3">Holiday Date</li>
                <li className="col-span-3">Greeting</li>
              </ul>
            </div>

            <div className="flex flex-col gap-1">
              {holidayData.mandatoryholiday.map((holiday) => (
                <div
                  key={holiday._id}
                  className="bg-neutral-900 p-2 rounded-md"
                >
                  <ul className="grid grid-cols-12 ">
                    <li className="col-span-3">Mandatory Holidays</li>
                    <li className="col-span-3">{holiday.name}</li>
                    <li className="col-span-3">{holiday.date}</li>
                    <li className="col-span-3">{holiday.greeting}</li>
                  </ul>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-1">
              {holidayData.optionalholiday.map((holiday) => (
                <div
                  key={holiday._id}
                  className="bg-neutral-900 p-2 rounded-md"
                >
                  <ul className="grid grid-cols-12 ">
                    <li className="col-span-3">Optional Holidays</li>
                    <li className="col-span-3">{holiday.name}</li>
                    <li className="col-span-3">{holiday.date}</li>
                    <li className="col-span-3">{holiday.greeting || "NA"}</li>
                  </ul>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-1">
              {holidayData.weekendHoliday.map((holiday) => (
                <div
                  key={holiday._id}
                  className="bg-neutral-900 p-2 rounded-md"
                >
                  <ul className="grid grid-cols-12 ">
                    <li className="col-span-3">Weekend Holidays</li>
                    <li className="col-span-3">{holiday.name}</li>
                    <li className="col-span-3">{holiday.date}</li>
                    <li className="col-span-3">{holiday.greeting}</li>
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add new holidays section */}
      <div className="bg-white dark:bg-neutral-950 shadow-md rounded-md p-2 dark:text-white z-10  mb-16">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <div className="flex gap-2 items-center justify-between">
              <h2 className="text-base font-semibold ">Optional Holidays</h2>
              <div
                onClick={() => handleAddHoliday("optional")}
                className="bg-green-500/15 rounded-md cursor-pointer w-fit p-1 text-green-600"
              >
                <IoIosAdd fontSize={25} />
              </div>
            </div>
            {optionalHoliday.map((holiday, index) => (
              <div
                key={index}
                className="flex flex-col lg:flex-row gap-2 items-center"
              >
                <Calendar
                  onDateChange={(newDate) =>
                    handleDateChange(setOptionalHoliday, optionalHoliday)(
                      newDate,
                      index
                    )
                  }
                  className="bg-red-400"
                />
                <TextField
                  className={classNames(
                    "p-2 border rounded-lg dark:bg-neutral-800 dark:border-neutral-700",
                    classes.root
                  )}
                  id="name"
                  name="name"
                  label="Holiday Name"
                  variant="outlined"
                  margin="dense"
                  value={holiday.name}
                  onChange={(e) =>
                    handleHolidayChange(setOptionalHoliday, optionalHoliday)(
                      e,
                      index
                    )
                  }
                  required
                  autoComplete="off"
                />
                <TextField
                  className={classNames(
                    "p-2 border rounded-lg dark:bg-neutral-800 dark:border-neutral-700",
                    classes.root
                  )}
                  id="greeting"
                  name="greeting"
                  label="Greeting"
                  variant="outlined"
                  margin="dense"
                  value={holiday.greeting}
                  onChange={(e) =>
                    handleHolidayChange(setOptionalHoliday, optionalHoliday)(
                      e,
                      index
                    )
                  }
                  autoComplete="off"
                />
                <div
                  variant="outlined"
                  color="secondary"
                  onClick={() => handleRemoveHoliday("optional", index)}
                  className="bg-red-400/15 p-2.5 mt-1 rounded-md text-red-500 cursor-pointer hover:bg-red-500/20"
                >
                  <IoIosRemove fontSize={30} />
                </div>
              </div>
            ))}
          </div>

          {/* <hr /> */}

          <div>
            <div className="flex gap-2 items-center justify-between">
              <h2 className="text-base font-semibold ">Mandatory Holidays</h2>
              <div
                onClick={() => handleAddHoliday("mandatory")}
                className="bg-green-500/15 rounded-md cursor-pointer w-fit p-1 text-green-600"
              >
                <IoIosAdd fontSize={25} />
              </div>
            </div>
            {mandatoryHoliday.map((holiday, index) => (
              <div
                key={index}
                className="flex flex-col lg:flex-row gap-2 items-center"
              >
                <Calendar
                  onDateChange={(newDate) =>
                    handleDateChange(setMandatoryHoliday, mandatoryHoliday)(
                      newDate,
                      index
                    )
                  }
                  className="mb-2"
                />
                <TextField
                  className={classNames(
                    "p-2 border rounded-lg dark:bg-neutral-800 dark:border-neutral-700",
                    classes.root
                  )}
                  id="name"
                  name="name"
                  label="Holiday Name"
                  variant="outlined"
                  margin="dense"
                  value={holiday.name}
                  onChange={(e) =>
                    handleHolidayChange(setMandatoryHoliday, mandatoryHoliday)(
                      e,
                      index
                    )
                  }
                  autoComplete="off"
                />
                <TextField
                  className={classNames(
                    "p-2 border rounded-lg dark:bg-neutral-800 dark:border-neutral-700",
                    classes.root
                  )}
                  id="greeting"
                  variant="outlined"
                  margin="dense"
                  label="Greeting"
                  name="greeting"
                  value={holiday.greeting}
                  onChange={(e) =>
                    handleHolidayChange(setMandatoryHoliday, mandatoryHoliday)(
                      e,
                      index
                    )
                  }
                  autoComplete="off"
                />
                <div
                  variant="outlined"
                  color="secondary"
                  onClick={() => handleRemoveHoliday("mandatory", index)}
                  className="bg-red-400/15 p-2.5 mt-1 rounded-md text-red-500 cursor-pointer hover:bg-red-500/20"
                >
                  <IoIosRemove fontSize={30} />
                </div>
              </div>
            ))}
          </div>

          {/* <hr /> */}

          <div>
            <div className="flex gap-2 items-center justify-between">
              <h2 className="text-base font-semibold ">Weekend Holidays</h2>
              <div
                onClick={() => handleAddHoliday("weekend")}
                className="bg-green-500/15 rounded-md cursor-pointer w-fit p-1 text-green-600"
              >
                <IoIosAdd fontSize={25} />
              </div>
            </div>
            {weekendHoliday.map((holiday, index) => (
              <div
                key={index}
                className="flex flex-col lg:flex-row gap-2 items-center"
              >
                <Calendar
                  onDateChange={(newDate) =>
                    handleDateChange(setWeekendHoliday, weekendHoliday)(
                      newDate,
                      index
                    )
                  }
                  className="mb-2"
                />
                <TextField
                  className={classNames(
                    "p-2 border rounded-lg dark:bg-neutral-800 dark:border-neutral-700",
                    classes.root
                  )}
                  id="name"
                  variant="outlined"
                  margin="dense"
                  label="Holiday Name"
                  name="name"
                  value={holiday.name}
                  onChange={(e) =>
                    handleHolidayChange(setWeekendHoliday, weekendHoliday)(
                      e,
                      index
                    )
                  }
                  autoComplete="off"
                />
                <TextField
                  className={classNames(
                    "p-2 border rounded-lg dark:bg-neutral-800 dark:border-neutral-700",
                    classes.root
                  )}
                  id="greeting"
                  variant="outlined"
                  margin="dense"
                  label="Greeting"
                  name="greeting"
                  value={holiday.greeting}
                  onChange={(e) =>
                    handleHolidayChange(setWeekendHoliday, weekendHoliday)(
                      e,
                      index
                    )
                  }
                  autoComplete="off"
                />
                <div
                  variant="outlined"
                  color="secondary"
                  onClick={() => handleRemoveHoliday("weekend", index)}
                  className="bg-red-400/15 p-2.5 mt-1 rounded-md text-red-500 cursor-pointer hover:bg-red-500/20"
                >
                  <IoIosRemove fontSize={30} />
                </div>
              </div>
            ))}
          </div>

          {error && (
            <div>
              <p className="text-red-500">{error}</p>
            </div>
          )}

          <div>
            <div
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              className="bg-blue-500/15 w-fit p-2 rounded-md flex items-center gap-1.5 text-blue-600 font-bold cursor-pointer"
            >
              <FaSave fontSize={20} />
              Save Holidays
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefillLeaves;
