import React, { useState, useEffect } from "react";
import { FaCheck } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import { IoCloseCircle } from "react-icons/io5";
import { PiKeyReturnBold } from "react-icons/pi";
import ApiendPonits from "../../../api/APIEndPoints.json";
import classNames from "classnames";
import { createGlobalStyle } from "styled-components";
import { makeStyles } from "@mui/styles";
import { InputLabel, Select, MenuItem, FormControl } from "@mui/material";
import ArrowDropDownRoundedIcon from "@mui/icons-material/ArrowDropDownRounded";

const GlobalStyles = createGlobalStyle`
.MuiPaper-root{
  // border-radius:10px;
} 
.MuiList-root {
// background-color:#e0f2fe !important;
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
      fontWeight: "bold",
    },
    "& .MuiInputLabel-root.Mui-focused": {
      fontWeight: "bold",
      fontSize: 15,
    },
    "& .MuiInputBase-root": {
      border: "0 none",
      borderRadius: 7,
      height: 52,
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
      display: "flex",
      alignItems: "center",
      gap: 10,
      fontFamily: "euclid-medium",
      fontSize: 14,
    },
    "& ::placeholder": {
      fontSize: 12,
    },
    "& JoyCheckbox-input": {
      backgroundColor: "red",
    },
    display: "flex",
    width: "100%",
    fontFamily: "euclid-medium",
  },
});

const CountryManagement = () => {
  const [countries, setCountries] = useState([]);
  const [newCountry, setNewCountry] = useState("");
  const [deleteCountries, setDeleteCountries] = useState([]);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const classes = useStyles();

  const token = localStorage.getItem("accessToken");

  // Fetch countries on component mount
  useEffect(() => {
    fetchCountries();
  }, []);

  // Function to show message
  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 3000);
  };

  // Function to show error
  const showError = (err) => {
    setError(err);
    setTimeout(() => setError(null), 3000);
  };

  // Function to get countries from API
  const fetchCountries = async () => {
    try {
      const response = await fetch(
        `${ApiendPonits.baseUrl}${ApiendPonits.endpoints.getcountry}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch countries.");
      const data = await response.json();
      setCountries(data.data);
    } catch (error) {
      console.error("Error fetching countries:", error);
      showError("Error fetching countries.");
    }
  };

  // Function to add country
  const handleAddCountry = async () => {
    if (!newCountry.trim()) return alert("Country name cannot be empty.");

    try {
      const response = await fetch(
        `${ApiendPonits.baseUrl}${ApiendPonits.endpoints.addcountry}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ countries: [newCountry] }),
        }
      );
      if (!response.ok) throw new Error("Failed to add country.");
      const data = await response.json();
      showMessage(data.msg);
      setCountries(data.data);
      setNewCountry("");
    } catch (error) {
      console.error("Error adding country:", error);
      showError("Error adding country.");
    }
  };

  // Function to delete countries
  const handleDeleteCountries = async () => {
    if (deleteCountries.length === 0)
      return alert("Select countries to delete.");

    try {
      const response = await fetch(
        `${ApiendPonits.baseUrl}${ApiendPonits.endpoints.deletecountry}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ countries: deleteCountries }),
        }
      );
      if (!response.ok) throw new Error("Failed to delete countries.");
      const data = await response.json();
      showMessage(data.msg);
      setCountries(data.data);
      setDeleteCountries([]);
    } catch (error) {
      console.error("Error deleting countries:", error);
      showError("Error deleting countries.");
    }
  };

  const handleclearselection = () => {
    setDeleteCountries([]);
  };

  return (
    <div className="bg-white dark:bg-neutral-900 p-2 h-full min-h-full shadow-md rounded-md">
      <div className="md:w-1/3 flex flex-col gap-4 h-full">
        <h1 className="text-base font-bold text-gray-800 dark:text-white">
          Add Country
        </h1>

        {message && (
          <div className="bg-green-500/20 text-green-600 text-base absolute bottom-2 right-2 px-3 py-2 rounded-md font-bold">
            {message}
          </div>
        )}
        {error && (
          <div className="bg-red-500/20 text-red-600 text-base absolute bottom-2 right-2 px-3 py-2 rounded-md font-bold">
            {error}
          </div>
        )}

        {/* Add Country */}
        <div className="flex gap-2 w-full">
          <div className=" rounded-md w-full bg-blue-50 dark:bg-neutral-800 flex gap-2 justify-between items-center">
            <input
              type="text"
              value={newCountry}
              onChange={(e) => setNewCountry(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddCountry();
                }
              }}
              className=" border p-3 rounded-md w-full bg-blue-50 dark:bg-neutral-800"
              placeholder="Enter country name"
            />
            <hr className="bg-blue-300 dark:bg-neutral-950 w-2 h-7 rounded-full border-none" />

            <FormControl
              variant="outlined"
              className={classNames(
                "col-span-12 sm:col-span-6 xl:col-span-2 text-xs",
                classes.root
              )}
            >
              <InputLabel id="Select Country" className="w-52">
                Select Country
              </InputLabel>
              <Select
                labelId="Select Country"
                id="Select Country"
                label="Select Country"
                name="Select Country"
                value={newCountry}
                onChange={(e) => setNewCountry(e.target.value)}
                IconComponent={(props) => (
                  <ArrowDropDownRoundedIcon
                    {...props}
                    sx={{
                      fontSize: 40,
                      borderRadius: 1,
                    }}
                  />
                )}
              >
                <GlobalStyles />

                <MenuItem value="India">India</MenuItem>
                <MenuItem value="USA">USA</MenuItem>
                <MenuItem value="UK">UK</MenuItem>
                <MenuItem value="Australia">Australia</MenuItem>
                <MenuItem value="UAE">UAE</MenuItem>
              </Select>
            </FormControl>
          </div>
          <button
            onClick={handleAddCountry}
            className="w-fit bg-green-600/30 text-green-600 px-3 rounded-md font-semibold hover:bg-green-700/20 transition duration-300 flex gap-2 items-center"
          >
            <PiKeyReturnBold fontSize={20} />
            Add
          </button>
        </div>

        {/* List Countries */}
        <div className="text-base font-bold dark:text-white flex items-center gap-2 justify-between">
          <div className="py-1">Countries {countries.length}</div>
          {/* Delete Selected Countries */}
          <div className="w-fit">
            {deleteCountries.length > 0 && (
              <div className="flex gap-2">
                <button
                  onClick={handleDeleteCountries}
                  className="w-full bg-red-600/30 text-red-600 p-1 rounded font-semibold hover:bg-red-700/30 transition duration-300 flex gap-1 items-center"
                >
                  <MdDelete fontSize={20} />
                  <span className="text-sm">{deleteCountries.length}</span>
                </button>
                <button
                  onClick={handleclearselection}
                  className="w-full bg-blue-600/30 text-blue-600 p-1 rounded font-semibold hover:bg-blue-700/30 transition duration-300 flex gap-1 items-center"
                >
                  <IoCloseCircle fontSize={20} />
                </button>
              </div>
            )}
          </div>
        </div>
        {countries.length > 0 ? (
          <ul className="flex flex-col gap-2  h-fit overflow-y-scroll scrollbrhdn">
            {countries.map((country, index) => (
              <li
                key={index}
                className="flex justify-between items-center p-3 bg-blue-100 dark:bg-neutral-800 rounded shadow-sm cursor-pointer mr-1"
                onClick={() => {
                  if (deleteCountries.includes(country)) {
                    setDeleteCountries((prev) =>
                      prev.filter((c) => c !== country)
                    );
                  } else {
                    setDeleteCountries((prev) => [...prev, country]);
                  }
                }}
              >
                <span className="text-base font-medium">{country}</span>
                <label
                  className="flex items-center cursor-pointer"
                  onClick={(e) => e.stopPropagation()} // Prevent triggering <li> click
                >
                  <input
                    type="checkbox"
                    checked={deleteCountries.includes(country)}
                    onChange={() => {
                      if (deleteCountries.includes(country)) {
                        setDeleteCountries((prev) =>
                          prev.filter((c) => c !== country)
                        );
                      } else {
                        setDeleteCountries((prev) => [...prev, country]);
                      }
                    }}
                    className="hidden"
                  />
                  <span
                    className={`custom-checkbox flex items-center justify-center w-8 h-8 rounded border-2 bg-none border-blue-600 transition-all duration-300 ${
                      deleteCountries.includes(country)
                        ? "bg-blue-600 border-blue-600"
                        : "bg-white dark:bg-neutral-800"
                    }`}
                  >
                    {deleteCountries.includes(country) && (
                      <FaCheck className="text-white w-3.5 h-3.5 font-extrabold" />
                    )}
                  </span>
                </label>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center bg-blue-50 dark:bg-neutral-950 h-full rounded-md p-2 flex items-center justify-center">
            No countries found.
          </p>
        )}
      </div>
    </div>
  );
};

export default CountryManagement;
