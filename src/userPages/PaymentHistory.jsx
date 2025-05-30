import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Loading from "../components/Loading";
import { useContext } from "react";
import { AuthContext } from "../provider/AuthProvider";


const PaymentHistory = () => {

    const { user } = useContext(AuthContext); 
    const email =  user?.email 

    // Fetch payment history
    const { data: payments = [], isLoading, error } = useQuery({
        queryKey: ["paymentHistory"],
        queryFn: async () => {
            const res = await axios.get(`https://honey-meal-server.vercel.app/payments/${email}`);
            return res.data;
        },
        enabled: !!email,
    });

    if (isLoading) return <Loading></Loading>;
    if (error) return <p className="text-center text-red-500">Error loading payment history</p>;

    return (
        <div className="overflow-x-auto p-5 min-h-screen">
            <h2 className="text-2xl font-semibold mb-4">Payment History</h2>
            <div className="overflow-x-auto">
                <table className="table">
                    {/* Table Header */}
                    <thead>
                        <tr>
                            <th></th>
                            <th>Date</th>
                            <th>Package</th>
                            <th>Price ($)</th>
                            <th>Transaction ID</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="text-center text-gray-500">No payments found</td>
                            </tr>
                        ) : (
                            payments.map((payment, index) => (
                                <tr key={payment._id}>
                                    <th>{index + 1}</th>
                                    <td>{new Date(payment.date).toLocaleDateString()}</td>
                                    <td>{payment.userPackage}</td>
                                    <td>${payment.price}</td>
                                    <td>{payment.transactionId}</td>
                                    <td>
                                        <span className={`badge ${payment.status === "purchased" ? "badge-success" : "badge-error"}`}>
                                            {payment.status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PaymentHistory;
