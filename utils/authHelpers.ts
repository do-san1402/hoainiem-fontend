// src/utils/authHelpers.ts

export type User = {
    id: number;
    email: string;
  };
  
  // Hàm giả lập để tìm người dùng
  export async function fetchUser(email: string, password: string): Promise<User | null> {
    const dummyUser = { id: 1, email: "user@example.com", password: "123456" };
  
    if (email === dummyUser.email && password === dummyUser.password) {
      return { id: dummyUser.id, email: dummyUser.email };
    }
    return null;
  }
  