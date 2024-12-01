"use client";

import Link from 'next/link';
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { isAuthenticated, login, errorMessage } = useAuth();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await login(email, password);
  };

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/')
    }
  }, [isAuthenticated, router]);

  return (
    <div className="h-screen bg-gray-200">
      <div className="container mx-auto py-5 h-full">
        <div className="flex justify-center items-center h-full">
          <div className="w-full xl:w-10/12">
            <div className="bg-white rounded-3xl text-black shadow-lg">
              <div className="flex flex-wrap">
                {/* Form Side */}
                <div className="w-full lg:w-1/2">
                  <div className="p-8 md:p-10 mx-auto">
                    <div className="text-center">
                      <Link href="/">
                        <img src="/images/logo-new.png" alt="logo" className="w-[7rem] mx-auto" />
                      </Link>
                    </div>

                    <form onSubmit={handleSubmit} className="mt-6">
                      <div className="mb-4">
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
                          Địa chỉ email
                        </label>
                        <input
                          type="email"
                          id="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full px-4 py-2 text-base text-gray-700 bg-white border border-gray-300 rounded-md outline-mainColor focus:ring-1"
                          placeholder="example@email.com"
                        />
                      </div>

                      <div className="mb-4">
                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">
                          Mật khẩu
                        </label>
                        <input
                          type="password"
                          id="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full px-4 py-2 text-base text-gray-700 bg-white border border-gray-300 rounded-md outline-mainColor"
                          placeholder="Nhập mật khẩu"
                        />
                      </div>

                      {errorMessage && <p className="mb-4 text-red-500">{errorMessage}</p>}

                      <div className="text-center pt-1 mb-6 pb-1">
                        <button type="submit" className="w-full py-2 mb-3 text-white bg-mainColor rounded-md hover:bg-opacity-70 transition duration-300">
                          Đăng nhập
                        </button>
                        <Link href="/forgot-password" className="text-sm text-gray-600 hover:text-mainColor hover:underline transition duration-300">
                          Quên mật khẩu?
                        </Link>
                      </div>

                      <div className="flex items-center justify-center pb-4">
                        <p className="mb-0 mr-2 text-gray-700">Không có tài khoản?</p>
                        <Link href="/signup" className="px-4 py-2 text-white border bg-mainColor rounded-md hover:bg-opacity-70 transition duration-300">
                          Tạo mới
                        </Link>
                      </div>
                    </form>
                  </div>
                </div>

                {/* Right Side */}
                <div className="hidden lg:flex lg:w-1/2 items-center bg-gradient-custom-login text-white rounded-tr-3xl rounded-br-3xl p-8 md:p-10">
                  <div>
                    <h4 className="mb-4 text-[30px] font-semibold font-greatvibes">
                      Nơi Lưu Giữ Kỷ Niệm Thời Gian
                    </h4>
                    <p className="text-sm leading-relaxed font-interItalic">
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
    </div>
  );
}
