
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

  useEffect(() => {
    checkAuthStatus();
  }, []);

  return { isAuthenticated, login, logout, errorMessage };
}