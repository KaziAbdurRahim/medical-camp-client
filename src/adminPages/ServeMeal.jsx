import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import Loading from "../components/Loading"; // Assuming you have a Loading component
import { useState } from "react";

const ServeMeal = () => {
  const [search, setSearch] = useState({
    username: "",
    email: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // useQuery hook to fetch meal requests with search parameters
  const { data, isLoading, error, refetch } = useQuery({
    // "http://localhost:5000/meal-requests"
    queryKey: [
      "mealRequests",
      search.username,
      search.email,
      limit,
      currentPage,
    ],
    queryFn: () =>
      axios
        .get("http://localhost:5000/meal-requests", {
          params: {
            username: search.username || undefined,
            email: search.email || undefined,
            page: currentPage,
            limit: limit,
          },
        })
        .then((res) => res.data),

    enabled: !!search, // Disable query initially until search is provided
  });

  // useMutation hook for serving a meal
  const { mutate: serveMeal } = useMutation({
    mutationFn: (mealId) =>
      axios.patch(`http://localhost:5000/meal-requests/${mealId}`, {
        status: "delivered",
      }),
    onSuccess: () => {
      toast.success("Meal status updated to delivered");
      refetch(); // Refetch the meal requests after a successful mutation
    },
    onError: (error) => {
      toast.error(`Error: ${error.response?.data?.message || error.message}`);
    },
  });

  // Handle the "Serve" button click
  const handleServe = (mealId) => {
    serveMeal(mealId);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearch({
      ...search,
      [e.target.name]: e.target.value,
    });
  };

  // Loading and error handling
  if (isLoading) return <Loading />;
  if (error) return <div>Error: {error.message}</div>;
  const mealRequests = data?.mealRequests ?? [];
  const totalPages = data?.totalPages ?? 0;

  return (
    <div className="flex flex-col justify-center items-center">
      <h2 className="text-center font-bold text-3xl my-5 ">Camp managment</h2>

      {/* Search Bar */}
      <div className="mb-5">
        <input
          type="text"
          name="username"
          value={search.username}
          onChange={handleSearchChange}
          placeholder="Search by Username"
          className="input input-bordered mb-2"
        />
        <input
          type="text"
          name="email"
          value={search.email}
          onChange={handleSearchChange}
          placeholder="Search by Email"
          className="input input-bordered"
        />
      </div>

      <div className="mt-5 card card-body rounded-2xl shadow-xl max-w-5xl mx-auto">
        <div className="overflow-x-auto">
          <table className="table">
            {/* Head */}
            <thead>
              <tr>
                <th>Title</th>
                <th>User Name</th>
                <th>User Email</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {mealRequests?.map((meal) => (
                <tr key={meal._id}>
                  <td>{meal.title}</td>
                  <td>{meal.name}</td>
                  <td>{meal.email}</td>
                  <td>{meal.status}</td>
                  <td>
                    {meal.status === "pending" ? (
                      <button
                        className="btn btn-primary"
                        onClick={() => handleServe(meal._id)}
                      >
                        Book
                      </button>
                    ) : (
                      <span>Conformed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Pagination Component */}
      <div className="flex justify-center mt-4">
        {totalPages > 0 ? (
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

export default ServeMeal;
