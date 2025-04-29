export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  TaskList: undefined;
  AddTask: undefined;
  EditTask: { task: Task };
};

export type Task = {
  _id: string;
  name: string;
  description?: string;
  dueDate: string;
  status: "PENDING" | "COMPLETED";
  priority: "HIGH" | "MEDIUM" | "LOW";
  subject: string;
  userId: string;
};