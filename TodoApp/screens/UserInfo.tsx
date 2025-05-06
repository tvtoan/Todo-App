import { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../types/navigation";
import { getCurrentUser, logout, updateUser } from "../services/UserService";
import { MaterialIcons } from "@expo/vector-icons";

type UserInfoNavigationProp = NavigationProp<RootStackParamList, "UserInfo">;

interface User {
  id: string;
  email: string;
  username: string;
  address?: string;
  phoneNumber?: string;
}

export default function UserInfo() {
  const [user, setUser] = useState<User>({
    id: "",
    username: "",
    email: "",
    address: "",
    phoneNumber: "",
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [editingField, setEditingField] = useState<keyof User | "">("");
  const [editingValue, setEditingValue] = useState<string>("");
  const navigation = useNavigation<UserInfoNavigationProp>();

  const fetchUser = async () => {
    try {
      const userData = await getCurrentUser();
      setUser({
        id: userData.id,
        username: userData.username,
        email: userData.email,
        address: userData.address || "Chưa cập nhật",
        phoneNumber: userData.phoneNumber || "Chưa cập nhật",
      });
    } catch (error: any) {
      Alert.alert("Lỗi", error.message || "Không thể lấy thông tin người dùng");
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUser();
    }, [])
  );

  const validateInput = (field: keyof User, value: string): boolean => {
    if (field === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        Alert.alert("Lỗi", "Email không hợp lệ");
        return false;
      }
    }
    if (field === "phoneNumber") {
      const phoneRegex = /^[0-9]{10,15}$/;
      if (value && !phoneRegex.test(value)) {
        Alert.alert("Lỗi", "Số điện thoại không hợp lệ (10-15 chữ số)");
        return false;
      }
    }
    if (field === "username" && !value.trim()) {
      Alert.alert("Lỗi", "Tên đăng nhập không được để trống");
      return false;
    }
    return true;
  };

  const handleEditField = (field: keyof User, value: string) => {
    setEditingField(field);
    setEditingValue(value === "Chưa cập nhật" ? "" : value);
    setModalVisible(true);
  };

  const handleSaveField = async () => {
    if (!editingField) return;
    if (!validateInput(editingField, editingValue)) return;
    try {
      const updateData: Partial<User> = {
        [editingField]: editingValue || undefined,
      };
      await updateUser(updateData);
      setUser((prev) => ({
        ...prev,
        [editingField]: editingValue || "Chưa cập nhật",
      }));
      setModalVisible(false);
      Alert.alert("Thành công", "Cập nhật thông tin thành công");
    } catch (error: any) {
      Alert.alert("Lỗi", error.message || "Không thể cập nhật thông tin");
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigation.reset({ index: 0, routes: [{ name: "Login" }] });
    } catch (error: any) {
      Alert.alert("Lỗi", error.message || "Không thể đăng xuất");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thông tin người dùng</Text>
      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          <Text style={styles.label}>Tên đăng nhập:</Text>
          <View style={styles.valueContainer}>
            <Text style={styles.value}>{user.username}</Text>
            <TouchableOpacity
              onPress={() => handleEditField("username", user.username)}
            >
              <MaterialIcons name="edit" size={18} color="#42a5f5" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.label}>Email:</Text>
          <View style={styles.valueContainer}>
            <Text style={styles.value}>{user.email}</Text>
            <TouchableOpacity
              onPress={() => handleEditField("email", user.email)}
            >
              <MaterialIcons name="edit" size={18} color="#42a5f5" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.label}>Địa chỉ:</Text>
          <View style={styles.valueContainer}>
            <Text style={styles.value}>{user.address}</Text>
            <TouchableOpacity
              onPress={() => handleEditField("address", user.address || "")}
            >
              <MaterialIcons name="edit" size={18} color="#42a5f5" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.label}>Số điện thoại:</Text>
          <View style={styles.valueContainer}>
            <Text style={styles.value}>{user.phoneNumber}</Text>
            <TouchableOpacity
              onPress={() =>
                handleEditField("phoneNumber", user.phoneNumber || "")
              }
            >
              <MaterialIcons name="edit" size={18} color="#42a5f5" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Chỉnh sửa{" "}
              {editingField === "username"
                ? "Tên đăng nhập"
                : editingField === "email"
                ? "Email"
                : editingField === "address"
                ? "Địa chỉ"
                : "Số điện thoại"}
            </Text>
            <TextInput
              style={styles.modalInput}
              value={editingValue}
              onChangeText={setEditingValue}
              autoCapitalize={editingField === "email" ? "none" : "sentences"}
              keyboardType={
                editingField === "phoneNumber"
                  ? "phone-pad"
                  : editingField === "email"
                  ? "email-address"
                  : "default"
              }
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#ffcccb" }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#c8e6c9" }]}
                onPress={handleSaveField}
              >
                <Text style={styles.modalButtonText}>Lưu</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <View style={styles.optionsBar}>
        <TouchableOpacity
          style={[styles.optionButton, { backgroundColor: "#bbdefb" }]}
          onPress={() => navigation.navigate("TaskList")}
          activeOpacity={0.7}
        >
          <MaterialIcons name="arrow-back" size={20} color="#42a5f5" />
          <Text style={styles.optionText}>Quay lại</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.optionButton, { backgroundColor: "#ffcccb" }]}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <MaterialIcons name="logout" size={20} color="#ef5350" />
          <Text style={styles.optionText}>Đăng xuất</Text>
        </TouchableOpacity>
      </View>
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
  title: {
    fontSize: 26,
    fontWeight: "600",
    textAlign: "center",
    color: "#fff",
    marginBottom: 20,
  },
  infoContainer: {
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoItem: {
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginTop: 8,
  },
  valueContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  value: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
  },
  optionsBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: "auto",
    marginBottom: 16,
  },
  optionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 10,
    marginHorizontal: 4,
  },
  optionText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    width: "100%",
    marginBottom: 16,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
    marginHorizontal: 5,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
});
