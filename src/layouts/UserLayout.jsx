import Footer from '../components/Footer';
import { Outlet } from 'react-router';
import UserNavbar from '../components/UserNavbar';
import { useContext } from 'react';
import { AuthContext } from '../provider/AuthProvider';
import { useNavigate } from 'react-router-dom';

const UserLayout = () => {
    const {user} = useContext(AuthContext)
    const navigate = useNavigate();

    if(!user) navigate('/')

    return (
        <div>
            <UserNavbar></UserNavbar>
            <Outlet></Outlet>
            <Footer></Footer>
        </div>
    );
};

export default UserLayout;