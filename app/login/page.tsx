"use client";

import instance from "@/utils/instance";
import Link from 'next/link';
import {useState } from "react";
import { useRouter } from 'next/navigation';
import useCsrfToken from '@/hooks/useCsrfToken';

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  const csrfToken = useCsrfToken();

  const login = async (email: string, password: string) => {
    try {
      const response = await instance.post('/login', {
        email,
        password,
      }, {
        headers: {
          'X-CSRF-TOKEN': csrfToken,
        },
        withCredentials: true,
      });
      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, message: error.response?.data.message || 'Đăng nhập thất bại' };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    const result = await login(email, password);

    if (result.success) {
      router.push('/');
    } else {
      setErrorMessage(result.message);
    }
    setIsLoading(false);
  };


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
                      <img src="/images/lotus.webp" alt="logo" className="w-48 mx-auto" />
                    </div>

                    <form onSubmit={handleSubmit} className="mt-6">
                      {errorMessage && <p className="mb-4 text-red-500">{errorMessage}</p>}
                      
                      <div className="mb-4">
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
                          Địa chỉ email
                        </label>
                        <input
                          type="email"
                          id="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="w-full px-4 py-2 text-base text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
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
                          required
                          className="w-full px-4 py-2 text-base text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                          placeholder="••••••••"
                        />
                      </div>

                      <div className="text-center pt-1 mb-6 pb-1">
                        <button type="submit" className="w-full py-2 mb-3 text-white bg-mainColor rounded-md hover:bg-opacity-70 transition duration-300" disabled={isLoading}>
                          {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
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
    </div>
  );
}
