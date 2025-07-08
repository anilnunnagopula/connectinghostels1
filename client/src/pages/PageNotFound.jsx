import React from "react";
import { useNavigate } from "react-router-dom";

const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-center px-4">
      <h1 className="text-4xl font-bold text-red-600 align-middle justify-center">
        404 - Oops! Page Not Found 😵‍💫
      </h1> 
      <p className="mt-2 text-gray-600 dark:text-gray-300 max-w-md">
        Either the page doesn’t exist, or it’s still under construction. Wanna
        go back home?
      </p>
      <button
        onClick={() => navigate("/")}
        className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
      >
        ⬅️ Go Home
      </button>
    </div>
  );
};

export default PageNotFound;
