"use client";
import { API_URL } from "@/app/server";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React, { useState } from "react";
import axios from "axios";
import { Loader } from "lucide-react";
import { useDispatch } from "react-redux";
import { setAuthUser } from "@/app/store/authSlice";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const Signup: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.password !== confirmPassword) {
      return toast.warning("Password doesn't match");
    }
    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/user/signup`, formData, {
        withCredentials: true,
      });
      const user = response.data.data;
      // console.log(user);
      toast.success("Signup Successful");
      dispatch(setAuthUser(user));
      router.push("/auth/verify");
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        setLoading(false);
        toast.error(error.response.data.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center mx-auto bg-gray-100">
      <div className="w-[90%] sm:w-[60%] md:w-[70%] lg:w-[35%] xlg:w-[28%] bg-white rounded flex justify-center">
        <div className="w-[90%]">
          <h2 className="my-10 font-bold text-center">SIGN-UP</h2>
          <form className="" onSubmit={submitHandler}>
            <div className="my-3">
              <label htmlFor="username" className="font-semibold text-sm">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                placeholder="John Doe"
                className="bg-gray-200 w-full p-2 rounded text-sm"
              />
            </div>
            <div className="my-3">
              <label htmlFor="email" className="font-semibold text-sm">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="johndoe@gmail.com"
                className="bg-gray-200 w-full p-2 rounded"
              />
            </div>
            <div className="my-3">
              <label htmlFor="Password" className="font-semibold text-sm">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="**********"
                className="bg-gray-200 w-full p-2 rounded"
              />
            </div>

            <div className="my-3">
              <label
                htmlFor="confirmPassword"
                className="font-semibold text-sm"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="**********"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-gray-200 w-full p-2 rounded"
              />
            </div>
            <div className="my-5">
              {!loading && <Button className="w-full">Sign up</Button>}
              {loading && (
                <Button className="w-full">
                  <Loader className="animate-spin" />
                </Button>
              )}
            </div>
            <div className="my-5 mx-auto text-center">
              Already have an account?&nbsp;
              <Link
                href="/auth/login"
                className="text-blue-600 hover:underline"
              >
                Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
