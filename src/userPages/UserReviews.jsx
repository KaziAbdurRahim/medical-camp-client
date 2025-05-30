import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import axios from "axios";
import { useContext } from "react";
import Swal from "sweetalert2";
import { AuthContext } from "../provider/AuthProvider";
import { Link } from "react-router-dom";
import Loading from "../components/Loading";

const UserReviews = () => {
    const { user } = useContext(AuthContext); // Get logged-in user
    const queryClient = useQueryClient();

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentReview, setCurrentReview] = useState(null);
    const [newComment, setNewComment] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);

    // Fetch user reviews
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ["userReviews", user?.email, limit, currentPage],
        queryFn: async () => {
            const res = await axios.get(
                `https://honey-meal-server.vercel.app/reviews?email=${user.email}&page=${currentPage}&limit=${limit}`
                // `http://localhost:5000/reviews?email=${user.email}&page=${currentPage}&limit=${limit}`

            );

            return res.data;
        },
        enabled: !!user?.email,
    });

    const reviews = data?.reviews ?? [];
    // console.log("rei", reviews.length)
    const totalPages = data?.totalPages ?? 0;

    // Handle delete confirmation
    const handleDelete = (id, mealId) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                axios.post("https://honey-meal-server.vercel.app/review-delete",
                    // axios.post("http://localhost:5000/review-delete", 
                    {
                        email: user?.email, // Get email from AuthContext
                        reviewId: id,       // The review ID to delete
                        mealId: mealId       // The meal ID associated with the review
                    })
                    .then((response) => {
                        Swal.fire({
                            title: "Deleted!",
                            text: response.data.message, // Show success message from API
                            icon: "success",
                        });
                        refetch()
                        // Optionally refetch the reviews or update the UI after deletion
                        queryClient.invalidateQueries("userReviews"); // Refetch data
                    })
                    .catch((error) => {
                        console.error("Error deleting review:", error);
                        Swal.fire({
                            title: "Error!",
                            text: "Failed to delete the review.",
                            icon: "error",
                        });
                    });
            }
        });
    };

    // Handle edit click
    const handleEditClick = (review) => {
        setCurrentReview(review);
        setNewComment(review.comment); // Pre-fill the comment
        setIsModalOpen(true); // Open the modal
    };

    // Handle the update
    const handleUpdate = () => {
        // API call to update review
        axios.post("https://honey-meal-server.vercel.app/review-update", {
            email: user?.email,  // Logged-in user's email
            reviewId: currentReview._id,  // Review ID
            mealId: currentReview.mealId,  // Meal ID associated with the review
            newComment: newComment,  // New comment entered by user
        })
            .then((response) => {
                // Show success message or handle the response
                Swal.fire({
                    title: "Updated!",
                    text: "Your review has been updated successfully.",
                    icon: "success",
                });

                // Optionally, refetch reviews or update UI
                queryClient.invalidateQueries("userReviews"); // Refetch reviews data

                // Close the modal after successful update
                setIsModalOpen(false);
            })
            .catch((error) => {
                // Handle error if the update fails
                console.error("Error updating review:", error);
                Swal.fire({
                    title: "Error!",
                    text: "Failed to update your review. Please try again.",
                    icon: "error",
                });
            });
    };


    if (isLoading) return <Loading></Loading>;
    if (error) return <p className="text-center text-red-500">Error loading reviews</p>;

    return (
        <div className="overflow-x-auto p-5">
            <h2 className="text-2xl font-semibold mb-4">My Reviews</h2>
            <div className="overflow-x-auto">
                <table className="table">
                    {/* Table Header */}
                    <thead>
                        <tr>
                            <th></th>
                            <th>Meal Title</th>
                            <th>Likes</th>
                            <th>Review</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reviews.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="text-center text-gray-500">No reviews found</td>
                            </tr>
                        ) : (
                            reviews?.map((review, index) => (
                                <tr key={review._id}>
                                    <th>{index + 1}</th>
                                    <td>{review.title || "N/A"}</td>
                                    <td>{review.likes || 0}</td>
                                    <td>{review.comment}</td>
                                    <td>
                                        <div className="flex flex-col xl:block gap-y-1">
                                        <button className="btn btn-sm btn-warning mr-2 w-22" onClick={() => handleEditClick(review)}>
                                            Edit
                                        </button>
                                        <button
                                            className="btn btn-sm btn-error mr-2 w-22"
                                            onClick={() => handleDelete(review._id, review.mealId)}
                                        >
                                            Delete
                                        </button>
                                        <Link to={`/meal/${review.mealId}`}>
                                            <button className="btn btn-sm btn-info w-22">View Meal</button>
                                        </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
                {/* Pagination Component */}
                <div className="flex justify-center mt-4">
                    {totalPages > 1 ? (
                        <div className="join">
                            {Array.from({ length: totalPages }, (_, index) => (
                                <button
                                    key={index}
                                    className={`join-item btn btn-square ${currentPage === index + 1 ? "btn-active" : ""
                                        }`}
                                    onClick={() => setCurrentPage(index + 1)}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <button className="btn btn-square btn-active">1</button>
                    )
                    }
                    <div className="ml-2 max-w-[70px]"><select defaultValue={limit} className="select" onChange={(e) => {
                        setLimit(Number(e.target.value))
                        setCurrentPage(1)
                    }
                    }>
                        <option disabled={true}>No of items</option>
                        <option>2</option>
                        <option>5</option>
                        <option>10</option>
                        <option>20</option>
                    </select></div>
                </div>
            </div>

            {/* Modal for editing review */}
            {isModalOpen && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h2 className="text-xl font-semibold">Edit Review</h2>
                        <textarea
                            className="textarea textarea-bordered w-full"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                        />
                        <div className="modal-action">
                            <button className="btn" onClick={handleUpdate}>Update</button>
                            <button className="btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserReviews;
