import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://10.0.2.2:3002/api/auth";

export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      email: email.trim(),
      password: password.trim(),
    });
    const { token } = response.data;
    await AsyncStorage.setItem("token", token);
    return response.data; // { token, user: { id, email, username } }
  } catch (error: any) {
    console.error(
      "Đăng nhập thất bại:",
      error.response?.data,
      error.message,
      error.response?.status
    );
    throw new Error(error.response?.data?.message || "Đăng nhập thất bại");
  }
};

export const register = async (
  username: string,
  email: string,
  password: string
) => {
  try {
    const response = await axios.post(`${API_URL}/register`, {
      username: username.trim(),
      email: email.trim(),
      password: password.trim(),
    });
    return response.data;
  } catch (error: any) {
    console.error(
      "Đăng ký thất bại:",
      error.response?.data,
      error.message,
      error.response?.status
    );
    throw new Error(error.response?.data?.message || "Đăng ký thất bại");
  }
};

export const getToken = async (): Promise<string | null> => {
  try {
    const token = await AsyncStorage.getItem("token");
    return token;
  } catch (error) {
    console.error("Lỗi lấy token:", error);
    return null;
  }
};

export const logout = async () => {
  try {
    await AsyncStorage.removeItem("token");
  } catch (error) {
    console.error("Lỗi đăng xuất:", error);
  }
};

export const getCurrentUser = async () => {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error("Không có token, vui lòng đăng nhập lại");
    }
    const response = await axios.get(`${API_URL}/current`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; // { id, email, username }
  } catch (error: any) {
    console.error(
      "Lấy thông tin người dùng thất bại:",
      error.response?.data,
      error.message,
      error.response?.status
    );
    throw new Error(
      error.response?.data?.message || "Không thể lấy thông tin người dùng"
    );
  }
};

interface User {
  id: string;
  email: string;
  username: string;
  address?: string;
  phoneNumber?: string;
}

export const updateUser = async (data: Partial<User>) => {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error("Không có token, vui lòng đăng nhập lại");
    }
    const response = await axios.put(`${API_URL}/update`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; // { id, email, username, address, phoneNumber }
  } catch (error: any) {
    console.error(
      "Cập nhật thông tin người dùng thất bại:",
      error.response?.data,
      error.message,
      error.response?.status
    );
    throw new Error(
      error.response?.data?.message || "Không thể cập nhật thông tin"
    );
  }
};
