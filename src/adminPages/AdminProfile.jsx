import { useContext } from "react";
import { AuthContext } from "../provider/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Loading from "../components/Loading";

const AdminProfile = () => {
  const { user, isAdmin } = useContext(AuthContext);

  if (!isAdmin)
    return (
      <div className="text-center text-xl font-semibold text-red-600 mt-10">
        You are not authorized to access this page
      </div>
    );

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", user.email],
    queryFn: () => axios.get(`http://localhost:5000/admin/${user.email}`),
  });

  if (isLoading) return <Loading />;
  if (error)
    return (
      <div className="text-center text-xl font-semibold text-red-600 mt-10">
        Error: {error.message}
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      {/* Profile Section */}
      <div className="max-w-lg mx-auto bg-white p-6 shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Admin Profile
        </h1>

        {/* Profile Info */}
        <div className="space-y-4">
          <p className="text-lg text-gray-700">
            <strong>Name:</strong> {data.data.name}
          </p>
          <p className="text-lg text-gray-700">
            <strong>Email:</strong> {data.data.email}
          </p>
          <p className="text-lg text-gray-700">
            <strong>No of Meals Added:</strong> {data.data.noOfMealsAdded}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
