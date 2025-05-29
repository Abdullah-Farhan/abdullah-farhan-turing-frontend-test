"use client";

import useAuthStore from "@/services/auth.service";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LuUserRound } from "react-icons/lu";
import { toast } from "react-toastify";
import { MdOutlineLock } from "react-icons/md";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username) {
      return toast.error("Username is Required!");
    }
    if (!password) {
      return toast.error("Password is Required!");
    }
    const payload = {
      username,
      password,
    };

    await login(payload)
      .then((res) => {
        if (res?.status === 201 || res?.status === 200) {
          Cookies.set("access_token", res?.data?.access_token);
          Cookies.set("refresh_token", res?.data?.refresh_token);
          toast.success("Log In Successful.");
          router.push("/home");
        } else {
          toast.error(res?.error || "Error Logging In.");
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error(err?.response?.message || "An Unexpected Error Occured.");
      });
  };

  return (
    <div className="flex justify-center items-center bg-white rounded-md py-16">
      <form
        className="w-full lg:w-[700px] space-y-6 px-4 md:px-10"
        onSubmit={(e) => handleSubmit(e)}
      >
        {/* Username Input */}
        <div className="space-y-2">
          <label htmlFor="username" className="block text-sm font-semibold">
            <span className="text-red-500">*</span> User Name
          </label>
          <div className="flex items-center border border-gray-300 rounded px-3 py-2">
            <LuUserRound className="text-gray-400 mr-2" />
            <input
              id="username"
              type="text"
              required
              placeholder="Enter your username"
              className="w-full outline-none"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
        </div>

        {/* Password Input */}
        <div className="space-y-2">
          <label htmlFor="username" className="block text-sm font-semibold">
            <span className="text-red-500">*</span> Password
          </label>
          <div className="flex items-center border border-gray-300 rounded px-3 py-2">
            <MdOutlineLock className="text-gray-400 mr-2" />
            <input
              id="password"
              type="password"
              required
              placeholder="Enter your password"
              className="w-full outline-none"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        {/* Login Button */}
        <input
          type="submit"
          value="Login"
          className="px-3 py-2 bg-blue-500 text-white flex justify-center items-center"
        />
      </form>
    </div>
  );
};

export default LoginForm;
