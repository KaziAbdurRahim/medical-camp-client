import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Loading from "../components/Loading";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const AdminAllReviews = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  // const limit = 10; // Meals per page

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["meals", currentPage, limit],
    queryFn: () =>
      axios
        .get(
          `https://medical-camp-server-zeta.vercel.app/meals?page=${currentPage}&limit=${limit}`
        )
        // .get(`https://medical-camp-server-zeta.vercel.app/meals?page=${currentPage}&limit=${limit}`)
        .then((res) => res.data),
  });

  if (isLoading) return <Loading />;
  if (error) return <div>Error: {error.message}</div>;

  const { meals, totalPages } = data;

  const handleDeleteReview = async (mealId) => {
    Swal.fire({
      title: "Are you sure you want to delete all the reviews?",
      text: "Review count and ratings will be set to 0",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.patch(
            `https://medical-camp-server-zeta.vercel.app/meals/reset/${mealId}`
          );

          if (response.status === 200) {
            Swal.fire({
              title: "Deleted!",
              text: "Reviews for this Camp have been reset.",
              icon: "success",
            });
            refetch();
          } else {
            Swal.fire({
              title: "Error!",
              text: "Failed to reset reviews. Please try again.",
              icon: "error",
            });
          }
        } catch (error) {
          Swal.fire({
            title: "Error!",
            text: `Something went wrong: ${error.message}`,
            icon: "error",
          });
        }
      }
    });
  };

  return (
    <div className="container mx-auto p-4">
      <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
        <table className="table">
          <thead>
            <tr>
              <th>Camp Title</th>
              <th>Likes</th>
              <th>Review Count</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {meals && meals.length > 0 ? (
              meals.map((review) => (
                <tr key={review._id}>
                  <td>{review.title}</td>
                  <td>{review.likes}</td>
                  <td>{review.reviewsCount}</td>
                  <td>
                    <Link to={`/meal/${review._id}`}>
                      <button className="btn btn-sm btn-info mr-2">
                        {" "}
                        View Camp{" "}
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDeleteReview(review._id)}
                      className="btn btn-sm btn-error"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center text-gray-500">
                  No reviews found.
                </td>
              </tr>
            )}
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

export default AdminAllReviews;
