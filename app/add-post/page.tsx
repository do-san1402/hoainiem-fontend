"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import instance from "@/utils/instance";
import useAuth from "@/hooks/useAuth";
import { useRouter } from 'next/navigation';
import { toast } from "@/components/themeWrapper/ToastContainer";
import useSWR from "swr";
import fetcher from "@/utils/fetcher";
import ReactQuill from 'react-quill'; 
import 'react-quill/dist/quill.snow.css';

type SubCategory = {
  menu_lavel: string;
  slug: string;
  menu_content_id: number;
};

type CategoryItem = {
  menu_lavel: string;
  slug: string;
  menu_content_id: number;
  categorieslevelone: SubCategory[];
};

type FormData = {
  category: string;
  release_date: string;
  title: string;
  short_title: string;
  description: string;
  image: File | null;
  tags: string[];
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
  const router = useRouter();
  const token = localStorage.getItem("access_token");
  const userId = localStorage.getItem("user_id");
  if (!token || !userId) {
    router.push('/login'); 
  }
  const { isAuthenticated } = useAuth();
  const [inputValue, setInputValue] = useState<string>("");
  const [formData, setFormData] = useState<FormData>({
    category: "",
    release_date: "",
    title: "",
    short_title: "",
    description: "",
    image: null,
    tags: [],
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

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<
    { label: string; options: { value: string; label: string }[] }[]
  >([]);

  const {
    data: categoriesData,
    error,
    isLoading,
  }: { data: CategoryItem[] | undefined; error: any; isLoading: boolean } = useSWR(
    "/sidebar-categories",
    fetcher
  );

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
      }
    };

    if (categoriesData) {
      const formattedCategories = categoriesData.map((category: CategoryItem) => ({
        label: category.menu_lavel,
        options: category.categorieslevelone?.map((subCategory: SubCategory) => ({
          value: subCategory.slug,
          label: subCategory.menu_lavel,
        })) || [],
      }));
      setCategories(formattedCategories);
    }

    if (isAuthenticated) {
      fetchNewsData();
    }
  }, [isAuthenticated, categoriesData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> | string
  ) => {
    if (typeof e === 'string') {
      setFormData({
        ...formData,
        description: e,
      });
    } else {
      const { name, value } = e.target;
      if (name !== "tags") {
        setFormData({
          ...formData,
          [name]: value,
        });
      }
    }
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
      formDataToSubmit.append("tags", JSON.stringify(formData.tags));

      if (formData.image && typeof formData.image !== "string") {
        formDataToSubmit.append("image", formData.image);
      }

      try {
        setLoading(true);
        const token = localStorage.getItem("access_token");
        const response = await instance.post(
          `/posts`,
          formDataToSubmit,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        toast.success("Tạo bài viết mới thành công!");
        setFormData({
          category: "",
          release_date: "",
          title: "",
          short_title: "",
          description: "",
          image: null,
          tags: [],
        });
        setImagePreview(null);
      } catch (error: any) {
        console.error("Lỗi khi tạo bài viết:", error);
        toast.error(error.response?.data?.message || "Tạo bài viết không thành công. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    }
  };

  const modules = {
    toolbar: [
      [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['bold', 'italic', 'underline'],
      ['link'],
      ['blockquote'],
      ['code-block']
    ],
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === ',') && inputValue.trim()) {
      e.preventDefault();
  
      const newTags = inputValue
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag !== "");
  
      const uniqueTags = newTags.filter((tag) => !formData.tags.includes(tag));
  
      if (formData.tags.length + uniqueTags.length > 5) {
        toast.error("Chỉ được thêm tối đa 5 thẻ.");
        return;
      }
  
      setFormData((prevData) => ({
        ...prevData,
        tags: [...prevData.tags, ...uniqueTags],
      }));
  
      setInputValue('');
    }
  };
  const handleDeleteTag = (tagToDelete: string) => {
    setFormData((prevData) => ({
      ...prevData,
      tags: prevData.tags.filter((tag) => tag !== tagToDelete),
    }));
  };
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <form
          onSubmit={handleSubmit}
          className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-12 ">Thêm tin tức mới</h2>
          <div className="container mx-auto px-4">
            <div className="grid gap-10">
              {/* Category */}
              <div>
                <label htmlFor="category" className="text-gray-700">
                  Danh mục
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-mainColor">
                  <option value="" disabled>
                    Chọn danh mục
                  </option>
                  {categories.map((category) => (
                    <optgroup key={category.label} label={category.label}>
                      {category.options.map((subCategory) => (
                        <option key={subCategory.value} value={subCategory.value}>
                          {subCategory.label}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
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
                <ReactQuill
                  id="description"
                  name="description"
                  modules={modules}
                  value={formData.description}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md focus:outline-none focus:ring-2 focus:ring-mainColor"
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
                <div className="flex items-center flex-wrap gap-2 mt-2">
                  {formData.tags.map((tag, index) => (
                    <div
                      key={index}
                      className="flex items-center bg-gray-200 text-gray-700 px-3 py-1 rounded-md"
                    >
                      {tag}
                      <button
                        type="button"
                        className="ml-2 text-red-500 hover:text-red-700"
                        onClick={() => handleDeleteTag(tag)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <input
                  id="tags"
                  name="tags"
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Nhập thẻ và nhấn Enter hoặc dấu phẩy"
                  className="mt-2 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-mainColor"
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
                <div className="mt-6 text-right">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`py-4 px-4 mt-12 ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-mainColor hover:bg-mainColor/80"
                      } text-white font-bold rounded-md focus:outline-none focus:ring-2 focus:ring-mainColor`}
                  >
                    {loading ? (
                      <>
                        <svg
                          className="inline w-5 h-5 mr-2 text-white animate-spin"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                          ></path>
                        </svg>
                        Đang xử lý...
                      </>
                    ) : (
                      "Thêm mới"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
