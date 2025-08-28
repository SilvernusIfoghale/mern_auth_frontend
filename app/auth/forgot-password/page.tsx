"use client";

import { API_URL } from "@/app/server";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    setLoading(true);

    try {
      await axios.post(
        `${API_URL}/user/forgot-password`,
        { email },
        { withCredentials: true }
      );
      toast.success("Reset code sent to your email");
      router.push(`/auth/reset-password?email=${encodeURIComponent(email)}`);
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        console.log(error.response.data.message);
        toast.error(error.response.data.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-slate-100">
      <div className="bg-white p-10 rounded-lg">
        <h2 className="font-semibold text-lg py-3">
          Provide you email associated with account
        </h2>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="johndoe@gmail.com"
          className="border rounded bg-gray-200 py-3 px-4 w-full"
        />
        {loading ? (
          <Button className="flex place-self-center my-2">
            <Loader className="animate-spin" />
          </Button>
        ) : (
          <Button
            className="flex place-self-center my-2"
            onClick={handleSubmit}
          >
            Submit
          </Button>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
