export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  TaskList: undefined;
  AddTask: undefined;
  EditTask: { task: Task };
  UserInfo: undefined;
  UserSetting: undefined;
};

export type Task = {
  _id: string;
  name: string;
  description?: string;
  dueDate: string;
  status: "Chưa Bắt Đầu" | "Đang Thực Hiện" | "Hoàn Thành";
  priority: "Cao" | "Trung Bình" | "Thấp";
  userId: string;
};