import { useContext, useState } from "react";
import { AuthContext } from "../provider/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import MealCard from "../components/MealCard";
import Loading from "../components/Loading";

const AllMeals = () => {
  const { user, isAdmin } = useContext(AuthContext);

  // if (!isAdmin) return <div>You are not authorized to access this page</div>;

  const [category, setCategory] = useState("All");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [filterByPrice, setFilterByPrice] = useState(false);

  const fetchMeals = async () => {
    // let url = `http://localhost:5000/meals?category=${category}`;
    let url = `http://localhost:5000/meals?category=${category}`;
    if (filterByPrice && (minPrice || maxPrice)) {
      if (!minPrice) {
        url += `&priceRange={"min":0,"max":${maxPrice}}`;
      } else if (!maxPrice) {
        url += `&priceRange={"min":${minPrice},"max":9999999999}`;
      } else {
        url += `&priceRange={"min":${minPrice},"max":${maxPrice}}`;
      }
    }
    const response = await axios.get(url);
    return response.data.meals;
  };

  const {
    data: meals,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["meals", category, filterByPrice, minPrice, maxPrice],
    queryFn: fetchMeals,
  });

  if (isLoading) return <Loading />; // Show loading spinner
  if (error) return <div>Error: {error.message}</div>; // Handle error state
  // console.log(meals)
  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row sm:items-center justify-between gap-4 mb-6">
        {/* Category Selection */}
        <div className="flex items-center gap-2">
          <label className="font-semibold">Category:</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="select select-bordered"
          >
            <option value="All">All</option>
            <option value="Breakfast">3days</option>
            <option value="Lunch">7days</option>
            <option value="Dinner">10days</option>
          </select>
        </div>

        {/* Price Filter */}
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={filterByPrice}
              onChange={(e) => setFilterByPrice(e.target.checked)}
              className="checkbox"
            />
            <span>Filter by Price</span>
          </label>
          {filterByPrice && (
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min Price"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="input input-bordered w-24"
              />
              <input
                type="number"
                placeholder="Max Price"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="input input-bordered w-24"
              />
            </div>
          )}
        </div>
      </div>

      {/* Meals Display */}
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
        {meals.length > 0 ? (
          meals.map((meal) => <MealCard key={meal._id} meal={meal} />)
        ) : (
          <p className="text-center col-span-full text-gray-500">
            No Camp found.
          </p>
        )}
      </div>
    </div>
  );
};

export default AllMeals;
