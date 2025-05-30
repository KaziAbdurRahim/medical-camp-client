// import { useContext, useState } from "react";
// import { AuthContext } from "../provider/AuthProvider"; // Ensure AuthProvider is correctly imported
// import { toast } from "react-toastify";

// const AddUpcomingMeal = () => {
//   const { user } = useContext(AuthContext); // Get the current user's details
//   const [isModalOpen, setIsModalOpen] = useState(false); // State to handle modal visibility

//   // Toggle modal
//   const toggleModal = () => {
//     setIsModalOpen(!isModalOpen);
//   };

//   // Form submission handler
//   const handleAddMeal = (event) => {
//     event.preventDefault();
//     const form = event.target;
//     const title = form.title.value;
//     const category = form.category.value;
//     const image = form.image.value;
//     const ingredients = form.ingredients.value.split(",").map((item) => item.trim());
//     const description = form.description.value;
//     const price = parseFloat(form.price);

//     if (!title || !category || !image || !ingredients || !description || isNaN(price)) {
//       toast.error("Please fill out all fields!");
//       console.log(title, category, image, ingredients, description, price)
//       return;
//     }

//     const newMeal = {
//       title,
//       category,
//       image,
//       ingredients,
//       description,
//       price,
//       postTime: new Date().toISOString(),
//       distributor: {
//         name: user?.displayName || "Admin", // Fallback if user is undefined
//         email: user?.email || "admin@example.com",
//       },
//       rating: 0,
//       likes: 0,
//       reviewsCount: 0,
//       reviews: [],
//     };

//     // Example API call
//     fetch("http://localhost:5000/upcoming-meals", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(newMeal),
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         console.log("Meal added:", data);
//         toast.success("Meal added successfully!");
//         form.reset();
//         toggleModal(); // Close modal after successful addition
//       })
//       .catch((error) => {
//         console.error("Error adding meal:", error);
//         toast.error("Failed to add meal. Try again.");
//       });
//   };

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-3xl font-bold mb-6">Upcoming Meals</h1>

//       {/* Add Meal Button */}
//       <button className="btn btn-primary" onClick={toggleModal}>
//         Add a New Meal
//       </button>

//       {/* Modal */}
//       {isModalOpen && (
//         <dialog id="add_meal_modal" className="modal modal-bottom sm:modal-middle" open>
//           <div className="modal-box">
//             <h3 className="font-bold text-lg">Add an Upcoming Meal</h3>
//             <form onSubmit={handleAddMeal} className="space-y-4 mt-4">
//               <input
//                 type="text"
//                 name="title"
//                 placeholder="Meal Title"
//                 className="input input-bordered w-full"
//                 required
//               />
//               <select
//                 name="category"
//                 className="select select-bordered w-full"
//                 required
//               >
//                 <option value="" disabled selected>
//                   Select a Category
//                 </option>
//                 <option value="Breakfast">Breakfast</option>
//                 <option value="Lunch">Lunch</option>
//                 <option value="Dinner">Dinner</option>
//               </select>
//               <input
//                 type="url"
//                 name="image"
//                 placeholder="Image URL"
//                 className="input input-bordered w-full"
//                 required
//               />
//               <input
//                 type="text"
//                 name="ingredients"
//                 placeholder="Comma-separated Ingredients"
//                 className="input input-bordered w-full"
//                 required
//               />
//               <textarea
//                 name="description"
//                 placeholder="Description"
//                 className="textarea textarea-bordered w-full"
//                 required
//               ></textarea>
//               <input
//                 type="number"
//                 name="price"
//                 placeholder="Price"
//                 className="input input-bordered w-full"
//                 required
//               />
//               <div className="modal-action">
//                 <button type="submit" className="btn btn-primary">
//                   Add Meal
//                 </button>
//                 <button
//                   type="button"
//                   className="btn"
//                   onClick={toggleModal}
//                 >
//                   Close
//                 </button>
//               </div>
//             </form>
//           </div>
//         </dialog>
//       )}
//     </div>
//   );
// };

// export default AddUpcomingMeal;
