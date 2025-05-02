import axios from "axios";
import { getToken } from "./UserService";
import { Task } from "../types/navigation";

const API_URL = "http://10.0.2.2:3002/api/tasks";

export const getTasks = async () => {
  try {
    const token = await getToken();
    if (!token) throw new Error("Không tìm thấy token");

    console.log("Gửi yêu cầu lấy danh sách công việc");
    const response = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("Lấy danh sách công việc thành công:", response.data);
    return response.data; // Danh sách công việc
  } catch (error: any) {
    console.error(
      "Lỗi lấy công việc:",
      error.response?.data,
      error.message,
      error.response?.status
    );
    throw new Error(error.response?.data?.error || "Lấy công việc thất bại");
  }
};

export const createTask = async (
  name: string,
  dueDate: string,
  subject: string,
  description: string = "",
  status: "PENDING" | "COMPLETED" = "PENDING",
  priority: "HIGH" | "MEDIUM" | "LOW" = "MEDIUM"
) => {
  try {
    const token = await getToken();
    if (!token) throw new Error("Không tìm thấy token");

    console.log("Gửi yêu cầu tạo công việc:", {
      name,
      dueDate,
      subject,
      description,
      status,
      priority,
    });
    const response = await axios.post(
      API_URL,
      { name, description, dueDate, status, priority, subject },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log("Tạo công việc thành công:", response.data);
    return response.data; // Công việc mới tạo
  } catch (error: any) {
    console.error(
      "Lỗi tạo công việc:",
      error.response?.data,
      error.message,
      error.response?.status
    );
    throw new Error(error.response?.data?.error || "Tạo công việc thất bại");
  }
};

export const updateTask = async (taskId: string, updates: Partial<Task>) => {
  try {
    const token = await getToken();
    if (!token) throw new Error("Không tìm thấy token");

    console.log("Gửi yêu cầu cập nhật công việc:", { taskId, updates });
    const response = await axios.put(`${API_URL}/${taskId}`, updates, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("Cập nhật công việc thành công:", response.data);
    return response.data; // Công việc đã cập nhật
  } catch (error: any) {
    console.error(
      "Lỗi cập nhật công việc:",
      error.response?.data,
      error.message,
      error.response?.status
    );
    throw new Error(
      error.response?.data?.error || "Cập nhật công việc thất bại"
    );
  }
};

export const deleteTask = async (taskId: string) => {
  try {
    const token = await getToken();
    if (!token) throw new Error("Không tìm thấy token");

    console.log("Gửi yêu cầu xóa công việc:", { taskId });
    const response = await axios.delete(`${API_URL}/${taskId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("Xóa công việc thành công:", response.data);
    return response.data; // { message: "Task deleted" }
  } catch (error: any) {
    console.error(
      "Lỗi xóa công việc:",
      error.response?.data,
      error.message,
      error.response?.status
    );
    throw new Error(error.response?.data?.error || "Xóa công việc thất bại");
  }
};
