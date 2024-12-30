import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProfilePage = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedDetails, setUpdatedDetails] = useState({});

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/getuser`, {
        withCredentials: true, // Important for sending cookies with the request
      });
      setUserDetails(response.data);
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
    }
  };

  if (!userDetails) {
    return <div className="text-center text-lg font-semibold">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Profile Page UI */}
    </div>
  );
};

export default ProfilePage;
