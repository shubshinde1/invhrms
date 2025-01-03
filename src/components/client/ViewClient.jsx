import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import userprofile from "../../assets/images/clientAvatar.png";
import ApiendPonits from "../../api/APIEndPoints.json";

/*************  ✨ Codeium Command ⭐  *************/
/**
 * ViewClient is a component that displays a client's details and all projects assigned to them.
 *
 * @param {object} location.state - The state object passed via the Link component that contains the client data.
 * @param {string} token - The access token used to authenticate the API request.
 *
 * @returns {JSX.Element} A JSX element that displays a client's details and projects.

/******  d758e886-176f-468f-98f2-0b0adfd87e51  *******/ const ViewClient =
  () => {
    const location = useLocation();
    const { client } = location.state; // Destructure the client data passed via state
    const token = localStorage.getItem("accessToken"); // Assuming the token is stored in localStorage

    const [projects, setProjects] = useState([]);
    const selectedclientid = client._id;

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
          console.log(data);

          if (response.ok) {
            setProjects(data.data); // Set the projects data
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

    return (
      <div className="h-full pb-20">
        <div className="bg-white dark:bg-neutral-950 p-2 rounded-md text-black dark:text-white h-full min-h-full">
          {/* Client Details */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-end gap-2 justify-between h-fit w-full">
              <div className="flex items-end gap-2 h-fit">
                <img
                  src={userprofile}
                  className="w-28 h-2w-28 rounded-md object-cover"
                />
                <div className="flex flex-col">
                  <strong className="text-xl"> {client.companyname}</strong>
                  <span className="text">{client.clientname}</span>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex flex-col gap-2">
                  <strong>Client ID</strong>
                  <span>{client.clientid}</span>
                </div>
                <div className="flex flex-col gap-2">
                  <strong>Phone</strong>
                  <span>{client.phone}</span>
                </div>
                <div className="flex flex-col gap-2">
                  <strong>Email</strong>
                  <span>{client.email}</span>
                </div>
                <div className="flex flex-col gap-2">
                  <strong>No Of Projects</strong>
                  <span>{client.projectCount}</span>
                </div>
                <div className="flex flex-col gap-2">
                  <strong>HeadQurter</strong>
                  <span>{client.officeaddress || "N/A"}</span>
                </div>
              </div>
              <div>Buttons</div>
            </div>
          </div>
          <hr className="w-full h-[2px] border-none bg-gray-300 dark:bg-neutral-800 my-2" />

          {/* Projects Table */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {projects.map((project) => (
              <div
                key={project._id}
                className=" rounded-lg shadow-md p-3 bg-white dark:bg-neutral-900 hover:shadow-lg transition-shadow"
              >
                <h3 className="text-lg font-semibold mb-2">
                  {project.projectid}-{project.projectname}
                </h3>
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
                    {project.status === 0 ? "Pending" : "Completed"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

export default ViewClient;
