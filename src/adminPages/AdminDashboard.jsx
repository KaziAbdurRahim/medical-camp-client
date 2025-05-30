import { useContext } from "react";
import { AuthContext } from "../provider/AuthProvider";
import axios from "axios";

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4">
            {/* Dashboard Title */}
            <div className="text-center mb-8">
                <h1 className="text-4xl font-semibold text-gray-800">Admin Dashboard</h1>
                <p className="text-lg text-gray-600 mt-2">Manage and track the performance of the system</p>
            </div>

            {/* Dashboard Content */}
            <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Admin Info Section */}
                    <div className="flex flex-col items-center md:items-start">
                        <h2 className="text-2xl font-bold text-gray-700">Welcome, {user?.name || "Admin"}</h2>
                        <p className="text-lg text-gray-500 mt-2">All the action tabs are in the navbar or menu</p>
                    </div>

                    {/* Image Section */}
                    <div className="flex justify-center md:justify-end">
                        <img 
                            className="rounded-lg  max-w-full h-auto" 
                            src="https://img.freepik.com/free-vector/website-analysis-seo-reports-analytics-pie-charts-diagrams-computer-monitor-screen-business-financial-analyst-annual-presentation-concept-illustration_335657-1737.jpg?t=st=1738224289~exp=1738227889~hmac=9a5f6f97994b7787ee2b9b93097aa2311501383eeb156cec0e495efea78600e1&w=1060" 
                            alt="Admin Dashboard" 
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
