import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Loading from "../components/Loading";
import Swal from "sweetalert2";

const ManageUsers = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    // const limit = 1; // Users per page

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ["users", username, email, page, limit],
        queryFn: () =>
            axios
                .get("https://honey-meal-server.vercel.app/users", {
                    params: { username: username.trim(), email: email.trim(), page, limit },
                })
                .then((res) => res.data),
        enabled: true,
    });

    const handleSearch = () => {
        setPage(1); // Reset to first page on search
        refetch();
    };

    const handleMakeAdmin = async (userId) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You are about to promote this user to admin!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, promote to admin!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await axios.post("https://honey-meal-server.vercel.app/make-admin", { userId });
                    Swal.fire("Success!", response.data.message, "success");
                    refetch(); // Refresh user list
                } catch (error) {
                    Swal.fire("Error!", error.response?.data?.message || "Failed to promote user.", "error");
                }
            }
        });
    };

    if (isLoading) return <Loading />;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-semibold mb-3">All Users</h1>
            <div className="flex gap-4 mb-4">
                <input
                    type="text"
                    placeholder="Search by username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="input input-bordered w-1/4"
                />
                <input
                    type="email"
                    placeholder="Search by email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input input-bordered w-1/4"
                />
                <button onClick={handleSearch} className="btn btn-primary">Search</button>
            </div>
            
            <div className="overflow-x-auto border rounded-lg">
                <table className="table">
                    <thead>
                        <tr>
                            <th>User Name</th>
                            <th>Email</th>
                            <th>Subscription Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.users.length > 0 ? (
                            data.users.map((user) => (
                                <tr key={user._id}>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.badge}</td>
                                    <td>
                                        {user.role === "student" ? (
                                            <button onClick={() => handleMakeAdmin(user._id)} className="btn btn-sm btn-accent">Make Admin</button>
                                        ) : (
                                            <p>Admin</p>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center text-gray-500">No users found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            
            <div className="flex justify-center mt-4 gap-2">
                <button onClick={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={page === 1} className="btn btn-sm">
                    Previous
                </button>
                <span className="p-2">Page {page} of {data?.totalPages || 1}</span>
                <button onClick={() => setPage((prev) => (prev < data?.totalPages ? prev + 1 : prev))} disabled={page >= (data?.totalPages || 1)} className="btn btn-sm">
                    Next
                </button>
                <div className="ml-2 max-w-[70px]"><select defaultValue={limit} className="select" onChange={(e) => {setLimit(Number(e.target.value)); setPage(1)}}>
                    <option disabled={true}>No of items</option>
                    <option>2</option>
                    <option>5</option>
                    <option>10</option>
                    <option>20</option>
                </select></div>
            </div>
        </div>
    );
};

export default ManageUsers;
