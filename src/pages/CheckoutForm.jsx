import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../provider/AuthProvider";
import axios from "axios";

const CheckoutForm = () => {
    const [error, setError] = useState('');
    const [clientSecret, setClientSecret] = useState('');
    const [transactionId, setTransactionId] = useState('');
    const stripe = useStripe();
    const elements = useElements();
    const { user, setBuyPackage, buyPackage } = useContext(AuthContext);
    const navigate = useNavigate();

    // 🛠️ FIX: Set package inside useEffect to avoid infinite loop
    // useEffect(() => {
    //     setBuyPackage({ name: "Gold", price: 10 });
    // }, []); 

    const totalPrice = buyPackage?.price || 0;

    useEffect(() => {
        if (totalPrice > 0) {
            axios.post('https://honey-meal-server.vercel.app/create-payment-intent', { price: totalPrice })
                .then(res => {
                    if (res.data?.clientSecret) {
                        setClientSecret(res.data.clientSecret);
                    } else {
                        setError("Payment initialization failed. Try again.");
                    }
                })
                .catch(err => setError("Error creating payment intent. " + err.message));
        }
    }, [totalPrice]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) return;

        const card = elements.getElement(CardElement);
        if (!card) return;

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card,
        });

        if (error) {
            setError(error.message);
            return;
        }

        // 🛠️ FIX: Ensure clientSecret is available before confirming payment
        if (!clientSecret) {
            setError("Payment not initialized properly. Try again.");
            return;
        }

        const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card,
                billing_details: {
                    email: user?.email || 'anonymous',
                    name: user?.displayName || 'anonymous',
                },
            },
        });

        if (confirmError) {
            setError("Payment failed. Please try again.");
            return;
        }

        if (paymentIntent?.status === 'succeeded') {
            setTransactionId(paymentIntent.id);

            const payment = {
                email: user.email,
                price: totalPrice,
                transactionId: paymentIntent.id,
                date: new Date(),
                userPackage: buyPackage.name,
                status: 'purchased',
            };

            try {
                const res = await axios.post('https://honey-meal-server.vercel.app/payments', payment);
                if (res.data?.insertedId) {
                    Swal.fire({
                        position: "top-end",
                        icon: "success",
                        title: "Thank you for purchasing!",
                        showConfirmButton: false,
                        timer: 1500,
                    });
                }
            } catch (err) {
                setError("Payment was successful but failed to save transaction.");
            }
        }
    };

    return (
        <div className="flex justify-center mt-36 mb-96">
            <div className="card w-full max-w-2xl bg-base-100 shadow-xl p-6">
                <h2 className="text-2xl font-semibold text-center mb-4">
                    Package Name: {buyPackage?.name || "Loading..."}
                </h2>
                <p className="mb-10">Total Price: {buyPackage?.price} usd</p>
                <form onSubmit={handleSubmit} className="">
                    <CardElement 
                        options={{
                            style: {
                                base: {
                                    fontSize: '16px',
                                    color: '#424770',
                                    padding: '10px',
                                    borderRadius: '8px',
                        
                                },
                                invalid: {
                                    color: '#9e2146',
                                },
                            },
                        }} 
                    />
                    <div className="mt-4 flex justify-between items-center">
                        <button 
                            className="btn btn-primary btn-block"
                            type="submit"
                            disabled={!stripe || !clientSecret}
                        >
                            Pay Now
                        </button>
                    </div>
                </form>
                {error && <p className="text-red-600 mt-4 text-center">{error}</p>}
                {transactionId && (
                    <p className="text-green-600 mt-4 text-center">
                        Your transaction ID: <span className="font-semibold">{transactionId}</span>
                    </p>
                )}
            </div>
        </div>
    );
};

export default CheckoutForm;
