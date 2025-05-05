import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { register } from "../services/UserService";
import { RootStackParamList } from "../types/navigation";

type RegisterNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Register"
>;

export default function Register() {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigation = useNavigation<RegisterNavigationProp>();

  const handleRegister = async () => {
    try {
      console.log("Bắt đầu đăng ký:", { username, email, password });
      await register(username, email, password);
      Alert.alert("Thành công", "Đăng ký thành công! Vui lòng đăng nhập.", [
        { text: "OK", onPress: () => navigation.navigate("Login") },
      ]);
    } catch (error: any) {
      console.error("Lỗi đăng ký:", error.message);
      Alert.alert(
        "Lỗi",
        error.message || "Đăng ký thất bại. Vui lòng thử lại."
      );
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.title}>Create Account</Text>
        <Image
          source={require("../images/login.jpg")}
          style={{
            width: 200,
            height: 180,
            marginBottom: 40,
          }}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter your Name"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="words"
          multiline={false}
          textBreakStrategy="simple"
        />
        <TextInput
          style={styles.input}
          placeholder="Enter your Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          multiline={false}
          textBreakStrategy="simple"
        />
        <TextInput
          style={styles.input}
          placeholder="Enter Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          multiline={false}
          textBreakStrategy="simple"
        />
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginTop: 20,
          }}
        >
          <Text style={{ color: "#A5F3FC", fontWeight: 500 }}>
            Already have an account ?
          </Text>
          <View style={{ width: 10 }} />
          <Text
            style={{ color: "#A5F3FC", fontWeight: "bold" }}
            onPress={() => navigation.navigate("Login")}
          >
            Login
          </Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#636bfb",
    alignItems: "center",
  },
  title: {
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 28,
    marginBottom: 20,
    color: "white",
  },
  input: {
    borderWidth: 0.5,
    borderColor: "#ccc",
    paddingLeft: 20,
    height: 50,
    marginBottom: 30,
    borderRadius: 50,
    color: "black",
    backgroundColor: "white",
    width: "100%",
  },
  button: {
    backgroundColor: "#50C2C9",
    padding: 10,
    borderRadius: 5,
    height: 50,
    justifyContent: "center",
    width: "100%",
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "semibold",
  },
});
