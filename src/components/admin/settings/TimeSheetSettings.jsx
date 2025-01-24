import React, { useState, useEffect } from "react";
import ApiendPonits from "../../../api/APIEndPoints.json";
import Loading from "../../Loading";
import { FaCaretUp, FaCaretDown } from "react-icons/fa6";
import { motion } from "framer-motion";
import DepartmentSettings from "./DepartmentSettings";
import DesignationSettings from "./DesignationSettings";
import CountrySettings from "./CountrySettings";
import ReportingManagerSettings from "./ReportingManagerSettings";

const Settings = () => {
  const token = localStorage.getItem("accessToken");
  const [timesheetLimit, setTimesheetLimit] = useState(null);
  const [error, setError] = useState(null);
  const [massage, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    addtimesheetlimit: "",
    updatetimesheetlimit: "",
    deletetimesheetlimit: "",
  });

  // Fetch timesheet limits
  useEffect(() => {
    setLoading(true);
    const fetchTimesheetLimit = async () => {
      try {
        const response = await fetch(
          `${ApiendPonits.baseUrl}${ApiendPonits.endpoints.gettimesheetlimit}`,
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
          setTimesheetLimit(data.data);
          setFormData({
            addtimesheetlimit: data.data.addtimesheetlimit,
            updatetimesheetlimit: data.data.updatetimesheetlimit,
            deletetimesheetlimit: data.data.deletetimesheetlimit,
          });
          setLoading(false);
        } else {
          throw new Error(data.msg || "Failed to fetch timesheet limits");
        }
      } catch (err) {
        setError(err.message || "An error occurred");
        console.error("Error fetching timesheet limits:", err.message || err);
      }
    };

    if (token) {
      fetchTimesheetLimit();
    }
  }, [token]);

  // Update timesheet limits
  const handleUpdate = async (e) => {
    e.preventDefault(); // Prevent form submission
    setError(null);

    try {
      const response = await fetch(
        `${ApiendPonits.baseUrl}${ApiendPonits.endpoints.updatetimesheetlimit}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setTimesheetLimit(data.data); // Update the state with the new values
        setMessage("Timesheet limits updated successfully");
        setTimeout(() => setMessage(""), 3000);
      } else {
        throw new Error(data.msg || "Failed to update timesheet limits");
      }
    } catch (err) {
      setError(err.message || "An error occurred");
      console.error("Error updating timesheet limits:", err.message || err);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-neutral-900 p-2 h-full shadow-md rounded-md">
      <h1 className="text-base font-bold border-b pb-3 text-gray-800 dark:text-white">
        Timesheet Limit Settings
      </h1>
      {/* Display error if any */}
      {error && (
        <div className="bg-red-200 dark:bg-red-800 text-red-700 dark:text-red-200 p-4 rounded-lg mb-4">
          {error}
        </div>
      )}
      <div className="flex flex-col  gap-2">
        <p className="text-sm text-gray-500 dark:text-gray-300">
          <strong>Last Updated At:</strong>{" "}
          {new Date(timesheetLimit.updatedAt).toLocaleString()}
        </p>
        {/* Update form */}
        <form onSubmit={handleUpdate} className="flex flex-col gap-4 w-fit">
          {/* Add Timesheet Limit */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="addtimesheetlimit"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Add Timesheet Limit
            </label>
            <div className="flex gap-2 items-center justify-between bg-gray-100 dark:bg-neutral-900 p-2 rounded-md">
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    addtimesheetlimit: Math.max(0, prev.addtimesheetlimit - 1),
                  }))
                }
                className="w-10 h-10 flex justify-center items-center rounded-lg bg-gray-200 dark:bg-neutral-800 hover:bg-gray-300 dark:hover:bg-neutral-500 text-xl text-gray-700 dark:text-white"
              >
                <FaCaretDown />
              </button>
              <input
                type="number"
                id="addtimesheetlimit"
                name="addtimesheetlimit"
                value={formData.addtimesheetlimit}
                onChange={handleInputChange}
                className="w-24 border-2 border-gray-300 rounded-md text-center py-2 dark:bg-neutral-800 dark:text-white"
              />
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    addtimesheetlimit: prev.addtimesheetlimit + 1,
                  }))
                }
                className="w-10 h-10 flex justify-center items-center rounded-lg bg-gray-200 dark:bg-neutral-800 hover:bg-gray-300 dark:hover:bg-neutral-500 text-xl text-gray-700 dark:text-white"
              >
                <FaCaretUp />
              </button>
            </div>
          </div>

          {/* Update Timesheet Limit */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="updatetimesheetlimit"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Update Timesheet Limit
            </label>
            <div className="flex items-center justify-between bg-gray-100 dark:bg-neutral-900 p-2 rounded-md">
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    updatetimesheetlimit: Math.max(
                      0,
                      prev.updatetimesheetlimit - 1
                    ),
                  }))
                }
                className="w-10 h-10 flex justify-center items-center rounded-lg bg-gray-200 dark:bg-neutral-800 hover:bg-gray-300 dark:hover:bg-neutral-500 text-xl text-gray-700 dark:text-white"
              >
                <FaCaretDown />
              </button>
              <input
                type="number"
                id="updatetimesheetlimit"
                name="updatetimesheetlimit"
                value={formData.updatetimesheetlimit}
                onChange={handleInputChange}
                className="w-24 border-2 border-gray-300 rounded-md text-center py-2 dark:bg-neutral-800 dark:text-white"
              />
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    updatetimesheetlimit: prev.updatetimesheetlimit + 1,
                  }))
                }
                className="w-10 h-10 flex justify-center items-center rounded-lg bg-gray-200 dark:bg-neutral-800 hover:bg-gray-300 dark:hover:bg-neutral-500 text-xl text-gray-700 dark:text-white"
              >
                <FaCaretUp />
              </button>
            </div>
          </div>

          {/* Delete Timesheet Limit */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="deletetimesheetlimit"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Delete Timesheet Limit
            </label>
            <div className="flex items-center justify-between bg-gray-100 dark:bg-neutral-900 p-2 rounded-md">
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    deletetimesheetlimit: Math.max(
                      0,
                      prev.deletetimesheetlimit - 1
                    ),
                  }))
                }
                className="w-10 h-10 flex justify-center items-center rounded-lg bg-gray-200 dark:bg-neutral-800 hover:bg-gray-300 dark:hover:bg-neutral-500 text-xl text-gray-700 dark:text-white"
              >
                <FaCaretDown />
              </button>
              <input
                type="number"
                id="deletetimesheetlimit"
                name="deletetimesheetlimit"
                value={formData.deletetimesheetlimit}
                onChange={handleInputChange}
                className="w-24 border-2 border-gray-300 rounded-md text-center py-2 dark:bg-neutral-800 dark:text-white"
              />
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    deletetimesheetlimit: prev.deletetimesheetlimit + 1,
                  }))
                }
                className="w-10 h-10 flex justify-center items-center rounded-lg bg-gray-200 dark:bg-neutral-800 hover:bg-gray-300 dark:hover:bg-neutral-500 text-xl text-gray-700 dark:text-white"
              >
                <FaCaretUp />
              </button>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="bg-blue-500/20 text-blue-500 py-3 rounded-lg hover:bg-blue-500/30 transition duration-300 ease-in-out"
          >
            Update Timesheet Limits
          </button>
        </form>
      </div>

      {massage ? (
        <motion.div
          initial={{ opacity: 0, x: 5 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute bottom-2 right-2 bg-green-500/20 text-green-500 py-2 px-4 rounded-lg "
        >
          {massage}
        </motion.div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Settings;
