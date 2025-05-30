import React from "react";
import { Link } from "react-router-dom";

const MealCard = ({
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
  },
}) => {
  //console.log(_id)
  return (
    <div className="card w-full sm:max-w-sm md:max-w-md lg:max-w-lg bg-base-100 shadow-xl mx-auto max-w-sm">
      <figure>
        <img
          src={image}
          alt={title}
          className="w-full h-48 lg:h-60 object-cover"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{title}</h2>
        <p className="">
          <strong>Category:</strong> {category}
        </p>
        <p className="">
          <strong>Description:</strong> {description}
        </p>
        <p className="">
          <strong>Camp Fees:</strong> ${price}
        </p>
        <p className="">
          <strong>Healthcare Professional:</strong> {ingredients.join(", ")}
        </p>
        <p className="">
          <strong>Rating:</strong> {rating.toFixed(1)}
        </p>
        <p className="">
          <strong>Review:</strong> {reviewsCount}
        </p>
        <p className="">
          <strong>participant count:</strong> {likes}
        </p>
        <p className="">
          <strong>Posted on:</strong> {new Date(postTime).toLocaleDateString()}
        </p>
        <p className="">
          <strong>Distributor:</strong> {distributor.name}
        </p>
        <div className="card-actions justify-end">
          <Link to={`/meal/${_id}`}>
            <button className="btn btn-primary btn-sm">View Details</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MealCard;
