import { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types/navigation";
import { createTask } from "../services/TaskService";

type AddTaskNavigationProp = StackNavigationProp<RootStackParamList, "AddTask">;

export default function AddTask() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState<"PENDING" | "COMPLETED">("PENDING");
  const [priority, setPriority] = useState<"HIGH" | "MEDIUM" | "LOW">("MEDIUM");
  const [subject, setSubject] = useState("");
  const navigation = useNavigation<AddTaskNavigationProp>();

  // Hàm chuyển đổi DD/MM/YYYY hoặc YYYY/MM/DD sang YYYY-MM-DD
  const formatDueDate = (input: string): string => {
    // Kiểm tra DD/MM/YYYY (ví dụ: 22/07/2025)
    const ddmmyyyyRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
    const ddmmyyyyMatch = input.match(ddmmyyyyRegex);
    if (ddmmyyyyMatch) {
      const [_, day, month, year] = ddmmyyyyMatch;
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }

    // Kiểm tra YYYY/MM/DD (ví dụ: 2025/07/22)
    const yyyymmddSlashRegex = /^(\d{4})\/(\d{1,2})\/(\d{1,2})$/;
    const yyyymmddSlashMatch = input.match(yyyymmddSlashRegex);
    if (yyyymmddSlashMatch) {
      const [_, year, month, day] = yyyymmddSlashMatch;
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }

    return input; // Giữ nguyên nếu không khớp
  };

  // Hàm kiểm tra định dạng YYYY-MM-DD
  const isValidISODate = (date: string): boolean => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(date)) return false;
    const parsedDate = new Date(date);
    return parsedDate instanceof Date && !isNaN(parsedDate.getTime());
  };

  const handleAddTask = async () => {
    try {
      // Chuyển đổi dueDate nếu cần
      let formattedDueDate = dueDate;
      if (dueDate.includes("/")) {
        formattedDueDate = formatDueDate(dueDate);
      }

      // Kiểm tra định dạng
      if (!isValidISODate(formattedDueDate)) {
        Alert.alert(
          "Lỗi",
          "Hạn hoàn thành không đúng định dạng. Vui lòng nhập YYYY-MM-DD (ví dụ: 2025-07-22)."
        );
        return;
      }

      await createTask(
        name,
        formattedDueDate,
        subject,
        description,
        status,
        priority
      );
      Alert.alert("Thành công", "Thêm công việc thành công");
      navigation.navigate("TaskList");
    } catch (error: any) {
      console.error(
        "Lỗi trong handleAddTask:",
        error.message,
        error.response?.data
      );
      Alert.alert(
        "Lỗi",
        error.message === "Invalid dueDate"
          ? "Hạn hoàn thành không hợp lệ. Vui lòng nhập định dạng YYYY-MM-DD (ví dụ: 2025-07-22)."
          : error.message || "Không thể thêm công việc"
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thêm công việc mới</Text>
      <TextInput
        style={styles.input}
        placeholder="Tên công việc"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Mô tả"
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <TextInput
        style={styles.input}
        placeholder="Hạn hoàn thành (YYYY-MM-DD)"
        value={dueDate}
        onChangeText={setDueDate}
      />
      <Text style={styles.helperText}>
        Nhập ngày theo định dạng YYYY-MM-DD (ví dụ: 2025-07-22)
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Trạng thái (PENDING/COMPLETED)"
        value={status}
        onChangeText={(text) => setStatus(text as "PENDING" | "COMPLETED")}
      />
      <TextInput
        style={styles.input}
        placeholder="Ưu tiên (HIGH/MEDIUM/LOW)"
        value={priority}
        onChangeText={(text) => setPriority(text as "HIGH" | "MEDIUM" | "LOW")}
      />
      <TextInput
        style={styles.input}
        placeholder="Môn học"
        value={subject}
        onChangeText={setSubject}
      />
      <Button title="Thêm công việc" onPress={handleAddTask} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f0f0f0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: "white",
  },
  helperText: {
    fontSize: 12,
    color: "#555",
    marginBottom: 10,
  },
});
