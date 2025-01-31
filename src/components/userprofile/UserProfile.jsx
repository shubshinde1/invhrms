import React, { useState, useContext, useEffect, useRef } from "react";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";
import secureLocalStorage from "react-secure-storage";
import { MdEdit } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { FaPlus } from "react-icons/fa6";
import Checkbox from "@mui/material/Checkbox";
import { TiMinus } from "react-icons/ti";
import { FaExternalLinkAlt } from "react-icons/fa";
import { FaCopy } from "react-icons/fa6";
import ApiendPonits from "../../api/APIEndPoints.json";
import ProfilePic from "./ProfilePic";
import { FaCheck } from "react-icons/fa6";
import { BiSolidHappyHeartEyes } from "react-icons/bi";
import { motion } from "framer-motion";
import { BsFillShieldLockFill } from "react-icons/bs";
import { FaFaceSadTear } from "react-icons/fa6";

const UserProfile = () => {
  const { userData } = useContext(AuthContext);
  const token = localStorage.getItem("accessToken");

  if (!userData || !userData.employeeData) {
    return <p>Loading...</p>;
  }

  const empid = userData.employeeData._id;

  const { name, phone, status, email } = userData.employeeData;

  const [formData, setFormData] = useState({
    id: empid,
    name: "",
    phone: "",
    status: "",
    dob: "",
    gender: "",
    maritialstatus: "",
    bloodgroup: "",
    dateofjoining: "",
    designation: "",
    department: "",
    reportingto: "",
    teamleader: "",
    techexperties: [],
    address: "",
    city: "",
    state: "",
    country: "",
    zipcode: "",
    emergencypersonname: "",
    relation: "",
    profession: "",
    emergencypersonaddress: "",
    emergencypersonemail: "",
    emergencypersonphone: "",
    workexperience: [
      {
        jobtitle: "",
        companyname: "",
        companylinkedinurl: "",
        employeementtype: "",
        startdate: "",
        enddate: "",
        description: "",
      },
    ],
  });

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(179);
  const [customTech, setCustomTech] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const [successMessage, setSuccessMessage] = useState("");
  const [isEditMode, setIsEditMode] = useState(false); // State to manage edit mode
  const [showPasswordModal, setShowPasswordModal] = useState(false); // State to manage password modal
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [password, setPassword] = useState(""); // State for password input
  const [passwordError, setPasswordError] = useState(""); // State for password error message
  const [showPopup, setShowPopup] = useState(false);
  const { setUserData, setTokenType } = useContext(AuthContext);

  const inputRefs = useRef([]);

  useEffect(() => {
    let countdown;
    if (showOtpPopup) {
      countdown = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(countdown);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(countdown);
  }, [showOtpPopup, timer]);

  useEffect(() => {
    if (showOtpPopup && inputRefs.current[0]) {
      inputRefs.current[0].focus(); // Auto-focus the first OTP input
    }
  }, [showOtpPopup]);

  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    if (/^[0-9]$/.test(value) || value === "") {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move to the next input if a digit is entered
      if (value && index < otp.length - 1) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();

    if (/^\d{6}$/.test(pastedData)) {
      // Check if the pasted value is exactly 6 digits
      const newOtp = pastedData.split("");
      setOtp(newOtp);

      // Move focus to the last input field
      inputRefs.current[otp.length - 1]?.focus();
    }
  };

  const handleBackspace = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const resendcode = async (e) => {
    setMessage("Code Resent");
    setTimeout(() => {
      setMessage(null);
    }, 3000);
    handleSubmit(e);
    setTimer(179);
    setOtp(["", "", "", "", "", ""]);
  };

  useEffect(() => {
    setFormData({
      id: empid,
      name: name || "",
      phone: phone || "",
      status: status || "",
      dob: userData.employeeData.dob || "",
      gender: userData.employeeData.gender || "",
      maritialstatus: userData.employeeData.maritialstatus || "",
      bloodgroup: userData.employeeData.bloodgroup || "",
      dateofjoining: userData.employeeData.dateofjoining || "",
      designation: userData.employeeData.designation || "",
      department: userData.employeeData.department || "",
      reportingto: userData.employeeData.reportingto || "",
      teamleader: userData.employeeData.teamleader || "",
      techexperties: userData.employeeData.techexperties || [],
      address: userData.employeeData.address || "",
      city: userData.employeeData.city || "",
      state: userData.employeeData.state || "",
      country: userData.employeeData.country || "",
      zipcode: userData.employeeData.zipcode || "",
      emergencypersonname: userData.employeeData.emergencypersonname || "",
      relation: userData.employeeData.relation || "",
      profession: userData.employeeData.profession || "",
      emergencypersonaddress:
        userData.employeeData.emergencypersonaddress || "",
      emergencypersonemail: userData.employeeData.emergencypersonemail || "",
      emergencypersonphone: userData.employeeData.emergencypersonphone || "",
      workexperience: userData.employeeData.workexperience || [
        {
          jobtitle: "",
          companyname: "",
          companylinkedinurl: "",
          employeementtype: "",
          startdate: "",
          enddate: "",
          description: "",
        },
      ],
    });
  }, [empid, userData]);

  const predefinedTech = [
    "JavaScript",
    "Python",
    "Java",
    "C++",
    "C#",
    "Ruby",
    "PHP",
    "Go",
    "Swift",
    "Kotlin",
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const {
        id,
        name,
        phone,
        status,
        dob,
        gender,
        maritialstatus,
        bloodgroup,
        dateofjoining,
        designation,
        department,
        reportingto,
        teamleader,
        techexperties,
        address,
        city,
        state,
        country,
        zipcode,
        emergencypersonname,
        relation,
        profession,
        emergencypersonaddress,
        emergencypersonemail,
        emergencypersonphone,
        workexperience,
      } = formData;

      const response = await fetch(
        `${ApiendPonits.baseUrl}${ApiendPonits.endpoints.updateuser}`,
        {
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
            dob,
            gender,
            maritialstatus,
            bloodgroup,
            dateofjoining,
            designation,
            department,
            reportingto,
            teamleader,
            techexperties,
            address,
            city,
            state,
            country,
            zipcode,
            emergencypersonname,
            relation,
            profession,
            emergencypersonaddress,
            emergencypersonemail,
            emergencypersonphone,
            workexperience,
          }),
        }
      );

      if (response.status === 200) {
        try {
          const loginResponse = await axios.post(
            `${ApiendPonits.baseUrl}${ApiendPonits.endpoints.login}`,
            {
              email: userData.employeeData.email,
              password: password,
            }
          );

          const data = loginResponse.data.data;

          if (loginResponse.data.success) {
            setShowOtpPopup(true);
            setTimer(179);
            setShowPasswordModal(false);
          }
        } catch (error) {
          setError("Please enter a valid password.");
          setTimeout(() => setError(null), 5000);
          return;
        }

        setSuccessMessage("Details updated successfully!");
        setError("");
        setIsEditMode(false); // Exit edit mode after successful update
        setShowPasswordModal(false); // Hide the password modal
      }
    } catch (error) {
      //remove local storage and logout user here
      console.error("Error updating details:", error);
      setError("Something went wrong. Please try again later.");
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const enteredOtp = otp.join("");
    setLoading(true);
    try {
      const response = await axios.post(
        `${ApiendPonits.baseUrl}${ApiendPonits.endpoints.verifyOtp}`,
        { email, otp: enteredOtp }
      );

      const data = response.data.data;

      if (response.data.success) {
        setMessage("Code verified Succesfully");
        setTimeout(() => setMessage, 2000);
        localStorage.setItem("accessToken", response.data.accessToken);
        secureLocalStorage.setItem("userData", JSON.stringify(data)); // Store user data in sessionStorage
        setUserData(data);
        setTokenType(response.data.tokenType); // Set tokenType in context
        // setTimeout(() => location.reload(), 2000);
      } else {
        setError(data.msg || "Invalid OTP. Please try again.");
        setTimeout(() => setError(null), 5000);
      }
    } catch (error) {
      setError(
        error.response?.data?.msg ||
          "An unexpected error occurred. Please try again."
      );
      setTimeout(() => setError(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      id: empid,
      name: name || "",
      phone: phone || "",
      status: status || "",
      dob: userData.employeeData.dob || "",
      gender: userData.employeeData.gender || "",
      maritialstatus: userData.employeeData.maritialstatus || "",
      bloodgroup: userData.employeeData.bloodgroup || "",
      dateofjoining: userData.employeeData.dateofjoining || "",
      designation: userData.employeeData.designation || "",
      department: userData.employeeData.department || "",
      reportingto: userData.employeeData.reportingto || "",
      teamleader: userData.employeeData.teamleader || "",
      techexperties: userData.employeeData.techexperties || [],
      address: userData.employeeData.address || "",
      city: userData.employeeData.city || "",
      state: userData.employeeData.state || "",
      country: userData.employeeData.country || "",
      zipcode: userData.employeeData.zipcode || "",
      emergencypersonname: userData.employeeData.emergencypersonname || "",
      relation: userData.employeeData.relation || "",
      profession: userData.employeeData.profession || "",
      emergencypersonaddress:
        userData.employeeData.emergencypersonaddress || "",
      emergencypersonemail: userData.employeeData.emergencypersonemail || "",
      emergencypersonphone: userData.employeeData.emergencypersonphone || "",
      workexperience: userData.employeeData.workexperience || [
        {
          jobtitle: "",
          companyname: "",
          companylinkedinurl: "",
          employeementtype: "",
          startdate: "",
          enddate: "",
          description: "",
        },
      ],
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

  const handleCheckboxChange = (tech) => {
    if (formData.techexperties.includes(tech)) {
      setFormData({
        ...formData,
        techexperties: formData.techexperties.filter((item) => item !== tech),
      });
    } else {
      setFormData({
        ...formData,
        techexperties: [...formData.techexperties, tech],
      });
    }
  };

  const handleCustomTechChange = (e) => {
    setCustomTech(e.target.value);
  };

  const handleAddCustomTech = () => {
    if (customTech && !formData.techexperties.includes(customTech)) {
      setFormData({
        ...formData,
        techexperties: [...formData.techexperties, customTech],
      });
      setCustomTech("");
    }
  };

  const handleAddExperience = () => {
    setFormData({
      ...formData,
      workexperience: [
        ...formData.workexperience,
        {
          jobtitle: "",
          companyname: "",
          companylinkedinurl: "",
          employeementtype: "",
          startdate: "",
          enddate: "",
          description: "",
        },
      ],
    });
  };

  const handleRemoveExperience = (index) => {
    setFormData({
      ...formData,
      workexperience: formData.workexperience.filter((_, i) => i !== index),
    });
  };

  const handleExperienceChange = (e, index) => {
    const { name, value } = e.target;
    const updatedWorkexperience = [...formData.workexperience];
    const field = name.split(".")[1]; // Extract field name from name attribute
    updatedWorkexperience[index] = {
      ...updatedWorkexperience[index],
      [field]: value,
    };
    setFormData({ ...formData, workexperience: updatedWorkexperience });
  };

  const handleCopyLink = (url) => {
    navigator.clipboard.writeText(url).then(() => {
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
      }, 2000); // Hide the popup after 2 seconds
    });
  };

  const handleOtpKeyDown = (e) => {
    if (e.key === "Enter") {
      handleOtpSubmit(e); // Submit OTP when Enter is pressed
    }
  };

  return (
    <div className="flex flex-col  gap-2 h-full min-h-full pb-20 dark:text-white">
      <div
        className={`flex flex-col lg:flex-row gap-2 h-full  ${
          showPasswordModal ? "md:z-50" : ""
        }`}
      >
        <div className="lg:w-1/3 h-full lg:sticky top-0 bg-white p-2 dark:bg-neutral-950 dark:text-white rounded-md flex flex-col gap-2">
          <div className="flex justify-between">
            <div className="">
              <ProfilePic />
            </div>
            <div>
              {isEditMode ? (
                <div>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="bg-red-200 dark:bg-red-200/15 text-red-500 font-bold px-2 py-1 mr-2 rounded w-fit"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleUpdateClick}
                    className="bg-blue-200 dark:bg-blue-200/15 text-blue-500 font-bold px-2 py-1 rounded w-fit"
                  >
                    Save Details
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-end md:items-stretch md:flex-row gap-2">
                  <button
                    onClick={() => setIsEditMode(true)}
                    className="bg-blue-200 dark:bg-blue-200/15 text-blue-500 font-bold px-2 py-1 rounded w-fit flex items-center gap-1.5 group"
                  >
                    <MdEdit fontSize={15} />
                    Edit Profile
                  </button>

                  <div className="py-2 px-3 rounded-md bg-blue-100 dark:bg-neutral-900 flex items-center gap-2 w-fit">
                    <div>
                      As {userData.employeeData.auth === 0 ? "an" : "a"}
                    </div>
                    <div className="font-bold">
                      {userData.employeeData.auth === 0 ? (
                        <div className="text-purple-700">Employee</div>
                      ) : userData.employeeData.auth === 2 ? (
                        <div className="text-blue-700">HR</div>
                      ) : userData.employeeData.auth === 3 ? (
                        <div className="text-orange-700">Manager</div>
                      ) : (
                        "Unknown"
                      )}
                    </div>
                  </div>
                </div>
              )}

              {showPasswordModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-lg z-50 w-screen">
                  <div className="bg-white dark:bg-neutral-900 p-6  dark:border-2 border-neutral-600 rounded-lg shadow-lg flex flex-col items-center z-50 md:w-1/6 w-full mx-10">
                    <h2 className="text-lg font-bold mb-4">
                      Enter your login password
                    </h2>
                    <form onSubmit={handlePasswordSubmit} className="w-full">
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
                      <div className="flex justify-between gap-2">
                        <button
                          type="submit"
                          className="bg-blue-500/20 text-blue-500 px-4 py-2 rounded-md w-full hover:bg-blue-700/20"
                        >
                          Submit
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowPasswordModal(false);
                            setPasswordError(""); // Clear password error on cancel
                          }}
                          className="bg-gray-500/20  px-4 py-2 rounded-md w-fit"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className=" flex gap-2 items-center">
              <label className="lable w-2/6">Name</label>
              {/* {isEditMode ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="border px-2 py-1 w-3/4 bg-sky-100 dark:bg-neutral-800 rounded-md"
                />
              ) : ( */}
              <strong>{name}</strong>
              {/* )} */}
            </div>
            <div className=" flex gap-2 items-center">
              <label className="lable w-2/5">Employee ID</label>{" "}
              <strong className="w-3/4">{userData.employeeData.empid}</strong>
            </div>
            <div className=" flex gap-2 items-center">
              <label className="lable w-2/5">Email </label>
              <strong className="w-3/4 overflow-scroll scrollbar-hide">
                <a href={`mailto:${email}`} target="_blank">
                  {email}
                </a>
              </strong>
            </div>
            <div className=" flex gap-2 items-center">
              <label className="lable w-2/6">Phone </label>
              {/* {isEditMode ? (
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="border px-2 py-1 w-3/4 bg-sky-100 dark:bg-neutral-800 rounded-md"
                />
              ) : ( */}
              <strong>
                <a href={`tell:${phone}`} target="_blank">
                  {phone}
                </a>
              </strong>
              {/* )} */}
            </div>
          </div>
        </div>
        <div className="lg:w-2/3 h-full overflow-y-scroll scrollbrhdn bg-white p-2 dark:bg-neutral-950 dark:text-white rounded-md flex flex-col gap-2">
          <div className=" bg-sky-100 flex flex-col gap-2 dark:bg-neutral-900 rounded-md p-2">
            <h4 className="text-base font-bold">Personal Details</h4>
            <div className="grid grid-cols-12 gap-2 bg-sky-50 dark:bg-neutral-950 rounded-md p-2">
              <div className="col-span-12 lg:col-span-6 flex gap-2 items-center">
                <label className="w-1/3">DOB</label>
                {isEditMode ? (
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    required
                    className="border px-2 py-1 w-3/4 bg-sky-100 dark:bg-neutral-800 rounded-md"
                  />
                ) : (
                  <strong>{formData.dob}</strong>
                )}
              </div>
              <div className="col-span-12 lg:col-span-6 flex gap-2 items-center">
                <label className="w-1/3">Gender</label>
                {isEditMode ? (
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                    className="border px-2 py-1 w-3/4 bg-sky-100 dark:bg-neutral-800 rounded-md"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                ) : (
                  <strong>{formData.gender}</strong>
                )}
              </div>
              <div className="col-span-12 lg:col-span-6 flex gap-2 items-center">
                <label className="w-1/3">Maritial status</label>
                {isEditMode ? (
                  <select
                    name="maritialstatus"
                    value={formData.maritialstatus}
                    onChange={handleChange}
                    required
                    className="border px-2 py-1 w-3/4 bg-sky-100 dark:bg-neutral-800 rounded-md "
                  >
                    <option value="">Select Maritial Status</option>
                    <option value="single">Single</option>
                    <option value="married">Married</option>
                    <option value="widowed">Widowed</option>
                    <option value="divorced">Divorced</option>
                    <option value="registeredpartnership">
                      Registered Partnership
                    </option>
                  </select>
                ) : (
                  <strong>{formData.maritialstatus}</strong>
                )}
              </div>
              <div className="col-span-12 lg:col-span-6 flex gap-2 items-center">
                <label className="w-1/3">Blood Group</label>
                {isEditMode ? (
                  <select
                    name="bloodgroup"
                    value={formData.bloodgroup}
                    onChange={handleChange}
                    required
                    className="border px-2 py-1 w-3/4 bg-sky-100 dark:bg-neutral-800 rounded-md"
                  >
                    <option value="">Select Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                ) : (
                  <strong>{formData.bloodgroup}</strong>
                )}
              </div>
            </div>
          </div>

          <div className=" bg-sky-100 flex flex-col gap-2 dark:bg-neutral-900 rounded-md p-2 ">
            <h4 className="text-base font-bold">Employment Information</h4>
            <div className="grid grid-cols-12 items-start gap-2 bg-sky-50 dark:bg-neutral-950 rounded-md p-2">
              <div className="col-span-12 lg:col-span-6 flex gap-2 items-center">
                <label className="w-1/3">Designation</label>
                {/* {isEditMode ? (
                  <select
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                    required
                    className="border px-2 py-1 w-3/4 bg-sky-100 dark:bg-neutral-800 rounded-md"
                  >
                    <option value="">Select Designation</option>
                    <option value="Junior Developer">Junior Developer</option>
                    <option value="Senior Developer">Senior Developer</option>
                    <option value="Team Lead">Team Lead</option>
                    <option value="Project Manager">Project Manager</option>
                    <option value="QA Engineer">QA Engineer</option>
                    <option value="UI/UX Designer">UI/UX Designer</option>
                    <option value="Product Manager">Product Manager</option>
                  </select>
                ) : ( */}
                <strong>{formData.designation}</strong>
                {/* )} */}
              </div>
              <div className="col-span-12 lg:col-span-6 flex gap-2 items-center">
                <label className="w-1/3">Date of Joining</label>
                {/* {isEditMode ? (
                  <input
                    type="date"
                    name="dateofjoining"
                    value={formData.dateofjoining}
                    onChange={handleChange}
                    required
                    className="border px-2 py-1 w-3/4 bg-sky-100 dark:bg-neutral-800 rounded-md"
                  />
                ) : ( */}
                <strong>{formData.dateofjoining}</strong>
                {/* )} */}
              </div>
              <div className="col-span-12 lg:col-span-6 flex gap-2 items-center">
                <label className="w-1/3">Department</label>

                {/* {isEditMode ? (
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    required
                    className="border px-2 py-1 w-3/4 bg-sky-100 dark:bg-neutral-800 rounded-md"
                  >
                    <option value="">Select Department</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Sales">Sales</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="Finance">Finance</option>
                    <option value="Operations">Operations</option>
                    <option value="Customer Support">Customer Support</option>
                    <option value="IT">IT</option>
                    <option value="Administration">Administration</option>
                  </select>
                ) : ( */}
                <strong>{formData.department}</strong>
                {/* )} */}
              </div>
              <div className="col-span-12 lg:col-span-6 flex gap-2 items-center">
                <label className="w-1/3">Reporting To </label>
                {/* {isEditMode ? (
                  <select
                    name="reportingto"
                    value={formData.reportingto}
                    onChange={handleChange}
                    required
                    className="border px-2 py-1 w-3/4 bg-sky-100 dark:bg-neutral-800 rounded-md"
                  >
                    <option value="">Select Reporting Person</option>
                    <option value="Swapnil Patil">Swapnil Patil</option>
                    <option value="Manish Sharma">Manish Sharma</option>
                    <option value="Sheetal Patil">Sheetal Patil</option>
                    <option value="Nitin Ahire">Nitin Ahire</option>
                    <option value="Laxman Sahu">Laxman Sahu</option>
                  </select>
                ) : ( */}
                <strong>{formData.reportingto}</strong>
                {/* )} */}
              </div>
              <div className="col-span-12 lg:col-span-6 flex gap-2 items-center">
                <label className="w-1/3">Team Leader</label>
                {/* {isEditMode ? (
                  <select
                    name="teamleader"
                    value={formData.teamleader}
                    onChange={handleChange}
                    required
                    className="border px-2 py-1 w-3/4 bg-sky-100 dark:bg-neutral-800 rounded-md"
                  >
                    <option value="">Select Team Leader</option>
                    <option value="Swapnil Patil">Swapnil Patil</option>
                    <option value="Manish Sharma">Manish Sharma</option>
                    <option value="Sheetal Patil">Sheetal Patil</option>
                    <option value="Nitin Ahire">Nitin Ahire</option>
                    <option value="Laxman Sahu">Laxman Sahu</option>
                  </select>
                ) : ( */}
                <strong>{formData.teamleader}</strong>
                {/* )} */}
              </div>
              <div className="col-span-6 flex gap-2 justify-between items-center"></div>
              <div className="col-span-12 flex gap-2 flex-row justify-between items-start">
                <label className="w-1/3 lg:w-1/6 ">Tech Experties</label>
                {isEditMode ? (
                  <div className="w-3/4 lg:w-full lg:pl-2">
                    <div className="flex flex-row flex-wrap mb-2 gap-2 ">
                      {predefinedTech.map((tech) => (
                        <label key={tech} className="flex items-center gap-1">
                          <input
                            type="checkbox"
                            checked={formData.techexperties.includes(tech)}
                            onChange={() => handleCheckboxChange(tech)}
                            className="hidden"
                          />
                          <span className="custom-checkbox">
                            {formData.techexperties.includes(tech) && (
                              <FaCheck className="text-white w-3.5 h-3.5 font-extrabold" />
                            )}
                          </span>
                          <span>{tech}</span>
                        </label>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 bg-sky-100 dark:bg-neutral-800 rounded-md px-1.5">
                      <input
                        type="text"
                        value={customTech}
                        onChange={handleCustomTechChange}
                        className="border py-2 w-full bg-sky-100 dark:bg-neutral-800 rounded-md "
                      />
                      <button className="cursor-pointer bg-sky-200 dark:bg-neutral-950 p-1 rounded-md">
                        <FaPlus
                          type="button"
                          onClick={handleAddCustomTech}
                          fontSize={17}
                        />
                      </button>
                    </div>
                    <ul className="mt-2 flex gap-2 flex-wrap">
                      {formData.techexperties.map((tech, index) => (
                        <li
                          key={index}
                          className="flex gap-1.5 justify-between items-center bg-green-200 dark:bg-green-200/15 text-green-600 rounded-md font-bold py-1 px-1.5  "
                        >
                          <span>{tech}</span>
                          <button
                            type="button"
                            onClick={() => handleCheckboxChange(tech)}
                            className=""
                          >
                            <IoClose
                              className="bg-green-400/15 font-bold rounded-md  "
                              fontSize={20}
                            />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <ul className="flex flex-row items-center gap-2 flex-wrap w-full ml-5">
                    {formData.techexperties.map((tech, index) => (
                      <li
                        key={index}
                        className="dark:bg-neutral-900 bg-sky-200 font-bold rounded-md px-2 py-1"
                      >
                        <span>{tech}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
          <div className=" bg-sky-100 flex flex-col gap-2 dark:bg-neutral-900 rounded-md p-2">
            <h4 className="text-base font-bold">Contact Information</h4>
            <div className="grid grid-cols-12 items-start gap-2 bg-sky-50 dark:bg-neutral-950 rounded-md p-2">
              <div className="col-span-12 lg:col-span-6 flex gap-2 items-center">
                <label className="w-1/3  ">Address</label>
                {isEditMode ? (
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    rows="2"
                    className="border px-2 py-1 w-3/4 bg-sky-100 dark:bg-neutral-800 rounded-md "
                  />
                ) : (
                  <strong className="w-2/3">{formData.address}</strong>
                )}
              </div>
              <div className=" col-span-12 lg:col-span-6 flex gap-2 items-center">
                <label className="w-1/3">City</label>
                {isEditMode ? (
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="border px-2 py-1 w-3/4 bg-sky-100 dark:bg-neutral-800 rounded-md"
                  />
                ) : (
                  <strong>{formData.city}</strong>
                )}
              </div>
              <div className="col-span-12 lg:col-span-6 flex gap-2 items-center">
                <label className="w-1/3">State</label>
                {isEditMode ? (
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    className="border px-2 py-1 w-3/4 bg-sky-100 dark:bg-neutral-800 rounded-md"
                  >
                    <option value="" disabled>
                      Select a state
                    </option>
                    <option value="Andhra Pradesh">Andhra Pradesh</option>
                    <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                    <option value="Assam">Assam</option>
                    <option value="Bihar">Bihar</option>
                    <option value="Chhattisgarh">Chhattisgarh</option>
                    <option value="Goa">Goa</option>
                    <option value="Gujarat">Gujarat</option>
                    <option value="Haryana">Haryana</option>
                    <option value="Himachal Pradesh">Himachal Pradesh</option>
                    <option value="Jharkhand">Jharkhand</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Kerala">Kerala</option>
                    <option value="Madhya Pradesh">Madhya Pradesh</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Manipur">Manipur</option>
                    <option value="Meghalaya">Meghalaya</option>
                    <option value="Mizoram">Mizoram</option>
                    <option value="Nagaland">Nagaland</option>
                    <option value="Odisha">Odisha</option>
                    <option value="Punjab">Punjab</option>
                    <option value="Rajasthan">Rajasthan</option>
                    <option value="Sikkim">Sikkim</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Telangana">Telangana</option>
                    <option value="Tripura">Tripura</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                    <option value="Uttarakhand">Uttarakhand</option>
                    <option value="West Bengal">West Bengal</option>
                  </select>
                ) : (
                  <strong>{formData.state}</strong>
                )}
              </div>
              <div className="col-span-12 lg:col-span-6 flex gap-2 items-center">
                <label className="w-1/3">Country</label>
                {isEditMode ? (
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    required
                    className="border px-2 py-1 w-3/4 bg-sky-100 dark:bg-neutral-800 rounded-md"
                  >
                    <option value="" disabled>
                      Select a country
                    </option>
                    <option value="India">India</option>
                    <option value="Afghanistan">Afghanistan</option>
                    <option value="Australia">Australia</option>
                    <option value="Bangladesh">Bangladesh</option>
                    <option value="Brazil">Brazil</option>
                    <option value="Canada">Canada</option>
                    <option value="China">China</option>
                    <option value="France">France</option>
                    <option value="Germany">Germany</option>
                    <option value="Japan">Japan</option>
                    <option value="Mexico">Mexico</option>
                    <option value="Nepal">Nepal</option>
                    <option value="Pakistan">Pakistan</option>
                    <option value="Russia">Russia</option>
                    <option value="South Africa">South Africa</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="United States">United States</option>
                  </select>
                ) : (
                  <strong>{formData.country}</strong>
                )}
              </div>
              <div className="col-span-12 lg:col-span-6 flex gap-2 items-center">
                <label className="w-1/3">Zipcode</label>
                {isEditMode ? (
                  <input
                    type="number"
                    name="zipcode"
                    value={formData.zipcode}
                    onChange={handleChange}
                    required
                    className="border px-2 py-1 w-3/4 bg-sky-100 dark:bg-neutral-800 rounded-md"
                  />
                ) : (
                  <strong>{formData.zipcode}</strong>
                )}
              </div>
            </div>
          </div>
          <div className=" bg-sky-100 flex flex-col gap-2 dark:bg-neutral-900 rounded-md p-2">
            <h4 className="text-base font-bold">Emergency Contacts</h4>
            <div className="grid grid-cols-12 items-start gap-2 bg-sky-50 dark:bg-neutral-950 rounded-md p-2">
              <div className="col-span-12 lg:col-span-6 flex gap-2 items-center">
                <label className="w-1/3">Person Name</label>
                {isEditMode ? (
                  <input
                    type="text"
                    name="emergencypersonname"
                    value={formData.emergencypersonname}
                    onChange={handleChange}
                    required
                    className="border px-2 py-1 w-3/4 bg-sky-100 dark:bg-neutral-800 rounded-md"
                  />
                ) : (
                  <strong>{formData.emergencypersonname}</strong>
                )}
              </div>
              <div className="col-span-12 lg:col-span-6 flex gap-2 items-center">
                <label className="w-1/3">Relation</label>
                {isEditMode ? (
                  <select
                    name="relation"
                    value={formData.relation}
                    onChange={handleChange}
                    required
                    className="border px-2 py-1 w-3/4 bg-sky-100 dark:bg-neutral-800 rounded-md"
                  >
                    <option value="" disabled>
                      Select Relation
                    </option>
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Brother">Brother</option>
                    <option value="Sister">Sister</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Friend">Friend</option>
                    <option value="Colleague">Colleague</option>
                    <option value="Other">Other</option>
                  </select>
                ) : (
                  <strong>{formData.relation}</strong>
                )}
              </div>
              <div className="col-span-12 lg:col-span-6 flex gap-2 items-center">
                <label className="w-1/3">Profession</label>
                {isEditMode ? (
                  <select
                    name="profession"
                    value={formData.profession}
                    onChange={handleChange}
                    required
                    className="border px-2 py-1 w-3/4 bg-sky-100 dark:bg-neutral-800 rounded-md"
                  >
                    <option value="" disabled>
                      Select Profession
                    </option>
                    <option value="Software Engineer">Software Engineer</option>
                    <option value="Data Scientist">Data Scientist</option>
                    <option value="Product Manager">Product Manager</option>
                    <option value="Designer">Designer</option>
                    <option value="Analyst">Analyst</option>
                    <option value="Consultant">Consultant</option>
                    <option value="Sales Manager">Sales Manager</option>
                    <option value="Marketing Manager">Marketing Manager</option>
                    <option value="HR Manager">HR Manager</option>
                    <option value="Other">Other</option>
                  </select>
                ) : (
                  <strong>{formData.profession}</strong>
                )}
              </div>
              <div className="col-span-12 lg:col-span-6 flex gap-2 items-center">
                <label className="w-1/3">Person Address</label>
                {isEditMode ? (
                  <input
                    type="text"
                    name="emergencypersonaddress"
                    value={formData.emergencypersonaddress}
                    onChange={handleChange}
                    required
                    className="border px-2 py-1 w-3/4 bg-sky-100 dark:bg-neutral-800 rounded-md"
                  />
                ) : (
                  <strong>{formData.emergencypersonaddress}</strong>
                )}
              </div>
              <div className="col-span-12 lg:col-span-6 flex gap-2 items-center">
                <label className="w-1/3">Person Email</label>
                {isEditMode ? (
                  <input
                    type="email"
                    name="emergencypersonemail"
                    value={formData.emergencypersonemail}
                    onChange={handleChange}
                    required
                    className="border px-2 py-1 w-3/4 bg-sky-100 dark:bg-neutral-800 rounded-md"
                  />
                ) : (
                  <strong>
                    <a
                      href={`mailto:${formData.emergencypersonemail}`}
                      target="_blank"
                    >
                      {formData.emergencypersonemail}
                    </a>
                  </strong>
                )}
              </div>
              <div className="col-span-12 lg:col-span-6 flex gap-2 items-center">
                <label className="w-1/3">Person Phone</label>
                {isEditMode ? (
                  <input
                    type="number"
                    name="emergencypersonphone"
                    value={formData.emergencypersonphone}
                    onChange={handleChange}
                    required
                    className="border px-2 py-1 w-3/4 bg-sky-100 dark:bg-neutral-800 rounded-md"
                  />
                ) : (
                  <strong>{formData.emergencypersonphone}</strong>
                )}
              </div>
            </div>
          </div>
          <div className=" bg-sky-100 flex flex-col gap-2 dark:bg-neutral-900 rounded-md p-2">
            <div className="flex flex-col gap-4">
              <h4 className="text-base font-bold">Work Experiences</h4>
              {formData.workexperience.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {formData.workexperience.map((experience, index) => (
                    <div key={index} className="flex gap-2 flex-col">
                      <div className=" flex gap-2 items-center bg-sky-50 dark:bg-neutral-950 rounded-t-md p-2 w-fit -mb-2">
                        {/* <strong>Experience {index + 1}</strong> */}
                        <h4 className="bg-sky-50 dark:bg-neutral-950 rounded-t-md col-span-12 font-semibold w-fit flex gap-2 items-center text-sm">
                          <span className="bg-sky-200 dark:bg-neutral-800 px-2 py-0.5 rounded-md">
                            {index + 1}
                          </span>{" "}
                          Experience
                        </h4>
                        {isEditMode && (
                          <button
                            type="button"
                            onClick={() => handleRemoveExperience(index)}
                            className="hover:bg-red-200/15 text-red-500 p-1 rounded-md flex items-center gap2"
                          >
                            <TiMinus fontSize={18} />
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-12 items-start gap-2 bg-sky-50 dark:bg-neutral-950 rounded-tl-none rounded-md p-2">
                        <div className="col-span-12 lg:col-span-6 flex gap-2 items-center">
                          <label className="w-1/3">Job Title</label>
                          {isEditMode ? (
                            <input
                              type="text"
                              name={`workexperience[${index}].jobtitle`}
                              value={experience.jobtitle || ""}
                              onChange={(e) => handleExperienceChange(e, index)}
                              required
                              className="border px-2 py-1 w-3/4 bg-sky-100 dark:bg-neutral-800 rounded-md"
                            />
                          ) : (
                            <strong>{experience.jobtitle}</strong>
                          )}
                        </div>

                        <div className="col-span-12 lg:col-span-6 flex gap-2 items-center">
                          <label className="w-1/3">Company Name</label>
                          {isEditMode ? (
                            <input
                              type="text"
                              name={`workexperience[${index}].companyname`}
                              value={experience.companyname || ""}
                              onChange={(e) => handleExperienceChange(e, index)}
                              required
                              className="border px-2 py-1 w-3/4 bg-sky-100 dark:bg-neutral-800 rounded-md"
                            />
                          ) : (
                            <strong>{experience.companyname}</strong>
                          )}
                        </div>

                        <div className="col-span-12 lg:col-span-6 flex gap-2 items-center">
                          <label className="w-1/3">LinkedIn URL</label>
                          {isEditMode ? (
                            <input
                              type="text"
                              name={`workexperience[${index}].companylinkedinurl`}
                              value={experience.companylinkedinurl}
                              onChange={(e) => handleExperienceChange(e, index)}
                              required
                              className="border px-2 py-1 w-3/4 bg-sky-100 dark:bg-neutral-800 rounded-md"
                            />
                          ) : (
                            <strong>
                              <div className="flex items-center gap-2">
                                <a
                                  href={experience.companylinkedinurl}
                                  className="text-blue-500 bg-blue-200 dark:bg-blue-200/15 p-2 rounded-md"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <FaExternalLinkAlt />
                                </a>
                                <button
                                  className=" text-green-600 bg-green-200 dark:bg-green-200/15 p-2 rounded-md"
                                  onClick={() =>
                                    handleCopyLink(
                                      experience.companylinkedinurl
                                    )
                                  }
                                >
                                  <FaCopy />
                                </button>
                              </div>
                              {showPopup && (
                                <div className="fixed bottom-4 right-4 bg-green-500/20 text-green-500 px-4 py-2 rounded">
                                  Link copied to clipboard!
                                </div>
                              )}
                            </strong>
                          )}
                        </div>

                        <div className="col-span-12 lg:col-span-6 flex gap-2 items-center">
                          <label className="w-1/3">Employment Type</label>
                          {isEditMode ? (
                            <select
                              type="text"
                              name={`workexperience[${index}].employeementtype`}
                              value={experience.employeementtype}
                              onChange={(e) => handleExperienceChange(e, index)}
                              required
                              className="border px-2 py-1 w-3/4 bg-sky-100 dark:bg-neutral-800 rounded-md"
                            >
                              <option value="">Select an option</option>
                              <option value="Full-time">Full-time</option>
                              <option value="Part-time">Part-time</option>
                              <option value="Contract">Contract</option>
                              <option value="Internship">Internship</option>
                              {/* Add other options as needed */}
                            </select>
                          ) : (
                            <strong>{experience.employeementtype}</strong>
                          )}
                        </div>

                        <div className="col-span-12 lg:col-span-6 flex gap-2 items-center">
                          <label className="w-1/3">Start Date</label>
                          {isEditMode ? (
                            <input
                              type="date"
                              name={`workexperience[${index}].startdate`}
                              value={experience.startdate || ""}
                              onChange={(e) => handleExperienceChange(e, index)}
                              required
                              className="border px-2 py-1 w-3/4 bg-sky-100 dark:bg-neutral-800 rounded-md"
                            />
                          ) : (
                            <strong>{experience.startdate}</strong>
                          )}
                        </div>

                        <div className="col-span-12 lg:col-span-6 flex gap-2 items-center">
                          <label className="w-1/3">End Date</label>
                          {isEditMode ? (
                            <input
                              type="date"
                              name={`workexperience[${index}].enddate`}
                              value={experience.enddate || ""}
                              onChange={(e) => handleExperienceChange(e, index)}
                              required
                              className="border px-2 py-1 w-3/4 bg-sky-100 dark:bg-neutral-800 rounded-md"
                            />
                          ) : (
                            <strong>{experience.enddate}</strong>
                          )}
                        </div>

                        <div className="col-span-12 flex gap-2 items-center">
                          <label className="w-2/5 lg:w-2/12">Description</label>
                          {isEditMode ? (
                            <textarea
                              name={`workexperience[${index}].description`}
                              value={experience.description || ""}
                              onChange={(e) => handleExperienceChange(e, index)}
                              required
                              className="border px-2 py-1 w-4/5 lg:w-10/12 bg-sky-100 dark:bg-neutral-800 rounded-md"
                              rows="3" // Adjust the number of rows as needed
                            />
                          ) : (
                            <strong>{experience.description}</strong>
                          )}
                        </div>
                      </div>

                      {/* Add similar blocks for other fields like companylinkedinurl, employeementtype, etc. */}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-blue-50 dark:bg-neutral-950 p-3 rounded-md flex items-center justify-center h-32">
                  No found Experience
                </div>
              )}

              {isEditMode && (
                <button
                  type="button"
                  onClick={handleAddExperience}
                  className="bg-green-500/20 text-green-600 font-bold  p-2 rounded-md"
                >
                  Add Experience
                </button>
              )}
            </div>
          </div>
        </div>
        <div className=" absolute top-0 md:w-[75%] w-[92%]  flex items-center justify-center z-50">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: 1, y: 15 }}
              exit={{ opacity: 0, y: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute top-4 text-red-500 border border-red-500/10 bg-red-500/10 py-2 px-4 w-fit rounded-md text-center flex items-center gap-2"
            >
              <FaFaceSadTear fontSize={20} />
              {error}
            </motion.div>
          )}
        </div>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: 15 }}
            exit={{ opacity: 0, y: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute top-4 text-green-500 border border-green-500/10 bg-green-500/10 py-2 px-4 w-fit rounded-md text-center flex items-center gap-2"
          >
            <BiSolidHappyHeartEyes fontSize={20} />
            {successMessage}
          </motion.div>
        )}

        {/* Code Modal Popup */}
        {showOtpPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-xl flex justify-center items-center z-50">
            <div className="bg-white dark:bg-neutral-900 dark:border-2 border-neutral-600 px-4 py-10 md:py-4 rounded-lg shadow-xl max-w-sm w-full flex flex-col items-center gap-2">
              <BsFillShieldLockFill fontSize={40} className="text-blue-500" />
              <h3 className="text-2xl font-semibold text-center text-gray-800 dark:text-gray-200">
                Verify Your Code
              </h3>
              <p className="text-center text-gray-600 dark:text-gray-400">
                Please enter the Code sent to your email.
              </p>

              <div className="flex justify-center gap-2 mt-4">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    type="number"
                    maxLength="1"
                    className="w-12 h-12 text-center text-lg font-bold rounded-lg dark:bg-neutral-700 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={digit}
                    onChange={(e) => handleOtpChange(e, index)}
                    onKeyDown={(e) => {
                      handleBackspace(e, index);
                      handleOtpKeyDown(e);
                    }}
                    onPaste={handlePaste}
                    ref={(el) => (inputRefs.current[index] = el)}
                  />
                ))}
              </div>
              <button
                onClick={handleOtpSubmit}
                className="bg-blue-600/20 rounded-lg text-base text-blue-500 font-semibold hover:bg-blue-700/20 w-full transition duration-200 mt-10"
                disabled={loading || timer === 0}
              >
                {loading ? (
                  <div className="py- mt-2.5">
                    <l-leapfrog
                      size="40"
                      speed="2.5"
                      color="#285999"
                    ></l-leapfrog>
                  </div>
                ) : (
                  <h4 className="py-3">Verify Code</h4>
                )}
              </button>
              <div className="flex gap-2 w-full justify-between">
                {/* timer */}
                <p
                  className={`text-center font-bold flex gap-1 ${
                    timer > 120
                      ? "text-green-500" // More than 2 minutes
                      : timer > 60
                      ? "text-yellow-500" // More than 1 minute
                      : timer > 20
                      ? "text-orange-500" // More than 20 seconds
                      : "text-red-500" // Less than 20 seconds
                  }`}
                >
                  <div>
                    {Math.floor(timer / 60)}:
                    {String(timer % 60).padStart(2, "0")}
                  </div>
                  {timer < 60 ? "Sec " : "Min "}
                  remaining
                </p>
                {/* resend code */}
                <p>
                  Don't get Code?
                  <button
                    onClick={resendcode}
                    className="text-blue-600 font-bold hover:px-1 hover:bg-blue-500/20 duration-500 rounded-md"
                  >
                    Resend
                  </button>
                </p>
              </div>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 0 }}
                  animate={{ opacity: 1, y: 15 }}
                  exit={{ opacity: 0, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute top-4 text-red-500 border border-red-500/10 bg-red-500/10 py-2 px-4 w-fit rounded-md text-center flex items-center gap-2"
                >
                  <FaFaceSadTear fontSize={20} />
                  {error}
                </motion.div>
              )}
              {message && (
                <motion.div
                  initial={{ opacity: 0, y: 0 }}
                  animate={{ opacity: 1, y: 15 }}
                  exit={{ opacity: 0, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute top-4 text-green-500 border border-green-500/10 bg-green-500/10 py-2 px-4 w-fit rounded-md text-center flex items-center gap-2"
                >
                  <BiSolidHappyHeartEyes fontSize={20} />
                  {message}
                </motion.div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
