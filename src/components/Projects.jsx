import React, { useState, useEffect } from "react";
import ApiendPonits from "../api/APIEndPoints.json";
import userprofile from "../assets/images/clientAvatar.png";
import { FaHospitalUser } from "react-icons/fa";
import { IoFlash, IoFlashOff } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { FaExternalLinkAlt } from "react-icons/fa";
import Loading from "./Loading";

const Projects = () => {
  const token = localStorage.getItem("accessToken");
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]); // For search
  const [searchQuery, setSearchQuery] = useState(""); // Search query state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(
          `${ApiendPonits.baseUrl}${ApiendPonits.endpoints.viewproject}`,
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
          setProjects(data.data);
          setFilteredProjects(data.data); // Initialize filtered projects
        } else {
          console.error("Error fetching project:", data.msg);
          setError(data.msg);
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setError("Error fetching data");
        console.error("Error fetching project:", error);
      }
    };
    fetchProject();
  }, [token]);

  useEffect(() => {
    const filtered = projects.filter(
      (project) =>
        project.projectname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.clientid.companyname
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        (project.projectid?.toString().toLowerCase() || "").includes(
          searchQuery.toLowerCase()
        ) ||
        project._id.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProjects(filtered);
  }, [searchQuery, projects]);

  const handleViewProject = (projectId) => {
    navigate(`/projects/viewproject/${projectId}`);
  };

  if (loading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Calculate totals
  const totalProjects = projects.length;
  const activeProjects = projects.filter(
    (project) => project.status === 0
  ).length;
  const inactiveProjects = projects.filter(
    (project) => project.status === 1
  ).length;

  return (
    <div className="h-full pb-20">
      <div className="bg-white dark:bg-neutral-950 p-2 rounded-md flex flex-col gap-2 text-black dark:text-white h-full max-h-full">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <div className="p-2 dark:bg-neutral-900 bg-sky-50 flex flex-col gap-4 items-end rounded-md">
            <div className="flex items-center gap-2 w-full">
              <div className="bg-blue-500/20 rounded-md p-2">
                <FaHospitalUser fontSize={20} className="text-blue-600" />
              </div>
              <h2 className="text-sm">Total Projects</h2>
            </div>
            <p className="text-4xl font-bold text-blue-400">{totalProjects}</p>
          </div>

          <div className="p-2 dark:bg-neutral-900 bg-sky-50 flex flex-col gap-4 items-end rounded-md">
            <div className="flex items-center gap-2 w-full">
              <div className="bg-green-500/20 rounded-md p-2">
                <IoFlash fontSize={20} className="text-green-600" />
              </div>
              <h2 className="text-sm">Active Projects</h2>
            </div>
            <p className="text-4xl font-bold text-green-400">
              {activeProjects}
            </p>
          </div>

          <div className="p-2 dark:bg-neutral-900 bg-sky-50 flex flex-col gap-4 items-end rounded-md">
            <div className="flex items-center gap-2 w-full">
              <div className="bg-red-500/20 rounded-md p-2">
                <IoFlashOff fontSize={20} className="text-red-600" />
              </div>
              <h2 className="text-sm">Inactive Projects</h2>
            </div>
            <p className="text-4xl font-bold text-red-400">
              {inactiveProjects}
            </p>
          </div>
        </div>

        <div className="flex gap-2 items-center ">
          <div className="w-full md:w-96">
            <input
              type="text"
              placeholder="Search by Project Name, Business Name, or Project ID"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md dark:bg-neutral-900 bg-sky-50"
            />
          </div>
        </div>

        {/* Projects List */}
        <div className="h-full  overflow-y-scroll scrollbrhdn">
          {/* Header Row */}
          <div className="hidden md:grid grid-cols-12 gap-4 bg-blue-100 dark:bg-neutral-800 px-2 py-3 rounded-md font-semibold sticky top-0">
            <div className="col-span-1">Project ID</div>
            <div className="col-span-2">Project Name</div>
            <div className="col-span-2">Business Name</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-1">Start Date</div>
            <div className="col-span-1">Deadline</div>
            <div className="col-span-3">Assigned To</div>
            <div className="col-span-1 text-center">Action</div>
          </div>

          {/* Data Rows */}
          <div className="h-ful ">
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project, index) => (
                <div
                  key={project._id}
                  className="md:grid md:grid-cols-12 md:gap-2 flex flex-col gap-2 p-2  bg-blue-50 dark:bg-neutral-900 rounded-md md:items-center mt-2 group"
                >
                  <div className="col-span-1 truncate flex items-center gap-2 justify-between">
                    <span className="flex md:hidden"> Sr.No</span>
                    {index + 1}
                  </div>
                  <div className="col-span-2 flex items-center gap-2 justify-between">
                    <span className="flex md:hidden"> Project Name</span>
                    {project.projectname}
                  </div>
                  <div className="col-span-2 flex items-center gap-2 justify-between">
                    <span className="flex md:hidden"> Business Name</span>
                    {project.clientid.companyname}
                  </div>
                  <div className="col-span-1 flex items-center gap-2 justify-between">
                    <span className="flex md:hidden"> Status</span>
                    {project.status === 0 ? (
                      <span className="text-green-600 bg-green-500/20 px-1.5 py-0.5 text-xs rounded-md font-bold">
                        Active
                      </span>
                    ) : (
                      <span className="text-red-600 bg-red-500/20 px-1.5 py-0.5 text-xs rounded-md font-bold">
                        Inactive
                      </span>
                    )}
                  </div>
                  <div className="col-span-1 flex items-center gap-2 justify-between">
                    <span className="flex md:hidden"> Start Date</span>
                    {project.reciveddate
                      ? new Date(project.reciveddate).toLocaleDateString()
                      : "N/A"}
                  </div>
                  <div className="col-span-1 flex items-center gap-2 justify-between">
                    <span className="flex md:hidden"> Deadline</span>
                    {project.deadline
                      ? new Date(project.deadline).toLocaleDateString()
                      : "N/A"}
                  </div>
                  <div className="col-span-3 flex items-center gap-2   justify-between">
                    <span className="flex md:hidden"> Assigne To</span>
                    <div className="flex items-center gap-1">
                      <img
                        src={project.assignto.profile || userprofile}
                        alt={project.assignto.name}
                        width="25"
                        height="25"
                        className="rounded-md"
                      />
                      <span>{project.assignto.name}</span>
                    </div>
                  </div>
                  <div className="col-span-1 md:text-center">
                    <button
                      onClick={() => handleViewProject(project._id)}
                      className="group-hover:bg-blue-500/20 hover:text-blue-500 p-2 rounded-md"
                    >
                      <FaExternalLinkAlt />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="mt-2 h-full bg-blue-50 dark:bg-neutral-800 rounded-md items-center justify-center flex">
                No projects found for keyword "{searchQuery}"
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projects;
