import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import API from '../api';

const BlogList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [blogs, setBlogs] = useState([]);
  const [sortOrder, setSortOrder] = useState("latest");
  const blogsPerPage = 6;

  // Search Params
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get("category") || "";  // Default to empty if no category
  const [categories, setCategories] = useState([]);

  // Fetch blogs
  useEffect(() => {
    API.get('blogs/')
      .then((response) => {
        setBlogs(response.data);
        const categories = Array.from(
          new Set(response.data.map((blog) => blog.category))
        ).filter(Boolean); // Remove null or undefined categories
        setCategories(categories);
      })
      .catch((error) => console.error('Error fetching blogs:', error));
  }, []);

  // Filter and Sort Blogs
  const filteredBlogs = blogs
    .filter((blog) =>
      selectedCategory ? blog.category === selectedCategory : true
    )
    .sort((a, b) =>
      sortOrder === "latest"
        ? new Date(b.date_created) - new Date(a.date_created)
        : new Date(a.date_created) - new Date(b.date_created)
    );

  // Pagination
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleFirstPage = () => setCurrentPage(1);
  const handleLastPage = () => setCurrentPage(totalPages);

  const handleCategoryChange = (event) => {
    const category = event.target.value;
    setSearchParams(category ? { category } : {});
  };

  return (
    <div className="container mx-auto py-8 px-3">
      <h1 className="text-3xl font-bold text-center mb-6">Blog Posts</h1>

      {/* Filter and Sort Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="">All Categories</option>
          {categories.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>

        {/* Sort Order */}
        <button
          onClick={() => setSortOrder(sortOrder === "latest" ? "oldest" : "latest")}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Sort by: {sortOrder === "latest" ? "Oldest" : "Latest"}
        </button>
      </div>

      {/* Blog Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {currentBlogs.map((blog) => (
          <div
            key={blog.id}
            className="border rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <div className="overflow-hidden">
              {blog.image && (
                <img
                  src={`http://localhost:8000/api${blog.image}`}
                  alt={blog.title}
                  className="w-full h-60 object-cover transition-transform duration-300 ease-in-out transform hover:scale-125"
                />
              )}
            </div>
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2 overflow-hidden text-ellipsis whitespace-nowrap">
                {blog.title}
              </h2>
              <p className="text-gray-600 text-sm mb-1">By: {blog.author}</p>
              <p className="text-gray-500 text-xs">{blog.date_created}</p>
              <Link
                to={`/blogs/${blog.id}`}
                className="block mt-4 text-blue-500 hover:underline"
              >
                Read More
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-6 gap-4">
        <button
          onClick={handleFirstPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-lg ${
            currentPage === 1
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          First Page
        </button>
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-lg ${
            currentPage === 1
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          Previous
        </button>
        <span className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hidden lg:flex">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded-lg ${
            currentPage === totalPages
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          Next
        </button>
        <button
          onClick={handleLastPage}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded-lg ${
            currentPage === totalPages
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          Last Page
        </button>
      </div>
    </div>
  );
};

export default BlogList;
