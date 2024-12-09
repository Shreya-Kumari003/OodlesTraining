import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import API from "../api";
import useShowImages from "../hooks/useShowImages";
import { formatDistanceToNow } from "date-fns";

const BlogDetails = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch blog details
    API.get(`blogs/${id}/`)
      .then((response) => setBlog(response.data))
      .catch((error) => console.error("Error fetching blog:", error));

    // Fetch comments for the blog
    // blogs/9/comments/list
    API.get(`blogs/${id}/comments/list/`)
      .then((response) => setComments(response.data))
      .catch((error) => console.error("Error fetching comments:", error));
  }, [id]);

  console.log(comments);

  const imageSrc = useShowImages(blog?.image);

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    API.post(`blogs/${id}/comments/`, {
      content: newComment,
      blog: id,
    })
      .then((response) => {
        setComments((prev) => [...prev, response.data]); // Append the new comment
        setNewComment(""); // Clear the input
      })
      .catch((error) => console.error("Error adding comment:", error));
  };

  const calculateReadingTime = (text) => {
    const wordsPerMinute = 200; // Average reading speed
    const wordCount = text.split(/\s+/).length;
    const timeInMinutes = Math.ceil(wordCount / wordsPerMinute);
    return timeInMinutes;
  };

  const readingTime = calculateReadingTime(blog?.content || "");

  return (
    <div className="container mx-auto py-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Post Title on Top */}
        <div className="p-6">
          <h2 className="text-5xl font-semibold text-gray-800 mb-6 text-center">
            {blog?.title}
          </h2>
          <div className="flex item-center justify-center mb-4">
            <span className="bg-black text-xs text-white px-3 py-1 rounded-full hover:bg-slate-700 hover:text-black hover:scale-105">
              <Link
                to={`/blogs?category=${blog?.category}`}
                className="text-white"
              >
                {blog?.category}
              </Link>
            </span>
          </div>

          {/* Image Below the Title */}
          {imageSrc && (
            <img
              src={imageSrc}
              alt="How to Learn React"
              className="w-full h-[500px] object-cover mb-4"
            />
          )}
          <div className="px-20">
            <div className="flex justify-between items-center text-sm text-gray-500 mb-2">
              <p>
                <span className="font-semibold">Author: </span>
                {blog?.author}
              </p>
              <p>
                <span className="font-semibold">Min Read:</span> {readingTime}{" "}
                min
              </p>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              <span className="font-semibold">Date Created:</span>{" "}
              {blog?.date_created.split("T")[0]}
            </p>
            {/* Post Content */}
            <div
              className="blog_content"
              dangerouslySetInnerHTML={{ __html: blog?.content }}
            />
          </div>
        </div>
      </div>
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <h2 className="text-3xl font-semibold mb-6 text-center">Comments</h2>

        {/* Display existing comments */}
        <div className="space-y-6 mb-8">
          {comments.map((comment) => (
            <div key={comment.id} className="border-b pb-4">
              <div className="flex justify-between items-center text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  {/* Circle with the first letter */}
                  <div className="w-6 h-6 rounded-full bg-gray-700 text-white flex items-center justify-center text-xs font-semibold">
                    {comment.username[0].toUpperCase()}
                  </div>
                  <strong>@{comment.username}</strong>
                </div>

                <span>
                  {formatDistanceToNow(new Date(comment.date_created), {
                    addSuffix: true,
                  })}
                </span>
              </div>

              <p className="text-gray-700 mt-2 text-sm">{comment.content}</p>
            </div>
          ))}
        </div>

        {/* Add a new comment form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-lg rounded-lg p-6 border-t-2 border-gray-200"
        >
          <h3 className="text-xl font-medium mb-4">Leave a Comment</h3>
          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">
              Your Comment
            </label>
            <textarea
              value={newComment}
              onChange={handleCommentChange}
              placeholder="Write your comment"
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              rows="3"
              required
            />
          </div>
          <button
            type="submit"
            className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Post Comment
          </button>
        </form>
      </div>
    </div>
  );
};

export default BlogDetails;
