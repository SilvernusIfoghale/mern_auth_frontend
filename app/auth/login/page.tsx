/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { API_URL } from "@/app/server";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React, { useState } from "react";
import axios from "axios";
import { Loader } from "lucide-react";
import { useDispatch, UseDispatch } from "react-redux";
import { setAuthUser } from "@/app/store/authSlice";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const Login: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [formData, setFormData] = useState({
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
    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/user/login`, formData, {
        withCredentials: true,
      });
      const user = response.data.data;
      // console.log(user);
      toast.success("Login Successful");
      dispatch(setAuthUser(user));
      router.push("/");
    } catch (error: any) {
      setLoading(false);
      toast.error(error.response.data.message);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center mx-auto bg-gray-100">
      <div className="w-[90%] sm:w-[60%] md:w-[70%] lg:w-[35%] xlg:w-[28%] bg-white rounded flex justify-center">
        <div className="w-[90%]">
          <h2 className="my-10 font-bold text-center">LOG IN</h2>
          <form className="" onSubmit={submitHandler}>
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

              <Link
                href={"/auth/forgot-password"}
                className="text-sm text-right block my-1 text-blue-500 hover:underline"
              >
                Forgot Password
              </Link>
            </div>

            <div className="my-5">
              {!loading && <Button className="w-full">Log in</Button>}
              {loading && (
                <Button className="w-full">
                  <Loader className="animate-spin" />
                </Button>
              )}
            </div>
            <div className="my-5 mx-auto text-center">
              Don&apos;t have an account? &nbsp;
              <Link
                href="/auth/signup"
                className="text-blue-600 hover:underline"
              >
                Sign-up
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
