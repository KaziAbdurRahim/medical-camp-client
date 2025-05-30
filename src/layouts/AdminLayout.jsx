import { Outlet } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";

const AdminLayout = () => {
    return (
        <div>
            <AdminNavbar></AdminNavbar>     
            <Outlet></Outlet>
        </div>
    );
};

export default AdminLayout;