import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import Loading from "../components/Loading";
import UpcomingMealCard from "../components/UpcomingMealCard";
import { useContext, useState } from "react";
import { AuthContext } from "../provider/AuthProvider";

const AllUpcomingMeal = () => {
  const { user } = useContext(AuthContext);
  const [dorefetch, setDoRefetch] = useState(false);
  // const { email } = user;

  const {
    data: meals,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["meals", dorefetch],
    queryFn: async () => {
      const res = await axios.get(`http://localhost:5000/upcoming-meals`);
      return res.data; // Return the data from the response
    },
  });

  if (isLoading) return <Loading />; // Show loading spinner
  if (error) return <div>Error: {error.message}</div>; // Handle error state

  return (
    <div className="container mx-auto p-4">
      {/* Meals Display */}
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
        {meals.length > 0 ? (
          meals.map((meal) => {
            const isLikedByUser = meal?.likedby?.includes(user?.email); // Check if email is in the likedby array
            return (
              <UpcomingMealCard
                key={meal._id}
                meal={meal}
                setDoRefetch={setDoRefetch}
                isLikedByUser={isLikedByUser} // Pass the true/false value as a prop to the UpcomingMealCard
              />
            );
          })
        ) : (
          <p>No camps available</p>
        )}
      </div>
    </div>
  );
};

export default AllUpcomingMeal;
