import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NavigationProp, RouteProp } from "@react-navigation/native";
import { RootStackParamList, Task } from "../types/navigation";
import { updateTask } from "../services/TaskService";
import { MaterialIcons } from "@expo/vector-icons";

type EditTaskNavigationProp = NavigationProp<RootStackParamList, "EditTask">;
type EditTaskRouteProp = RouteProp<RootStackParamList, "EditTask">;

export default function EditTask() {
  const navigation = useNavigation<EditTaskNavigationProp>();
  const route = useRoute<EditTaskRouteProp>();
  const { task } = route.params;

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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Sửa công việc</Text>

          <Text style={styles.label}>Tên công việc</Text>
          <TextInput
            style={[styles.input, name ? styles.inputFilled : null]}
            placeholder="Tên công việc"
            placeholderTextColor="#b0bec5"
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>Mô tả</Text>
          <TextInput
            style={[
              styles.input,
              description ? styles.inputFilled : null,
              styles.inputMultiline,
            ]}
            placeholder="Mô tả"
            placeholderTextColor="#b0bec5"
            value={description}
            onChangeText={setDescription}
            multiline
          />

          <Text style={styles.label}>Hạn hoàn thành</Text>
          <TextInput
            style={[
              styles.input,
              dueDateError
                ? styles.inputError
                : dueDate
                ? styles.inputFilled
                : null,
            ]}
            placeholder="YYYY-MM-DD (ví dụ: 2025-07-22)"
            placeholderTextColor="#b0bec5"
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
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.mainButton, { backgroundColor: "#c8e6c9" }]}
            onPress={handleUpdateTask}
            activeOpacity={0.7}
          >
            <MaterialIcons name="save" size={20} color="#66bb6a" />
            <Text style={styles.mainButtonText}>Cập nhật</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.mainButton, { backgroundColor: "#ffcccb" }]}
            onPress={() => navigation.navigate("TaskList")}
            activeOpacity={0.7}
          >
            <MaterialIcons name="arrow-back" size={20} color="#ef5350" />
            <Text style={styles.mainButtonText}>Quay về</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#636bfb",
    paddingTop: 60,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#636bfb",
    borderTopWidth: 1,
    borderTopColor: "#ffffff33",
  },
  title: {
    fontSize: 26,
    fontWeight: "600",
    textAlign: "center",
    color: "#fff",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#fff",
    marginBottom: 8,
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#b0bec5",
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#f5f5f5",
    fontSize: 16,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  inputFilled: {
    borderColor: "#78909c",
  },
  inputMultiline: {
    height: 100,
    textAlignVertical: "top",
  },
  inputError: {
    borderColor: "#ef5350",
  },
  errorText: {
    color: "#ffcccb",
    fontSize: 13,
    marginBottom: 8,
  },
  helperText: {
    fontSize: 13,
    color: "#b0bec5",
    marginBottom: 12,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#b0bec5",
    borderRadius: 10,
    backgroundColor: "#f5f5f5",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  picker: {
    height: 50,
    width: "100%",
    color: "#333",
  },
  mainButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginHorizontal: 4,
  },
  mainButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginLeft: 8,
  },
});
