import { useEffect, useState } from 'react';
import instance from '@/utils/instance'; // Đảm bảo instance được cấu hình đúng

export default function useCsrfToken() {
  const [csrfToken, setCsrfToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await instance.get('/csrf-token', {
          withCredentials: true,
        });
        console.log(response);  

        setCsrfToken(response.data.csrf_token);
      } catch (error) {
        console.error('Lỗi khi lấy CSRF token:', error);
      }
    };

    fetchCsrfToken();
  }, []);

  return csrfToken;
}
