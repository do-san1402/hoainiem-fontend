"use client";

import Link from 'next/link';
import { useState } from "react";
import { useRouter } from 'next/navigation';
import useAuth from "@/hooks/useAuth";
import { useEffect } from "react";
import Image from "next/image";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const { sendForgotPasswordEmail, isAuthenticated } = useAuth();
  const [message, setMessage] = useState<{ text: string; type: string } | null>(null);
  const [isWaiting, setIsWaiting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);


  useEffect(() => {
    if (isAuthenticated) {
      router.push('/')
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsWaiting(true);
    setTimeLeft(60);

    const result = await sendForgotPasswordEmail(email);
    setMessage({ text: result.message, type: result.success ? "success" : "error" });
  };

  useEffect(() => {
    if (isWaiting && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      setIsWaiting(false);
    }
  }, [isWaiting, timeLeft]);

  return (
    <div className="max-w-4xl mx-auto font-[sans-serif] p-6">
      <div className="text-center mb-16">
        <Link href="/">
          <Image src="/images/logo-new.png" alt="logo" className="w-[7rem] mx-auto" />
        </Link>
        <h3 className="text-gray-600 text-base font-semibold mt-7">
          Đặt Lại Mật Khẩu
        </h3>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid sm:grid-cols-1 gap-8">
          <div>
            <label className="text-gray-800 text-md mb-2 block">Địa chỉ email</label>
            <input
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3.5 rounded-md focus:bg-transparent outline-mainColor transition-all"
              placeholder="Nhập email"
              required
            />
          </div>
        </div>

        {message && (
          <div className={`mt-4 ${message.type === "success" ? "text-green-600" : "text-red-600"}`}>
            {message.text}
          </div>
        )}

        <div className="mt-12 flex flex-col gap-4 sm:flex-row justify-between">
          <button
            type="button"
            onClick={() => router.push('/login')}
            className="p-3 text-sm font-semibold tracking-wider rounded-md text-white bg-gray-600 hover:bg-gray-500 focus:outline-none"
          >
            Quay lại đăng nhập
          </button>

          <button
            type="submit"
            className="p-3 text-sm flex items-center font-semibold tracking-wider rounded-md text-white bg-mainColor hover:bg-mainColor/70 focus:outline-none"
            disabled={isWaiting}
          >
            {isWaiting ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-gray-300 border-t-mainColor rounded-full animate-spin mr-2"></span>
                Gửi lại trong {timeLeft}s
              </>
            ) : (
              "Gửi email xác nhận"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}


