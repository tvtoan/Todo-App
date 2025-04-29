import { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { login } from "../services/UserService";
import { RootStackParamList } from "../types/navigation";

type LoginNavigationProp = StackNavigationProp<RootStackParamList, "Login">;

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigation = useNavigation<LoginNavigationProp>();

  const handleLogin = async () => {
    try {
      console.log("Bắt đầu đăng nhập:", { email, password });
      await login(email, password);
      navigation.replace("TaskList");
    } catch (error: any) {
      console.error("Lỗi đăng nhập:", error.message);
      Alert.alert(
        "Lỗi",
        error.message === "Thông tin đăng nhập chưa chính xác"
          ? "Email hoặc mật khẩu không đúng. Vui lòng kiểm tra lại."
          : error.message || "Đăng nhập thất bại. Vui lòng thử lại."
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng nhập</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Mật khẩu"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Đăng nhập" onPress={handleLogin} />
      <Button
        title="Đi đến Đăng ký"
        onPress={() => navigation.navigate("Register")}
        color="gray"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
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
