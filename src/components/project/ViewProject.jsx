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
  const [projectDrawerOpen, setProjectDrawerOpen] = useState(false);
  const [activeEmployees, setActiveEmployees] = useState([]);

  useEffect(() => {
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
        if (response.ok) {
          setProject(data.data);
          setFormData({
            projectname: data.data.projectname || "",
            description: data.data.description || "",
            technologies: data.data.technologies || "",
            reciveddate: data.data.reciveddate || "",
            deadline: data.data.deadline || "",
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

    fetchProject();
  }, [projectId, token]);

  const handleViewClient = (client) => {
    navigate("/clients/viewclient", { state: { client } });
  };

  const handleViewClick = (employeeId) => {
    navigate(`/pim/employee-details/${employeeId}`, {
      state: { activeTab: "Info" },
    });
  };

  const handleUpdateProject = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/admin/updateproject",
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
        console.log("Project updated successfully:", data);
        setDrawerOpen(false);
        setProject({ ...project, ...formData });
      } else {
        console.error("Error updating project:", data.msg);
      }
    } catch (err) {
      console.error("Error:", err.message);
    }
  };

  if (!project) {
    return <div>Loading project details...</div>;
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

  // useEffect(() => {
  // }, [isDrawerOpen]);
  if (isDrawerOpen) {
    employeeList();
  }

  // const handleProjectInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setProjectForm((prev) => ({ ...prev, [name]: value }));
  // };

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
                <img
                  src={userprofile}
                  alt="clientprofile"
                  className="w-28 group-hover:w-8 duration-300 rounded-md shadow-md"
                />
                <div>
                  {project.status === 0 ? (
                    <span className="text-green-500 bg-green-500/20 px-2 py-0.5 rounded-md">
                      Active
                    </span>
                  ) : (
                    <span className="text-red-500 bg-red-500/20 px-2 py-0.5 rounded-md">
                      Inactive
                    </span>
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
                      {project.assignto?.email?.substring(0, 30) || "N/A"}
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
          <p>{project.description || "N/A"}</p>
          <div className="">
            <p>
              <span className="font-medium">Technologies:</span>{" "}
              {project.technologies || "N/A"}
            </p>
            <p>
              <span className="font-medium">Received Date:</span>{" "}
              {project.reciveddate
                ? new Date(project.reciveddate).toLocaleString()
                : "N/A"}
            </p>
            <p>
              <span className="font-medium">Deadline:</span>{" "}
              {project.deadline
                ? new Date(project.deadline).toLocaleString()
                : "N/A"}
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={() => setDrawerOpen(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4"
      >
        Edit Project Details
      </button>

      {/* Material-UI Drawer */}
      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={() => setDrawerOpen(false)}
        className="backdrop-blur-sm euclid "
      >
        <div className="p-4 w-96 flex flex-col gap- dark:text-white bg-sky-100 dark:bg-neutral-900 h-full rounded-s-2xl ">
          <h2 className="text-lg font-bold mb-4">Update Project</h2>
          <div className="flex flex-col gap-4">
            <TextField
              label="Project Name"
              name="projectname"
              value={formData.projectname}
              onChange={(e) =>
                setFormData({ ...formData, projectname: e.target.value })
              }
              fullWidth
              className={classNames(
                "col-span-12 sm:col-span-6 xl:col-span-2 text-xs ",
                classes.root
              )}
            />

            <textarea
              name="description"
              rows={4}
              placeholder="description"
              label="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              fullWidth
              margin="normal"
              className="px-2 py-1 mt-1 mb-2 border  rounded-lg bg-sky-50 dark:bg-neutral-800 dark:border-neutral-700"
            />

            <TextField
              label="Technologies"
              value={formData.technologies}
              onChange={(e) =>
                setFormData({ ...formData, technologies: e.target.value })
              }
              fullWidth
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
              fullWidth
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
              fullWidth
              className={classNames(
                "col-span-12 sm:col-span-6 xl:col-span-2 text-xs ",
                classes.root
              )}
              InputLabelProps={{ shrink: true }}
            />

            <FormControl
              variant="outlined"
              margin="dense"
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
                value={formData.assignto}
                onChange={(e) =>
                  setFormData({ ...formData, assignto: e.target.value })
                }
                fullWidth
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
                fullWidth
              >
                <GlobalStyles />

                <MenuItem value={0}>Active</MenuItem>
                <MenuItem value={1}>Inactive</MenuItem>
              </Select>
            </FormControl>
          </div>

          <div className="mt-2 flex w-full gap-2">
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
