import React, { useState } from "react";
import { useParams } from "react-router-dom";
import MenuTabs from "./Menutabs";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import classNames from "classnames";
import { makeStyles } from "@mui/styles";
import { createGlobalStyle } from "styled-components";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import dayjs from "dayjs";
import ArrowDropDownRoundedIcon from "@mui/icons-material/ArrowDropDownRounded";
import { FaUpload } from "react-icons/fa6";

const GlobalStyles = createGlobalStyle`
.MuiPaper-root{
  height:215px;
  border-radius:10px;
} 
  .MuiMenuItem-root {
    font-family: Euclid;
    font-size: 14px;
    font-weight: bold;
    margin: auto 8px;
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
      color: "black",
      fontWeight: "bold",
      fontSize: 15,
    },
    "& .MuiInputBase-root": {
      // backgroundColor: "#f0f9ff",
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
    "& JoyCheckbox-input": {
      backgroundColor: "red",
    },
    display: "block",
    width: "100%",
    fontFamily: "euclid-medium",
  },
});

// Define the updateEmployee function
const updateEmployee = (empid, name, designation, joiningDate, status) => {
  // Placeholder implementation of updateEmployee function
  console.log("Employee Updated:", {
    empid,
    name,
    designation,
    joiningDate,
    status,
  });
  // You can replace this with your actual logic to update the employee
};

export default function EditEmployee({ updateEmployee }) {
  const classes = useStyles();

  const {
    empid,
    ename: initialName,
    designation: initialDesignation,
    jdate: initialJoiningDate,
    status: initialStatus,
  } = useParams();

  // State variables to store the edited values
  const [editedName, setEditedName] = useState(initialName);
  const [editedDesignation, setEditedDesignation] =
    useState(initialDesignation);
  const [editedJoiningDate, setEditedJoiningDate] =
    useState(initialJoiningDate);
  const [editedStatus, setEditedStatus] = useState(initialStatus);

  // Function to handle saving the edited information
  const handleSave = () => {
    // Call the updateEmployee function with the edited values
    updateEmployee(
      empid,
      editedName,
      editedDesignation,
      editedJoiningDate,
      editedStatus
    );
  };

  return (
    <div>
      <MenuTabs />
      <div className="bg-white dark:bg-neutral-950 dark:text-white p-4 rounded-md flex flex-col gap-5">
        <div>
          <h1>Employement Information</h1>
          <div className="grid grid-cols-12 gap-4 mt-4">
            <div className="flex flex-row  col-span-12 md:col-span-4">
              <TextField
                className={classNames(
                  "flex flex-row",
                  "col-span-12 sm:col-span-6 xl:col-span-2 text-xs",
                  classes.root
                )}
                label="Employee ID"
                value={empid}
                variant="outlined"
                margin="dense"
                InputLabelProps={{ shrink: true }}
                InputProps={{ readOnly: true }}
              />
            </div>
            <div className="flex flex-row col-span-12 md:col-span-4">
              <TextField
                className={classNames(
                  "col-span-12 sm:col-span-6 xl:col-span-2 text-xs",
                  classes.root
                )}
                id="name"
                name="name"
                label="Name"
                variant="outlined"
                margin="dense"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
              />
            </div>
            <div className="flex flex-row col-span-12 md:col-span-4">
              <TextField
                className={classNames(
                  "col-span-12 sm:col-span-6 xl:col-span-2 text-xs",
                  classes.root
                )}
                id="designation"
                name="designation"
                label="Designation"
                variant="outlined"
                margin="dense"
                value={editedDesignation}
                onChange={(e) => setEditedDesignation(e.target.value)}
              />
            </div>
            <div className="flex flex-col col-span-12 md:col-span-4">
              <LocalizationProvider
                dateAdapter={AdapterDayjs}
                className="w-full"
              >
                <DemoContainer components={["DatePicker"]}>
                  <DatePicker
                    label="Joining Date"
                    value={dayjs(editedJoiningDate)}
                    className={classNames(
                      "col-span-12 sm:col-span-6 xl:col-span-2",
                      classes.root
                    )}
                    onChange={(date) => setEditedJoiningDate(date)}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </DemoContainer>
              </LocalizationProvider>
            </div>
            <div className="flex flex-row col-span-12 md:col-span-4">
              <FormControl
                variant="outlined"
                margin="dense"
                className={classNames(
                  "col-span-12 sm:col-span-6 xl:col-span-2 text-xs",
                  classes.root
                )}
              >
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                  labelId="status-label"
                  id="status"
                  value={editedStatus}
                  onChange={(e) => setEditedStatus(e.target.value)}
                  label="Status"
                  IconComponent={(props) => (
                    <ArrowDropDownRoundedIcon
                      {...props}
                      sx={{ fontSize: 40 }}
                    />
                  )}
                >
                  <GlobalStyles />
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                  <MenuItem value="Removed">Removed</MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>
        </div>
        <hr />
        <div>
          <h1>Personal Information</h1>
          <div className="grid grid-cols-12 gap-4 mt-4">
            <div className="flex flex-row  col-span-12 md:col-span-4">
              <TextField
                className={classNames(
                  "flex flex-row",
                  "col-span-12 sm:col-span-6 xl:col-span-2 text-xs",
                  classes.root
                )}
                label="Employee ID"
                value={empid}
                variant="outlined"
                margin="dense"
                InputLabelProps={{ shrink: true }}
                InputProps={{ readOnly: true }}
              />
            </div>
            <div className="flex flex-row col-span-12 md:col-span-4">
              <TextField
                className={classNames(
                  "col-span-12 sm:col-span-6 xl:col-span-2 text-xs",
                  classes.root
                )}
                id="name"
                name="name"
                label="Name"
                variant="outlined"
                margin="dense"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
              />
            </div>
            <div className="flex flex-row col-span-12 md:col-span-4">
              <TextField
                className={classNames(
                  "col-span-12 sm:col-span-6 xl:col-span-2 text-xs",
                  classes.root
                )}
                id="designation"
                name="designation"
                label="Designation"
                variant="outlined"
                margin="dense"
                value={editedDesignation}
                onChange={(e) => setEditedDesignation(e.target.value)}
              />
            </div>
            <div className="flex flex-col col-span-12 md:col-span-4">
              <LocalizationProvider
                dateAdapter={AdapterDayjs}
                className="w-full"
              >
                <DemoContainer components={["DatePicker"]}>
                  <DatePicker
                    label="Joining Date"
                    value={dayjs(editedJoiningDate)}
                    className={classNames(
                      "col-span-12 sm:col-span-6 xl:col-span-2",
                      classes.root
                    )}
                    onChange={(date) => setEditedJoiningDate(date)}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </DemoContainer>
              </LocalizationProvider>
            </div>
            <div className="flex flex-row col-span-12 md:col-span-4">
              <FormControl
                variant="outlined"
                margin="dense"
                className={classNames(
                  "col-span-12 sm:col-span-6 xl:col-span-2 text-xs",
                  classes.root
                )}
              >
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                  labelId="status-label"
                  id="status"
                  value={editedStatus}
                  onChange={(e) => setEditedStatus(e.target.value)}
                  label="Status"
                  IconComponent={(props) => (
                    <ArrowDropDownRoundedIcon
                      {...props}
                      sx={{ fontSize: 40 }}
                    />
                  )}
                >
                  <GlobalStyles />
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                  <MenuItem value="Removed">Removed</MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>
        </div>
        <div className="flex justify-end ">
          <button
            onClick={handleSave}
            className="bg-[#5336FD] text-white px-4 py-2 rounded-md hover:scale-[1.020]"
          >
            <div className="flex items-center gap-2">
              <FaUpload />
              Update
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
