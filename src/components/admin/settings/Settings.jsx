import React, { useState, useEffect } from "react";
import ApiendPonits from "../../../api/APIEndPoints.json";

const Settings = () => {
  const token = localStorage.getItem("accessToken");
  const [timesheetLimit, setTimesheetLimit] = useState(null);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    addtimesheetlimit: "",
    updatetimesheetlimit: "",
    deletetimesheetlimit: "",
  });

  // Fetch timesheet limits
  useEffect(() => {
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

  return (
    <div className="h-full pb-20">
      <div className="bg-gray-50 dark:bg-neutral-950 p-6 rounded-2xl shadow-lg text-black dark:text-white h-full max-h-full flex flex-col gap-6">
        <h1 className="text-2xl font-bold border-b pb-3 text-gray-800 dark:text-white">
          Timesheet Limit Settings
        </h1>

        {/* Display error if any */}
        {error && (
          <div className="bg-red-200 dark:bg-red-800 text-red-700 dark:text-red-200 p-4 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Main content */}
        {timesheetLimit ? (
          <div className="flex flex-col gap-6">
            {/* Last updated info */}
            <p className="text-sm text-gray-500 dark:text-gray-300">
              <strong>Last Updated At:</strong>{" "}
              {new Date(timesheetLimit.updatedAt).toLocaleString()}
            </p>

            {/* Update form */}
            <form onSubmit={handleUpdate} className="flex flex-col gap-8">
              {/* Add Timesheet Limit */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="addtimesheetlimit"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Add Timesheet Limit
                </label>
                <div className="flex items-center justify-between bg-gray-100 dark:bg-neutral-800 p-3 rounded-xl">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        addtimesheetlimit: Math.max(
                          0,
                          prev.addtimesheetlimit - 1
                        ),
                      }))
                    }
                    className="w-10 h-10 flex justify-center items-center rounded-full bg-gray-200 dark:bg-neutral-600 hover:bg-gray-300 dark:hover:bg-neutral-500 text-xl text-gray-700 dark:text-white"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    id="addtimesheetlimit"
                    name="addtimesheetlimit"
                    value={formData.addtimesheetlimit}
                    onChange={handleInputChange}
                    className="w-24 border-2 border-gray-300 rounded-xl text-center py-2 dark:bg-neutral-900 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        addtimesheetlimit: prev.addtimesheetlimit + 1,
                      }))
                    }
                    className="w-10 h-10 flex justify-center items-center rounded-full bg-gray-200 dark:bg-neutral-600 hover:bg-gray-300 dark:hover:bg-neutral-500 text-xl text-gray-700 dark:text-white"
                  >
                    +
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
                <div className="flex items-center justify-between bg-gray-100 dark:bg-neutral-800 p-3 rounded-xl">
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
                    className="w-10 h-10 flex justify-center items-center rounded-full bg-gray-200 dark:bg-neutral-600 hover:bg-gray-300 dark:hover:bg-neutral-500 text-xl text-gray-700 dark:text-white"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    id="updatetimesheetlimit"
                    name="updatetimesheetlimit"
                    value={formData.updatetimesheetlimit}
                    onChange={handleInputChange}
                    className="w-24 border-2 border-gray-300 rounded-xl text-center py-2 dark:bg-neutral-900 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        updatetimesheetlimit: prev.updatetimesheetlimit + 1,
                      }))
                    }
                    className="w-10 h-10 flex justify-center items-center rounded-full bg-gray-200 dark:bg-neutral-600 hover:bg-gray-300 dark:hover:bg-neutral-500 text-xl text-gray-700 dark:text-white"
                  >
                    +
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
                <div className="flex items-center justify-between bg-gray-100 dark:bg-neutral-800 p-3 rounded-xl">
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
                    className="w-10 h-10 flex justify-center items-center rounded-full bg-gray-200 dark:bg-neutral-600 hover:bg-gray-300 dark:hover:bg-neutral-500 text-xl text-gray-700 dark:text-white"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    id="deletetimesheetlimit"
                    name="deletetimesheetlimit"
                    value={formData.deletetimesheetlimit}
                    onChange={handleInputChange}
                    className="w-24 border-2 border-gray-300 rounded-xl text-center py-2 dark:bg-neutral-900 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        deletetimesheetlimit: prev.deletetimesheetlimit + 1,
                      }))
                    }
                    className="w-10 h-10 flex justify-center items-center rounded-full bg-gray-200 dark:bg-neutral-600 hover:bg-gray-300 dark:hover:bg-neutral-500 text-xl text-gray-700 dark:text-white"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                className="bg-blue-600 text-white py-3 rounded-full hover:bg-blue-700 transition duration-300 ease-in-out mt-6"
              >
                Update Timesheet Limits
              </button>
            </form>
          </div>
        ) : (
          !error && (
            <p className="text-center text-gray-500 dark:text-gray-400">
              Loading timesheet limits...
            </p>
          )
        )}
      </div>
    </div>
  );
};

export default Settings;
