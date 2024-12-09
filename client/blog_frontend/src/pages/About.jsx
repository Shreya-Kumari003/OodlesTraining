import React from 'react';

const About = () => {
  return (
    <div className="bg-gray-100 min-h-screen py-8 px-4">
      <div className="container mx-auto text-center max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">About Us</h1>
        <p className="text-lg text-gray-600 mb-8">
          Welcome to Shreya's blog! We are passionate about sharing valuable insights, tips, and experiences on various topics, including technology, lifestyle, and more. Our mission is to provide engaging content that inspires, educates, and entertains.
        </p>

        <div className="flex justify-around mb-8">
          <div className="w-full md:w-1/3 bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Our Vision</h2>
            <p className="text-gray-600">
              Our vision is to create a platform where people can share their thoughts, knowledge, and experiences with the world. We strive to foster a community of like-minded individuals who can grow together.
            </p>
          </div>
          <div className="w-full md:w-1/3 bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Our Values</h2>
            <p className="text-gray-600">
              We believe in honesty, creativity, and collaboration. We value the diversity of perspectives and aim to create content that resonates with a wide audience, encouraging open discussion and learning.
            </p>
          </div>
          <div className="w-full md:w-1/3 bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Join Us</h2>
            <p className="text-gray-600">
              Whether you're a blogger, writer, or someone who just loves reading, we welcome you to join our community. Share your ideas, engage with others, and be a part of something great!
            </p>
          </div>
        </div>

        <div className="text-gray-600 text-lg">
          <p>
            Thank you for visiting Shreya's blog! We hope you enjoy our content and find it inspiring. Feel free to reach out to us if you have any questions or suggestions. We are always happy to hear from our readers.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
