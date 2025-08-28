"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./store/store";
import { Avatar } from "@/components/ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { API_URL } from "./server";
import axios from "axios";
import { setAuthUser } from "./store/authSlice";
import { toast } from "sonner";

const HomePage: React.FC = () => {
  const [dropDown, setDropDown] = useState(false);
  const user = useSelector((state: RootState) => state?.auth.user);
  const dispatch = useDispatch();
  // console.log("Redux User", user);
  const handleLogout = async () => {
    await axios.post(`${API_URL}/user/logout`);
    dispatch(setAuthUser(null));
    toast.success("Logout Successful");
  };

  return (
    <div>
      <div className="shadow">
        <header>
          <nav className="flex h-16 px-10 items-center justify-between mx-auto">
            <h1 className="font-black text-lg">Auth</h1>

            {user ? (
              <div className="flex items-center space-x-2">
                <div className="relative ">
                  <Avatar
                    className="flex items-center justify-center rounded-full bg-gray-100 cursor-pointer "
                    onClick={() => setDropDown(!dropDown)}
                  >
                    {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
                    <AvatarFallback className="font-semibold uppercase">
                      {user.username.split("")[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`${
                      dropDown ? "block" : "hidden"
                    } absolute shadow top-8 bg-white left-[-5px]`}
                  >
                    <Button
                      variant={"ghost"}
                      size={"sm"}
                      onClick={handleLogout}
                    >
                      Logout
                    </Button>
                  </div>
                </div>

                <Button size={"sm"} className="cursor-pointer">
                  Dashboard
                </Button>
                <Button variant={"ghost"} size={"sm"}>
                  {user.isVerified ? "Verified" : "Not Verified"}
                </Button>
              </div>
            ) : (
              <Link href="/auth/signup">
                <Button
                  size="sm"
                  className="text-xs font-normal hover:cursor-pointer"
                >
                  Register
                </Button>
              </Link>
            )}
          </nav>
        </header>
      </div>
      <div
        className="h-[90vh] flex justify-center items-center"
        onClick={() => setDropDown(false)}
      >
        <p className="text-3xl font-semibold ">HomePage</p>
      </div>
    </div>
  );
};

export default HomePage;
