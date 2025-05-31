import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "react-router-dom";
import MealDetailCard from "../components/MealDetailsCard";
import Loading from "../components/Loading";
import { useState } from "react";

const fetchMealDetails = async (id) => {
  const response = await axios.get(`/meals/${id}`);
  return response.data;
};

const MealDetails = () => {
  const { id: mealId } = useParams(); // Destructure the 'id' parameter
  // const [refetch, setrefetch] = useState(false)
  // const { data, error, isLoading } = useQuery(['mealDetails', mealId], () => fetchMealDetails(mealId), {
  //     enabled: !!mealId, // Ensure the query runs only if mealId exists
  // });
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["meal", mealId],
    // queryFn: () => axios.get(`https://medical-camp-server-zeta.vercel.app/meals/${mealId}`),
    queryFn: () =>
      axios.get(`https://medical-camp-server-zeta.vercel.app/meals/${mealId}`),
  });

  if (isLoading) return <Loading></Loading>;
  if (error) return <div>Error fetching Camp details</div>;
  // console.log(data.data)
  return (
    <div className="flex mx-auto my-16">
      <MealDetailCard meal={data.data} refetch={refetch} />
    </div>
  );
};

export default MealDetails;
