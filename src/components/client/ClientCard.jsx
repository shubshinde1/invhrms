import React, { useState, useEffect } from "react";
import userprofile from "../../assets/images/clientAvatar.png";
import { FaHospitalUser } from "react-icons/fa";
import { IoFlash, IoFlashOff } from "react-icons/io5";
import { Drawer, TextField, Button } from "@mui/material";
import { FaPlus } from "react-icons/fa6";
import { makeStyles } from "@mui/styles";
import classNames from "classnames";
import { useNavigate } from "react-router-dom";
import { FaExternalLinkAlt } from "react-icons/fa";
import ApiendPonits from "../../api/APIEndPoints.json";

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

const ClientCard = () => {
  const [clients, setClients] = useState([]); // Initialize as an empty array
  const [filteredClients, setFilteredClients] = useState([]); // Filtered clients
  const [searchQuery, setSearchQuery] = useState(""); // Search query
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDrawer, setOpenDrawer] = useState(false); // Control drawer visibility
  const [newClient, setNewClient] = useState({
    // State to hold new client data
    clientname: "",
    companyname: "",
    email: "",
    phone: "",
  });

  const classes = useStyles();

  const token = localStorage.getItem("accessToken"); // Assuming the token is stored in localStorage

  const navigate = useNavigate(); // Initialize navigate

  const handleViewClient = (client) => {
    // Navigate to the /clients/viewclient route and pass client data
    navigate("/clients/viewclient", { state: { client } });
  };

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch(
          `${ApiendPonits.baseUrl}${ApiendPonits.endpoints.viewclient}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch clients: ${response.statusText}`);
        }

        const result = await response.json();
        setClients(result.data || []); // Use `result.data` as per the API response
        setFilteredClients(result.data || []); // Initialize filtered clients
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [token]);

  // Filter clients whenever the search query changes
  useEffect(() => {
    const filtered = clients.filter((client) => {
      const query = searchQuery.toLowerCase();
      return (
        client.companyname.toLowerCase().includes(query) ||
        client.clientname.toLowerCase().includes(query) ||
        client.clientid.toString().includes(query)
      );
    });
    setFilteredClients(filtered);
  }, [searchQuery, clients]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  // Handle form submission to add a new client
  const handleAddClient = async () => {
    try {
      const response = await fetch(
        `${ApiendPonits.baseUrl}${ApiendPonits.endpoints.addclient}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newClient),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to add client: ${response.statusText}`);
      }

      const result = await response.json();
      setClients((prevClients) => [...prevClients, result.data]);
      setFilteredClients((prevClients) => [...prevClients, result.data]);
      setOpenDrawer(false); // Close the drawer after adding client
      setNewClient({
        clientname: "",
        companyname: "",
        email: "",
        phone: "",
      }); // Reset form data
    } catch (err) {
      setError(err.message);
    }
  };

  // Calculate totals
  const totalClients = clients.length;
  const activeClients = clients.filter((client) => client.status === 1).length;
  const inactiveClients = totalClients - activeClients;

  return (
    <div className="bg-white dark:bg-neutral-950 p-2 rounded-md flex flex-col gap-2 text-black dark:text-white h-full min-h-full">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <div className="p-2 dark:bg-neutral-900 bg-sky-50 flex flex-col gap-4 items-end rounded-md">
          <div className="flex items-center gap-2 w-full">
            <div className="bg-blue-500/20 rounded-md p-2">
              <FaHospitalUser fontSize={20} className="text-blue-600" />
            </div>
            <h2 className="text-sm">Total Clients</h2>
          </div>
          <p className="text-4xl font-bold text-blue-400">{totalClients}</p>
        </div>

        <div className="p-2 dark:bg-neutral-900 bg-sky-50 flex flex-col gap-4 items-end rounded-md">
          <div className="flex items-center gap-2 w-full">
            <div className="bg-green-500/20 rounded-md p-2">
              <IoFlash fontSize={20} className="text-green-600" />
            </div>
            <h2 className="text-sm">Active Clients</h2>
          </div>
          <p className="text-4xl font-bold text-green-400">{activeClients}</p>
        </div>

        <div className="p-2 dark:bg-neutral-900 bg-sky-50 flex flex-col gap-4 items-end rounded-md">
          <div className="flex items-center gap-2 w-full">
            <div className="bg-red-500/20 rounded-md p-2">
              <IoFlashOff fontSize={20} className="text-red-600" />
            </div>
            <h2 className="text-sm">Inactive Clients</h2>
          </div>
          <p className="text-4xl font-bold text-red-400">{inactiveClients}</p>
        </div>
      </div>

      {/* Add Client Button and Search Bar */}
      <div className="flex gap-2 items-center ">
        <div className="w-96">
          <input
            type="text"
            placeholder="Search by Company Name or Client Name/ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md dark:bg-neutral-900 bg-sky-50"
          />
        </div>
        <div
          className="bg-sky-50 dark:bg-neutral-900 p-3 rounded-md cursor-pointer"
          variant="contained"
          color="primary"
          onClick={() => setOpenDrawer(true)}
        >
          <FaPlus fontSize={20} />
        </div>
      </div>

      {/* Client Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 h-full overflow-y-scroll scrollbar-hide">
        {filteredClients.length > 0 ? (
          filteredClients.map((client) => (
            <div
              key={client._id}
              className="p-2 dark:bg-neutral-900 bg-sky-50 flex flex-col gap-1 rounded-md group"
            >
              <div className="flex justify-between gap-2 py-2 rounded-md group-hover:bg-blue-100 group-hover:dark:bg-neutral-950 group-hover:px-2 duration-300">
                <div className="flex items-center gap-2">
                  <img
                    src={userprofile}
                    className="w-10 h-10 rounded-md object-cover"
                  />
                  <p className="flex flex-col">
                    <strong className="text-base"> {client.companyname}</strong>
                    <span className="text-xs">{client.clientname}</span>
                  </p>
                </div>
                <div className="hidden group-hover:block">
                  <button
                    onClick={() => handleViewClient(client)} // Pass the clicked client data
                    className="hover:bg-blue-500/20 hover:text-blue-500  p-2 rounded-md"
                  >
                    <FaExternalLinkAlt />
                  </button>
                </div>
              </div>
              <hr className="w-full h-[2px] border-none bg-gray-300 dark:bg-neutral-800 my-2" />
              <div className="flex items-center gap-2">
                <strong className="w-1/3">ID</strong>
                <span className="w-2/3 overflow-x-hidden">
                  {client.clientid}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <strong className="w-1/3 ">Email</strong>
                <span className="w-2/3 overflow-x-scroll scrollbar-hide">
                  {client.email}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <strong className="w-1/3">Phone</strong>
                <span className="w-2/3 overflow-x-hidden">{client.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <strong className="w-1/3">Status</strong>
                <span
                  className={`w-fit px-1.5 py-0.5 text-xs rounded-md font-bold ${
                    client.status === 1
                      ? "bg-green-500/20 text-green-500"
                      : "bg-red-500/20 text-red-500"
                  }`}
                >
                  {client.status === 1 ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <strong className="w-1/3">Address</strong>
                <span className="w-2/3">{client.officeaddress || "N/A"}</span>
              </div>
              <div className="flex items-center gap-2">
                <strong className="w-1/3">Projects</strong>
                <span className="w-2/3">{client.projectCount}</span>
              </div>
            </div>
          ))
        ) : (
          <p>No clients found.</p>
        )}
      </div>

      {/* Add Client Drawer */}
      <Drawer
        anchor="right"
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        className="backdrop-blur-sm euclid "
      >
        <div className="p-4 w-96 flex flex-col gap-2 dark:text-white bg-sky-100 dark:bg-neutral-900 h-full rounded-t-2xl ">
          <h2 className="text-xl font-semibold ">Add Client</h2>
          <div className="flex flex-col gap-5">
            <TextField
              label="Client Name"
              value={newClient.clientname}
              onChange={(e) =>
                setNewClient({ ...newClient, clientname: e.target.value })
              }
              fullWidth
              className={classNames(
                "p-2 border rounded-lg dark:bg-neutral-800 dark:border-neutral-700 h-10",
                classes.root
              )}
            />
            <TextField
              label="Company Name"
              value={newClient.companyname}
              onChange={(e) =>
                setNewClient({ ...newClient, companyname: e.target.value })
              }
              fullWidth
              className={classNames(
                "p-2 border rounded-lg dark:bg-neutral-800 dark:border-neutral-700 h-10",
                classes.root
              )}
            />
            <TextField
              label="Email"
              value={newClient.email}
              onChange={(e) =>
                setNewClient({ ...newClient, email: e.target.value })
              }
              fullWidth
              className={classNames(
                "p-2 border rounded-lg dark:bg-neutral-800 dark:border-neutral-700 h-10",
                classes.root
              )}
            />
            <TextField
              label="Phone"
              value={newClient.phone}
              onChange={(e) =>
                setNewClient({ ...newClient, phone: e.target.value })
              }
              fullWidth
              className={classNames(
                "p-2 border rounded-lg dark:bg-neutral-800 dark:border-neutral-700 h-10",
                classes.root
              )}
            />
            <div
              className="bg-blue-500/20 text-center text-base hover:bg-blue-600/20 font-bold text-blue-500  p-3 rounded-md cursor-pointer"
              variant="contained"
              color="primary"
              onClick={handleAddClient}
              fullWidth
            >
              Add Client
            </div>
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default ClientCard;
