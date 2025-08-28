"use client";

import { API_URL } from "@/app/server";
import { setAuthUser } from "@/app/store/authSlice";
import { RootState } from "@/app/store/store";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const Verify = () => {
  // Store multiple refs in an array
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]); // store 6 digits
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (!user) router.replace("/auth/signup");
  }, [user, router]);

  // Handle input change: digits only
  const handleChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;

    // Only allow digits
    if (!/^\d*$/.test(value)) return;

    // Update OTP state
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input if digit entered
    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace: move to previous input when empty
  const handleKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (
      event.key === "Backspace" &&
      event.currentTarget.value === "" &&
      index > 0
    ) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // ✅ Get OTP as a single string
      const otpValue = otp.join("");
      const response = await axios.post(
        `${API_URL}/user/verify`,
        { otp: otpValue },
        { withCredentials: true }
      );
      const verifiedUser = response.data.data.user;
      dispatch(setAuthUser(verifiedUser));
      toast.success("Verification Successful");
      router.push("/");
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        toast.error(error.response.data.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    try {
      await axios.post(`${API_URL}/user/resend-otp`, null, {
        withCredentials: true,
      });
      toast.success("New Otp is sent to your email");
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        toast.error(error.response.data.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-slate-100">
      <div className=" bg-white rounded-lg shadow p-5 md:p-20">
        <h2 className="text-lg font-semibold py-5 ">
          Enter you email validation code
        </h2>
        {Array.from({ length: 6 }).map((_, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el; // assign input ref
            }}
            type="text"
            inputMode="numeric" // mobile numeric keypad
            pattern="[0-9]*" // numeric pattern
            maxLength={1} // one character only
            onChange={(event) => handleChange(index, event)}
            onKeyDown={(event) => handleKeyDown(index, event)}
            className="m-2 p-2 w-10 text-center border"
          />
        ))}

        <div className="py-5">
          {loading ? (
            <>
              <Button
                variant={"secondary"}
                size={"sm"}
                className="cursor-pointer"
                onClick={handleSubmit}
              >
                <Loader className="animate-spin" />
              </Button>
              <Button
                variant={"ghost"}
                size={"sm"}
                className="text-blue-400 hover:text-blue-500 text-sm hover:bg-transparent cursor-pointer"
                onClick={handleResendOtp}
              >
                <Loader className="animate-spin" />
              </Button>
            </>
          ) : (
            <>
              <Button
                variant={"secondary"}
                size={"sm"}
                className="cursor-pointer"
                onClick={handleSubmit}
              >
                Submit
              </Button>
              <Button
                variant={"ghost"}
                size={"sm"}
                className="text-blue-400 hover:text-blue-500 text-sm hover:bg-transparent cursor-pointer"
                onClick={handleResendOtp}
              >
                resend Otp
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Verify;
