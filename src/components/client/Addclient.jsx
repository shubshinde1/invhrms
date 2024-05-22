import React, { useState, useEffect } from "react";
import { makeStyles } from "@mui/styles";
import classNames from "classnames";
import { createGlobalStyle } from "styled-components";
import ArrowDropDownRoundedIcon from "@mui/icons-material/ArrowDropDownRounded";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { FaFileArrowUp } from "react-icons/fa6";
import { IoMdSave } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { BsPersonFillCheck, BsPersonFillAdd } from "react-icons/bs";
import { motion } from "framer-motion";

import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

const GlobalStyles = createGlobalStyle`
.MuiPaper-root{
  // border-radius:10px;
} 
.MuiList-root {
  height: full;
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
      fontFamily: "euclid-medium",
      fontSize: 14,
    },
    "& ::placeholder": {
      fontSize: 12,
    },
    "& JoyCheckbox-input": {
      backgroundColor: "red",
    },
    display: "block",
    width: "100%",
    fontFamily: "euclid-medium",
  },
});

export default function Addclient() {
  const classes = useStyles();
  const navigate = useNavigate();
  const [selectedFileName, setSelectedFileName] = useState("");
  const [isInputLabelShrunk, setIsInputLabelShrunk] = useState(false);
  const [isSuccessPopupOpen, setIsSuccessPopupOpen] = useState(false);
  const [remainingTime, setRemainingTime] = useState(2); // Initial remaining time in seconds

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFileName(file.name);
      setIsInputLabelShrunk(true);
    } else {
      setSelectedFileName("");
      setIsInputLabelShrunk(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsSuccessPopupOpen(true);
    const timer = setInterval(() => {
      setRemainingTime((prevTime) => prevTime - 1);
    }, 1000);

    setTimeout(() => {
      clearInterval(timer);
      setIsSuccessPopupOpen(false);
      // Redirect to "/clients"
      navigate("/clients");
    }, 2000); // Popup will disappear after 2 seconds
  };

  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        setIsSuccessPopupOpen(false);
        navigate("/clients");
      }
    };

    document.addEventListener("keydown", handleEscKey);

    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [navigate]);

  return (
    <div className="bg-white dark:bg-neutral-950 p-4 rounded-md mb-20">
      <form>
        <motion.div
          className="grid grid-cols-12 gap-4"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="col-span-12 sm:col-span-6 md:col-span-4 flex flex-row gap-2">
            <div className="w-[120px] flex flex-col">
              <FormControl
                variant="outlined"
                margin="dense"
                className={classNames(
                  "col-span-12 sm:col-span-6 xl:col-span-2 text-xs",
                  classes.root
                )}
              >
                <InputLabel id="prefix-label" className="w-52">
                  Prefix
                </InputLabel>
                <Select
                  labelId="prefix-label"
                  id="prefix"
                  name="prefix"
                  label="Prefix"
                  IconComponent={(props) => (
                    // <div className="bg-red-500 z-50">
                    <ArrowDropDownRoundedIcon
                      {...props}
                      sx={{
                        fontSize: 40,
                        // marginLeft: "0.375rem",
                        // backgroundColor: "#bfdbfe",
                        borderRadius: 1,
                      }}
                      // className="bg-sky-200 mr-1.5 rounded-md cursor-pointer"
                    />
                    // </div>
                  )}
                >
                  <GlobalStyles />
                  <MenuItem value="mr">Mr.</MenuItem>
                  <MenuItem value="mrs">Mrs.</MenuItem>
                  <MenuItem value="miss">Miss.</MenuItem>
                </Select>
              </FormControl>
            </div>
            <TextField
              className={classNames(
                "col-span-12 sm:col-span-6 xl:col-span-2 text-xs",
                classes.root
              )}
              id="clientname"
              name="clientname"
              label="Client Name"
              variant="outlined"
              margin="dense"
            />
          </div>
          <div className="col-span-12 sm:col-span-6 md:col-span-4 flex flex-row ">
            <TextField
              className={classNames(
                "col-span-12 sm:col-span-6 xl:col-span-2 text-xs",
                classes.root
              )}
              id="clientid"
              name="clientid"
              label="Client Id"
              variant="outlined"
              margin="dense"
            />
          </div>
          <div className="col-span-12 sm:col-span-6 md:col-span-4 flex flex-row ">
            <TextField
              className={classNames(
                "col-span-12 sm:col-span-6 xl:col-span-2 text-xs",
                classes.root
              )}
              id="businessname"
              name="businessname"
              label="Conpmany Name"
              variant="outlined"
              margin="dense"
            />
          </div>
          <div className="col-span-12 sm:col-span-6 md:col-span-4 flex flex-row ">
            <TextField
              className={classNames(
                "col-span-12 sm:col-span-6 xl:col-span-2 text-xs",
                classes.root
              )}
              id="phone"
              name="phone"
              label="Phone No"
              variant="outlined"
              margin="dense"
            />
          </div>
          <div className="col-span-12 sm:col-span-6 md:col-span-4 flex flex-row ">
            <TextField
              className={classNames(
                "col-span-12 sm:col-span-6 xl:col-span-2 text-xs",
                classes.root
              )}
              id="email"
              name="email"
              label="Email Id"
              variant="outlined"
              margin="dense"
            />
          </div>
          <div className="col-span-12 sm:col-span-6 md:col-span-4 flex flex-row ">
            <TextField
              className={classNames(
                "col-span-12 sm:col-span-6 xl:col-span-2 text-xs",
                classes.root
              )}
              id="website"
              name="website"
              label="Website Url"
              variant="outlined"
              margin="dense"
            />
          </div>
          <div className="col-span-12 sm:col-span-6 md:col-span-4 flex flex-row ">
            <TextField
              className={classNames(
                "col-span-12 sm:col-span-6 xl:col-span-2 text-xs",
                classes.root
              )}
              id="address"
              name="address"
              label="Office Address"
              variant="outlined"
              margin="dense"
            />
          </div>
          <div className="col-span-12 sm:col-span-6 md:col-span-4 flex flex-row ">
            <TextField
              className={classNames(
                "col-span-12 sm:col-span-6 xl:col-span-2 text-xs",
                classes.root
              )}
              id="projectname"
              name="projectname"
              label="Project Name"
              variant="outlined"
              margin="dense"
            />
          </div>
          <div className="col-span-12 sm:col-span-6 md:col-span-4 flex flex-row ">
            <FormControl
              variant="outlined"
              margin="dense"
              className={classNames(
                "col-span-12 sm:col-span-6 xl:col-span-2 text-xs",
                classes.root
              )}
            >
              <InputLabel id="prefix-label" className="w-52">
                Client Type
              </InputLabel>
              <Select
                labelId="clienttype-label"
                id="clienttype"
                name="clienttype"
                label="Client Type"
                IconComponent={(props) => (
                  // <div className="bg-red-500 z-50">
                  <ArrowDropDownRoundedIcon
                    {...props}
                    sx={{
                      fontSize: 40,
                      // marginLeft: "0.375rem",
                      // backgroundColor: "#bfdbfe",
                      borderRadius: 1,
                    }}
                    // className="bg-sky-200 mr-1.5 rounded-md cursor-pointer"
                  />
                  // </div>
                )}
              >
                <GlobalStyles />
                <MenuItem value="businesspartner">Business Partner</MenuItem>
                <MenuItem value="individual">Individual </MenuItem>
                <MenuItem value="corporate">Corporate </MenuItem>
                <MenuItem value="government">Government </MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className="col-span-12 sm:col-span-6 md:col-span-4 flex flex-col">
            <LocalizationProvider dateAdapter={AdapterDayjs} className="w-full">
              <DemoContainer components={["DatePicker"]}>
                <DatePicker
                  label="Contract Date"
                  className={classNames(
                    "col-span-12 sm:col-span-6 xl:col-span-2",
                    classes.root
                  )}
                />
              </DemoContainer>
            </LocalizationProvider>
          </div>
          <div className="col-span-12 sm:col-span-6 md:col-span-4 flex flex-col">
            <div>
              <input
                type="file"
                id="contractfile"
                name="contractfile"
                accept=".pdf,.doc,.docx,.png,.jpeg,.jpg"
                onChange={handleFileChange}
                style={{ display: "none" }} // Hide the file input
              />
              <TextField
                id="contractfile"
                label="Contract File"
                variant="outlined"
                margin="dense"
                type="text" // Change type to text for styling purposes
                className={classNames(
                  "col-span-12 sm:col-span-6 xl:col-span-2 text-xs ",
                  classes.root
                )}
                InputLabelProps={{
                  shrink: isInputLabelShrunk, // Dynamic shrink property based on file selection
                }}
                InputProps={{
                  endAdornment: (
                    <label
                      htmlFor="contractfile"
                      className="p-2.5 my-2 -mr-0.5 rounded-md bg-blue-10 dark:bg-neutral-950 hover:scale-105 cursor-pointer"
                    >
                      <FaFileArrowUp className="text-gray-500 dark:text-neutral-600" />
                    </label>
                  ),
                  value: selectedFileName, // Display only the selected file name
                  readOnly: true, // Make the field read-only
                  style: { paddingRight: 10, height: 50 }, // Adjust padding and maintain height
                }}
              />
            </div>
          </div>
          <div className="col-span-12 sm:col-span-6 md:col-span-4 flex flex-row ">
            <TextField
              className={classNames(
                "col-span-12 sm:col-span-6 xl:col-span-2 text-xs",
                classes.root
              )}
              id="gstn"
              name="gstn"
              label="GST No"
              variant="outlined"
              margin="dense"
            />
          </div>
          <div className="col-span-12 sm:col-span-6 md:col-span-8 flex flex-col">
            <textarea
              className="bg-[#f0f9ff] dark:bg-neutral-900 dark:text-white rounded-md focus:border-[1px] p-3 pb-0 h-20 "
              placeholder="Description"
            ></textarea>
          </div>
          <div className="col-span-12 sm:col-span-6 md:col-span-4 flex items-end justify-end">
            <button
              type="submit"
              value="Save Details"
              onClick={handleSubmit}
              className="bg-[#5336FD] text-white px-4 py-2 rounded-md cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <IoMdSave fontSize={20} />
                Save
              </div>
            </button>
            {isSuccessPopupOpen && (
              <div
                className="fixed top-0 left-0 w-full h-full flex items-center justify-center"
                style={{
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  backdropFilter: "blur(5px)",
                  zIndex: 9998,
                }}
              >
                <div className="bg-white dark:bg-neutral-900 p-4 rounded-md shadow-lg popup-content ">
                  <div className="flex flex-row items-center gap-3 bg-sky-50 dark:bg-neutral-950 dark:text-white p-3 rounded-md">
                    <BsPersonFillCheck className="text-green-500 text-2xl" />
                    <p className="text-center text-base">
                      New Client Added Successfully.
                    </p>
                  </div>
                  <div className="flex justify-center mt-5">
                    <p className="text-red-500">
                      {" "}
                      Redirect To Clients Page in {remainingTime} s.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </form>
    </div>
  );
}
