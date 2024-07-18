import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";
import secureLocalStorage from "react-secure-storage";
import profile from "../../../src/assets/images/profilepic.png";

const UserProfile = () => {
  const { userData } = useContext(AuthContext);

  // Check if userData is null or undefined
  if (!userData || !userData.employeeData) {
    return <p>Loading...</p>; // Handle loading state or return an error message
  }

  const empid = userData.employeeData._id;

  // Destructuring user data for default values in form
  const { name, phone, status, email } = userData.employeeData;

  const [formData, setFormData] = useState({
    id: empid,
    name: "",
    phone: "",
    status: "",
  });

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isEditMode, setIsEditMode] = useState(false); // State to manage edit mode
  const [showPasswordModal, setShowPasswordModal] = useState(false); // State to manage password modal
  const [password, setPassword] = useState(""); // State for password input
  const [passwordError, setPasswordError] = useState(""); // State for password error message

  // Set form data when user data changes
  useEffect(() => {
    setFormData({
      id: empid,
      name: name || "",
      phone: phone || "",
      status: status || "",
    });
  }, [empid, name, phone, status]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("accessToken");

    try {
      const { id, name, phone, status } = formData;

      const response = await fetch("http://localhost:3000/api/updateuser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id,
          name,
          phone,
          status,
        }),
      });

      if (response.status === 200) {
        try {
          const loginResponse = await axios.post(
            "http://localhost:3000/api/login",
            {
              email: userData.employeeData.email,
              password: password,
            }
          );

          const data = loginResponse.data.data;

          if (loginResponse.data.success) {
            localStorage.setItem("accessToken", loginResponse.data.accessToken);
            secureLocalStorage.setItem("userData", JSON.stringify(data));
            location.reload();
          }
        } catch (error) {
          setPasswordError("Please enter a valid password.");
          return;
        }

        setSuccessMessage("Details updated successfully!");
        setError("");
        setIsEditMode(false); // Exit edit mode after successful update
        setShowPasswordModal(false); // Hide the password modal
      }
    } catch (error) {
      console.error("Error updating details:", error);
      setError("Something went wrong. Please try again later.");
    }
  };

  const handleCancel = () => {
    setFormData({
      id: empid,
      name: name || "",
      phone: phone || "",
      status: status || "",
    });
    setIsEditMode(false);
  };

  const handleUpdateClick = () => {
    setShowPasswordModal(true);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    handleSubmit(e);
  };

  return (
    <div className="flex flex-col md:flex-row gap-2 ">
      <div className="md:w-2/5 bg-white p-2 dark:bg-neutral-950 dark:text-white rounded-md flex flex-col gap-2">
        <div className="flex justify-center gap-3 flex-col items-center bg-neutral-900 p-2 rounded-md w-1/2">
          <img src={profile} alt="profile" className="rounded-xl   " />
          <span className="">
            {userData.employeeData.status == 1 ? (
              <span className="bg-green-200 px-1.5 py-0.5 rounded-md text-green-600 font-bold absolute -mt-7 ml-7">
                Active
              </span>
            ) : (
              <span className="bg-red-200 px-1.5 py-0.5 rounded-md text-red-600 font-bold">
                InaActive
              </span>
            )}
          </span>
        </div>
        <div className="mb-4">
          <p className="mb-2">
            <strong>Name:</strong>{" "}
            {isEditMode ? (
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="border p-2 w-full bg-sky-100 dark:bg-neutral-800 rounded-md"
              />
            ) : (
              name
            )}
          </p>
          <p className="mb-2">
            <strong>Employee ID:</strong> {userData.employeeData.empid}
          </p>
          <p className="mb-2">
            <strong>Email:</strong> {email}
          </p>
          <p className="mb-2">
            <strong>Phone:</strong>{" "}
            {isEditMode ? (
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="border p-2 w-full bg-sky-100 dark:bg-neutral-800 rounded-md"
              />
            ) : (
              phone
            )}
          </p>
        </div>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        {successMessage && (
          <p className="text-green-500 mb-2">{successMessage}</p>
        )}
        {isEditMode ? (
          <div>
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-500 text-white px-4 py-2 mr-2 rounded w-fit"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleUpdateClick}
              className="bg-blue-500 text-white px-4 py-2 rounded w-fit"
            >
              Update Details
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsEditMode(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded w-fit"
          >
            Edit Details
          </button>
        )}

        {showPasswordModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white dark:bg-neutral-700 p-6 rounded shadow-lg flex flex-col items-center">
              <h2 className="text-xl font-bold mb-4">Enter Password</h2>
              <form onSubmit={handlePasswordSubmit}>
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={handlePasswordChange}
                  required
                  className="border p-2 w-full mb-4 bg-sky-100 dark:bg-neutral-800 rounded-md"
                />
                {passwordError && (
                  <p className="text-red-500 mb-4">{passwordError}</p>
                )}
                <div className="flex justify-between">
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                  >
                    Submit
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowPasswordModal(false);
                      setPasswordError(""); // Clear password error on cancel
                    }}
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      <div className="w-full bg-white p-2 dark:bg-neutral-950 dark:text-white rounded-md">
        Hello
      </div>
    </div>
  );
};

export default UserProfile;
