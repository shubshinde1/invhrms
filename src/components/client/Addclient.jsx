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
import timezones from "../../dummydata/timezone.json";
import { format } from "date-fns";

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
  const [remainingTime, setRemainingTime] = useState(2);
  const [selectedTimezone, setSelectedTimezone] = useState("");
  const [timezoneList, setTimezoneList] = useState([]);
  const [formData, setFormData] = useState({
    prefix: "",
    clientName: "",
    clientId: "",
    phone: "",
    email: "",
    linkedinurl: "",
    address: "",
    projectName: "",
    conpmanyName: "",
    clienttype: "",
    paymentcycle: "",
    domain: "",
    timeZone: "",
    primarytech: "",
    futurepotential: "",
    agreementduration: "",
    contractdate: null, // Adjust if needed based on your DatePicker setup
    contractfile: "",
    gstn: "",
    description: "",
  });

  useEffect(() => {
    setTimezoneList(timezones);
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFileName(file.name);
      setIsInputLabelShrunk(true);
    } else {
      setSelectedFileName("");
      setIsInputLabelShrunk(false);
    }
    setFormData({
      ...formData,
      contractfile: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Form Data:", formData);
    setIsSuccessPopupOpen(true);
    const timer = setInterval(() => {
      setRemainingTime((prevTime) => prevTime - 1);
    }, 1000);

    setTimeout(() => {
      clearInterval(timer);
      setIsSuccessPopupOpen(false);
      navigate("/clients");
    }, 2000);
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

  const handleTimezoneChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedTimezone(selectedValue);

    const currentUTC = new Date();

    const timeZone = selectedValue;
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone,
      hour12: true,
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    });

    const formattedTime = formatter.format(currentUTC);

    console.log("Current local time in", timeZone, ":", formattedTime);
  };

  const handleSelectChange = (e) => {
    // First action: handleTimezoneChange
    handleTimezoneChange(e);

    setFormData({ ...formData, timeZone: e.target.value });
  };

  const handleDateChange = (date) => {
    if (date && date.$d) {
      const formattedDate = `${date.$d.getFullYear()}-${(date.$d.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${date.$d.getDate().toString().padStart(2, "0")}`;
      setFormData({ ...formData, contractdate: formattedDate });
    } else {
      setFormData({ ...formData, contractdate: "" }); // Handle case when date is cleared
    }
  };

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
                  value={formData.prefix}
                  onChange={(e) =>
                    setFormData({ ...formData, prefix: e.target.value })
                  }
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
              value={formData.clientName}
              onChange={(e) =>
                setFormData({ ...formData, clientName: e.target.value })
              }
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
              value={formData.clientId}
              onChange={(e) =>
                setFormData({ ...formData, clientId: e.target.value })
              }
            />
          </div>

          <div className="col-span-12 sm:col-span-6 md:col-span-4 flex flex-row ">
            <TextField
              className={classNames(
                "col-span-12 sm:col-span-6 xl:col-span-2 text-xs",
                classes.root
              )}
              id="conpmanyname"
              name="conpmanyname"
              label="Conpmany Name"
              variant="outlined"
              margin="dense"
              value={formData.conpmanyName}
              onChange={(e) =>
                setFormData({ ...formData, conpmanyName: e.target.value })
              }
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
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
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
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          <div className="col-span-12 sm:col-span-6 md:col-span-4 flex flex-row ">
            <TextField
              className={classNames(
                "col-span-12 sm:col-span-6 xl:col-span-2 text-xs",
                classes.root
              )}
              id="linkedin"
              name="linkedin"
              label="Linkedin Url"
              variant="outlined"
              margin="dense"
              value={formData.linkedinurl}
              onChange={(e) =>
                setFormData({ ...formData, linkedinurl: e.target.value })
              }
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
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
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
              value={formData.projectName}
              onChange={(e) =>
                setFormData({ ...formData, projectName: e.target.value })
              }
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
                value={formData.clienttype}
                onChange={(e) =>
                  setFormData({ ...formData, clienttype: e.target.value })
                }
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
                Payment Cycle
              </InputLabel>
              <Select
                labelId="paymentcycle-label"
                id="paymentcycle"
                name="paymentcycle"
                label="Payment Cycle"
                value={formData.paymentcycle}
                onChange={(e) =>
                  setFormData({ ...formData, paymentcycle: e.target.value })
                }
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
                <MenuItem value="weekly">Weekly</MenuItem>
                <MenuItem value="monthly">Monthly </MenuItem>
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
              <InputLabel id="prefix-label" className="w-52">
                Domain
              </InputLabel>
              <Select
                labelId="domain-label"
                id="domain"
                name="domain"
                label="Domain"
                value={formData.domain}
                onChange={(e) =>
                  setFormData({ ...formData, domain: e.target.value })
                }
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
                <MenuItem value="information technology">
                  Technology and IT
                </MenuItem>
                <MenuItem value="healthcare">
                  Healthcare and Life Sciences
                </MenuItem>
                <MenuItem value="finance and insurance">
                  Finance and Insurance
                </MenuItem>
                <MenuItem value="manufacturing">
                  Manufacturing and Industrial
                </MenuItem>
                <MenuItem value="retail">Retail and Consumer Goods</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>
          </div>

          <div className="col-span-12 sm:col-span-6 md:col-span-4 flex flex-row">
            <FormControl
              variant="outlined"
              margin="dense"
              className={classNames(
                "col-span-12 sm:col-span-6 xl:col-span-2 text-xs",
                classes.root
              )}
            >
              <InputLabel id="timezone-label">Select Timezone</InputLabel>
              <Select
                labelId="timezone-label"
                id="timezone"
                label="Select Timezone"
                value={selectedTimezone && formData.timeZone}
                onChange={handleSelectChange}
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
                {timezoneList.map((timezone) => (
                  <MenuItem key={timezone.value} value={timezone.value}>
                    {timezone.location.replace("_", " ")}
                    {timezone.currentTime}
                    {/* {current time} */}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <div className="col-span-12 sm:col-span-6 md:col-span-4 flex flex-row ">
            <TextField
              className={classNames(
                "col-span-12 sm:col-span-6 xl:col-span-2 text-xs",
                classes.root
              )}
              id="primarytech"
              name="primarytech"
              label="Primary Technologies"
              variant="outlined"
              margin="dense"
              value={formData.primarytech}
              onChange={(e) =>
                setFormData({ ...formData, primarytech: e.target.value })
              }
            />
          </div>
          <div className="col-span-12 sm:col-span-6 md:col-span-4 flex flex-row ">
            <TextField
              className={classNames(
                "col-span-12 sm:col-span-6 xl:col-span-2 text-xs",
                classes.root
              )}
              id="futurepotential"
              name="futurepotential"
              label="Future Potential"
              variant="outlined"
              margin="dense"
              value={formData.futurepotential}
              onChange={(e) =>
                setFormData({ ...formData, futurepotential: e.target.value })
              }
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
                Agreement Duration
              </InputLabel>
              <Select
                labelId="agreementduration-label"
                id="agreementduration"
                name="agreementduration"
                label="Agreement Duration"
                value={formData.agreementduration}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    agreementduration: e.target.value,
                  })
                }
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
                <MenuItem value="lessthanthree">Less than 3 Months</MenuItem>
                <MenuItem value="threetosix">3 to 6 Months</MenuItem>
                <MenuItem value="sixtotwelve">6 to 12 Months</MenuItem>
                <MenuItem value="morethantwelve">More than 12 Months</MenuItem>
              </Select>
            </FormControl>
          </div>

          <div className="col-span-12 sm:col-span-6 md:col-span-4 flex flex-col">
            <LocalizationProvider dateAdapter={AdapterDayjs} className="w-full">
              <DemoContainer components={["DatePicker"]}>
                <DatePicker
                  label="Contract Date"
                  value={formData.contractdate} // Ensure formData.contractdate is of the expected type for DatePicker
                  onChange={handleDateChange}
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
                value={formData.contractfile}
                style={{ display: "none" }} // Hide the file input
                onChange={handleFileChange}
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
              value={formData.gstn}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  gstn: e.target.value,
                })
              }
            />
          </div>

          <div className="col-span-12 sm:col-span-6 md:col-span-8 flex flex-col">
            <textarea
              className="bg-[#f0f9ff] dark:bg-neutral-900 dark:text-white rounded-md focus:border-[1px] p-3 pb-0 h-20 "
              placeholder="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  description: e.target.value,
                })
              }
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
