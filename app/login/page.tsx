"use client";

import Link from 'next/link';
import { useEffect, useState } from "react";
import fetcher from "@/utils/fetcher";
import useSWR from "swr";
import SearchPageSkeleton from "@/components/skeleton/SearchPageSkeleton";
import LoginLayout from './layout';

export default function LoginPage() {
  const [currentUrl, setCurrentUrl] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
    <LoginLayout>
    <div>
      <section className="h-screen bg-gray-200">
        <div className="container mx-auto py-5 h-full">
          <div className="flex justify-center items-center h-full">
            <div className="w-full xl:w-10/12">
              <div className="bg-white rounded-3xl text-black shadow-lg">
                <div className="flex flex-wrap">
                  {/* Left side (Form) */}
                  <div className="w-full lg:w-1/2">
                    <div className="p-8 md:p-10 mx-auto">
                      <div className="text-center">
                        <img
                          src="/images/lotus.webp"
                          alt="logo"
                          className="w-48 mx-auto"
                        />
                      </div>

                      <form onSubmit={handleSubmit} className="mt-6">
                        <div className="mb-4">
                          <label
                            htmlFor="email"
                            className="block mb-2 text-sm font-medium text-gray-700"
                          >
                            Địa chỉ email
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email"
                            required
                            className="w-full px-4 py-2 text-base text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                            placeholder="example@email.com"
                          />
                        </div>

                        <div className="mb-4">
                          <label
                            htmlFor="password"
                            className="block mb-2 text-sm font-medium text-gray-700"
                          >
                            Mật khẩu
                          </label>
                          <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="current-password"
                            required
                            className="w-full px-4 py-2 text-base text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                            placeholder="••••••••"
                          />
                        </div>

                        <div className="text-center pt-1 mb-6 pb-1">
                          <button
                            type="submit"
                            className="w-full py-2 mb-3 text-white bg-mainColor rounded-md hover:bg-opacity-70 transition duration-300"
                          >
                            Đăng nhập
                          </button>
                          <Link
                            href="/forgot-password"
                            className="text-sm text-gray-600 hover:text-mainColor hover:underline transition duration-300"
                          >
                            Quên mật khẩu?
                          </Link>
                        </div>

                        <div className="flex items-center justify-center pb-4">
                          <p className="mb-0 mr-2 text-gray-700">Không có tài khoản?</p>
                            <a
                              href="/signup"
                              
                              className="px-4 py-2 text-white border bg-mainColor rounded-md hover:bg-opacity-70 transition duration-300"
                            >
                              Tạo mới
                            </a>
                        </div>
                      </form>
                    </div>
                  </div>

                  {/* Right side (Description) */}
                  <div className="hidden lg:flex lg:w-1/2 items-center bg-gradient-custom-login text-white rounded-tr-3xl rounded-br-3xl p-8 md:p-10">
                    <div>
                      <h4 className="mb-4 text-xl font-semibold">
                        Nơi Lưu Giữ Kỷ Niệm Thời Gian
                      </h4>
                      <p className="text-sm leading-relaxed">
                        Chúng ta không chỉ đơn thuần ghi lại những câu chuyện, mà còn gói ghém từng khoảnh khắc của quá khứ.
                        Những ký ức đẹp, những hoài niệm sâu lắng về thời thanh xuân, tình bạn, và gia đình...
                        Tất cả được lưu giữ nơi đây, để mỗi khi tìm lại, bạn như thấy mình quay về những năm tháng cũ, với tất cả cảm xúc tinh khôi và trong trẻo.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
    </LoginLayout>
  );
}