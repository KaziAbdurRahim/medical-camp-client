import { useContext, useState } from "react";
import { AuthContext } from "../provider/AuthProvider";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Loading from "../components/Loading";

const UpcomingMeal = () => {
  const { user, isAdmin } = useContext(AuthContext);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!isAdmin) return <div>You are not authorized to access this page</div>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const toggleModal = () => setIsModalOpen(!isModalOpen);

  // Fetch meal data with refetch function
  const {
    data: upcomingMeals,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["upcoming-meals"],
    queryFn: () =>
      axios.get("http://localhost:5000/upcoming-meals").then((res) => res.data),
  });

  const handlePublish = (_id) => {
    // Call the backend to move the meal from the upcomingMeals to meals collection
    axios
      .post("http://localhost:5000/meals/from-upcoming", {
        upcomingMealId: _id,
      })
      .then((response) => {
        toast.success("Meal published successfully!");
        refetch(); // Refetch the data to update the upcoming meals list
      })
      .catch((error) => {
        toast.error("Failed to publish meal. Try again.");
      });
  };

  const handleAddMeal = (data) => {
    const { title, category, image, ingredients, description, price } = data;
    const ingredientsArray = ingredients.split(",").map((item) => item.trim());

    if (
      !title ||
      !category ||
      !image ||
      !ingredientsArray ||
      !description ||
      isNaN(price)
    ) {
      toast.error("Please fill out all fields!");
      return;
    }

    const newMeal = {
      title,
      category,
      image,
      ingredients: ingredientsArray,
      description,
      price: parseFloat(price),
      postTime: new Date().toISOString(),
      distributor: {
        name: user?.displayName || "Admin",
        email: user?.email || "admin@example.com",
      },
      rating: 0,
      likes: 0,
      reviewsCount: 0,
      reviews: [],
      status: "pending",
    };

    axios
      .post("http://localhost:5000/upcoming-meals", newMeal)
      .then((response) => {
        toast.success("Meal added successfully!");
        reset();
        toggleModal();
        refetch(); // Refetch the data to reload the meals
      })
      .catch((error) => {
        toast.error("Failed to add meal. Try again.");
      });
  };

  if (isLoading) return <Loading />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Upcoming Meals</h1>

      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Camp Name</th>
              <th>Category</th>
              <th>Camp Fee</th>
              <th>Likes</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {upcomingMeals?.map((meal) => (
              <tr key={meal._id}>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="mask mask-squircle h-12 w-12">
                        <img src={meal.image} alt={meal.title} />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold">{meal.title}</div>
                      <div className="text-sm opacity-50">
                        {meal.description}
                      </div>
                    </div>
                  </div>
                </td>
                <td>{meal.category}</td>
                <td>${meal.price}</td>
                <td>{meal.likes}</td>
                <th>
                  <button
                    onClick={() => handlePublish(meal._id)}
                    className="btn btn-primary btn-xs"
                  >
                    Publish
                  </button>
                </th>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th>Camp Name</th>
              <th>Category</th>
              <th>Camp Fee</th>
              <th>Likes</th>
              <th></th>
            </tr>
          </tfoot>
        </table>
      </div>

      <button className="btn btn-primary mt-6" onClick={toggleModal}>
        Add a New Camp
      </button>

      {isModalOpen && (
        <dialog
          id="add_meal_modal"
          className="modal modal-bottom sm:modal-middle"
          open
        >
          <div className="modal-box">
            <h3 className="font-bold text-lg">Add an Upcoming Camp</h3>
            <form
              onSubmit={handleSubmit(handleAddMeal)}
              className="space-y-4 mt-4"
            >
              <input
                {...register("title", { required: true })}
                type="text"
                placeholder="Camp Title"
                className="input input-bordered w-full"
              />
              {errors.title && (
                <p className="text-red-500">Title is required</p>
              )}

              <select
                {...register("category", { required: true })}
                className="select select-bordered w-full"
              >
                <option value="" disabled selected>
                  Select a Category
                </option>
                <option value="3days">3days</option>
                <option value="7days">7days</option>
                <option value="10days">10days</option>
              </select>
              {errors.category && (
                <p className="text-red-500">Category is required</p>
              )}

              <input
                {...register("image", { required: true })}
                type="url"
                placeholder="Image URL"
                className="input input-bordered w-full"
              />
              {errors.image && (
                <p className="text-red-500">Image URL is required</p>
              )}

              <input
                {...register("ingredients", { required: true })}
                type="text"
                placeholder="Comma-separated Healthcare Professional"
                className="input input-bordered w-full"
              />
              {errors.ingredients && (
                <p className="text-red-500">
                  Healthcare Professional are required
                </p>
              )}

              <textarea
                {...register("description", { required: true })}
                placeholder="Description"
                className="textarea textarea-bordered w-full"
              ></textarea>
              {errors.description && (
                <p className="text-red-500">Description is required</p>
              )}

              <input
                {...register("price", { required: true, valueAsNumber: true })}
                type="number"
                placeholder="Camp Fee"
                className="input input-bordered w-full"
              />
              {errors.price && (
                <p className="text-red-500">Camp Fee is required</p>
              )}

              <div className="modal-action">
                <button type="submit" className="btn btn-primary">
                  Add Camp
                </button>
                <button type="button" className="btn" onClick={toggleModal}>
                  Close
                </button>
              </div>
            </form>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default UpcomingMeal;
