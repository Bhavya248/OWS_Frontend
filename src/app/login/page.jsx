"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import Cookies from "js-cookie";
import "react-toastify/dist/ReactToastify.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email || !password) {
      toast.error("Email and password are required");
      return;
    }

    try {
      const response = await fetch("/api/validate-credentials", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          email,
          password,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();

      if (data.found && data.can_access) {
        // Store the server response data in cookies with a 12-hour expiration time
        const expiration = new Date(new Date().getTime() + 12 * 60 * 60 * 1000);

        Cookies.set("RNS", data.RNS || "", { expires: expiration });
        Cookies.set("username", data.username || "", { expires: expiration });
        Cookies.set("email", data.email || "", { expires: expiration });
        Cookies.set("first_name", data.first_name || "", {
          expires: expiration,
        });
        Cookies.set("last_name", data.last_name || "", { expires: expiration });
        Cookies.set("addresses", JSON.stringify(data.addresses || []), {
          expires: expiration,
        });

        // Show success message and part of the response in toast
        toast.success(
          `Login successful! Welcome, ${data.first_name || data.username}`
        );

        // Redirect after a short delay
        // setTimeout(() => {
        router.push("/");
        // }, 1500);
      } else {
        // Display the error from the server response
        toast.error(data.error || "Invalid credentials. Please try again.");
      }
    } catch (error) {
      toast.error(error.message || "An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen mx-3">
      <ToastContainer position="top-right" autoClose={3000} />

      <form
        className="w-full max-w-md p-8 shadow-lg rounded-lg"
        onSubmit={handleSubmit}
      >
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white text-center">
          Login to OneWaySwap
        </h1>
        <div className="mb-5">
          <label
            htmlFor="email"
            className="block text-left mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Your email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-gray-950 border border-gray-300 text-gray-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="xyz@mail.com"
            required
          />
        </div>
        <div className="mb-5">
          <label
            htmlFor="password"
            className="block mb-2 text-left text-sm font-medium text-gray-900 dark:text-white"
          >
            Your password
          </label>
          <input
            type="password"
            id="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-gray-950 border border-gray-300 text-gray-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
          />
        </div>
        <button
          type="submit"
          className="text-white btn p-5 font-medium rounded-lg text-sm w-full text-center"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
