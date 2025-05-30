import { useContext } from "react";
import { AuthContext } from "../provider/AuthProvider";

const UserDashboard = () => {
    const { user } = useContext(AuthContext);

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4">
            {/* Dashboard Title */}
            <div className="text-center mb-8">
                <h1 className="text-4xl font-semibold text-gray-800">User Dashboard</h1>
                <p className="text-lg text-gray-600 mt-2">Welcome to your dashboard!</p>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* User Info Section */}
                    <div className="flex flex-col items-center md:items-start">
                        <h2 className="text-2xl font-bold text-gray-700 mb-2">Welcome, {user?.name || "User"}</h2>
                        <p className="text-lg text-gray-500">Find all the actions tabs in the menu</p>
                    </div>

                    {/* Profile Image Section */}
                    <div className="flex justify-center md:justify-end">
                        <img 
                            className="w-32 h-32 rounded-full shadow-xl object-cover" 
                            src={user?.photoURL || "https://www.w3schools.com/w3images/avatar2.png"} 
                            alt="Profile" 
                        />
                    </div>
                </div>

                {/* Optional Meal Info or Additional Content */}
                <div className="text-center mt-8">
                    
                    <p className="text-gray-700 text-xl mt-20">You can manage your preferences and meals here.</p>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
