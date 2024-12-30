import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProfilePage = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedDetails, setUpdatedDetails] = useState({});

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/getuser/676bd65c12abce13c4dad71e`, {
        withCredentials: true, // Important for sending cookies with the request
      });
      setUserDetails(response.data.userData);
      setUpdatedDetails(response.data);
    } catch (error) {
      console.error("Error fetching user details:", error);
      // Optionally redirect to login page
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedDetails({ ...updatedDetails, [name]: value });
  };

  const handleSave = async () => {
    try {
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/user/updateuser`, updatedDetails, {
        withCredentials: true,
      });
      setUserDetails(updatedDetails);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating user details:", error);
    }x
  };

  if (!userDetails) {
    return <div className="text-center text-lg font-semibold">Loading...</div>;
  }

   console.log(userDetails)

  return (
    <div className="max-w-4xl mx-auto p-4">
    <div className="flex flex-col items-center">
      <img
        src={userDetails.profilePicture || "/default-profile.png"}
        alt="Profile"
        className="w-32 h-32 rounded-full border border-gray-300"
      />
      <h1 className="text-2xl font-bold mt-4">{userDetails.username}</h1>
    </div>

    <div className="mt-6 bg-white shadow-md rounded-lg p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700">Email</label>
          {isEditing ? (
            <input
              type="email"
              name="email"
              value={updatedDetails.email}
              onChange={handleInputChange}
              className="mt-1 w-full border rounded px-3 py-2"
            />
          ) : (
            <p>{userDetails.email}</p>
          )}
        </div>

        <div>
          <label className="block text-gray-700">Mobile</label>
          {isEditing ? (
            <input
              type="text"
              name="mobile"
              value={updatedDetails.mobile}
              onChange={handleInputChange}
              className="mt-1 w-full border rounded px-3 py-2"
            />
          ) : (
            <p>{userDetails.mobile}</p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label className="block text-gray-700">Bio</label>
          {isEditing ? (
            <textarea
              name="bio"
              value={updatedDetails.bio}
              onChange={handleInputChange}
              className="mt-1 w-full border rounded px-3 py-2"
            ></textarea>
          ) : (
            <p>{userDetails.bio}</p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label className="block text-gray-700">Social Links</label>
          {isEditing ? (
            <input
              type="text"
              name="socialLinks"
              value={updatedDetails.socialLinks}
              onChange={handleInputChange}
              className="mt-1 w-full border rounded px-3 py-2"
            />
          ) : (
            <p>{userDetails.socialLinks}</p>
          )}
        </div>
      </div>

      <div className="mt-4">
        <h2 className="text-lg font-semibold">Events</h2>
        <ul className="list-disc ml-6">
          <li>Hosted: {userDetails.hostedEvents.length}</li>
          <li>Attended: {userDetails.attendedEvents.length}</li>
          {/* <li>Registered: {userDetails.registeredEvents.length}</li> */}
          {/* <li>Saved: {userDetails.savedEvents.length}</li> */}
        </ul>
      </div>

      <div className="mt-6 flex justify-end gap-4">
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Save
            </button>
            <button
              onClick={handleEditToggle}
              className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={handleEditToggle}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Edit Profile
          </button>
        )}
      </div>
    </div>
  </div>
  );
};

export default ProfilePage;
