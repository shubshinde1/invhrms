import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ApiendPonits from "../../api/APIEndPoints.json";
import userprofile from "../../assets/images/clientAvatar.png";
import teamsIcon from "../../assets/images/Teams.png";
import OutlookIcon from "../../assets/images/Outlook.png";
import { RiServiceFill } from "react-icons/ri";
import { FaCaretRight } from "react-icons/fa6";
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
import { MdEditSquare, MdDelete } from "react-icons/md";
import { IoClose, IoFlashOff } from "react-icons/io5";
import { TiFlash } from "react-icons/ti";
import Loading from "../Loading";

import {
  TbLayoutAlignLeftFilled,
  TbLayoutAlignRightFilled,
} from "react-icons/tb";

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

const ViewProject = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const token = localStorage.getItem("accessToken");
  const classes = useStyles();

  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [project, setProject] = useState(null);
  const [formData, setFormData] = useState({
    projectname: "",
    description: "",
    technologies: "",
    reciveddate: "",
    deadline: "",
    status: 0,
    assignto: "",
  });
  const [projectForm, setProjectForm] = useState({
    projectname: "",
    assignto: "",
    description: "", // default assignee
  });
  const [activeEmployees, setActiveEmployees] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationName, setConfirmationName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const fetchProject = async () => {
    try {
      const response = await fetch(
        `${ApiendPonits.baseUrl}${ApiendPonits.endpoints.viewprojectbyid}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ projectid: projectId }),
        }
      );

      const data = await response.json();
      // console.log(data);

      if (response.ok) {
        setProject(data.data);
        setFormData({
          projectname: data.data.projectname || "",
          description: data.data.description || "",
          technologies: data.data.technologies || "",
          reciveddate: data.data.reciveddate
            ? new Date(data.data.reciveddate).toISOString().split("T")[0]
            : "",
          deadline: data.data.deadline
            ? new Date(data.data.deadline).toISOString().split("T")[0]
            : "",
          status: data.data.status || 0,
          assignto: data.data.assignto?._id || "",
        });
      } else {
        console.error("Error fetching project:", data.msg);
      }
    } catch (err) {
      console.error("Error:", err.message);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [projectId, token]);

  const handleUpdateProject = async () => {
    try {
      const response = await fetch(
        `${ApiendPonits.baseUrl}${ApiendPonits.endpoints.updateproject}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...formData, id: projectId }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        // console.log("Project updated successfully:", data);
        setDrawerOpen(false);
        setProject({ ...project, ...formData });
        fetchProject();
      } else {
        console.error("Error updating project:", data.msg);
      }
    } catch (err) {
      console.error("Error:", err.message);
    }
  };

  const handleViewClient = (client) => {
    navigate("/clients/viewclient", { state: { client } });
  };

  const handleViewClick = (employeeId) => {
    navigate(`/pim/employee-details/${employeeId}`, {
      state: { activeTab: "Info" },
    });
  };

  if (!project) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

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

  const deleteproject = async (pid) => {
    try {
      const response = await fetch(
        `${ApiendPonits.baseUrl}${ApiendPonits.endpoints.deleteproject}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ projectid: pid }),
        }
      );
      const data = await response.json();

      if (response.ok) {
        navigate("/clients");
      } else {
        console.error(
          "Error in Response:",
          data.message || "Failed to delete project"
        );
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const handleDeleteClick = () => {
    if (confirmationName !== project.projectname) {
      setErrorMessage("Please enter correct project name");
      return;
    }
    setErrorMessage(""); // Clear the error message on success
    deleteproject(project._id);
  };

  return (
    <div className="dark:text-white p-2 bg-white dark:bg-neutral-950 rounded-md shadow-lg flex flex-col gap-2">
      {/* Breadcrumb */}
      <div className="text-sm bg-blue-500/20 text-blue-500 w-fit px-2.5 py-1.5 rounded-lg">
        <nav className="flex items-center space-x-">
          <span
            className="flex items-center gap-1 cursor-pointer hover:font-bold"
            onClick={() => handleViewClient(project.clientid?._id)}
          >
            <RiServiceFill fontSize={20} />
            {project.clientid?.companyname || "Client Name"}
          </span>

          <FaCaretRight fontSize={20} />

          <span className="font-semibold ">
            {project.projectname || "Project Name"}
          </span>
        </nav>
      </div>

      {/* Project Details */}
      <div className="grid grid-cols-12 gap-2 h-full">
        <div className="bg-blue-50 dark:bg-neutral-900 p-2 rounded-md h-full col-span-12 md:col-span-3 flex justify-between">
          <div className="flex flex-col gap-10 w-full">
            <div className="flex flex-col gap-1 w-full">
              <div className="flex justify-between gap-2">
                <div className="relative">
                  <img
                    src={userprofile}
                    alt="clientprofile"
                    className="w-28 group-hover:w-8 duration-300 rounded-md shadow-md"
                  />
                  <div className="absolute bottom-1 right-1 text-xs font-bold">
                    {project.status === 0 ? (
                      <span className="text-green-600 bg-green-300 px-1 py-0.5 rounded-md flex items-center">
                        <TiFlash fontSize={15} />
                        Active
                      </span>
                    ) : (
                      <span className="text-red-500 bg-red-300 px-1 py-0.5 rounded-md flex items-center">
                        <IoFlashOff fontSize={13} />
                        Inactive
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setDrawerOpen(true);
                      employeeList();
                    }}
                    className="bg-blue-500/20 text-center text-base hover:bg-blue-600/20 font-bold text-blue-500  p-1.5 rounded-md cursor-pointer h-fit"
                  >
                    <MdEditSquare fontSize={18} />
                  </button>
                  <button
                    onClick={() => setShowConfirmation(!showConfirmation)}
                    className="bg-red-500/20 text-center text-base hover:bg-red-600/20 font-bold text-red-500 p-1.5 rounded-md cursor-pointer h-fit"
                  >
                    <MdDelete fontSize={18} />
                  </button>
                  {showConfirmation && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50">
                      <div className="bg-white/50 dark:bg-neutral-800/50  p-6 rounded-lg shadow-lg flex flex-col gap-4 w-96">
                        <h3 className="text-lg font-semibold text-center">
                          Confirm Deletion
                        </h3>
                        <p>
                          To delete the project{" "}
                          <span className="font-extrabold">
                            {project.projectname}
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
                              : confirmationName === project.projectname
                              ? "border-green-500 ring-2 ring-green-500 dark:bg-neutral-900 bg-gray-200"
                              : "border-red-500 ring-2 ring-red-500 dark:bg-neutral-900 bg-gray-200"
                          )}
                        />
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
                </div>
              </div>
              <div className="mt-2 flex items-center gap-2 justify-between">
                ID <span className="font-semibold">{project.projectid}</span>
              </div>
              <div className="flex items-center gap-2 justify-between">
                Project Name{" "}
                <span className="font-semibold">{project.projectname}</span>
              </div>
              <div className="flex items-center gap-2 justify-between">
                Organization Name{" "}
                <span className="font-semibold">
                  {project.clientid?.companyname}
                </span>
              </div>
            </div>

            <div className="dark:bg-neutral-950 bg-white p-2 rounded-md flex flex-col gap-2">
              <h2 className="text-base font-semibold">Assigned To</h2>
              <div className="flex items-center justify-between gap-4">
                <div
                  className="flex items-center gap-2 hover:bg-blue-500/20 hover:text-blue-500 rounded-md cursor-pointer py-1 duration-300 hover:px-1 hover:pr-2"
                  onClick={() => handleViewClick(project.assignto?._id)}
                >
                  <img
                    src={project.assignto?.profile || userprofile}
                    alt="Assignee Profile"
                    className="w-12 h-12 rounded-lg shadow-md"
                  />
                  <div>
                    <p className="text-base font-medium">
                      {project.assignto?.name || "N/A"}
                    </p>
                    <p className="text-xs text-gray-400">
                      {project.assignto?.email?.substring(0, 20) || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={`mailto:${project.assignto?.email}`}
                    target="_blank"
                    className="bg-blue-500/20 p-1.5 group rounded-md"
                  >
                    <img
                      src={OutlookIcon}
                      alt="OutlookIcon"
                      className="w-7 group-hover:scale-110 duration-100 rounded-full shadow-md"
                    />
                  </a>
                  <a
                    href={`MSTeams:/l/chat/0/0?users=${project.assignto?.email}`}
                    target="_blank"
                    className="bg-blue-500/20 p-1.5 group rounded-md"
                  >
                    <img
                      src={teamsIcon}
                      alt="teamsIcon"
                      className="w-7 group-hover:scale-110 duration-100 rounded-full shadow-md"
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-neutral-900 p-2 rounded-md h-full col-span-12 md:col-span-9 flex flex-col gap-2 justify-between">
          <div className="flex flex-col gap-2">
            <p className="">{project.description || "N/A"}</p>
            <div className="flex flex-wrap gap-2 items-center">
              <span className="font-base">Technologies :</span>
              <div className="flex gap-2 items-center">
                {project.technologies ? (
                  project.technologies.split(" ").map((tech, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-500/20 text-blue-500 rounded-md text-xs"
                    >
                      {tech}
                    </span>
                  ))
                ) : (
                  <span>N/A</span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 p-2 rounded-md bg-blue-100 dark:bg-neutral-800">
              <TbLayoutAlignLeftFilled
                className="text-green-500"
                fontSize={18}
              />
              <span className="font-medium">Start Date:</span>{" "}
              {project.reciveddate
                ? new Date(project.reciveddate).toDateString()
                : "N/A"}
            </div>
            <div className="flex items-center gap-2 p-2 rounded-md bg-blue-100 dark:bg-neutral-800">
              <TbLayoutAlignRightFilled
                className="text-red-500"
                fontSize={18}
              />
              <span className="font-medium">Deadline:</span>{" "}
              {project.deadline
                ? new Date(project.deadline).toDateString()
                : "N/A"}
            </div>
          </div>
        </div>
      </div>

      {/* Material-UI Drawer */}
      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={() => setDrawerOpen(false)}
        className="backdrop-blur-sm euclid "
      >
        <div className="p-4 w-96 flex flex-col gap-4 dark:text-white bg-sky-100 dark:bg-neutral-900 h-full rounded-s-2xl ">
          <div className="flex flex-row items-center justify-between">
            <h2 className="text-xl font-semibold ">Update Project</h2>
            <div
              className="w-fit bg-blue-500/20 text-center text-base hover:bg-blue-600/20 font-bold text-blue-500  p-2 rounded-md cursor-pointer"
              onClick={() => setDrawerOpen(false)}
            >
              <IoClose fontSize={20} />
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <TextField
              label="Project Name"
              name="projectname"
              value={formData.projectname}
              onChange={(e) =>
                setFormData({ ...formData, projectname: e.target.value })
              }
              className={classNames(
                "col-span-12 sm:col-span-6 xl:col-span-2 text-xs ",
                classes.root
              )}
            />

            <div className="relative flex flex-col gap-2 col-span-12 sm:col-span-6 lg:col-span-6">
              <textarea
                name="description"
                rows={4}
                placeholder="description"
                label="Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                // inputProps={{ maxLength: 1000 }}
                className="px-2 py-1 mt-1 mb-2 border  rounded-lg bg-sky-50 dark:bg-neutral-800 dark:border-neutral-700 overflow-y-scroll scrollbar-hid scrollbrhdn"
              />
              <div className="absolute text-xs bottom-2 right-2 text-gray-500 mt-1">
                {1000 - formData.description.length}/1000
              </div>
            </div>

            <TextField
              label="Technologies"
              value={formData.technologies}
              onChange={(e) =>
                setFormData({ ...formData, technologies: e.target.value })
              }
              className={classNames(
                "col-span-12 sm:col-span-6 xl:col-span-2 text-xs ",
                classes.root
              )}
            />

            <TextField
              label="Received Date"
              type="date"
              value={formData.reciveddate}
              onChange={(e) =>
                setFormData({ ...formData, reciveddate: e.target.value })
              }
              className={classNames(
                "col-span-12 sm:col-span-6 xl:col-span-2 text-xs ",
                classes.root
              )}
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              label="Deadline"
              type="date"
              value={formData.deadline}
              onChange={(e) =>
                setFormData({ ...formData, deadline: e.target.value })
              }
              className={classNames(
                "col-span-12 sm:col-span-6 xl:col-span-2 text-xs ",
                classes.root
              )}
              InputLabelProps={{ shrink: true }}
            />

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
                // name="assignto"
                value={formData.assignto}
                onChange={(e) =>
                  setFormData({ ...formData, assignto: e.target.value })
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
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
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

                <MenuItem value={0}>Active</MenuItem>
                <MenuItem value={1}>Inactive</MenuItem>
              </Select>
            </FormControl>
          </div>

          <div className="mt- flex w-full gap-2">
            <div
              className="w-full bg-blue-500/20 text-center text-base hover:bg-blue-600/20 font-bold text-blue-500  p-3 rounded-md cursor-pointer"
              onClick={handleUpdateProject}
            >
              Save
            </div>
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default ViewProject;
