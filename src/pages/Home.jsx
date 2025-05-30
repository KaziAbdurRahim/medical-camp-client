import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../provider/AuthProvider";
import SubPackageCard from "../components/SubPackageCard";
import TotalMeals from "../components/TotalMeals";
import Loading from "../components/Loading";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import MealCard from "../components/MealCard";

const Home = () => {
    const { user } = useContext(AuthContext);
    const [searchQuery, setSearchQuery] = useState("");
    const subPackages = [
        {
            name: "Platinum",
            price: 20,
            features: [
                "High-resolution image generation",
                "Customizable style templates",
                "Batch processing capabilities",
                "AI-driven image enhancements",
                "Premium support"
            ]
        },
        {
            name: "Gold",
            price: 15,
            features: [
                "High-resolution image generation",
                "Customizable style templates",
                "Batch processing capabilities",
                "Basic support"
            ]
        },
        {
            name: "Silver",
            price: 10,
            features: [
                "Customizable style templates",
                "Basic image generation"
            ]
        }
    ];
    // useEffect(()=>{
    //     fetch('https://honey-meal-server.vercel.app/welcome')
    //     .then(res=>res.json())
    //     .then(data=> console.log(data))
    // },[])

    const fetchMeals = async () => {
        // const response = await axios.get(`https://honey-meal-server.vercel.app/meals?category=All`);
        const response = await axios.get(`https://honey-meal-server.vercel.app/meals?category=All`);
        return response.data.meals;
    };

    const { data: meals, isLoading, error } = useQuery({
        queryKey: ["meals"],
        queryFn: fetchMeals,
    });

    // Filter meals based on the search query
    const filteredMeals = Array.isArray(meals) ? meals.filter(meal =>
        meal?.title?.toLowerCase().includes(searchQuery.toLowerCase())
    ) : [];

    if (isLoading) return <Loading />;  // Show loading spinner
    if (error) return <div>Error: {error.message}</div>;  // Handle error state

    return (
        <div className="">
            {/* hero */}
            <div
                className="hero min-h-[720px] sm:min-h-[500px] md:min-h-[700px]"
                style={{
                    backgroundImage: "url(https://img.freepik.com/free-vector/hand-drawn-thanksgiving-background_23-2148680745.jpg?t=st=1738226839~exp=1738230439~hmac=a4371c3b1fd07073c66b6d9d7fbd695a5ae1939bbe397846df4d749b4e53dea6&w=1060)",
                }}>
                <div className="hero-overlay"></div>
                <div className="hero-content text-center">
                    <div className="max-w-md">
                        <h1 className="mb-5 text-5xl font-bold text-white">Best Meals</h1>
                        <p className="mb-2 text-start text-white opacity-90">
                        Seach your favorite meals
                        </p>
                        <div className="join">
                            <div>
                                <label className="input join-item">
                                    <input type="text" placeholder="Meals" required value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}/>
                                </label>
                            </div>
                            <button className="btn btn-primary join-item">Search</button>
                        </div>
                    </div>
                </div>
            </div>

            
            {/* Search Results */}
            {searchQuery && (
                <div className="container mx-auto my-10">
                    <h2 className="text-2xl font-bold text-center mb-4">Search Results</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
                        {filteredMeals.length > 0 ? (
                            filteredMeals.map((meal) => (
                                <MealCard key={meal._id} meal={meal} />
                            ))
                        ) : (
                            <p className="text-center col-span-full text-gray-500">No meals found.</p>
                        )}
                    </div>
                </div>
            )}

            {/* Meal by Category */}
            <div className="my-28 container mx-auto">
                <h1 className="font-bold text-2xl pb-2 text-center">Meals by Category</h1>
                {/* name of each tab group should be unique */}
                <div role="tablist" className="tabs tabs-lift container">
                    {/* Breakfast Tab */}
                    <input type="radio" name="my_tabs_3" id="tab1" role="tab" className="tab" aria-label="Breakfast" defaultChecked />
                    <div role="tabpanel" className="tab-content bg-base-100 border-base-300 p-6 ">
                        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
                            {meals.length > 0 ? (
                                meals
                                    .filter((meal) => meal.category === "Breakfast")
                                    .map((meal) => <MealCard key={meal._id} meal={meal} />)
                            ) : (
                                <p className="text-center col-span-full text-gray-500">No meals found.</p>
                            )}
                        </div>
                    </div>

                    {/* Lunch Tab */}
                    <input type="radio" name="my_tabs_3" id="tab2" role="tab" className="tab" aria-label="Lunch" />
                    <div role="tabpanel" className="tab-content bg-base-100 border-base-300 p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
                            {meals.length > 0 ? (
                                meals
                                    .filter((meal) => meal.category === "Lunch")
                                    .map((meal) => <MealCard key={meal._id} meal={meal} />)
                            ) : (
                                <p className="text-center col-span-full text-gray-500">No meals found.</p>
                            )}
                        </div>
                    </div>

                    {/* Dinner Tab */}
                    <input type="radio" name="my_tabs_3" id="tab3" role="tab" className="tab" aria-label="Dinner" />
                    <div role="tabpanel" className="tab-content bg-base-100 border-base-300 p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
                            {meals.length > 0 ? (
                                meals
                                    .filter((meal) => meal.category === "Dinner")
                                    .map((meal) => <MealCard key={meal._id} meal={meal} />)
                            ) : (
                                <p className="text-center col-span-full text-gray-500">No meals found.</p>
                            )}
                        </div>
                    </div>
                </div>

            </div>

            {/* total meals served */}
            <div>
                <TotalMeals></TotalMeals>
            </div>

            <div className="container flex flex-col mx-auto my-20">
                <h1 className="text-3xl font-bold text-center mb-5">Buy Package</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5">
                    {subPackages.map((pkg, index) => (
                        <SubPackageCard
                            key={index}
                            packageName={pkg.name}
                            packagePrice={pkg.price}
                            features={pkg.features}
                        />
                    ))}
                </div>
            </div>



            {/* news letter */}
            <div className="bg-base-200 p-6 rounded-lg mt-8 pb-20 pt-10 text-center">
                <h2 className="text-xl font-bold mb-4">Stay Updated</h2>
                <p className="mb-4">Subscribe to our newsletter for the latest meals updates.</p>
                <form className="flex justify-center gap-2">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        className="input input-bordered w-2/3 md:w-1/3"
                    />
                    <button className="btn btn-primary">Subscribe</button>
                </form>
            </div>

        </div>
    )
}

export default Home;