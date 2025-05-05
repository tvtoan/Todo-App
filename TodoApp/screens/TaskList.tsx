import { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NavigationProp } from "@react-navigation/native";
import { RootStackParamList, Task } from "../types/navigation";
import { getTasks, deleteTask } from "../services/TaskService";
import { logout, getCurrentUser } from "../services/UserService";
import { MaterialIcons } from "@expo/vector-icons";

type TaskListNavigationProp = NavigationProp<RootStackParamList, "TaskList">;

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [username, setUsername] = useState<string>("");
  const navigation = useNavigation<TaskListNavigationProp>();

  const fetchTasks = async () => {
    try {
      const data = await getTasks();
      const sortedTasks = data.sort((a: Task, b: Task) => {
        const dateA = new Date(a.dueDate).getTime();
        const dateB = new Date(b.dueDate).getTime();
        if (dateA !== dateB) {
          return dateA - dateB;
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

  const fetchUser = async () => {
    try {
      const user = await getCurrentUser();
      setUsername(user.username);
    } catch (error: any) {
      Alert.alert("Lỗi", error.message || "Không thể lấy thông tin người dùng");
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchTasks();
      fetchUser();
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
      <Text style={styles.welcomeText}>Xin Chào {username}</Text>
      <Text style={styles.title}>Danh sách công việc</Text>
      {tasks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Hiện tại chưa có công việc nào</Text>
        </View>
      ) : (
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
                <Text
                  style={[
                    styles.taskPriority,
                    {
                      color:
                        item.priority === "Cao"
                          ? "#f06292"
                          : item.priority === "Trung Bình"
                          ? "#FF8F00"
                          : "#81c784",
                    },
                  ]}
                >
                  Ưu tiên: {item.priority}
                </Text>
              </View>
              <View style={styles.taskActions}>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: "#bbdefb" }]}
                  onPress={() =>
                    navigation.navigate("EditTask", { task: item })
                  }
                  activeOpacity={0.7}
                >
                  <MaterialIcons name="edit" size={20} color="#42a5f5" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: "#ffcccb" }]}
                  onPress={() => handleDeleteTask(item._id)}
                  activeOpacity={0.7}
                >
                  <MaterialIcons name="delete" size={20} color="#ef5350" />
                </TouchableOpacity>
              </View>
            </View>
          )}
          keyExtractor={(item) => item._id}
        />
      )}
      <TouchableOpacity
        style={[styles.mainButton, { backgroundColor: "#c8e6c9" }]}
        onPress={() => navigation.navigate("AddTask")}
        activeOpacity={0.7}
      >
        <MaterialIcons name="add" size={20} color="#66bb6a" />
        <Text style={styles.mainButtonText}>Thêm công việc</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.mainButton, { backgroundColor: "#ffe0b2" }]}
        onPress={handleLogout}
        activeOpacity={0.7}
      >
        <MaterialIcons name="logout" size={20} color="#ffa726" />
        <Text style={styles.mainButtonText}>Đăng xuất</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#636bfb",
    paddingTop: 70,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: "500",
    textAlign: "center",
    color: "#fff",
    marginBottom: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "600",
    textAlign: "center",
    color: "#fff",
    marginBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  emptyText: {
    fontSize: 20,
    color: "#fff",
    textAlign: "center",
  },
  taskItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 14,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    marginVertical: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  taskContent: {
    flex: 1,
    paddingRight: 12,
  },
  taskName: {
    fontSize: 17,
    fontWeight: "500",
    color: "black",
    marginBottom: 4,
  },
  taskDueDate: {
    fontSize: 13,
    color: "black",
    marginBottom: 4,
  },
  taskStatus: {
    fontSize: 13,
    color: "#333",
    marginBottom: 4,
  },
  taskPriority: {
    fontSize: 13,
    fontWeight: "500",
  },
  taskActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  actionButton: {
    padding: 10,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  mainButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginTop: 12,
    marginBottom: 8,
  },
  mainButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginLeft: 8,
  },
});
