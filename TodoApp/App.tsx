import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Register from "./screens/Register";
import Login from "./screens/Login";
import TaskList from "./screens/TaskList";
import AddTask from "./screens/AddTask";
import EditTask from "./screens/EditTask";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Register"
          component={Register}
          options={{ title: "Register" }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ title: "Login" }}
        />
        <Stack.Screen
          name="TaskList"
          component={TaskList}
          options={{ title: "My Tasks" }}
        />
        <Stack.Screen
          name="AddTask"
          component={AddTask}
          options={{ title: "Add Task" }}
        />
        <Stack.Screen
          name="EditTask"
          component={EditTask}
          options={{ title: "Edit Task" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
