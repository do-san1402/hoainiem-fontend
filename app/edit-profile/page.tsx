"use client";

import { useState, ChangeEvent, FormEvent } from "react";

type FormData = {
  email: string;
  contact_no: string;
  full_name: string;
  sex: string;
  birth_date: string;
  address_one: string;
  profile_image: File | null;
};

type FormErrors = {
  email: string;
  contact_no: string;
  full_name: string;
  sex: string;
  birth_date: string;
  address_one: string;
  profile_image: string;
};

export default function EditProfilePage() {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    contact_no: "",
    full_name: "",
    sex: "",
    birth_date: "",
    address_one: "",
    profile_image: null,
  });

  const [errors, setErrors] = useState<FormErrors>({
    email: "",
    contact_no: "",
    full_name: "",
    sex: "",
    birth_date: "",
    address_one: "",
    profile_image: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, profile_image: e.target.files[0] });
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {
      email: "",
      contact_no: "",
      full_name: "",
      sex: "",
      birth_date: "",
      address_one: "",
      profile_image: "",
    };

    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Vui lòng nhập địa chỉ email hợp lệ.";
    }

    if (!formData.contact_no || !/^\d{10}$/.test(formData.contact_no)) {
      newErrors.contact_no = "Vui lòng nhập số điện thoại hợp lệ (10 chữ số).";
    }

    if (!formData.full_name) {
      newErrors.full_name = "Họ và tên là bắt buộc.";
    }

    if (!formData.sex) {
      newErrors.sex = "Vui lòng chọn giới tính của bạn.";
    }

    if (!formData.birth_date) {
      newErrors.birth_date = "Ngày sinh là bắt buộc.";
    }

    if (!formData.address_one) {
      newErrors.address_one = "Địa chỉ là bắt buộc.";
    }

    if (!formData.profile_image) {
      newErrors.profile_image = "Ảnh đại diện là bắt buộc.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).every((key) => newErrors[key as keyof FormErrors] === "");
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (validate()) {
      console.log("Form data submitted: ", formData);
      // Add logic to submit form data to backend here
    }
  };
  return (
    <section className="py-[60px]">
      <div className="container px-4 mx-auto">
        <div className="flex justify-center items-center min-h-scree">
          <form onSubmit={handleSubmit} className="w-full max-w-4xl pt-8 pb-16 pl-8 pr-8 bg-white rounded-md shadow-lg">
            <h1 className="text-2xl font-bold mb-12">Chỉnh sửa hồ sơ</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

              <label className="block">
                <span className="text-gray-700">Email</span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-mainColor"
                />
                {errors.email && <p className="text-red-500 text-sm mt-2">{errors.email}</p>}
              </label>

              <label className="block">
                <span className="text-gray-700">Số điện thoại</span>
                <input
                  type="text"
                  name="contact_no"
                  value={formData.contact_no}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-mainColor"
                />
                {errors.contact_no && <p className="text-red-500 text-sm mt-2">{errors.contact_no}</p>}
              </label>

              <label className="block">
                <span className="text-gray-700">Họ và tên</span>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-mainColor"
                />
                {errors.full_name && <p className="text-red-500 text-sm mt-2">{errors.full_name}</p>}
              </label>

              <label className="block relative">
                <span className="text-gray-700">Giới tính</span>
                <select
                  name="sex"
                  value={formData.sex}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mainColor appearance-none"
                >
                  <option value="">Chọn</option>
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                </select>
                {/* Custom icon */}
                <div className="absolute right-4 top-[39px] flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.23 8.27a.75.75 0 01.02-1.06z" />
                  </svg>
                </div>
              </label>


              <label className="block">
                <span className="text-gray-700">Ngày sinh</span>
                <input
                  type="date"
                  name="birth_date"
                  value={formData.birth_date}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-mainColor"
                />
                {errors.birth_date && <p className="text-red-500 text-sm mt-2">{errors.birth_date}</p>}
              </label>

              <label className="block">
                <span className="text-gray-700">Địa chỉ</span>
                <input
                  type="text"
                  name="address_one"
                  value={formData.address_one}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-mainColor"
                />
                {errors.address_one && <p className="text-red-500 text-sm mt-2">{errors.address_one}</p>}
              </label>

              <label className="block md:col-span-2">
                <span className="text-gray-700">Ảnh đại diện</span>
                <input
                  type="file"
                  name="profile_image"
                  onChange={handleFileChange}
                  className="mt-1 block w-full text-gray-500"
                />
                {errors.profile_image && <p className="text-red-500 text-sm mt-2">{errors.profile_image}</p>}
              </label>
            </div>

            <div className="text-right">
              <button
                type="submit"
                className="py-4 px-4 mt-12 bg-mainColor text-white font-bold rounded-md hover:bg-mainColor/80 focus:outline-none focus:ring-2 focus:ring-mainColor"
              >
                Lưu thay đổi
              </button>
            </div>

          </form>

        </div>
      </div>
    </section>
  );
}
