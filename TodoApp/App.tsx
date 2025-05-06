import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Register from "./screens/Register";
import Login from "./screens/Login";
import TaskList from "./screens/TaskList";
import AddTask from "./screens/AddTask";
import EditTask from "./screens/EditTask";
import UserInfo from "./screens/UserInfo";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Register"
          component={Register}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="TaskList"
          component={TaskList}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AddTask"
          component={AddTask}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EditTask"
          component={EditTask}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="UserInfo"
          component={UserInfo}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
