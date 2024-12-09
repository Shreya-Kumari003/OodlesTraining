import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API from "../api";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userResponse = await API.get("user/");
        setUser(userResponse.data);

        const blogsResponse = await API.get("user/blogs/");
        setBlogs(blogsResponse.data);
      } catch (error) {
        console.error("Failed to fetch user details or blogs", error);
        toast.error("Failed to fetch user details. Please log in.");
      } finally {
        setLoading(false); // Set loading to false after data fetching
      }
    };

    fetchUserDetails();
  }, []); // Empty dependency array ensures the effect runs only once

  const handleEdit = (id) => {
    navigate(`/edit-blog/${id}`);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      API.delete(`blogs/${id}/`)
        .then(() => {
          setBlogs(blogs.filter((blog) => blog.id !== id));
          toast.success("Blog deleted successfully");
        })
        .catch((error) => toast.error("Error deleting blog"));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    toast.success("User Logged out", {
      theme: "dark",
    });
    setTimeout(() => {
      navigate("/");
    }, 2000);
  };

  const handleEditProfile = () => {
    navigate("/edit-profile");
  };

  const handleCreateNewBlog = () => {
    navigate("/create-blog");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl font-semibold">Loading user details...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl font-semibold">
          You are not logged in. Please log in to view your profile.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-4xl bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Profile
        </h1>
        {/* User Details */}

        <div className="flex justify-center items-center">
          <div className="relative w-24 h-24 rounded-full overflow-hidden flex items-center justify-center text-5xl font-semibold text-white">
            <div className="absolute inset-0 animate-bg bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500"></div>
            <span className="relative z-10 gradient-text">
              {user?.first_name[0]?.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <label className="text-lg text-gray-700 font-semibold">
              Username
            </label>
            <p className="text-lg text-gray-600">{user?.username}</p>
          </div>
          <div className="flex justify-between items-center">
            <label className="text-lg text-gray-700 font-semibold">
              Full Name
            </label>
            <p className="text-lg text-gray-600">
              {user?.first_name + " " + user?.last_name}
            </p>
          </div>
          <div className="flex justify-between items-center">
            <label className="text-lg text-gray-700 font-semibold">
              Occupation
            </label>
            <p className="text-lg text-gray-600">{user?.occupation}</p>
          </div>
        </div>

        <div className="mt-8 flex justify-between space-x-4">
          <button
            onClick={handleEditProfile}
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 w-full md:w-auto"
          >
            Edit Profile
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700 w-full md:w-auto"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="container mx-auto py-8">
        <div className="flex justify-around items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">My Blogs</h1>
          <button
            onClick={handleCreateNewBlog}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-sky-500 text-black px-8 py-3 rounded-md shadow-lg hover:from-sky-500 hover:to-emerald-500"
          >
            <FaPlus />
            <span>Create New Blog</span>
          </button>
        </div>
        <div className="space-y-6">
          {blogs.map((blog) => (
            <div key={blog.id} className="bg-white rounded-lg shadow-md">
              <div className="flex flex-col md:flex-row items-center p-6">
                {blog.image && (
                  <Link to={`/blogs/${blog.id}`}>
                    <img
                      src={`http://localhost:8000/api${blog.image}`}
                      alt={blog.title}
                      className="w-24 h-15 object-cover rounded-md mr-4 mb-4 md:mb-0"
                    />
                  </Link>
                )}
                <div className="flex-1">
                  <Link to={`/blogs/${blog.id}`}>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                      {blog.title}
                    </h2>
                  </Link>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500">
                    <span className="font-semibold">Date Created:</span>{" "}
                    {blog.date_created.split("T")[0]}
                  </p>
                </div>
                <div className="flex space-x-4 mt-4 md:mt-0">
                  <button
                    onClick={() => handleEdit(blog.id)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(blog.id)}
                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        theme="colored"
      />
    </div>
  );
};

export default Profile;
