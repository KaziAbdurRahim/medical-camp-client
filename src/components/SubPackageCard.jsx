import { useContext } from "react";
import { AuthContext } from "../provider/AuthProvider";
import { useNavigate } from "react-router-dom";


const SubPackageCard = ({ packageName, packagePrice, features }) => {
    const navigate = useNavigate();
    const {user, setBuyPackage} = useContext(AuthContext);
    const handleSubcribe = () =>{
        // console.log({name: packageName, price: packagePrice})
        setBuyPackage({name: packageName, price: packagePrice});
        navigate('/payments')
    }

    return (
        <div className="card w-96 bg-base-100 shadow-2xl">
            <div className="card-body flex flex-col justify-between">
                {/* Badge for Most Popular, can be conditionally added */}
                {packageName === "Platinum" && <span className="badge badge-xs badge-warning">Most Popular</span>}
                <div className="flex justify-between">
                    <h2 className="text-3xl font-bold">{packageName}</h2>
                    <span className="text-xl">${packagePrice}/mo</span>
                </div>
                <ul className="mt-6 flex flex-col gap-2 text-xs">
                    {features.map((feature, index) => (
                        <li key={index}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="size-4 me-2 inline-block text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            <span>{feature}</span>
                        </li>
                    ))}
                </ul>
                <div className="mt-6">
                    <button className="btn btn-primary btn-block" onClick={handleSubcribe}>Subscribe</button>
                </div>
            </div>
        </div>
    );
};

export default SubPackageCard;