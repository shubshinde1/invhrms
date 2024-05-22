import React, { useState } from "react";
import clientsData from "./MasterClientsProjects.json";
import { makeStyles } from "@mui/styles";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  InputBase,
} from "@mui/material";
import { Card, CardContent, Grid, Box } from "@mui/material";
import clientAvatar from "../../assets/images/clientAvatar.png";
import { motion } from "framer-motion";
import { FaExternalLinkAlt } from "react-icons/fa";
import { MdOutlineAddCircle } from "react-icons/md";
import Tooltip from "@mui/material/Tooltip";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { BsFillGrid3X3GapFill } from "react-icons/bs";
import { FaThList } from "react-icons/fa";
import { FaHospitalUser } from "react-icons/fa";
// import { HiCodeBracketSquare } from "react-icons/hi2";
import { FaBriefcase } from "react-icons/fa6";
import { FaBusinessTime } from "react-icons/fa6";
import { HiMiniRocketLaunch } from "react-icons/hi2";
import Avatar from "@mui/joy/Avatar";
import AvatarGroup from "@mui/joy/AvatarGroup";
import { TbTimelineEventFilled } from "react-icons/tb";

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    "& .MuiTypography-root": {
      fontFamily: "euclid",
      fontSize: 14,
    },
    "& .MuiTableCell-root": {
      fontFamily: "euclid",
      fontSize: 14,
    },
    "& .MuiInputBase-input": {
      fontFamily: "euclid",
      fontSize: ".9rem",
    },
  },
  columnHeader: {
    fontWeight: "bold",
  },
  listViewContainer: {
    textAlign: "right",
  },
  searchContainer: {
    borderRadius: 7,
    display: "flex",
    alignItems: "center",
  },
  searchInput: {
    fontFamily: "euclid",
    marginLeft: 7,
    padding: 2,
  },
  title: {
    fontWeight: "bold",
  },
  fullScreenGrid: {
    marginBottom: 80,
  },
});

function GenerateLink({ client, navigate }) {
  const handleClick = () => {
    navigate({
      pathname: "/clients/viewclient",
      search: `?client=${encodeURIComponent(JSON.stringify(client))}`,
    });
  };

  return (
    <div
      onClick={handleClick}
      className="rounded-md  group-hover:flex group-hover:items-start cursor-pointer"
    >
      <div className="hover:bg-sky-100 hover:dark:bg-neutral-950 rounded-md hidden group-hover:flex p-3">
        <FaExternalLinkAlt />
      </div>
    </div>
  );
}

function GenerateLinkForList({ client, navigate }) {
  const handleClick = () => {
    navigate({
      pathname: "/clients/viewclient",
      search: `?client=${encodeURIComponent(JSON.stringify(client))}`,
    });
  };

  return (
    <div onClick={handleClick} className="rounded-md   cursor-pointer">
      <div className="hover:bg-sky-100 hover:dark:bg-neutral-950 rounded-md w-fit p-3">
        <FaExternalLinkAlt />
      </div>
    </div>
  );
}

export default function ClientCard({ clients }) {
  const classes = useStyles();
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState(clientsData);
  const location = useLocation(); // useLocation hook to get current location
  const navigate = useNavigate(); // Define the navigate function

  const totalClients = clientsData.length;

  const totalProjects = clientsData.reduce(
    (total, client) => total + client.projects.length,
    0
  );

  const totalPendingProjects = clientsData.reduce((total, client) => {
    // Count the number of projects with status "2" for each client
    const pendingProjects = client.projects.filter(
      (project) => project.status === 0
    ).length;
    // Add the count of pending projects for the current client to the total count
    return total + pendingProjects;
  }, 0);

  const totalCompleteProjects = clientsData.reduce((total, client) => {
    // Count the number of projects with status "2" for each client
    const pendingProjects = client.projects.filter(
      (project) => project.status === 2
    ).length;
    // Add the count of pending projects for the current client to the total count
    return total + pendingProjects;
  }, 0);

  const totalInprogressProjects = clientsData.reduce((total, client) => {
    // Count the number of projects with status "2" for each client
    const pendingProjects = client.projects.filter(
      (project) => project.status === 1
    ).length;
    // Add the count of pending projects for the current client to the total count
    return total + pendingProjects;
  }, 0);

  const toggleViewMode = () => {
    setViewMode(viewMode === "grid" ? "list" : "grid");
  };

  const handleSearch = () => {
    if (searchTerm.trim() === "") {
      setFilteredData(clientsData);
    } else {
      const filtered = clientsData.filter(
        (client) =>
          client.clientid.toString().includes(searchTerm.toLowerCase()) ||
          client.clientname.toLowerCase().includes(searchTerm.toLowerCase()) ||
          client.businessname
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          client.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredData(filtered);
    }
  };

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
    if (event.target.value.trim() === "") {
      setFilteredData(clientsData);
    } else {
      handleSearch(); // Call the handleSearch function to filter the data as the user types
    }
  };

  return (
    <div className={classes.root}>
      <div className="bg-white dark:bg-neutral-950 dark:text-white rounded-md">
        <div className="p-2">
          <div className="grid grid-cols-12 lg:grid-cols-11 gap-2 ">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-5 col-span-12 lg:col-span-3 bg-sky-5 border-2 dark:border-0 dark:bg-neutral-900 rounded-md p-2"
            >
              <div className="flex items-center gap-2">
                <div className="bg-sky-100 rounded-md p-2">
                  <FaHospitalUser fontSize={20} className="text-sky-600" />
                </div>
                <h2 className="text-sm">All Clients</h2>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <AvatarGroup>
                    <Avatar
                      alt="Remy Sharp"
                      src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      size="sm"
                    />
                    <Avatar
                      alt="Travis Howard"
                      src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      size="sm"
                    />
                    <Avatar
                      alt="Cindy Baker"
                      src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80"
                      size="sm"
                    />
                    <Avatar size="sm" sx={{ backgroundColor: "#f0f9ff" }}>
                      +{totalClients - 3}
                    </Avatar>
                  </AvatarGroup>
                </div>
                {/* <div className="bg-sky-50 px-2 py-1.5 rounded-md"> */}
                <h2 className="text-4xl font-bold text-gray-300">
                  {totalClients}
                </h2>
                {/* </div> */}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="col-span-6 lg:col-span-2 bg-sky-5 border-2 dark:border-0 dark:bg-neutral-900 rounded-md"
            >
              <Link to={"/projects"} className="flex flex-col p-2">
                <div className="flex items-center gap-2">
                  <div className="bg-purple-100 rounded-md p-2">
                    <FaBriefcase fontSize={18} className="text-purple-600" />
                  </div>
                  <h2 className="text-sm">All Projects</h2>
                </div>
                <div className="flex items-center justify-end relative top-4 scroll-m-0 ">
                  {/* <div className="bg-sky-50 px-2 py-1.5 rounded-md "> */}
                  <h2 className="text-4xl font-bold text-gray-300">
                    {totalProjects}
                  </h2>
                  {/* </div> */}
                </div>
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col gap-5 col-span-6 lg:col-span-2 bg-sky-5 border-2 dark:border-0 dark:bg-neutral-900 rounded-md p-2"
            >
              <div className="flex items-center gap-2">
                <div className="bg-green-100 rounded-md p-2">
                  <HiMiniRocketLaunch
                    fontSize={20}
                    className="text-green-500"
                  />
                </div>
                <h2 className="text-sm">Complete Projects</h2>
              </div>
              <div className="flex items-end justify-end">
                {/* <div className="bg-sky-50 px-2 py-1.5 rounded-md"> */}
                <h2 className="text-4xl font-bold text-gray-300">
                  {totalCompleteProjects}
                </h2>
                {/* </div> */}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col gap-5 col-span-6 lg:col-span-2 bg-sky-5 border-2  dark:border-0 dark:bg-neutral-900 rounded-md p-2"
            >
              <div className="flex items-center gap-2">
                <div className="bg-orange-100 rounded-md p-2">
                  <TbTimelineEventFilled
                    fontSize={20}
                    className="text-orange-500"
                  />
                </div>
                <h2 className="text-sm">In-Progress</h2>
              </div>
              <div className="flex items-center justify-end">
                {/* <div className="bg-sky-50 px-2 py-1.5 rounded-md"> */}
                <h2 className="text-4xl font-bold text-gray-300">
                  {totalInprogressProjects}
                </h2>
                {/* </div> */}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="flex flex-col gap-5 col-span-6 lg:col-span-2 bg-sky-5 border-2  dark:border-0 dark:bg-neutral-900 rounded-md p-2"
            >
              <div className="flex items-center gap-2">
                <div className="bg-red-100 rounded-md p-2">
                  <FaBusinessTime fontSize={20} className="text-red-500" />
                </div>
                <h2 className="text-sm">Pending Projects</h2>
              </div>
              <div className="flex items-center justify-end">
                {/* <div className="bg-sky-50 px-2 py-1.5 rounded-md"> */}
                <h2 className="text-4xl font-bold text-gray-300">
                  {totalPendingProjects}
                </h2>
                {/* </div> */}
              </div>
            </motion.div>
          </div>
        </div>
        <div
          style={{ marginBottom: 10 }}
          className=" pl-2 pb-2 flex justify-between items-center "
        >
          <div className="flex items-center">
            <div
              className={`${classes.searchContainer} bg-sky-50 dark:bg-neutral-900 mr-2  flex  h-full py-1 `}
            >
              <InputBase
                placeholder="Search by Client Name, Id "
                className={`${classes.searchInput} md:w-96 searchInput`}
                value={searchTerm}
                onChange={handleInputChange}
                inputProps={{ style: { fontSize: 14 } }}
              />
            </div>
            <Link
              to="/clients/addclient"
              className="bg-sky-50 dark:bg-neutral-900 rounded-md p-2.5 flex items-center gap-2"
            >
              <Tooltip title="Add Client" placement="top" arrow>
                <div>
                  <MdOutlineAddCircle fontSize={20} />
                </div>
              </Tooltip>
            </Link>
          </div>
          <div className="ml-2">
            <div
              onClick={toggleViewMode}
              className="mr-2 bg-sky-100 dark:bg-neutral-900 dark:text-white p-3 rounded-md cursor-pointer"
            >
              {viewMode === "grid" ? (
                <FaThList fontSize={16} />
              ) : (
                <BsFillGrid3X3GapFill fontSize={17} />
              )}
            </div>
          </div>
        </div>
      </div>
      {viewMode === "grid" ? (
        <Grid container spacing={1.5} className={`${classes.fullScreenGrid} `}>
          {filteredData.map((client, index) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
              key={`${client.clientid}-${index}`}
            >
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className={`${classes.card} `}>
                  <CardContent className="flex flex-col gap-4 hover:shadow-xl group dark:bg-neutral-950 dark:shadow-none dark:text-white">
                    <div className="flex  justify-between  group-hover:bg-sky-50 group-hover:dark:bg-neutral-900  py-2 group-hover:px-2 duration-300 group-hover:rounded-md">
                      <div className="flex items-center gap-4">
                        <img src={clientAvatar} width={50} alt="Clientlogo" />
                        <div className={classes.pos}>
                          <h4 className="font-bold">{client.businessname}</h4>
                          <h4 className="text-xs">{client.clientname}</h4>
                        </div>
                      </div>
                      <GenerateLink client={client} navigate={navigate} />
                    </div>
                    <hr className="w-full h-[1px] bg-gray-300 dark:bg-neutral-950" />
                    <div className="flex flex-col gap-2 text-[.85rem]">
                      <div className="flex ">
                        <label className="w-20 font-semibold">Client ID </label>
                        <p>- {client.clientid}</p>
                      </div>
                      <div className="flex ">
                        <label className="w-20 font-semibold">Phone </label>
                        <p>- {client.phone}</p>
                      </div>
                      <div className="flex ">
                        <label className="w-20 font-semibold">Email </label>
                        <p>- {client.email}</p>
                      </div>
                      {/* <div className="flex ">
                        <label className="w-20 font-semibold">GSTN </label>
                        <p>- {client.gstn}</p>
                      </div> */}
                      <div className="flex ">
                        <label className="w-20 font-semibold">Projects </label>
                        <p>- {client.projects.length}</p>
                      </div>
                      {/* <div className="flex">
                        <label className="w-20 font-semibold">Project </label>
                        <p>
                          -
                          {client.projects.length > 0 &&
                            client.projects[0].projectname}
                        </p>
                      </div> */}
                      <div className="flex">
                        <label className="w-20 font-semibold">Status </label>
                        <p>
                          {" "}
                          {client.status !== undefined && (
                            <span
                              style={{
                                backgroundColor:
                                  client.status === 0
                                    ? "#fee2e2"
                                    : client.status === 1
                                    ? "#bbf7d0"
                                    : "#fee2e2",
                                color:
                                  client.status === 0
                                    ? "#f87171"
                                    : client.status === 1
                                    ? "#22c55e"
                                    : "#f87171",
                                fontWeight: "bold",
                                fontSize: 11,
                                padding: "3px 8px",
                                borderRadius: "5px",
                              }}
                            >
                              {client.status === 0
                                ? "Inactive"
                                : client.status === 1
                                ? "Active"
                                : "Completed"}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box
          className={`${classes.listViewContainer} w-[96vw] md:w-auto bg-white dark:bg-neutral-950 p-2 rounded-md`}
        >
          <TableContainer component={Paper}>
            <Table>
              <TableHead className="bg-sky-50 ">
                <TableRow>
                  <TableCell className={classes.columnHeader}>
                    Client Name
                  </TableCell>
                  <TableCell className={classes.columnHeader}>
                    Client ID
                  </TableCell>
                  <TableCell className={classes.columnHeader}>
                    Business Name
                  </TableCell>
                  <TableCell className={classes.columnHeader}>Phone</TableCell>
                  <TableCell className={classes.columnHeader}>Email</TableCell>
                  <TableCell className={classes.columnHeader}>GSTN</TableCell>
                  <TableCell className={classes.columnHeader}>
                    Projects
                  </TableCell>
                  <TableCell className={classes.columnHeader}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.map((client, index) => (
                  <TableRow key={client.clientid} className="group">
                    <TableCell>{client.clientname}</TableCell>
                    <TableCell>{client.clientid}</TableCell>
                    <TableCell>{client.businessname}</TableCell>
                    <TableCell>{client.phone}</TableCell>
                    <TableCell>{client.email}</TableCell>
                    <TableCell>{client.gstn}</TableCell>
                    <TableCell>{client.projects.length}</TableCell>
                    <Tooltip title="View Details" placement="top" arrow>
                      <TableCell>
                        <GenerateLinkForList
                          client={client}
                          navigate={navigate}
                          className="flex"
                        />
                      </TableCell>
                    </Tooltip>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </div>
  );
}
