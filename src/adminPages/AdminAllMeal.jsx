import { useQueryClient } from "@tanstack/react-query";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../provider/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Swal from "sweetalert2";
import Loading from "../components/Loading";
import { Link } from "react-router-dom";

const AdminAllMeal = () => {
  const { isAdmin } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [sortBy, setSortBy] = useState(""); // Default sorting by likes
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);

  if (!isAdmin) {
    return <div>You are not authorized to access this page</div>;
  }

  // Fetch meals with sorting applied based on the selected option
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["meals", sortBy, currentPage, limit],
    queryFn: () =>
      axios
        .get(
          `https://medical-camp-server-zeta.vercel.app/meals?page=${currentPage}&limit=${limit}`,
          {
            params: { sortBy },
          }
        )
        .then((res) => {
          // console.log("API Response:", res.data);
          return res.data;
        }),
  });

  const handleUpdate = (meal) => {
    setSelectedMeal(meal);
    document.getElementById("update_meal_modal").showModal();
  };

  const handleUpdateSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const updatedMeal = Object.fromEntries(formData.entries());
    (updatedMeal.ingredients = updatedMeal.ingredients
      .split(",")
      .map((ingredient) => ingredient.trim())), // Handle the ingredients field specifically
      console.log(updatedMeal);

    try {
      const response = await axios.patch(
        `https://medical-camp-server-zeta.vercel.app/meals/${selectedMeal._id}`,
        updatedMeal
      );
      if (response.status === 200) {
        Swal.fire(
          "Updated!",
          "The Camp has been updated successfully.",
          "success"
        );
        refetch();
        queryClient.invalidateQueries(["meals"]);
        setSelectedMeal(null);
        document.getElementById("update_meal_modal").close();
      }
    } catch (error) {
      console.error("Error updating meal:", error);
      Swal.fire(
        "Error!",
        "Failed to update the Camp. Please try again.",
        "error"
      );
    }
  };

  const handleDelete = (id) => {
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
          .delete(`https://medical-camp-server-zeta.vercel.app/meals/${id}`)
          .then((response) => {
            if (response.status === 200) {
              Swal.fire("Deleted!", "The Camp has been deleted.", "success");
              refetch();
              queryClient.invalidateQueries(["meals"]);
            }
          })
          .catch((error) => {
            console.error("Error deleting meal:", error);
            Swal.fire(
              "Error!",
              "An error occurred while deleting the Camp.",
              "error"
            );
          });
      }
    });
  };

  if (isLoading) return <Loading />;
  if (error) return <div>Error: {error.message}</div>;
  const { meals, totalPages } = data;

  return (
    <div className="overflow-x-auto p-4">
      <h2 className="text-2xl font-bold mb-4">All Camps</h2>

      {/* Sort selector */}
      <div className="mb-4">
        <label htmlFor="sortBy" className="mr-2">
          Sort By:
        </label>
        <select
          id="sortBy"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="select select-bordered"
        >
          <option value="">Default</option>
          <option value="likes">Likes</option>
          <option value="reviewsCount">Reviews Count</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Fee</th>
              <th>Likes</th>
              <th>Reviews Count</th>
              <th>Rating</th>
              <th>Distributor</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {meals?.map((meal, index) => (
              <tr key={meal._id} className="hover">
                <th>{index + 1}</th>
                <td>{meal.title}</td>
                <td>{meal.price}</td>
                <td>{meal.likes}</td>
                <td>{meal.reviewsCount}</td>
                <td>{meal.rating.toFixed(1)}</td>
                <td>{meal.distributor.name}</td>
                <td className="flex gap-2">
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => handleUpdate(meal)}
                  >
                    Update
                  </button>
                  <button
                    className="btn btn-sm btn-error"
                    onClick={() => handleDelete(meal._id)}
                  >
                    Delete
                  </button>
                  <Link to={`/meal/${meal._id}`}>
                    <button className="btn btn-sm btn-success">View</button>
                  </Link>
                </td>
              </tr>
            ))}
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

      {/* Update Meal Modal */}
      <dialog
        id="update_meal_modal"
        className="modal modal-bottom sm:modal-middle"
      >
        {selectedMeal && (
          <form className="modal-box" onSubmit={handleUpdateSubmit}>
            <h3 className="font-bold text-lg">
              Update Meal: {selectedMeal.title}
            </h3>
            <div className="py-4 space-y-4">
              <div>
                <label className="label">
                  <span className="label-text">Title</span>
                </label>
                <input
                  type="text"
                  name="title"
                  defaultValue={selectedMeal.title}
                  className="input input-bordered w-full"
                  required
                />
              </div>
              <div>
                <label className="label">
                  <span className="label-text">Photo Url</span>
                </label>
                <input
                  type="url"
                  name="image"
                  defaultValue={selectedMeal.image}
                  className="input input-bordered w-full"
                  required
                />
              </div>
              <div>
                <label className="label">
                  <span className="label-text">Description</span>
                </label>
                <textarea
                  name="description"
                  defaultValue={selectedMeal.description}
                  className="textarea textarea-bordered w-full"
                  required
                />
              </div>
              <div>
                <label className="label">
                  <span className="label-text">Price</span>
                </label>
                <input
                  type="number"
                  name="price"
                  defaultValue={selectedMeal.price}
                  className="input input-bordered w-full"
                  required
                />
              </div>
              <div>
                <label className="label">
                  <span className="label-text">Ingredients</span>
                </label>
                <input
                  type="text"
                  name="ingredients"
                  defaultValue={selectedMeal.ingredients.join(", ")}
                  className="input input-bordered w-full"
                  required
                />
              </div>
            </div>
            <div className="modal-action">
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
              <button
                type="button"
                className="btn"
                onClick={() => {
                  setSelectedMeal(null);
                  document.getElementById("update_meal_modal").close();
                }}
              >
                Close
              </button>
            </div>
          </form>
        )}
      </dialog>
    </div>
  );
};

export default AdminAllMeal;
