import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation(); // Get current location
  const navigate = useNavigate();
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    toast.success("User Logged out",{
      theme:"dark"
    });
    setTimeout(() => {
      navigate("/");
    }, 2000);
  };

  // Function to check if the link is active
  const isActive = (path) =>
    location.pathname === path ? "bg-gray-700 text-white" : "";

  const isLoggedIn = !!localStorage.getItem("access_token"); // Check if user is logged in

  return (
    <header className="bg-gray-800 text-white shadow-md">
      <div className="mx-auto flex justify-between items-center py-4 px-6">
        {/* Logo */}
        <div className="text-2xl font-bold">
          <Link to="/" className="gradient-text text-2xl font-bold uppercase">
            Shreya's Blog
          </Link>
        </div>

        {/* Hamburger Icon for smaller screens */}
        <div className="lg:hidden flex items-center" onClick={toggleMenu}>
          <button className="text-white">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Navigation Links (Hidden on small screens) */}
        <nav className={`hidden lg:flex gap-6`}>
          <Link
            to="/home"
            className={`py-2 px-4 rounded-md hover:text-gray-300 ${isActive(
              "/home"
            )}`}
          >
            Home
          </Link>
          <Link
            to="/about"
            className={`py-2 px-4 rounded-md hover:text-gray-300 ${isActive(
              "/about"
            )}`}
          >
            About
          </Link>
          <Link
            to="/blogs"
            className={`py-2 px-4 rounded-md hover:text-gray-300 ${isActive(
              "/blogs"
            )}`}
          >
            Blogs
          </Link>
          <Link
            to="/contact"
            className={`py-2 px-4 rounded-md hover:text-gray-300 ${isActive(
              "/contact"
            )}`}
          >
            Contact
          </Link>
          <Link
            to="/profile"
            className={`py-2 px-4 rounded-md hover:text-gray-300 ${isActive(
              "/profile"
            )}`}
          >
            Profile
          </Link>
        </nav>

        <div className="gap-4 lg:flex hidden">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-md hover:from-red-600 hover:to-red-700"
            >
              Logout
            </button>
          ) : (
            <>
              <Link to="/login">
                <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-md hover:from-blue-600 hover:to-blue-700">
                  Login
                </button>
              </Link>
              <Link to="/signup">
                <button className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-md hover:from-green-600 hover:to-green-700">
                  Signup
                </button>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Dropdown Menu for smaller screens */}
      <div
        className={`md:hidden bg-gray-800 text-white p-4 ${
          isMenuOpen ? "block" : "hidden"
        }`}
      >
        <Link
          to="/home"
          className={`block py-2 px-2 rounded-md hover:text-gray-300 ${isActive(
            ""
          )}`}
        >
          Home
        </Link>
        <Link
          to="/about"
          className={`block py-2 px-2 rounded-md hover:text-gray-300 ${isActive(
            "/about"
          )}`}
        >
          About
        </Link>
        <Link
          to="/blogs"
          className={`block py-2 px-2 rounded-md hover:text-gray-300 ${isActive(
            "/blogs"
          )}`}
        >
          Blogs
        </Link>
        <Link
          to="/contact"
          className={`block py-2 px-2 rounded-md hover:text-gray-300 ${isActive(
            "/contact"
          )}`}
        >
          Contact
        </Link>
        <Link
          to="/profile"
          className={`block py-2 px-2 rounded-md hover:text-gray-300 ${isActive(
            "/profile"
          )}`}
        >
          Profile
        </Link>

        {/* Login and Signup Buttons in Mobile Dropdown */}
        <div className="mt-4">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="bg-gradient-to-r from-red-500 to-red-600 w-full px-4 py-2 rounded-md hover:from-red-600 hover:to-red-700 mb-2"
            >
              Logout
            </button>
          ) : (
            <>
              <Link to="/login">
                <button className="bg-gradient-to-r from-blue-500 to-blue-600 w-full px-4 py-2 rounded-md hover:from-blue-600 hover:to-blue-700 mb-2">
                  Login
                </button>
              </Link>
              <Link to="/signup">
                <button className="bg-gradient-to-r from-green-500 to-green-600 w-full px-4 py-2 rounded-md hover:from-green-600 hover:to-green-700">
                  Signup
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        theme="colored"
      />
    </header>
  );
};

export default Header;
