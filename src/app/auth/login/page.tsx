"use client";

import axios from "axios";

export default function Page() {

  const handleLogin = async () => {
    try {
      const response = await axios.get("/api/user/login");
      const { url } = response.data;

      // Redirect to Google OAuth URL
      window.location.href = url;
    } catch (error) {
      console.error("Error during login", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <h1 className="text-3xl font-bold">Login</h1>
      <p className="text-lg">To continue, please log in with Google:</p>
      <button
        onClick={handleLogin}
        className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-500 transition duration-300"
      >
        Login with Google
      </button>
    </div>
  );
}
