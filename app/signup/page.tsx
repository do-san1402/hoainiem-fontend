"use client";

import Link from 'next/link';
import { useEffect, useState } from "react";
import fetcher from "@/utils/fetcher";
import useSWR from "swr";
import { useRouter } from 'next/navigation';
import SearchPageSkeleton from "@/components/skeleton/SearchPageSkeleton";
import useAuth from "@/hooks/useAuth";

interface FormValues {
  email: string;
  contact_no: string;
  full_name: string;
  sex: string;
  birth_date: string;
  address_one: string;
  password: string;
  cpassword: string;
}

interface FormErrors {
  [key: string]: string;
}

export default function SignUpPage() {
  const router = useRouter();
  const { register } = useAuth(); 
  const [currentUrl, setCurrentUrl] = useState("");
  const [formValues, setFormValues] = useState<FormValues>({
    email: "",
    contact_no: "",
    full_name: "",
    sex: "",
    birth_date: "",
    address_one: "",
    password: "",
    cpassword: ""
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const {
    data,
    error,
    isLoading,
  }: { data: any; error: any; isLoading: boolean } = useSWR(
    "/latest-post",
    fetcher
  );

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  const validate = () => {
    const errors: FormErrors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formValues.email) {
      errors.email = "Vui lòng nhập địa chỉ email.";
    } else if (!emailPattern.test(formValues.email)) {
      errors.email = "Địa chỉ email không hợp lệ.";
    }

    if (!formValues.contact_no) {
      errors.contact_no = "Vui lòng nhập số điện thoại.";
    }

    if (!formValues.full_name) {
      errors.full_name = "Vui lòng nhập họ và tên.";
    }

    if (!formValues.sex) {
      errors.sex = "Vui lòng chọn giới tính.";
    }

    if (!formValues.birth_date) {
      errors.birth_date = "Vui lòng nhập ngày sinh.";
    }

    if (!formValues.address_one) {
      errors.address_one = "Vui lòng nhập địa chỉ.";
    }

    if (!formValues.password) {
      errors.password = "Vui lòng nhập mật khẩu.";
    } else if (formValues.password.length < 8) {
      errors.password = "Mật khẩu phải có ít nhất 8 ký tự.";
    }

    if (formValues.password !== formValues.cpassword) {
      errors.cpassword = "Mật khẩu xác nhận không khớp.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validate()) {
      const { success, message } = await register(
        formValues.email,
        formValues.full_name,
        formValues.contact_no,
        formValues.birth_date,
        formValues.address_one,
        formValues.sex,
        formValues.password,
        formValues.cpassword
      );

      if (success) {
        router.push('/login');
      } else {
        setFormErrors({ general: message });
      }
    }
  };

  if (error) return <div>Đã xảy ra lỗi!</div>;

  if (isLoading) return <SearchPageSkeleton />;

  return (
    <div className="max-w-4xl mx-auto font-[sans-serif] p-6">
      <div className="text-center mb-16">
        <Link href="/">
          <img src="/images/logo-new.png" alt="logo" className="w-[7rem] mx-auto" />
        </Link>
        <h4 className="text-gray-800 text-base font-semibold mt-7">
          Đăng ký tài khoản
        </h4>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid sm:grid-cols-2 gap-8">
          <div>
            <label className="text-gray-800 text-sm mb-2 block">Địa chỉ email</label>
            <input
              name="email"
              type="text"
              value={formValues.email}
              onChange={handleChange}
              className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3.5 rounded-md focus:bg-transparent outline-mainColor transition-all"
              placeholder="Nhập email"
            />
            {formErrors.email && <span className="text-red-500 text-sm">{formErrors.email}</span>}
          </div>

          <div>
            <label className="text-gray-800 text-sm mb-2 block">Số điện thoại</label>
            <input
              name="contact_no"
              type="number"
              value={formValues.contact_no}
              onChange={handleChange}
              className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3.5 rounded-md focus:bg-transparent outline-mainColor transition-all"
              placeholder="Nhập số điện thoại"
            />
            {formErrors.contact_no && <span className="text-red-500 text-sm">{formErrors.contact_no}</span>}
          </div>

          <div>
            <label className="text-gray-800 text-sm mb-2 block">Họ & tên</label>
            <input
              name="full_name"
              type="text"
              value={formValues.full_name}
              onChange={handleChange}
              className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3.5 rounded-md focus:bg-transparent outline-mainColor transition-all"
              placeholder="Nhập họ & tên"
            />
            {formErrors.full_name && <span className="text-red-500 text-sm">{formErrors.full_name}</span>}
          </div>

          <div className="relative">
            <label className="text-gray-800 text-sm mb-2 block">Giới tính</label>
            <select
              name="sex"
              value={formValues.sex}
              onChange={handleChange}
              className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3.5 rounded-md focus:bg-transparent outline-mainColor transition-all appearance-none pr-10"
            >
              <option value="">Chọn giới tính</option>
              <option value="Male">Nam</option>
              <option value="Female">Nữ</option>
            </select>
            {formErrors.sex && <span className="text-red-500 text-sm">{formErrors.sex}</span>}
            <div className="absolute right-4 top-[29px] bottom-0 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.23 8.27a.75.75 0 01.02-1.06z" />
              </svg>
            </div>
          </div>

          <div>
            <label className="text-gray-800 text-sm mb-2 block">Ngày sinh</label>
            <input
              name="birth_date"
              type="date"
              value={formValues.birth_date}
              onChange={handleChange}
              className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3.5 rounded-md focus:bg-transparent outline-mainColor transition-all"
            />
            {formErrors.birth_date && <span className="text-red-500 text-sm">{formErrors.birth_date}</span>}
          </div>

          <div>
            <label className="text-gray-800 text-sm mb-2 block">Địa chỉ</label>
            <input
              name="address_one"
              type="text"
              value={formValues.address_one}
              onChange={handleChange}
              className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3.5 rounded-md focus:bg-transparent outline-mainColor transition-all"
              placeholder="Nhập địa chỉ"
            />
            {formErrors.address_one && <span className="text-red-500 text-sm">{formErrors.address_one}</span>}
          </div>

          <div>
            <label className="text-gray-800 text-sm mb-2 block">Mật khẩu</label>
            <input
              name="password"
              type="password"
              value={formValues.password}
              onChange={handleChange}
              className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3.5 rounded-md focus:bg-transparent outline-mainColor transition-all"
              placeholder="Nhập mật khẩu"
            />
            {formErrors.password && <span className="text-red-500 text-sm">{formErrors.password}</span>}
          </div>

          <div>
            <label className="text-gray-800 text-sm mb-2 block">Xác nhận mật khẩu</label>
            <input
              name="cpassword"
              type="password"
              value={formValues.cpassword}
              onChange={handleChange}
              className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3.5 rounded-md focus:bg-transparent outline-mainColor transition-all"
              placeholder="Nhập lại mật khẩu"
            />
            {formErrors.cpassword && <span className="text-red-500 text-sm">{formErrors.cpassword}</span>}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 sm:flex-row justify-between">
          <button
            type="button"
            onClick={() => router.push('/login')}
            className="p-3 text-sm font-semibold tracking-wider rounded-md text-white bg-gray-500 hover:bg-gray-300 focus:outline-none"
          >
            Quay lại đăng nhập
          </button>

          <button
            type="submit"
            className="p-3 text-sm font-semibold tracking-wider rounded-md text-white bg-mainColor hover:bg-mainColorHover focus:outline-none"
          >
            Đăng ký
          </button>
        </div>
      </form>
    </div>
  );
}
