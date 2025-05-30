import React, { useContext, useState } from "react";
import { AiOutlineLike } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { AuthContext } from "../provider/AuthProvider";

const UpcomingMealCard = ({
  meal: {
    _id,
    category,
    description,
    distributor,
    image,
    ingredients,
    likes,
    postTime,
    price,
    rating,
    reviewsCount,
    title,
    likedby, // assuming likedby is the array of emails of users who liked the meal
  },
  isLikedByUser,
  setDoRefetch,
  refetchMeals, // Assuming you want to refetch meals after a like action
}) => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext); // Get logged-in user
  const [currentLikes, setCurrentLikes] = useState(likes); // Local state to manage likes count
  const [isLikedByUserLocal, setisLikedByUserlocal] = useState(isLikedByUser);

  const handleLike = async () => {
    if (!user) {
      navigate("/auth/login");
    }
    try {
      // Send like request to the backend
      const response = await axios.post(
        "https://honey-meal-server.vercel.app/like-upcoming-meal",
        {
          mealId: _id,
          userEmail: user?.email, // Replace with the logged-in user's email
        }
      );

      // If the like is successful, update the local like count and display a success message
      setCurrentLikes((prevLikes) => prevLikes + 1); // Increment likes locally
      Swal.fire({
        title: "Liked!",
        text: "You liked this meal.",
        icon: "success",
        confirmButtonText: "OK",
      });
      setisLikedByUserlocal(true);

      // If the like causes the meal to move to 'mealCollection' (i.e., likes >= 10)
      if (response.status === 201) {
        Swal.fire({
          title: "Meal Added!",
          text: "This meal is now part of the collection.",
          icon: "success",
          confirmButtonText: "OK",
        });
        setDoRefetch(true);
      }
    } catch (error) {
      // Check for backend errors
      if (error.response && error.response.status === 403) {
        // If the backend sends a 403 error, show the subscription message
        Swal.fire({
          title: "Subscription Required",
          text: "You need a subscription to like meals. Please upgrade your badge.",
          icon: "warning",
          confirmButtonText: "OK",
        });
      } else {
        // For other types of errors, show a generic error message
        Swal.fire({
          title: "Error",
          text:
            error.response?.data?.message ||
            "An error occurred. Please try again later.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    }
  };

  return (
    <div className="card w-full sm:max-w-sm md:max-w-md lg:max-w-lg bg-base-100 shadow-xl mx-auto max-w-sm">
      <figure>
        <img
          src={image}
          alt={title}
          className="w-full md:h-64 lg:h-72 xl:h-80 object-cover"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{title}</h2>
        <p>
          <strong>Category:</strong> {category}
        </p>
        <p>
          <strong>Description:</strong> {description}
        </p>
        <p>
          <strong>Camping Fees:</strong> ${price}
        </p>
        <p>
          <strong>Healthcare Professional:</strong> {ingredients.join(", ")}
        </p>
        <p>
          <strong>Rating:</strong> {rating.toFixed(1)}
        </p>
        <p>
          <strong>Review:</strong> {reviewsCount}
        </p>
        <p>
          <strong>Likes:</strong> {currentLikes}
        </p>
        <p>
          <strong>Posted on:</strong> {new Date(postTime).toLocaleDateString()}
        </p>
        <p>
          <strong>Distributor:</strong> {distributor.name}
        </p>
        <div className="card-actions justify-end">
          {isLikedByUserLocal ? (
            <button className="btn btn-secondary">
              <AiOutlineLike className="text-lg" /> Liked
            </button>
          ) : (
            <button className="btn" onClick={handleLike}>
              <AiOutlineLike className="text-lg" /> Like
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpcomingMealCard;
