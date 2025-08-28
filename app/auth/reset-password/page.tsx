"use client";
import { API_URL } from "@/app/server";
import { setAuthUser } from "@/app/store/authSlice";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Loader } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

const ResetPassword = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();
  const router = useRouter();

  const handleSubmit = async () => {
    if (!otp || !email || !password || !confirmPassword) {
      return;
    }
    setLoading(true);

    try {
      const data = { email, otp, password, confirmPassword };
      const response = await axios.post(
        `${API_URL}/user/reset-password`,
        data,
        { withCredentials: true }
      );
      dispatch(setAuthUser(response.data.data.user));
      toast.success("Password reset successful");
      router.push("/auth/login");
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        toast.error(error.response.data.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white p-10 rounded-lg">
        <h2 className="my-10 font-bold text-center">RESET PASSWORD</h2>
        <form className="">
          <div className="my-3">
            <label htmlFor="otp" className="font-semibold text-sm">
              OTP
            </label>
            <input
              id="otp"
              name="otp"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="123456"
              className="bg-gray-200 w-full p-2 rounded text-sm"
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="**********"
              className="bg-gray-200 w-full p-2 rounded"
            />
          </div>

          <div className="my-3">
            <label htmlFor="confirmPassword" className="font-semibold text-sm">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="**********"
              className="bg-gray-200 w-full p-2 rounded"
            />
          </div>
          <div className="flex items-center justify-center space-x-5">
            <div className="my-5">
              {!loading && (
                <Button size={"sm"} className="text-xs" onClick={handleSubmit}>
                  Change Password
                </Button>
              )}
              {loading && (
                <Button size={"sm"} className="text-xs">
                  <Loader className="animate-spin" />
                </Button>
              )}
            </div>
            <div className="my-5  text-center">
              <Button
                size={"sm"}
                variant={"ghost"}
                onClick={() => router.back()}
                className="text-xs"
              >
                &larr; Go Back
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
