import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import userprofile from "../../assets/images/clientAvatar.png";
import ApiendPonits from "../../api/APIEndPoints.json";
import {
  Drawer,
  Button,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  Box,
  FormControl,
  Autocomplete,
} from "@mui/material";
import classNames from "classnames";
import { createGlobalStyle } from "styled-components";
import { makeStyles } from "@mui/styles";
import ArrowDropDownRoundedIcon from "@mui/icons-material/ArrowDropDownRounded";
import { IoClose } from "react-icons/io5";
import { MdEditSquare } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { IoFileTrayFull } from "react-icons/io5";
import { FaExternalLinkAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Textarea } from "@chakra-ui/react";
import { FaLinkedin } from "react-icons/fa";

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

const ViewClient = () => {
  const navigate = useNavigate(); // Initialize navigate

  const classes = useStyles();
  const location = useLocation();
  const { client, noofactiveprojects } = location.state || {}; // Destructure client safely
  const token = localStorage.getItem("accessToken"); // Retrieve token from localStorage

  const [projects, setProjects] = useState([]);
  const [clientData, setClient] = useState(client || {}); // Initialize with client from location.state
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [drawerOpen, setDrawerOpen] = useState(false); // drawer for update client
  const [projectDrawerOpen, setProjectDrawerOpen] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationName, setConfirmationName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [error, setError] = useState("");
  const [countries, setCountries] = useState([""]);

  const [projectForm, setProjectForm] = useState({
    projectname: "",
    assignto: "",
    description: "", // default assignee
  });
  const [activeEmployees, setActiveEmployees] = useState([]);

  const selectedclientid = client?._id || client; // Use optional chaining for safety

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch(
          `${ApiendPonits.baseUrl}${ApiendPonits.endpoints.getallsettings}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        const allSettings = data.data[0];
        // console.log(allSettings.country);

        if (response.ok) {
          setCountries(allSettings.country);
        } else {
          throw new Error("Failed to fetch settings");
        }
      } catch (err) {
        setError(err.message);
      }
    };
    fetchCountries();
  }, [token]);

  useEffect(() => {
    if (clientData) {
      setFormData({
        clientname: clientData.clientname || "",
        companyname: clientData.companyname || "",
        email: clientData.email || "",
        phone: clientData.phone || "",
        officeaddress: clientData.officeaddress || "",
        status: clientData.status || 0,
        linkedinurl: clientData.linkedinurl || "",
        // paymentcycle: clientData.paymentcycle || 0,
        industry: clientData.industry || "",
        country: clientData.country || "",
        // primarytechnology: clientData.primarytechnology || 0,
        // futurepotential: clientData.futurepotential || 0,
        // agreementduration: clientData.agreementduration || 0,
        // gstno: clientData.gstno || 0,
      });
    }
  }, [clientData]);

  useEffect(() => {
    const viewClient = async () => {
      try {
        const response = await fetch(
          `${ApiendPonits.baseUrl}${ApiendPonits.endpoints.viewclientbyid}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              clientid: selectedclientid, // Use selected date
            }),
          }
        );

        const data = await response.json();
        // console.log("new data", data);

        if (response.ok) {
          setClient(data.data); // Set the projects data
        } else {
          console.error(
            "Error in Response:",
            data.message || "Failed to fetch projects"
          );
        }
      } catch (err) {
        console.error("Error fetching projects:", err.message || err);
      }
    };

    viewClient();
  }, [token, selectedclientid]);

  useEffect(() => {
    const viewProjects = async () => {
      try {
        const response = await fetch(
          `${ApiendPonits.baseUrl}${ApiendPonits.endpoints.viewprojectbyclientid}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              clientid: selectedclientid, // Use selected date
            }),
          }
        );

        const data = await response.json();

        if (response.ok) {
          const activeProjects = (data.data || []).filter(
            (project) => !project.isdeleted
          );
          setProjects(activeProjects); // Set the projects data
        } else {
          console.error(
            "Error in Response:",
            data.message || "Failed to fetch projects"
          );
        }
      } catch (err) {
        console.error("Error fetching projects:", err.message || err);
      }
    };

    viewProjects();
  }, [token, selectedclientid]);

  const handleEditToggle = () => setIsEditing(!isEditing);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const updateClient = async () => {
    try {
      const response = await fetch(
        `${ApiendPonits.baseUrl}${ApiendPonits.endpoints.updateclient}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: selectedclientid, // Use "id" as expected by the API
            clientname: formData.clientname,
            companyname: formData.companyname,
            email: formData.email,
            phone: formData.phone,
            officeaddress: formData.officeaddress,
            status: formData.status,
            projectCount: formData.projectCount,
            linkedinurl: formData.linkedinurl,
            // paymentcycle: formData.paymentcycle,
            industry: formData.industry,
            country: formData.country,
            // primarytechnology: formData.primarytechnology,
            // futurepotential: formData.futurepotential,
            // agreementduration: formData.agreementduration,
            // gstno: formData.gstno,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // console.log("Client updated successfully:", data);
        setClient(data.data);
        setIsEditing(false); // Exit edit mode
        setDrawerOpen(false);
      } else {
        console.error(
          "Error in Response:",
          data.message || "Failed to update client"
        );
      }
    } catch (err) {
      console.error("Error updating client:", err.message || err);
    }
  };

  const handleProjectInputChange = (e) => {
    const { name, value } = e.target;
    setProjectForm((prev) => ({ ...prev, [name]: value }));
  };

  const addProject = async () => {
    try {
      const response = await fetch(
        `${ApiendPonits.baseUrl}${ApiendPonits.endpoints.addProject}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...projectForm,
            clientid: selectedclientid,
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        // console.log("Project added successfully:", data);
        setProjects((prev) => [...prev, data.data]); // Update project list
        setProjectDrawerOpen(false);
      } else {
        console.error(
          "Error in Response:",
          data.message || "Failed to add project"
        );
      }
    } catch (err) {
      console.error("Error adding project:", err.message || err);
    }
  };

  const employeeList = async () => {
    try {
      const response = await fetch(
        `${ApiendPonits.baseUrl}${ApiendPonits.endpoints.employeeList}`,
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
        const activeEmployees = data.data.filter(
          (employee) => employee.status === 1
        );
        setActiveEmployees(activeEmployees);
      } else {
        console.error(
          "Error in Response:",
          data.message || "Failed to fetch employees"
        );
      }
    } catch (err) {
      console.error("Error fetching employees:", err.message || err);
    }
  };

  useEffect(() => {
    employeeList();
  }, [projectDrawerOpen]);

  const handleViewProject = (projectId) => {
    navigate(`/projects/viewproject/${projectId}`);
  };

  const deleteproject = async (cid) => {
    try {
      const response = await fetch(
        `${ApiendPonits.baseUrl}${ApiendPonits.endpoints.softdeleteclient}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`, // Ensure token is valid and not null
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ clientid: cid }), // Send client ID in the body
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Successfully deleted client
        console.log(data.msg); // Optional: Log success message from the server
        navigate("/clients"); // Redirect to clients page
      } else {
        // Set error message for UI
        setError(data.msg || "Failed to delete the client");
      }
    } catch (error) {
      // Set error message for network or client-side issues
      setError(
        "An error occurred while deleting the client. Please try again."
      );
      console.error("Error:", error.message);
    }
  };

  const handleDeleteClick = () => {
    if (confirmationName !== clientData.clientname) {
      setErrorMessage("Please enter correct project name");
      return;
    }
    setErrorMessage(""); // Clear the error message on success
    deleteproject(clientData._id);
    // console.log(clientData._id);
  };

  return (
    <div className="h-full pb-20">
      <div className="bg-white dark:bg-neutral-950 p-2 rounded-md flex flex-col gap-2 text-black dark:text-white h-full min-h-full">
        {/* Client Details */}
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="flex flex-col md:flex-row md:items-end gap-2 md:gap-44 justify- h-full w-full">
            <div className="flex items-end gap-2 h-fit">
              <img
                src={userprofile}
                className="w-28 h-2w-28 rounded-md object-cover"
              />

              <div className="flex flex-col">
                <strong className="text-xl">{clientData.companyname}</strong>
                <span>{clientData.clientname}</span>
                {/* <span>{clientData._id}</span> */}
              </div>
            </div>
            <div className="flex flex-col gap-2 w-full h-full justify-between items-end">
              {/* <div className=""> */}

              <a
                href={clientData.linkedinurl}
                target="_blank"
                className={`text-[#0073b1] -mt-10 md:m-0 bg-blue-500/20 p-2 rounded-md group ${
                  clientData.linkedinurl ? "opacity-100" : "opacity-0"
                }`}
              >
                <FaLinkedin
                  fontSize={22}
                  className="group-hover:scale-110 duration-100"
                />
              </a>
              {/* </div> */}
              <div className="flex flex-col gap-1 md:flex-row w-full justify-between">
                <div className="flex flex-col md:flex-row gap-2 md:gap-4">
                  <div className="flex justify-between md:flex-col gap-2">
                    <strong>Status</strong>
                    <span
                      className={`w-fit px-1.5 py-0.5 text-xs rounded-md font-bold ${
                        clientData.status === 1
                          ? "bg-green-500/20 text-green-500"
                          : "bg-red-500/20 text-red-500"
                      }`}
                    >
                      {clientData.status === 1 ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <div className="flex justify-between md:flex-col gap-2">
                    <strong>Client ID</strong>
                    <span>{clientData.clientid}</span>
                  </div>
                  <div className="flex justify-between md:flex-col gap-2">
                    <strong>Phone</strong>
                    <span>{clientData.phone}</span>
                  </div>
                  <div className="flex justify-between md:flex-col gap-2">
                    <strong>Email</strong>
                    <span>{clientData.email}</span>
                  </div>
                  <div className="flex justify-between md:flex-col gap-2">
                    <strong>No Of Projects</strong>
                    <span>{noofactiveprojects}</span>
                  </div>
                  <div className="flex justify-between md:flex-col gap-2">
                    <strong>Country</strong>
                    <span>{clientData.country || "N/A"}</span>
                  </div>
                  <div className="flex justify-between md:flex-col gap-2">
                    <strong>Address</strong>
                    <span>{clientData.officeaddress || "N/A"}</span>
                  </div>
                  <div className="flex justify-between md:flex-col gap-2">
                    <strong>Industry</strong>
                    <span>{clientData.industry || "N/A"}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowConfirmation(!showConfirmation)}
                    className="bg-red-500/20 text-center text-base hover:bg-red-600/20 font-bold text-red-500  p-2 rounded-md cursor-pointer"
                  >
                    <MdDelete fontSize={20} />
                  </button>

                  {showConfirmation && (
                    <div className="z-50 fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center">
                      <div className="bg-white/50 dark:bg-neutral-800/50  p-6 rounded-lg shadow-lg flex flex-col gap-4 w-96">
                        <h3 className="text-lg font-semibold text-center">
                          Confirm Deletion
                        </h3>
                        <p>
                          To delete the project{" "}
                          <span className="font-extrabold">
                            {clientData.clientname}
                          </span>
                          , type the name to confirm.
                        </p>
                        <input
                          type="text"
                          placeholder="Enter project name"
                          value={confirmationName}
                          onChange={(e) => setConfirmationName(e.target.value)}
                          className={classNames(
                            "border p-2 rounded-md w-full",
                            errorMessage
                              ? "border-red-500 ring-2 ring-red-500 dark:bg-neutral-900 bg-gray-200"
                              : confirmationName === clientData.clientname
                              ? "border-green-500 ring-2 ring-green-500 dark:bg-neutral-900 bg-gray-200"
                              : "border-red-500 ring-2 ring-red-500 dark:bg-neutral-900 bg-gray-200"
                          )}
                        />
                        {error && (
                          <div className=" text-red-500 bg-red-500/20 p-2 rounded-md">
                            {error}
                          </div>
                        )}
                        <div className="flex justify-center gap-2 w-full">
                          <button
                            onClick={handleDeleteClick}
                            className="bg-red-500/20 text-red-500 hover:font-bold px-4 py-2 rounded-md w-full"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => setShowConfirmation(false)}
                            className="bg-gray-300/20 hover:font-bold px-4 py-2 rounded-md w-ful"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  <button
                    onClick={() => setDrawerOpen(true)}
                    className="bg-blue-500/20 text-center text-base hover:bg-blue-600/20 font-bold text-blue-500  p-2 rounded-md cursor-pointer"
                  >
                    <MdEditSquare fontSize={20} />
                  </button>
                  <button
                    onClick={() => setProjectDrawerOpen(true)}
                    className="bg-green-500/50 dark:bg-green-500/20 text-white text-center dark:hover:bg-green-600/20 font-bold dark:text-green-500  p-2 text-sm rounded-md cursor-pointer"
                  >
                    Add Project
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <hr className="w-full h-[2px] border-none bg-gray-300 dark:bg-neutral-800 my-2" />

        {/* Projects Table */}
        {/* <div className=""> */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 h-full max-h-fit overflow-y-scroll scrollbar-hide">
          {projects.map((project, index) => (
            <div
              key={project._id}
              className=" rounded-lg shadow-md p-3 bg-gray-100 dark:bg-neutral-900 hover:shadow-lg transition-shadow group h-full"
            >
              <div className="text-lg font-semibold mb-2 flex items-start justify-between gap-2 py-2 group-hover:px-2 group-hover:bg-blue-100 group-hover:dark:bg-neutral-950 rounded-md  duration-300">
                <div className="flex items-center gap-2 py-2 group-hover:text-blue-500">
                  <span className="group-hover:hidden text-base">
                    {index + 1}
                  </span>
                  <IoFileTrayFull className="hidden group-hover:flex " />
                  <span className="text-base">{project.projectname}</span>
                </div>
                <div className="hidden group-hover:block">
                  <button
                    onClick={() => handleViewProject(project._id)} // Pass the clicked client data
                    className="hover:bg-blue-500/20 hover:text-blue-500  p-2 rounded-md"
                  >
                    <FaExternalLinkAlt />
                  </button>
                </div>
              </div>
              <hr className="w-full h-[2px] border-none bg-gray-300 dark:bg-neutral-800 my-2" />

              <div className="text-sm text-gray-600 dark:text-gray-300  grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1 w-1/2">
                  <strong>Project ID</strong>
                  {project.projectid}
                </div>
                <div className="flex flex-col gap-1 w-full">
                  <strong>Assigned To</strong>
                  <div className="flex items-center gap-2 ">
                    <img
                      src={
                        project.assignto?.profile
                          ? project.assignto?.profile
                          : userprofile
                      }
                      alt={`${project.assignto?.name}'s profile`}
                      className="w-6 h-6 rounded-lg object-cover"
                    />
                    {project.assignto ? project.assignto.name : "Unassigned"}
                  </div>
                </div>
                <div className="flex flex-col gap-1 w-1/2">
                  <strong>Start Date</strong>
                  {new Date(project.createdAt).toLocaleDateString()}
                </div>
                <div className="flex flex-col gap-1 w-1/2">
                  <strong>Status</strong>
                  <span
                    className={`w-fit px-1.5 py-0.5 text-xs rounded-md font-bold ${
                      project.status === 1
                        ? "bg-red-500/20 text-red-500"
                        : "bg-green-500/20 text-green-500"
                    }`}
                  >
                    {project.status === 0 ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* </div> */}

        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          className="backdrop-blur-sm euclid bg-transparent "
        >
          <div className="p-4 w-96 flex flex-col gap-4 dark:text-white bg-sky-100 dark:bg-neutral-900 h-full rounded-s-2xl ">
            <div className="flex flex-row items-center justify-between">
              <h2 className="text-xl font-semibold ">Edit Client</h2>
              <div
                className="w-fit bg-blue-500/20 text-center text-base hover:bg-blue-600/20 font-bold text-blue-500  p-2 rounded-md cursor-pointer"
                onClick={() => setDrawerOpen(false)}
              >
                <IoClose fontSize={20} />
              </div>
            </div>
            <TextField
              label="Company Name"
              name="companyname"
              value={formData.companyname}
              onChange={handleInputChange}
              className={classNames(
                "col-span-12 sm:col-span-6 xl:col-span-2 text-xs",
                classes.root
              )}
            />
            <TextField
              label="Client Name"
              name="clientname"
              value={formData.clientname}
              onChange={handleInputChange}
              className={classNames(
                "col-span-12 sm:col-span-6 xl:col-span-2 text-xs",
                classes.root
              )}
            />

            <TextField
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={classNames(
                "col-span-12 sm:col-span-6 xl:col-span-2 text-xs",
                classes.root
              )}
            />
            <TextField
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className={classNames(
                "col-span-12 sm:col-span-6 xl:col-span-2 text-xs",
                classes.root
              )}
            />
            <TextField
              label="Office Address"
              name="officeaddress"
              id="officeaddress"
              value={formData.officeaddress}
              onChange={handleInputChange}
              className={classNames(
                "col-span-12 sm:col-span-6 xl:col-span-2 text-xs",
                classes.root
              )}
            />
            <TextField
              label="Industry"
              name="industry"
              id="industry"
              value={formData.industry}
              onChange={handleInputChange}
              className={classNames(
                "col-span-12 sm:col-span-6 xl:col-span-2 text-xs",
                classes.root
              )}
            />
            {/* <TextField
              label="Country"
              name="country"
              id="country"
              value={formData.country}
              onChange={handleInputChange}
              className={classNames(
                "col-span-12 sm:col-span-6 xl:col-span-2 text-xs",
                classes.root
              )}
            /> */}

            <FormControl
              variant="outlined"
              className={classNames(
                "col-span-12 sm:col-span-6 xl:col-span-2 text-xs",
                classes.root
              )}
            >
              <InputLabel id="Select Country" className="w-fit ">
                Select Country
              </InputLabel>
              <Select
                labelId="Country"
                id="country"
                label="Country"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className={classNames(
                  "p-2 border rounded-lg dark:bg-neutral-800 dark:border-neutral-700",
                  classes.root
                )}
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
                {countries.length > 0 ? (
                  countries.map((country, index) => (
                    <MenuItem key={index} value={country}>
                      {country}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No found any country</MenuItem>
                )}
              </Select>
            </FormControl>
            <TextField
              label="linkedi Profile"
              name="linkedinurl"
              id="linkedinurl"
              value={formData.linkedinurl}
              onChange={handleInputChange}
              className={classNames(
                "col-span-12 sm:col-span-6 xl:col-span-2 text-xs",
                classes.root
              )}
            />
            <FormControl
              variant="outlined"
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
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
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

                <MenuItem value={1}>Active</MenuItem>
                <MenuItem value={0}>Inactive</MenuItem>
              </Select>
            </FormControl>
            <div className="mt- flex w-full gap-2">
              <div
                className="w-full bg-blue-500/20 text-center text-base hover:bg-blue-600/20 font-bold text-blue-500  p-3 rounded-md cursor-pointer"
                onClick={updateClient}
              >
                Save
              </div>
            </div>
          </div>
        </Drawer>

        <Drawer
          anchor="right"
          open={projectDrawerOpen}
          onClose={() => setProjectDrawerOpen(false)}
          className="backdrop-blur-sm euclid "
        >
          <div className="p-4 w-96 flex flex-col gap-2 dark:text-white bg-sky-100 dark:bg-neutral-900 h-full rounded-s-2xl ">
            <div className="flex flex-row items-center justify-between">
              <h2 className="text-xl font-semibold ">Add Project</h2>
              <div
                className="w-fit bg-blue-500/20 text-center text-base hover:bg-blue-600/20 font-bold text-blue-500  p-2 rounded-md cursor-pointer"
                onClick={() => setProjectDrawerOpen(false)}
              >
                <IoClose fontSize={20} />
              </div>
            </div>
            <TextField
              label="Project Name"
              name="projectname"
              value={projectForm.projectname}
              onChange={handleProjectInputChange}
              className={classNames(
                "col-span-12 sm:col-span-6 xl:col-span-2 text-xs ",
                classes.root
              )}
            />
            <div className="relative flex flex-col gap-2 col-span-12 sm:col-span-6 lg:col-span-6">
              <textarea
                name="description"
                value={projectForm.description}
                rows={4}
                placeholder="description"
                onChange={handleProjectInputChange}
                // inputProps={{ maxLength: 1000 }}
                className="px-2 py-1  border  rounded-lg bg-sky-50 dark:bg-neutral-800 dark:border-neutral-700"
              />
              <div className="absolute text-xs bottom-2 right-2 text-gray-500 mt-1">
                {1000 - projectForm.description.length}/1000
              </div>
            </div>
            <FormControl
              variant="outlined"
              className={classNames(
                "col-span-12 sm:col-span-6 xl:col-span-2 text-xs",
                classes.root
              )}
            >
              <InputLabel id="assignto-label" className="w-52">
                Assign To
              </InputLabel>
              <Select
                labelId="assignto-label"
                id="assignto"
                label="Assign To"
                name="assignto"
                value={projectForm.assignto}
                onChange={handleProjectInputChange}
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
                {activeEmployees.map((employee) => (
                  <MenuItem key={employee._id} value={employee._id}>
                    <div className="flex items-center">
                      <img
                        src={employee.profileUrl || userprofile}
                        alt={employee.name}
                        className="w-6 h-6 rounded-md mr-2"
                      />
                      {employee.name}
                    </div>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <div className="mt- flex w-full gap-2">
              <div
                className="w-full bg-blue-500/20 text-center text-base hover:bg-blue-600/20 font-bold text-blue-500  p-3 rounded-md cursor-pointer"
                onClick={addProject}
              >
                Save
              </div>
            </div>
          </div>
        </Drawer>
      </div>
    </div>
  );
};

export default ViewClient;
