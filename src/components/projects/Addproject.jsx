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
import clientsData from "../client/MasterClientsProjects.json";

import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

const GlobalStyles = createGlobalStyle`
.MuiPaper-root{
    border-radius:10px;
  } 
  .MuiList-root {
    height: 212px;
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

export default function Addproject() {
  const classes = useStyles();
  const navigate = useNavigate();
  const [selectedFileName, setSelectedFileName] = useState("");
  const [isInputLabelShrunk, setIsInputLabelShrunk] = useState(false);
  const [isSuccessPopupOpen, setIsSuccessPopupOpen] = useState(false);
  const [remainingTime, setRemainingTime] = useState(2); // Initial remaining time in seconds
  const [selectedBusinessName, setSelectedBusinessName] = useState("");
  const [selectedClientId, setSelectedClientId] = useState("");

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
      navigate("/projects");
    }, 2000); // Popup will disappear after 2 seconds
  };

  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        setIsSuccessPopupOpen(false);
        navigate("/projects");
      }
    };

    document.addEventListener("keydown", handleEscKey);

    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [navigate]);

  const handleBusinessNameChange = (event) => {
    const selectedName = event.target.value;
    // console.log("Selected name:", selectedName);
    setSelectedBusinessName(selectedName);
    const selectedClient = clientsData.find(
      (client) =>
        client.businessname.toLowerCase().replace(/\s/g, "") === selectedName
    );
    if (selectedClient) {
      //   console.log("Selected client ID:", selectedClient.clientid);
      setSelectedClientId(selectedClient.clientid);
    } else {
      //   console.log("Client not found for the selected name:", selectedName);
      setSelectedClientId(""); // Clearing client ID if client not found
    }
  };

  return (
    <div className="bg-white dark:bg-neutral-950 p-4 rounded-md mb-20">
      <form>
        <motion.div
          className="grid grid-cols-12 gap-2"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="col-span-12 sm:col-span-6 md:col-span-4 flex flex-row gap-2">
            <FormControl
              variant="outlined"
              margin="dense"
              className={classNames(
                "col-span-12 sm:col-span-6 xl:col-span-2 text-xs",
                classes.root
              )}
            >
              <InputLabel id="client-label" className="w-52">
                Choose Client
              </InputLabel>
              <Select
                labelId="client-label"
                id="chooseclient"
                name="chooseclient"
                label="Choose Client"
                IconComponent={(props) => (
                  <ArrowDropDownRoundedIcon
                    {...props}
                    sx={{
                      fontSize: 40,
                      borderRadius: 1,
                    }}
                  />
                )}
                onChange={handleBusinessNameChange}
              >
                <GlobalStyles />
                {clientsData.map((client) => (
                  <MenuItem
                    key={client.id}
                    value={client.businessname.toLowerCase().replace(/\s/g, "")}
                  >
                    {client.businessname}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <div className="w-[100px] flex flex-col ">
              <TextField
                className={classNames(
                  "col-span-12 sm:col-span-6 xl:col-span-2 text-xs w-[120px] flex flex-col",
                  classes.root
                )}
                id="clientid"
                name="clientid"
                label="Client Id"
                variant="outlined"
                margin="dense"
                value={selectedClientId}
                disabled
              />
            </div>
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
            <TextField
              className={classNames(
                "col-span-12 sm:col-span-6 xl:col-span-2 text-xs",
                classes.root
              )}
              id="projectid"
              name="projectid"
              label="Project Id"
              variant="outlined"
              margin="dense"
              type="number"
            />
          </div>
          <div className="col-span-12 sm:col-span-6 md:col-span-4 flex flex-col">
            <LocalizationProvider dateAdapter={AdapterDayjs} className="w-full">
              <DemoContainer components={["DatePicker"]}>
                <DatePicker
                  label="Recived Date"
                  className={classNames(
                    "col-span-12 sm:col-span-6 xl:col-span-2",
                    classes.root
                  )}
                />
              </DemoContainer>
            </LocalizationProvider>
          </div>
          <div className="col-span-12 sm:col-span-6 md:col-span-4 flex flex-col">
            <LocalizationProvider dateAdapter={AdapterDayjs} className="w-full">
              <DemoContainer components={["DatePicker"]}>
                <DatePicker
                  label="Deadline"
                  className={classNames(
                    "col-span-12 sm:col-span-6 xl:col-span-2",
                    classes.root
                  )}
                />
              </DemoContainer>
            </LocalizationProvider>
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
              <InputLabel id="status-label" className="w-52">
                Status
              </InputLabel>
              <Select
                labelId="status-label"
                id="status"
                name="status"
                label="Status"
                IconComponent={(props) => (
                  <ArrowDropDownRoundedIcon
                    {...props}
                    sx={{
                      fontSize: 40,
                      borderRadius: 1,
                    }}
                  />
                )}
                onChange={handleBusinessNameChange}
                // onChange={(event) => {
                //   const selectedValue = event.target.value;
                //   console.log("Selected value:", selectedValue);
                // }}
              >
                <GlobalStyles />
                <MenuItem value="planning">Planning</MenuItem>
                <MenuItem value="inprocess">In Process</MenuItem>
                <MenuItem value="deployement">Deployement</MenuItem>
                <MenuItem value="testing">Testing</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="onhold">On Hold</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
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
              <InputLabel id="status-label" className="w-52">
                Assign To
              </InputLabel>
              <Select
                labelId="status-label"
                id="status"
                name="status"
                label="Assign To"
                IconComponent={(props) => (
                  <ArrowDropDownRoundedIcon
                    {...props}
                    sx={{
                      fontSize: 40,
                      borderRadius: 1,
                    }}
                  />
                )}
                onChange={handleBusinessNameChange}
              >
                <GlobalStyles />
                <MenuItem value="shubhamshinde">Shubham Shinde</MenuItem>
                <MenuItem value="shubhamshinde">Shubham Shinde</MenuItem>
                <MenuItem value="shubhamshinde">Shubham Shinde</MenuItem>
                <MenuItem value="shubhamshinde">Shubham Shinde</MenuItem>
                <MenuItem value="shubhamshinde">Shubham Shinde</MenuItem>
                <MenuItem value="shubhamshinde">Shubham Shinde</MenuItem>
                <MenuItem value="shubhamshinde">Shubham Shinde</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className="col-span-12 sm:col-span-6 md:col-span-8 flex flex-col mt-2">
            <textarea
              className="bg-[#f0f9ff] dark:bg-neutral-900 dark:text-white rounded-md focus:border-[1px] p-3 pb-0 h-20 "
              placeholder="Description/Remark"
            ></textarea>
          </div>
          <div className="col-span-12 flex items-end justify-end mt-2">
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
                <div className="bg-white dark:bg-neutral-900 dark:text-white p-4 rounded-md shadow-lg popup-content ">
                  <div className="flex flex-row items-center gap-3 bg-sky-50 dark:bg-neutral-950 p-3 rounded-md">
                    <BsPersonFillCheck className="text-green-500 text-2xl" />
                    <p className="text-center text-base">
                      New Project Added Successfully.
                    </p>
                  </div>
                  <div className="flex justify-center mt-5">
                    <p className="text-red-500">
                      {" "}
                      Redirect To Projects Page in {remainingTime} s.
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
