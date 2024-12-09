import API from "../api"
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const popularTags = ["Technology", "Lifestyle", "Education", "Travel", "Health"];

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [uniqueCategories, setUniqueCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    API.get('blogs/')
      .then((response) => {
        setBlogs(response.data);

        // Extract unique categories from blogs
        const categories = response.data.map(blog => blog.category).flat();
        const uniqueCategories = [...new Set(categories)]; // Remove duplicates
        setUniqueCategories(uniqueCategories);
      })
      .catch((error) => console.error('Error fetching blogs:', error));
  }, []);

  const handleCategoryClick = (category) => {
    navigate(`/blogs?category=${category}`);
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      {/* Hero Section */}
      <div className="mb-12">
        <div className="relative">
          <img
            src={`http://localhost:8000/api${blogs[0]?.image}`}
            alt={blogs[0]?.title}
            className="w-full h-80 object-cover rounded-lg"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-start text-white p-6">
            <h1 className="text-4xl font-bold mb-4">{blogs[0]?.title}</h1>
            <p className="mb-6">Discover insights and inspiration in our featured blog – your spotlight for the most compelling stories!</p>
            <Link
              to={`/blogs/${blogs[0]?.id}`}
              className="px-6 py-2 bg-gradient-to-r from-pink-500 to-sky-500 text-black rounded-md shadow-lg hover:from-sky-500 hover:to-emerald-500 transform hover:scale-105 transition-all duration-300 ease-in-out"
            >
              Read More
            </Link>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-wrap -mx-4">
        {/* Latest Posts */}
        <div className="w-full lg:w-8/12 px-4 mb-8">
          <h2 className="text-2xl font-bold mb-6">Latest Posts</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.slice(0, 3).map((blog) => (
              <div
                key={blog.id}
                className="border rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="overflow-hidden">
                  <img
                    src={`http://localhost:8000/api${blog.image}`}
                    alt={blog.title}
                    className="w-full h-40 object-cover transition-transform duration-300 ease-in-out transform hover:scale-125"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2 overflow-hidden text-ellipsis whitespace-nowrap">{blog.title}</h3>
                  <p className="text-gray-600 text-sm mb-1">By {blog.author}</p>
                  <p className="text-gray-500 text-xs mb-4">{blog.date}</p>
                  <p className="text-gray-700 text-sm mb-4 overflow-hidden text-ellipsis whitespace-nowrap">{blog.snippet}</p>
                  <Link
                    to={`/blogs/${blog.id}`}
                    className="text-blue-500 hover:underline"
                  >
                    Read More
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-4/12 px-4">
          {/* Categories */}
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-4">Categories</h3>
            <ul className="space-y-2">
              {uniqueCategories.map((category, index) => (
                <li key={index}>
                  {/* <Link
                    to={`/blogs/${category.toLowerCase()}`}
                    className="text-blue-500 hover:underline"
                  >
                    {category}
                  </Link> */}
                  <button onClick={() => handleCategoryClick(category)}
                  className="text-blue-500 hover:underline">
                  {category}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Tags */}
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-4">Popular Tags</h3>
            <div className="flex flex-wrap gap-2">
              {popularTags.map((tag, index) => (
                <Link
                  key={index}
                  to={`/tags/${tag.toLowerCase()}`}
                  className="px-3 py-1 bg-gray-200 rounded-full text-sm text-gray-700 hover:bg-gray-300"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>

          {/* Subscribe to Newsletter */}
          <div className="p-6 border rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4">Subscribe to Newsletter</h3>
            <form>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
              />
              <button
                type="submit"
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
