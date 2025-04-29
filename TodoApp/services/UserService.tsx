import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://192.168.40.109:3002/api/auth";

export const login = async (email: string, password: string) => {
  try {
    console.log("Gửi yêu cầu đăng nhập:", { email, password });
    const response = await axios.post(`${API_URL}/login`, {
      email: email.trim(),
      password: password.trim(),
    });
    const { token } = response.data;
    await AsyncStorage.setItem("token", token);
    console.log("Đăng nhập thành công, token:", token);
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
    console.log("Gửi yêu cầu đăng ký:", { username, email, password });
    const response = await axios.post(`${API_URL}/register`, {
      username: username.trim(),
      email: email.trim(),
      password: password.trim(),
    });
    console.log("Đăng ký thành công:", response.data);
    return response.data; // { message: "Đăng ký thành công" }
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
    console.log("Lấy token:", token ? "Thành công" : "Không có token");
    return token;
  } catch (error) {
    console.error("Lỗi lấy token:", error);
    return null;
  }
};

export const logout = async () => {
  try {
    await AsyncStorage.removeItem("token");
    console.log("Đăng xuất thành công");
  } catch (error) {
    console.error("Lỗi đăng xuất:", error);
  }
};
