import Navbar from '../components/Navbar';
import { Outlet } from 'react-router';
import Footer from '../components/Footer';
// import { AuthContext } from '../provider/AuthProvider';

// const AuthLayout = ({children}) => {
const AuthLayout = ({children}) => {

    // const {user} = useContext(AuthProvider);

    

    return (
        <div>
            <Navbar></Navbar>
            <Outlet></Outlet>
            <Footer></Footer>
        </div>
    );
};

export default AuthLayout;