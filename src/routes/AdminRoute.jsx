import { useContext } from "react";
import { AuthContext } from "../provider/AuthProvider";
import { Navigate } from "react-router-dom";


const AdminRoute = ({children}) => {
    const {isAdmin} = useContext(AuthContext);
    if(isAdmin){
        return children;
    }
    return <Navigate to="/" />;
};

export default AdminRoute;