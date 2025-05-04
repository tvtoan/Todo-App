import { useState, useCallback } from "react";
import { View, Text, FlatList, Button, StyleSheet, Alert } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NavigationProp } from "@react-navigation/native";
import { RootStackParamList, Task } from "../types/navigation";
import { getTasks, deleteTask } from "../services/TaskService";
import { logout } from "../services/UserService";

type TaskListNavigationProp = NavigationProp<RootStackParamList, "TaskList">;

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const navigation = useNavigation<TaskListNavigationProp>();

  const fetchTasks = async () => {
    try {
      const data = await getTasks();
      // Sắp xếp theo dueDate (sớm nhất trước), sau đó theo priority (Cao > Trung Bình > Thấp)
      const sortedTasks = data.sort((a: Task, b: Task) => {
        const dateA = new Date(a.dueDate).getTime();
        const dateB = new Date(b.dueDate).getTime();
        if (dateA !== dateB) {
          return dateA - dateB; // Sắp xếp theo ngày tăng dần
        }
        const priorityOrder: {
          [key in "Cao" | "Trung Bình" | "Thấp"]: number;
        } = {
          Cao: 1,
          "Trung Bình": 2,
          Thấp: 3,
        };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });
      setTasks(sortedTasks);
    } catch (error: any) {
      Alert.alert("Lỗi", error.message || "Không thể tải danh sách công việc");
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchTasks();
    }, [])
  );

  const handleDeleteTask = async (id: string) => {
    try {
      await deleteTask(id);
      setTasks(tasks.filter((task) => task._id !== id));
      Alert.alert("Thành công", "Xóa công việc thành công");
    } catch (error: any) {
      Alert.alert("Lỗi", error.message || "Không thể xóa công việc");
    }
  };

  const handleLogout = async () => {
    await logout();
    navigation.reset({ index: 0, routes: [{ name: "Login" }] });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Danh sách công việc</Text>
      <Button
        title="Thêm công việc mới"
        onPress={() => navigation.navigate("AddTask")}
      />
      <Button title="Đăng xuất" onPress={handleLogout} color="red" />
      <FlatList
        data={tasks}
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            <View style={styles.taskContent}>
              <Text style={styles.taskName}>{item.name}</Text>
              <Text style={styles.taskDueDate}>
                Hạn: {new Date(item.dueDate).toLocaleDateString("vi-VN")}
              </Text>
              <Text style={styles.taskStatus}>Trạng thái: {item.status}</Text>
              <Text style={styles.taskPriority}>Ưu tiên: {item.priority}</Text>
            </View>
            <View style={styles.taskActions}>
              <Button
                title="Sửa"
                onPress={() => navigation.navigate("EditTask", { task: item })}
                color="blue"
              />
              <Button
                title="Xóa"
                onPress={() => handleDeleteTask(item._id)}
                color="red"
              />
            </View>
          </View>
        )}
        keyExtractor={(item) => item._id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f0f0f0",
    marginTop: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  taskItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "white",
    borderRadius: 5,
    marginVertical: 5,
  },
  taskContent: {
    flex: 1,
  },
  taskName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  taskDueDate: {
    fontSize: 14,
    color: "#555",
  },
  taskStatus: {
    fontSize: 14,
    color: "#555",
  },
  taskPriority: {
    fontSize: 14,
    color: "#555",
  },
  taskActions: {
    flexDirection: "row",
    gap: 10,
  },
});
