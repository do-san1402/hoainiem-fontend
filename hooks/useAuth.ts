
import { useState, useEffect } from "react";
import instance from "@/utils/instance";
import useCsrfToken from './useCsrfToken';

export default function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const csrfToken = useCsrfToken();

  const login = async (email: string, password: string) => {
    try {
      const response = await instance.post('/login', { email, password }, {
        headers: { 'X-CSRF-TOKEN': csrfToken },
        withCredentials: true,
      });
      console.log(response.data.access_token)
      localStorage.setItem('access_token', response.data.access_token);
      setIsAuthenticated(true);
      setErrorMessage("");
    } catch (error: any) {
      setErrorMessage(error.response?.data.message || 'Đăng nhập thất bại');
      setIsAuthenticated(false);
    }
  };

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) throw new Error("Token not found");

      const response = await instance.get('/details', {
        headers: { 'Authorization': `Bearer ${token}` },
        withCredentials: true,
      });
      setIsAuthenticated(response.data.authenticated);
    } catch {
      setIsAuthenticated(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setIsAuthenticated(false);
  };

  const sendForgotPasswordEmail = async (email: string) => {
    try {
      const response = await instance.post(
        "/forgot-password",
        { email },
        {
          headers: { "X-CSRF-TOKEN": csrfToken },
          withCredentials: true,
        }
      );
      return { message: response.data.message, success: true };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.data ||
        error.response?.data?.message ||
        "Đã xảy ra lỗi khi gửi yêu cầu. Vui lòng thử lại.";
      return {
        message: errorMessage,
        success: false,
      };
    }
  };
  
  
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const register = async (email: string, full_name: string, contact_no: string, birth_date: string, 
      address_one: string, sex: string, password: string, password_confirmation: string) => {
    try {
      const response = await instance.post('/register', {
        email,
        full_name,
        contact_no,
        birth_date,
        address_one,
        sex,
        password,
        password_confirmation,
      }, {
        headers: { 'X-CSRF-TOKEN': csrfToken },
        withCredentials: true,
      });
  
      return { success: true, data: response.data };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        'Đã xảy ra lỗi khi đăng ký. Vui lòng thử lại.';
      return { success: false, message: errorMessage };
    }
  };
  

  return { isAuthenticated, login, logout, register, errorMessage, sendForgotPasswordEmail };
}

