import axios from "axios";
import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "../provider/AuthProvider";
import { useNavigate } from "react-router-dom";

const MealDetailCard = ({ meal, refetch }) => {
  const { user } = useContext(AuthContext); // Get logged-in user info
  const [likes, setLikes] = useState(meal.likes || 0);
  const [isLiked, setIsLiked] = useState(
    meal.likedby?.includes(user?.email) || false
  );
  console.log(isLiked);
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [reveiwcount, setReveiwcount] = useState(meal.reviews?.length || 0);
  const navigate = useNavigate();

  // Handle the "like" functionality
  const handleLike = async () => {
    if (!user) {
      toast.error("Must Login to Like");
      return navigate("/auth/login");
    }
    if (!isLiked) {
      try {
        const response = await axios.post(
          `https://honey-meal-server.vercel.app/meals/${meal._id}/like`,
          { email: user.email }
        );
        setLikes(likes + 1); // Update likes count from server response
        setIsLiked(true); // Mark as liked
        toast.success("Meal liked successfully!");
        refetch();
      } catch (error) {
        if (error.response && error.response.status === 400) {
          toast.error(error.response.data.message); // Already liked error
        } else {
          toast.error("Something went wrong. Please try again.");
        }
      }
    } else {
      toast.info("You have already liked this meal.");
    }
  };

  // Handle review submission
  const handleReviewSubmit = async () => {
    if (review.trim() === "" || rating === 0) {
      toast.error("Please provide a review and a rating!");
      return;
    }

    try {
      const response = await axios.post(
        `https://honey-meal-server.vercel.app/meals/${meal._id}/review`,
        {
          email: user.email,
          comment: review,
          rating: rating,
        }
      );
      setReveiwcount(reveiwcount + 1);
      toast.success("Review submitted successfully!");
      // Optionally, you can update the meal state with new reviews and rating here
    } catch (error) {
      //console.log(error.response.data.message)
      if (error.response.data.message === "User already reviewed the meal") {
        toast.info("User already reviewed the meal");
        return;
      }
      toast.error("Failed to submit the review. Please try again.");
    }
  };

  // Handle meal request functionality
  const handleRequest = async () => {
    if (!user) {
      toast.error("Must Login to request");
      return navigate("/auth/login");
    }
    try {
      // console.log(user.email, meal._id)
      const response = await axios.post(
        "https://honey-meal-server.vercel.app/meal/request",
        {
          email: user.email,
          mealId: meal._id,
        }
      );
      // console.log(response)
      if (response.data.message === "Need to buy subscription") {
        toast.info("Need to buy subscription");
      } else toast.success("Meal request sent successfully!");
    } catch (error) {
      toast.error("Failed to request the meal. Please try again.");
    }
  };

  //   console.log(meal.reviews)

  return (
    <div className="card w-full sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl bg-base-100 shadow-xl mx-auto max-w-sm">
      <figure>
        <img
          src={meal.image}
          alt={meal.title}
          className="h-full w-full object-cover"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{meal.title}</h2>
        <p>{meal.description}</p>
        <p>
          <strong>Category:</strong> {meal.category}
        </p>
        <p>
          <strong>Healthcare Professional:</strong>{" "}
          {meal.ingredients.join(", ")}
        </p>
        <p>
          <strong>Camp Fee:</strong> ${meal.price}
        </p>
        <p>
          <strong>Distributor:</strong> {meal.distributor.name}
        </p>
        <p>
          <strong>Post Time:</strong> {new Date(meal.postTime).toLocaleString()}
        </p>
        <p>
          <strong>Rating:</strong> {meal.rating.toFixed(1)}
        </p>
        <p>
          <strong>Likes:</strong> {likes}
        </p>
        <p>
          <strong>Reveiw Count:</strong> {reveiwcount}
        </p>

        <div className="card-actions justify-end">
          <button
            className={`btn ${isLiked ? "btn-disabled" : "btn-primary"}`}
            onClick={handleLike}
            disabled={isLiked}
          >
            {isLiked ? "Liked" : "Like"}
          </button>
          <button className="btn btn-secondary" onClick={handleRequest}>
            Join Camp
          </button>
        </div>

        {/* Reviews Section */}
        <div className="mt-4">
          <h3 className="text-xl">Reviews</h3>
          {meal.reviews.length > 0 ? (
            meal.reviews.map((review, index) => (
              <div
                key={index}
                className="card w-full bg-base-200 shadow-xl mt-2"
              >
                <div className="card-body">
                  <p className="text-lg">
                    <strong>{review.name}</strong>
                  </p>
                  <p>
                    <strong>Rating:</strong> {review.rating} / 5
                  </p>
                  <p>
                    <strong>Reveiw:</strong> {review.comment}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p>No reviews yet. Be the first to leave one!</p>
          )}
        </div>

        {/* Add Review Section */}
        {user && (
          <div className="mt-4">
            <h3 className="text-xl">Leave a Review</h3>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Write your review..."
              className="textarea textarea-bordered w-full mt-2"
              rows="4"
            ></textarea>

            <div className="mt-2">
              <label>Rating: </label>
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="select select-bordered w-full mt-2"
              >
                <option value={0}>Select Rating (1-5)</option>
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
              </select>
            </div>

            <button
              className="btn btn-primary mt-4"
              onClick={handleReviewSubmit}
            >
              Submit Review
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MealDetailCard;
