import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const UserNavbar = () => {
  const navigate = useNavigate();

  const links = [
    <li key="profile">
      <Link to="/user/profile">Profile</Link>
    </li>,
    <li key="meals">
      <Link to="/user/meals">Camp Request</Link>
    </li>,
    <li key="reviews">
      <Link to="/user/reviews">User Reviews</Link>
    </li>,
    <li key="payment">
      <Link to="/user/history">Payment History</Link>
    </li>,
  ];

  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            {links}
          </ul>
        </div>
        <a className="btn btn-ghost text-xl">User Dashboard</a>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">{links}</ul>
      </div>
      <div className="navbar-end">
        <Link to="/">
          <button className="btn btn-primary">Main Page</button>
        </Link>
      </div>
    </div>
  );
};

export default UserNavbar;
