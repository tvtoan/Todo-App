import { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NavigationProp, RouteProp } from "@react-navigation/native";
import { RootStackParamList, Task } from "../types/navigation";
import { updateTask } from "../services/TaskService";

type EditTaskNavigationProp = NavigationProp<RootStackParamList, "EditTask">;
type EditTaskRouteProp = RouteProp<RootStackParamList, "EditTask">;

export default function EditTask() {
  const navigation = useNavigation<EditTaskNavigationProp>();
  const route = useRoute<EditTaskRouteProp>();
  const { task } = route.params;

  // Ánh xạ status cũ sang tiếng Việt
  const mapLegacyStatus = (
    status: string
  ): "Chưa Bắt Đầu" | "Đang Thực Hiện" | "Hoàn Thành" => {
    switch (status) {
      case "PENDING":
      case "NOT_STARTED":
        return "Chưa Bắt Đầu";
      case "IN_PROGRESS":
        return "Đang Thực Hiện";
      case "COMPLETED":
        return "Hoàn Thành";
      default:
        return status as "Chưa Bắt Đầu" | "Đang Thực Hiện" | "Hoàn Thành";
    }
  };

  // Ánh xạ priority cũ sang tiếng Việt
  const mapLegacyPriority = (
    priority: string
  ): "Cao" | "Trung Bình" | "Thấp" => {
    switch (priority) {
      case "HIGH":
        return "Cao";
      case "MEDIUM":
        return "Trung Bình";
      case "LOW":
        return "Thấp";
      default:
        return priority as "Cao" | "Trung Bình" | "Thấp";
    }
  };

  const [name, setName] = useState(task.name);
  const [description, setDescription] = useState(task.description || "");
  const [dueDate, setDueDate] = useState(task.dueDate.split("T")[0]);
  const [dueDateError, setDueDateError] = useState<string | null>(null);
  const [status, setStatus] = useState<
    "Chưa Bắt Đầu" | "Đang Thực Hiện" | "Hoàn Thành"
  >(mapLegacyStatus(task.status));
  const [priority, setPriority] = useState<"Cao" | "Trung Bình" | "Thấp">(
    mapLegacyPriority(task.priority)
  );

  // Hàm chuyển đổi DD/MM/YYYY hoặc YYYY/MM/DD sang YYYY-MM-DD
  const formatDueDate = (input: string): string => {
    const ddmmyyyyRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
    const ddmmyyyyMatch = input.match(ddmmyyyyRegex);
    if (ddmmyyyyMatch) {
      const [_, day, month, year] = ddmmyyyyMatch;
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }

    const yyyymmddSlashRegex = /^(\d{4})\/(\d{1,2})\/(\d{1,2})$/;
    const yyyymmddSlashMatch = input.match(yyyymmddSlashRegex);
    if (yyyymmddSlashMatch) {
      const [_, year, month, day] = yyyymmddSlashMatch;
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }

    return input;
  };

  // Hàm kiểm tra định dạng YYYY-MM-DD và ngày không trong quá khứ
  const validateDueDate = (
    date: string
  ): { isValid: boolean; error?: string } => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(date)) {
      return {
        isValid: false,
        error: "Vui lòng nhập định dạng YYYY-MM-DD (ví dụ: 2025-07-22).",
      };
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return { isValid: false, error: "Ngày không hợp lệ." };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(parsedDate);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return {
        isValid: false,
        error: "Hạn hoàn thành không được là ngày trong quá khứ.",
      };
    }

    return { isValid: true };
  };

  // Xử lý thay đổi dueDate (kiểm tra thời gian thực)
  const handleDueDateChange = (text: string) => {
    const formattedDate = formatDueDate(text);
    setDueDate(formattedDate);

    if (formattedDate) {
      const validation = validateDueDate(formattedDate);
      setDueDateError(validation.error || null);
    } else {
      setDueDateError(null);
    }
  };

  const handleUpdateTask = async () => {
    try {
      if (!name) {
        Alert.alert("Lỗi", "Tên công việc là bắt buộc.");
        return;
      }

      if (!dueDate || dueDateError) {
        Alert.alert(
          "Lỗi",
          dueDateError || "Vui lòng nhập hạn hoàn thành hợp lệ."
        );
        return;
      }

      if (!["Chưa Bắt Đầu", "Đang Thực Hiện", "Hoàn Thành"].includes(status)) {
        Alert.alert("Lỗi", "Trạng thái không hợp lệ.");
        return;
      }

      if (!["Cao", "Trung Bình", "Thấp"].includes(priority)) {
        Alert.alert("Lỗi", "Ưu tiên không hợp lệ.");
        return;
      }

      await updateTask(task._id, {
        name,
        description,
        dueDate,
        status,
        priority,
      });
      Alert.alert("Thành công", "Cập nhật công việc thành công");
      navigation.navigate("TaskList");
    } catch (error: any) {
      console.error(
        "Lỗi trong handleUpdateTask:",
        error.message,
        error.response?.data
      );
      Alert.alert("Lỗi", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sửa công việc</Text>

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
        style={[styles.input, dueDateError ? styles.inputError : null]}
        placeholder="Hạn hoàn thành (YYYY-MM-DD)"
        value={dueDate}
        onChangeText={handleDueDateChange}
      />
      {dueDateError && <Text style={styles.errorText}>{dueDateError}</Text>}
      <Text style={styles.helperText}>
        Nhập ngày theo định dạng YYYY-MM-DD (ví dụ: 2025-07-22)
      </Text>

      <Text style={styles.label}>Trạng thái</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={status}
          onValueChange={(itemValue) =>
            setStatus(
              itemValue as "Chưa Bắt Đầu" | "Đang Thực Hiện" | "Hoàn Thành"
            )
          }
          style={styles.picker}
        >
          <Picker.Item label="Chưa bắt đầu" value="Chưa Bắt Đầu" />
          <Picker.Item label="Đang thực hiện" value="Đang Thực Hiện" />
          <Picker.Item label="Hoàn thành" value="Hoàn Thành" />
        </Picker>
      </View>

      <Text style={styles.label}>Ưu tiên</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={priority}
          onValueChange={(itemValue) =>
            setPriority(itemValue as "Cao" | "Trung Bình" | "Thấp")
          }
          style={styles.picker}
        >
          <Picker.Item label="Cao" value="Cao" />
          <Picker.Item label="Trung bình" value="Trung Bình" />
          <Picker.Item label="Thấp" value="Thấp" />
        </Picker>
      </View>

      <Button title="Cập nhật công việc" onPress={handleUpdateTask} />
      <Button
        title="Quay về Trang chủ"
        onPress={() => navigation.navigate("TaskList")}
        color="gray"
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
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: "white",
  },
  inputError: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
  },
  helperText: {
    fontSize: 12,
    color: "#555",
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: "white",
  },
  picker: {
    height: 50,
    width: "100%",
  },
});
