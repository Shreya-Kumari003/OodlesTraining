import React, { useState, useRef, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useParams } from "react-router-dom";
import { QuillToolbar, modules, formats } from "../components/EditorToolbar";
import API from "../api";

const categories = ["Technology", "Lifestyle", "Education", "Travel", "Health"];

const EditBlog = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [existingImage, setExistingImage] = useState("");
  const [imagePreview, setImagePreview] = useState("src/assets/grid.jpg");
  const [category, setCategory] = useState(""); // New state for category
  const navigate = useNavigate();
  const fileInputRef = useRef();

  useEffect(() => {
    API.get(`blogs/${id}/`)
      .then((response) => {
        const { title, content, image, category } = response.data;
        console.log(response.data);
        setTitle(title);
        setImagePreview(`http://localhost:8000/api${image}`);
        setContent(content);
        setExistingImage(image); // Store the existing image URL
        setCategory(category); // Set the existing category
      })
      .catch((error) =>
        console.error("Error fetching blog for editing:", error)
      );
  }, [id]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("category", category); // Include the selected category
    if (image) {
      formData.append("image", image); // Include the image if one is selected
    }
    try {
      API.put(`blogs/${id}/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }).then((response) => {
        toast.success("Blog Updated Successfully", {
          theme: "colored",
        });
        setTimeout(() => {
          navigate("/");
        }, 2000);
      });
    } catch {
      toast.error("Internal Server Error");
      console.log("Blog Data:", { title, image, content, category });
    }
  };

  return (
    <div className="flex flex-col items-center py-10 px-4 min-h-screen bg-gray-100">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Edit Blog
      </h2>
      {/* Blog Title and Image Upload in Same Row */}
      <div className="w-full max-w-5xl flex items-start space-x-6 mb-6">
        {/* Blog Title */}
        <div className="flex-1">
          <label
            htmlFor="title"
            className="block text-xl font-bold text-gray-800 mb-2"
          >
            Blog Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md"
            placeholder="Enter blog title"
            required
          />
        </div>

        {/* Image Upload */}
        <div className="flex-2">
          <label
            htmlFor="image"
            className="block text-xl font-bold text-gray-800 mb-2"
          >
            Change Image
          </label>
          <button
            onClick={handleClick}
            className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-3 rounded-md
             hover:from-blue-600 hover:to-blue-800 transition-all duration-300 ease-in-out w-full"
          >
            Choose Image
          </button>
          <input
            type="file"
            id="image"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageUpload}
            style={{ display: "none" }}
          />
        </div>
      </div>

      {/* Image Preview */}
      {imagePreview && (
        <div className="w-full max-w-5xl mb-6">
          <img
            src={imagePreview}
            alt="Selected"
            className="w-full h-72 object-cover rounded-md shadow-md"
          />
        </div>
      )}

      {/* Category Dropdown */}
      <div className="w-full max-w-5xl mb-6">
        <label
          htmlFor="category"
          className="block text-xl font-bold text-gray-800 mb-2"
        >
          Select Category
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md"
        >
          <option value="" disabled>Select a category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* React Quill Editor */}
      <div className="w-full max-w-5xl mb-6">
        <label
          htmlFor="content"
          className="block text-xl font-bold text-gray-800 mb-2 text-center"
        >
          Blog Content
        </label>
        <QuillToolbar />
        <ReactQuill
          theme="snow"
          value={content}
          onChange={setContent}
          className="bg-white"
          placeholder="Write your blog content here..."
          modules={modules}
          formats={formats}
        />
      </div>
      
      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className="bg-gradient-to-r from-pink-500 to-sky-500 text-white px-8 
        py-3 rounded-md hover:from-green-600 hover:to-green-800 
        transform hover:scale-105 transition-all duration-300 ease-in-out"
      >
        Update Blog
      </button>
      
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        theme="colored"
      />
    </div>
  );
};

export default EditBlog;
