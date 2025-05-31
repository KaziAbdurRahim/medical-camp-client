import { useContext, useState } from "react";
import { AuthContext } from "../provider/AuthProvider";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const AddMeal = () => {
  const { isAdmin, user } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  //console.log(user)

  if (!isAdmin) return <div>You are not authorized to access this page</div>;

  const onSubmit = (data) => {
    //console.log(data); // Log the submitted data to the console
    const meal = {
      title: data.title,
      category: data.category,
      image: data.image,
      ingredients: data.ingredients
        .split(",")
        .map((ingredient) => ingredient.trim()), // Convert comma-separated string to array
      description: data.description,
      price: parseFloat(data.price), // Ensure price is a number
      postTime: new Date().toISOString(), // Current time in ISO format
      distributor: {
        name: user.displayName,
        email: user.email,
      },
      rating: 0,
      likes: 0,
      reviewsCount: 0,
      reviews: [],
    };

    // Send meal to backend (example using fetch)

    fetch("http://localhost:5000/meals", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(meal),
    })
      .then((response) => response.json())
      .then((data) => {
        //console.log('Success:', data);
        toast.success("Meal added successfully");
      })
      .catch((error) => {
        console.error("Error:", error);
        toast.error("Error adding meal");
      });
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mt-10 mb-5 text-center">Add Meal</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="card-body shadow-2xl rounded-2xl"
      >
        <fieldset className="fieldset">
          <label className="label">
            <span className="label-text">Title</span>
          </label>
          <input
            type="text"
            {...register("title", { required: true })}
            placeholder="Meal Title"
            className="input input-bordered w-full"
          />
          {errors.title && (
            <span className="text-sm text-error my-2">Title is required</span>
          )}

          <label className="label">
            <span className="label-text">Category</span>
          </label>
          {/* use select dropdown for category     */}
          <select
            {...register("category", { required: true })}
            className="input input-bordered w-full"
            defaultValue="Breakfast"
          >
            <option value="Breakfast">Breakfast</option>
            <option value="Lunch">Lunch</option>
            <option value="Dinner">Dinner</option>
          </select>
          {errors.category && (
            <span className="text-sm text-error my-2">
              Category is required
            </span>
          )}

          <label className="label">
            <span className="label-text">Image URL</span>
          </label>
          <input
            type="url"
            {...register("image", { required: true })}
            placeholder="Image URL"
            className="input input-bordered w-full"
          />
          {errors.image && (
            <span className="text-sm text-error my-2">
              Image URL is required
            </span>
          )}

          <label className="label">
            <span className="label-text">Ingredients</span>
          </label>
          <input
            type="text"
            {...register("ingredients", { required: true })}
            placeholder="Comma-separated ingredients"
            className="input input-bordered w-full"
          />
          {errors.ingredients && (
            <span className="text-sm text-error my-2">
              Ingredients are required
            </span>
          )}

          <label className="label">
            <span className="label-text">Description</span>
          </label>
          <textarea
            {...register("description", { required: true })}
            placeholder="Meal Description"
            className="input input-bordered w-full"
          />
          {errors.description && (
            <span className="text-sm text-error my-2">
              Description is required
            </span>
          )}

          <label className="label">
            <span className="label-text">Price</span>
          </label>
          <input
            type="number"
            {...register("price", { required: true })}
            placeholder="Price"
            className="input input-bordered w-full"
          />
          {errors.price && (
            <span className="text-sm text-error my-2">Price is required</span>
          )}

          <button className="btn btn-primary mt-4">Add Meal</button>
        </fieldset>
      </form>
    </div>
  );
};

export default AddMeal;
