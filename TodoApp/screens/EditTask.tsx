import { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList, Task } from "../types/navigation";
import { updateTask } from "../services/TaskService";

type EditTaskNavigationProp = StackNavigationProp<
  RootStackParamList,
  "EditTask"
>;
type EditTaskRouteProp = RouteProp<RootStackParamList, "EditTask">;

export default function EditTask() {
  const navigation = useNavigation<EditTaskNavigationProp>();
  const route = useRoute<EditTaskRouteProp>();
  const { task } = route.params;

  const [name, setName] = useState(task.name);
  const [description, setDescription] = useState(task.description || "");
  const [dueDate, setDueDate] = useState(task.dueDate.split("T")[0]);
  const [status, setStatus] = useState<"PENDING" | "COMPLETED">(task.status);
  const [priority, setPriority] = useState<"HIGH" | "MEDIUM" | "LOW">(
    task.priority
  );
  const [subject, setSubject] = useState(task.subject);

  const handleUpdateTask = async () => {
    try {
      await updateTask(task._id, {
        name,
        description,
        dueDate,
        status,
        priority,
        subject,
      });
      Alert.alert("Thành công", "Cập nhật công việc thành công");
      navigation.navigate("TaskList");
    } catch (error: any) {
      Alert.alert("Lỗi", error.message || "Không thể cập nhật công việc");
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
        style={styles.input}
        placeholder="Hạn hoàn thành (YYYY-MM-DD)"
        value={dueDate}
        onChangeText={setDueDate}
      />
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
      <Button title="Cập nhật công việc" onPress={handleUpdateTask} />
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
});
