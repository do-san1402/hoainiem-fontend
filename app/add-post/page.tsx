"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import instance from "@/utils/instance";
import useAuth from "@/hooks/useAuth";
import { useRouter } from 'next/navigation';
import { toast } from "@/components/themeWrapper/ToastContainer";
import useSWR from "swr";

type FormData = {
  category: string;
  release_date: string;
  title: string;
  short_title: string;
  description: string;
  image: File | null;
  tags: string;
};

type FormErrors = {
  category: string;
  release_date: string;
  title: string;
  short_title: string;
  description: string;
  image: string;
  tags: string;
};

export default function EditNewsPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    category: "",
    release_date: "",
    title: "",
    short_title: "",
    description: "",
    image: null,
    tags: "",
  });

  const [errors, setErrors] = useState<FormErrors>({
    category: "",
    release_date: "",
    title: "",
    short_title: "",
    description: "",
    image: "",
    tags: "",
  });

  const token = localStorage.getItem("access_token");
  const userId = localStorage.getItem("user_id");
  if (!token) throw new Error("Token không tồn tại");
  if (!userId) throw new Error("User không tồn tại");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchNewsData = async () => {
      try {
        const response = await instance.get(`/news/detail/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = response.data.data;
        setFormData({
          category: data.category || "",
          release_date: data.release_date || "",
          title: data.title || "",
          short_title: data.short_title || "",
          description: data.description || "",
          image: data.image || null,
          tags: data.tags || "",
        });
        if (data.image) {
          setImagePreview(data.image);
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNewsData();
  }, [isAuthenticated, router]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const imageUrl = URL.createObjectURL(selectedFile);
      setImagePreview(imageUrl);
      setFormData({ ...formData, image: selectedFile });
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {
      category: "",
      release_date: "",
      title: "",
      short_title: "",
      description: "",
      image: "",
      tags: "",
    };

    if (!formData.category) newErrors.category = "Danh mục là bắt buộc.";
    if (!formData.release_date) newErrors.release_date = "Ngày phát hành là bắt buộc.";
    if (!formData.title) newErrors.title = "Tiêu đề là bắt buộc.";
    if (!formData.short_title) newErrors.short_title = "Tiêu đề ngắn là bắt buộc.";
    if (!formData.description) newErrors.description = "Mô tả là bắt buộc.";
    if (!formData.image) newErrors.image = "Ảnh là bắt buộc.";
    if (!formData.tags) newErrors.tags = "Thẻ bài viết là bắt buộc.";

    setErrors(newErrors);
    return Object.keys(newErrors).every((key) => newErrors[key as keyof FormErrors] === "");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (validate()) {
      const formDataToSubmit = new FormData();
      formDataToSubmit.append("category", formData.category);
      formDataToSubmit.append("release_date", formData.release_date);
      formDataToSubmit.append("title", formData.title);
      formDataToSubmit.append("short_title", formData.short_title);
      formDataToSubmit.append("description", formData.description);
      formDataToSubmit.append("tags", formData.tags);

      if (formData.image && typeof formData.image !== "string") {
        formDataToSubmit.append("image", formData.image);
      }

      try {
        setLoading(true);
        const response = await instance.post(
          `/news/update/${userId}`,
          formDataToSubmit,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success("Cập nhật tin tức thành công!");
      } catch (error: any) {
        console.error("Lỗi khi cập nhật tin tức:", error);
        toast.error(error.response?.data?.message || "Cập nhật không thành công. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <form
          onSubmit={handleSubmit}
          className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg"
        >
          <h2 className="text-2xl font-bold mb-12 ">Thêm tin tức mới</h2>

          <div className="container mx-auto px-4">
            <div className="grid gap-10">
              {/* Category */}
              <div>
                <label htmlFor="category" className="text-gray-700">
                  Danh mục
                </label>
                <input
                  id="category"
                  name="category"
                  type="text"
                  value={formData.category}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-mainColor"
                />
                {errors.category && (
                  <p className="text-sm text-red-500 mt-1">{errors.category}</p>
                )}
              </div>
              {/* Release Date */}
              <div>
                <label htmlFor="release_date" className="text-gray-700">
                  Ngày phát hành
                </label>
                <input
                  id="release_date"
                  name="release_date"
                  type="date"
                  value={formData.release_date}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-mainColor"
                />
                {errors.release_date && (
                  <p className="text-sm text-red-500 mt-1">{errors.release_date}</p>
                )}
              </div>

              {/* Title */}
              <div>
                <label htmlFor="title" className="text-gray-700">
                  Tiêu đề
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-mainColor"
                />
                {errors.title && (
                  <p className="text-sm text-red-500 mt-1">{errors.title}</p>
                )}
              </div>

              {/* Short Title */}
              <div>
                <label htmlFor="short_title" className="text-gray-700">
                  Tiêu đề ngắn
                </label>
                <input
                  id="short_title"
                  name="short_title"
                  type="text"
                  value={formData.short_title}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-mainColor"
                />
                {errors.short_title && (
                  <p className="text-sm text-red-500 mt-1">{errors.short_title}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="text-gray-700">
                  Mô tả
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-mainColor"
                />
                {errors.description && (
                  <p className="text-sm text-red-500 mt-1">{errors.description}</p>
                )}
              </div>

              {/* Tags */}
              <div>
                <label htmlFor="tags" className="text-gray-700">
                  Thẻ bài viết
                </label>
                <input
                  id="tags"
                  name="tags"
                  type="text"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="Nhập các thẻ, cách nhau bằng dấu phẩy"
                  className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-mainColor"
                />
                {errors.tags && (
                  <p className="text-sm text-red-500 mt-1">{errors.tags}</p>
                )}
              </div>

              {/* Image */}
              <div>
                <label htmlFor="image" className="text-gray-700">
                  Hình ảnh
                </label>
                <input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="mt-1 block w-full text-gray-500"
                />
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Xem trước hình ảnh"
                    className="mt-2 w-full max-h-60 object-contain border border-gray-300"
                  />
                )}
                {errors.image && (
                  <p className="text-sm text-red-500 mt-1">{errors.image}</p>
                )}
              </div>

              <div className="mt-6 text-right">
                <button
                  type="submit"
                  disabled={loading}
                  className={`py-4 px-4 mt-12 ${loading ? "bg-gray-400" : "bg-mainColor"
                    } text-white font-bold rounded-md hover:bg-mainColor/80 focus:outline-none focus:ring-2 focus:ring-mainColor`}
                >
                  {loading ? "Đang xử lý..." : "Thêm mới"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
