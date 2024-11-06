"use client";

import Link from 'next/link';
import { useEffect, useState } from "react";
import fetcher from "@/utils/fetcher";
import useSWR from "swr";
import SearchPageSkeleton from "@/components/skeleton/SearchPageSkeleton";

export default function SignUpPage() {
  const [currentUrl, setCurrentUrl] = useState("");
  const {
    data,
    error,
    isLoading,
  }: { data: any; error: any; isLoading: boolean } = useSWR(
    "/latest-post",
    fetcher
  );

  useEffect(() => {
    const currentUrl = window.location.href;
    setCurrentUrl(currentUrl);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  if (error) return <div>There was an Error!</div>;

  if (isLoading) return <SearchPageSkeleton />;
  return (
    <div className="max-w-4xl mx-auto font-[sans-serif] p-6">
      <div className="text-center mb-16">
        <Link href="/">
          <img src="/images/logo-new.png" alt="logo" className="w-[7rem] mx-auto" />
        </Link>
        <h4 className="text-gray-800 text-base font-semibold mt-6">
          Sign up into your account
        </h4>
      </div>

      <form>
        <div className="grid sm:grid-cols-2 gap-8">
          <div>
            <label className="text-gray-800 text-sm mb-2 block">Email Id</label>
            <input
              name="email"
              type="text"
              className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3.5 rounded-md focus:bg-transparent outline-blue-500 transition-all"
              placeholder="Enter email"
            />
          </div>
          <div>
            <label className="text-gray-800 text-sm mb-2 block">Mobile No.</label>
            <input
              name="number"
              type="number"
              className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3.5 rounded-md focus:bg-transparent outline-blue-500 transition-all"
              placeholder="Enter mobile number"
            />
          </div>
          <div>
            <label className="text-gray-800 text-sm mb-2 block">Nick Name</label>
            <input
              name="nick_name"
              type="text"
              className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3.5 rounded-md focus:bg-transparent outline-blue-500 transition-all"
              placeholder="Enter nick name"
            />
          </div>
          <div>
            <label className="text-gray-800 text-sm mb-2 block">Sex</label>
            <select
              name="sex"
              className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3.5 rounded-md focus:bg-transparent outline-blue-500 transition-all"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <div>
            <label className="text-gray-800 text-sm mb-2 block">Birth Date</label>
            <input
              name="birth_date"
              type="date"
              className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3.5 rounded-md focus:bg-transparent outline-blue-500 transition-all"
            />
          </div>
          <div>
            <label htmlFor="address_one" className="block text-sm font-medium text-gray-700">Address Line One</label>
            <input type="text" id="address_one" name="address_one" placeholder="Address Line One" className="mt-1 p-2 border rounded w-full" />
          </div>
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
            <input type="text" id="city" name="city" placeholder="City" className="mt-1 p-2 border rounded w-full" />
          </div>
          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700">State</label>
            <input type="text" id="state" name="state" placeholder="State" className="mt-1 p-2 border rounded w-full" />
          </div>
          <div>
            <label className="text-gray-800 text-sm mb-2 block">Password</label>
            <input
              name="password"
              type="password"
              className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3.5 rounded-md focus:bg-transparent outline-blue-500 transition-all"
              placeholder="Enter password"
            />
          </div>
          <div>
            <label className="text-gray-800 text-sm mb-2 block">Confirm Password</label>
            <input
              name="cpassword"
              type="password"
              className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3.5 rounded-md focus:bg-transparent outline-blue-500 transition-all"
              placeholder="Enter confirm password"
            />
          </div>
        </div>

        <div className="!mt-12">
          <button
            type="button"
            className="py-3.5 px-7 text-sm font-semibold tracking-wider rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
          >
            Sign up
          </button>
        </div>
      </form>
    </div>
  );
}

