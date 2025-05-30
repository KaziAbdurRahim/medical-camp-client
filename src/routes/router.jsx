import { createBrowserRouter } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import Home from "../pages/Home";
import HomeLayout from "../layouts/HomeLayout";
import Page404 from "../pages/Page404";
import Login from "../pages/Login";
import Register from "../pages/Register";
import AdminRoute from "./AdminRoute";
import AdminDashboard from "../adminPages/AdminDashboard";
import AdminLayout from "../layouts/AdminLayout";
import AdminProfile from "../adminPages/AdminProfile";
import AddMeal from "../adminPages/AddMeal";
import MealDetails from "../pages/MealDetails";
import AllMeals from "../pages/AllMeals";
// import AddUpcomingMeal from "../adminPages/AddUpcomingMeal";
import UpcomingMeal from "../adminPages/UpcomingMeal";
import ServeMeal from "../adminPages/ServeMeal";
import AdminAllMeal from "../adminPages/AdminAllMeal";
import AdminAllReviews from "../adminPages/AdminAllReviews";
import ManageUsers from "../adminPages/ManageUsers";
import UserLayout from "../layouts/UserLayout";
import UserDashboard from "../userPages/UserDashboard";
import UserProfile from "../userPages/UserProfile";
import UserMealRequest from "../userPages/UserMealRequest";
import UserReviews from "../userPages/UserReviews";
import AllUpcomingMeal from "../pages/AllUpcomingMeal";
import Payment from "../pages/Payment";
import PaymentHistory from "../userPages/PaymentHistory";


const router = createBrowserRouter([
    {
        path: "/",
        element: <HomeLayout></HomeLayout>,
        children: [
            {
                path: "/",
                element: <Home></Home>
            },
            {
                path: "/meal/:id",
                element: <MealDetails></MealDetails>,
            },
            {
                path: '/meals',
                element: <AllMeals></AllMeals>
            },
            {
                path: '/upcoming-meals',
                element: <AllUpcomingMeal></AllUpcomingMeal>
            },
            {
                path: '/payments',
                element: <Payment></Payment>
            }
            
        ]
    },
    {
        path: "/auth",
        element: <HomeLayout />,
        children: [
            {
                path: "/auth/login",
                element: <Login />,
            },
            {
                path: "/auth/register",
                element: <Register />,
            }
        ],
    },
    //admin dashboard
    {
        path: "/admin",
        element: <AdminRoute><AdminLayout></AdminLayout></AdminRoute>,
        children: [
            {
                path: "/admin",
                element: <AdminDashboard></AdminDashboard>
            },
            {
                path: "/admin/profile",
                element: <AdminProfile></AdminProfile>
            },
            {
                path: "/admin/add-meal",
                element: <AddMeal></AddMeal>
            },
            {
                path: "/admin/add-upcomingmeal",
                element: <UpcomingMeal></UpcomingMeal>
            },
            {
                path: "/admin/serve-meal",
                element: <ServeMeal></ServeMeal>
            },
            {
                path: "/admin/all-meal",
                element: <AdminAllMeal></AdminAllMeal>
            },
            {
                path: "/admin/all-reviews",
                element: <AdminAllReviews></AdminAllReviews>
            },
            {
                path: "/admin/manage-user",
                element: <ManageUsers></ManageUsers>
            },
        ]
    },
    // user dashboard
    {
        path: "/user",
        element: <UserLayout></UserLayout>,
        children: [
            {
                path: "/user",
                element: <UserDashboard></UserDashboard>
            },
            {
                path:"/user/profile",
                element: <UserProfile></UserProfile>
            },
            {
                path:"/user/meals",
                element: <UserMealRequest></UserMealRequest>
            },
            {
                path:"/user/reviews",
                element: <UserReviews></UserReviews>
            },
            {
                path:"/user/history",
                element: <PaymentHistory></PaymentHistory>
            },
        
    ]
    },
    {
        path: "*",
        element: <Page404></Page404>
    }
])

export default router;