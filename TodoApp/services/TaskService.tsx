import axios from "axios";
import { getToken } from "./UserService";
import { Task } from "../types/navigation";

const API_URL = "http://10.0.2.2:3002/api/tasks";

// Ánh xạ từ tiếng Anh sang tiếng Việt để xử lý dữ liệu cũ
const statusToFrontend: { [key: string]: string } = {
  NOT_STARTED: "Chưa Bắt Đầu",
  IN_PROGRESS: "Đang Thực Hiện",
  COMPLETED: "Hoàn Thành",
  PENDING: "Chưa Bắt Đầu",
};

const priorityToFrontend: { [key: string]: string } = {
  HIGH: "Cao",
  MEDIUM: "Trung Bình",
  LOW: "Thấp",
};

export const getTasks = async (): Promise<Task[]> => {
  try {
    const token = await getToken();
    if (!token) throw new Error("Không tìm thấy token");

    const response = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Ánh xạ status và priority sang tiếng Việt
    const tasks = response.data.map((task: any) => ({
      ...task,
      status: statusToFrontend[task.status] || task.status,
      priority: priorityToFrontend[task.priority] || task.priority,
    }));
    return tasks;
  } catch (error: any) {
    console.error(
      "Lỗi lấy công việc:",
      error.response?.data,
      error.message,
      error.response?.status
    );
    const errorMsg =
      error.response?.data?.errors?.map((e: any) => e.msg).join(", ") ||
      error.response?.data?.error ||
      "Lấy công việc thất bại";
    throw new Error(errorMsg);
  }
};

export const createTask = async (
  name: string,
  dueDate: string,
  description: string = "",
  status: "Chưa Bắt Đầu" | "Đang Thực Hiện" | "Hoàn Thành" = "Chưa Bắt Đầu",
  priority: "Cao" | "Trung Bình" | "Thấp" = "Trung Bình"
) => {
  try {
    const token = await getToken();
    if (!token) throw new Error("Không tìm thấy token");

    const response = await axios.post(
      API_URL,
      { name, description, dueDate, status, priority },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // Ánh xạ lại sang tiếng Việt (nếu backend trả về tiếng Anh)
    return {
      ...response.data,
      status: statusToFrontend[response.data.status] || response.data.status,
      priority:
        priorityToFrontend[response.data.priority] || response.data.priority,
    };
  } catch (error: any) {
    console.error(
      "Lỗi tạo công việc:",
      error.response?.data,
      error.message,
      error.response?.status
    );
    const errorMsg =
      error.response?.data?.errors?.map((e: any) => e.msg).join(", ") ||
      error.response?.data?.error ||
      "Tạo công việc thất bại";
    throw new Error(errorMsg);
  }
};

export const updateTask = async (taskId: string, updates: Partial<Task>) => {
  try {
    const token = await getToken();
    if (!token) throw new Error("Không tìm thấy token");

    const response = await axios.put(`${API_URL}/${taskId}`, updates, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Ánh xạ lại sang tiếng Việt
    return {
      ...response.data,
      status: statusToFrontend[response.data.status] || response.data.status,
      priority:
        priorityToFrontend[response.data.priority] || response.data.priority,
    };
  } catch (error: any) {
    console.error(
      "Lỗi cập nhật công việc:",
      error.response?.data,
      error.message,
      error.response?.status
    );
    const errorMsg =
      error.response?.data?.errors?.map((e: any) => e.msg).join(", ") ||
      error.response?.data?.error ||
      "Cập nhật công việc thất bại";
    throw new Error(errorMsg);
  }
};

export const deleteTask = async (taskId: string) => {
  try {
    const token = await getToken();
    if (!token) throw new Error("Không tìm thấy token");

    const response = await axios.delete(`${API_URL}/${taskId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data; // { message: "Task deleted" }
  } catch (error: any) {
    console.error(
      "Lỗi xóa công việc:",
      error.response?.data,
      error.message,
      error.response?.status
    );
    const errorMsg =
      error.response?.data?.errors?.map((e: any) => e.msg).join(", ") ||
      error.response?.data?.error ||
      "Xóa công việc thất bại";
    throw new Error(errorMsg);
  }
};
