import React, { useState, useContext, useEffect, useRef } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import demoprofile from "../../../src/assets/images/clientAvatar.png";
import { FaUserEdit } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { IoMdTrash } from "react-icons/io";
import { FaUpload } from "react-icons/fa6";
import { TiMinus } from "react-icons/ti";
import ApiendPonits from "../../api/APIEndPoints.json";

const ProfilePic = () => {
  const { userData } = useContext(AuthContext);
  const token = localStorage.getItem("accessToken");
  const empid = userData.employeeData._id;

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasProfile, setHasProfile] = useState(false);
  const [editing, setEditing] = useState(false); // New state for toggling edit forms
  const [selectedFile, setSelectedFile] = useState(null); // New state for selected file

  // Create refs for file inputs
  const uploadFileInputRef = useRef(null);
  const updateFileInputRef = useRef(null);

  // Fetch profile on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const response = await fetch(ApiendPonits.viewProfile, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ Employee_id: empid }),
        });

        const data = await response.json();

        if (response.ok) {
          setProfile(data.data);
          setHasProfile(true);
        } else {
          setProfile(demoprofile);
          setHasProfile(false);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [empid, token]);

  const handleFileChange = (event, setFile) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("Employee_id", empid);

    try {
      const response = await fetch(ApiendPonits.uploadProfile, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setProfile(data.data);
        setHasProfile(true);
        setEditing(false); // Hide edit forms after upload
        setSelectedFile(null); // Clear selected file
        location.reload();
      } else {
        setError(data.msg);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(ApiendPonits.deleteProfile, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Employee_id: empid }),
      });

      const data = await response.json();
      if (response.ok) {
        setProfile(null);
        setHasProfile(false);
        setEditing(false); // Hide edit forms after deletion
        location.reload();
      } else {
        setError(data.msg);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("Employee_id", empid);

    try {
      const response = await fetch(ApiendPonits.updateProfile, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setProfile(data.data);
        setEditing(false); // Hide edit forms after update
        setSelectedFile(null); // Clear selected file
        location.reload();
      } else {
        setError(data.msg);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className=" bg-sky-100 dark:bg-neutral-900 p-2 rounded-md flex flex-col gap-2">
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <div className="  flex flex-col gap-2">
        <div>
          {profile && (
            <img
              src={profile.profileUrl ? profile.profileUrl : profile}
              alt="Profile"
              className="w-40 h-auto rounded-lg"
            />
          )}
        </div>
        <div className="flex gap-2">
          <button onClick={() => setEditing(!editing)}>
            {editing ? (
              <span className="flex items-center bg-red-500/20 py-1 px-1.5 rounded-md gap-1 text-sm text-red-500">
                <IoClose fontSize={18} />
                Cancel
              </span>
            ) : (
              <span className="flex items-center bg-blue-500/20 py-1 px-1.5 rounded-md gap-1 text-sm text-blue-500">
                <FaUserEdit fontSize={18} />
                Edit
              </span>
            )}
          </button>
          {editing && <div></div>}
        </div>
      </div>

      {editing && (
        <>
          {!hasProfile ? (
            <form onSubmit={handleUpload} className="flex flex-col gap-2">
              <div className="flex gap-2">
                <input
                  type="file"
                  name="file"
                  id="upload-avatar"
                  accept="image/*"
                  ref={uploadFileInputRef}
                  onChange={(event) => handleFileChange(event, setSelectedFile)}
                  className="bg-blue-500/15 w-32 py-1 px-2 rounded-md"
                />
                {selectedFile && (
                  <button
                    className="bg-blue-500/15 text-blue-500 px-2 rounded-md"
                    type="button"
                    onClick={() => {
                      uploadFileInputRef.current.value = "";
                      setSelectedFile(null);
                    }}
                  >
                    <TiMinus />
                  </button>
                )}
              </div>
              <div className="bg-blue-500/15 text-blue-500 font-bold flex items-center bg-white dark:bg-neutral-800 justify-center hover:bg-blue-500/20 py-1 px-1.5 rounded-md gap-1 text-sm ">
                <button type="submit" className="flex items-center gap-2">
                  <FaUpload size={16} />
                  Upload Profile
                </button>
              </div>
            </form>
          ) : (
            <>
              <form onSubmit={handleUpdate} className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <input
                    type="file"
                    name="file"
                    id="upload-avatar"
                    accept="image/*"
                    ref={updateFileInputRef}
                    onChange={(event) =>
                      handleFileChange(event, setSelectedFile)
                    }
                    className="bg-blue-500/15 w-32 py-1 px-2 rounded-md"
                  />

                  {selectedFile && (
                    <button
                      className="bg-blue-500/15 text-blue-500 px-2 rounded-md"
                      type="button"
                      onClick={() => {
                        updateFileInputRef.current.value = "";
                        setSelectedFile(null);
                      }}
                    >
                      <TiMinus />
                    </button>
                  )}
                </div>
                <div className="bg-blue-500/15 text-blue-500 font-bold flex items-center bg-white dark:bg-neutral-800 justify-center hover:bg-blue-500/20 py-1 px-1.5 rounded-md gap-1 text-sm ">
                  <button type="submit" className="flex items-center gap-2">
                    <FaUpload size={16} />
                    New Profile
                  </button>
                </div>
                {/* <button type="submit">New Profile</button> */}
              </form>
              <button
                onClick={handleDelete}
                className="flex items-center bg-white dark:bg-neutral-800 justify-center hover:bg-red-500/20 py-1 px-1.5 rounded-md gap-1 text-sm text-red-500"
              >
                <IoMdTrash fontSize={18} />
                Delete Profile
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default ProfilePic;