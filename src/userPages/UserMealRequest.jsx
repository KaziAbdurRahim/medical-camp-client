import React, { useContext, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { AuthContext } from "../provider/AuthProvider";
import Loading from "../components/Loading";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const UserMealRequest = () => {
  const { user } = useContext(AuthContext); // Access user from AuthContext
  const userEmail = user?.email;
  const queryClient = useQueryClient(); // Initialize Query Client
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  // Fetch meal requests using React Query
  const { data, isLoading, error } = useQuery({
    queryKey: ["meal-requests", userEmail, limit, currentPage],
    queryFn: () =>
      axios
        .get(
          `https://medical-camp-server-zeta.vercel.app/meal-requests-user?page=${currentPage}&limit=${limit}`,
          // .get(`https://medical-camp-server-zeta.vercel.app/meal-requests-user?page=${currentPage}&limit=${limit}`,
          { params: { email: userEmail } }
        )
        .then((res) => {
          console.log(res.data.mealRequests);
          return res.data;
        }),
    enabled: !!userEmail, // Only fetch if userEmail is available
  });

  // Error handling
  if (error) return <div>Error: {error.message}</div>;

  // Loading state
  if (isLoading) return <Loading />;

  // const {mealRequests, totalPages, totalRequest} = data

  // if (data) {
  //     // console.log(data)
  //     const { totalPages, mealRequests } = data
  //     console.log(totalPages, mealRequests)}
  const totalPages = data?.totalPages ?? 0;
  const mealRequests = data?.mealRequests ?? [];

  // console.log(mealRequests)
  // }
  // console.log(data)

  // Function to handle canceling a meal request
  const handleCancel = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(
            "https://medical-camp-server-zeta.vercel.app/meal-requests-user",
            {
              data: { id }, // Send the id in the 'data' property
            }
          )
          .then(() => {
            Swal.fire({
              title: "Cancelled!",
              text: "Your camp has been cancelled.",
              icon: "success",
            });
            // Refetch the meal requests after canceling
            queryClient.invalidateQueries(["meal-requests", userEmail]);
          })
          .catch((error) => {
            console.error("Error canceling camp request:", error);
            Swal.fire({
              title: "Error!",
              text: "Failed to cancel the camp request.",
              icon: "error",
            });
          });
      }
    });
  };

  return (
    <div className="container mx-auto p-4 min-h-screen">
      <h1 className="text-2xl font-semibold mb-3 ml-1 mt-8">
        My Meal Requests
      </h1>
      {/* Meal Request Table */}
      <div className="overflow-x-auto">
        <table className="table w-full">
          {/* Table Header */}
          <thead>
            <tr>
              <th></th>
              <th>Meal Title</th>
              <th>Likes</th>
              <th>Reviews Count</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          {/* Table Body */}
          <tbody>
            {mealRequests.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center text-gray-500">
                  No Meal Request found
                </td>
              </tr>
            ) : (
              mealRequests?.map((meal, index) => {
                // console.log(meal.mealRequest)
                return (
                  <tr key={meal.mealRequest._id}>
                    <th>{index + 1}</th>
                    <td>{meal.mealRequest.title}</td>
                    <td>{meal.mealRequest.likes || 0}</td>
                    <td>{meal.mealRequest.reviews_count || 0}</td>
                    <td>{meal.mealRequest.status}</td>
                    <td>
                      {meal.mealRequest?.status === "served" ? (
                        <p>Delivered</p>
                      ) : (
                        <button
                          className="btn btn-error btn-sm"
                          onClick={() => handleCancel(meal.mealRequest._id)}
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
            {}
          </tbody>
        </table>
      </div>
      {/* Pagination Component */}
      <div className="flex justify-center mt-4">
        {totalPages > 1 ? (
          <div className="join">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                className={`join-item btn btn-square ${
                  currentPage === index + 1 ? "btn-active" : ""
                }`}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        ) : (
          <button className="btn btn-square btn-active">1</button>
        )}
        <div className="ml-2 max-w-[70px]">
          <select
            defaultValue={limit}
            className="select"
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            <option disabled={true}>No of items</option>
            <option>2</option>
            <option>5</option>
            <option>10</option>
            <option>20</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default UserMealRequest;
