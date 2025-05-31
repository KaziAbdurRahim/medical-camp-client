import React, { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Loading from "../components/Loading";
import { AuthContext } from "../provider/AuthProvider";

const UserProfile = () => {
  const { user } = useContext(AuthContext); // Access user from AuthContext
  const userEmail = user?.email;

  // Fetch user data using Tanstack React Query
  const { data, isLoading, error } = useQuery({
    queryKey: ["user", userEmail], // Use queryKey instead of passing an array directly
    queryFn: () =>
      axios
        .get(`http://localhost:5000/users/${userEmail}`)
        .then((res) => res.data.user),
    enabled: !!userEmail, // Only fetch if userEmail is available
  });

  // Error handling
  if (error)
    return (
      <div className="text-center text-red-600">Error: {error.message}</div>
    );

  // Loading state
  if (isLoading) return <Loading />;

  // Destructure user data
  const { name, email, badge } = data || {};

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-3xl mx-auto bg-white p-6 shadow-lg rounded-lg">
        {/* Title */}
        <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
          My Profile
        </h1>

        {/* Profile Details */}
        <div className="flex flex-col items-center md:flex-row md:items-start md:space-x-6">
          {/* Profile Image */}
          <img
            src={
              user?.photoURL ||
              "https://cdn.pixabay.com/photo/2015/03/04/22/35/avatar-659652_640.png"
            }
            alt="User Profile"
            className="w-32 h-32 rounded-full border-4 border-blue-500 shadow-lg"
          />
          <div className="mt-4 md:mt-0">
            {/* User Information */}
            <p className="text-2xl font-semibold text-gray-800">{name}</p>
            <p className="text-lg text-gray-600">{email}</p>

            {/* Badges */}
            <div className="mt-4">
              {badge && (
                <p className="badge badge-primary text-white py-1 px-4 rounded-full shadow-md">
                  {badge}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
