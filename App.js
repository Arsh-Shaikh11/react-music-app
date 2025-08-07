import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Provider as PaperProvider } from "react-native-paper";
import Login from "./src/LoginScreen";
import RegisterScreen from "./src/Register";
import HomeScreen from "./src/HomeScreen";
import AdminScreen from "./src/AdminScreen";
import UserScreen from "./src/UserScreen";
import ArtistDetailScreen from "./src/ArtistDetailScreen";



const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator>
          
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Admin" component={AdminScreen} />
          <Stack.Screen name="UserScreen" component={UserScreen} />
          <Stack.Screen name="ArtistDetail" component={ArtistDetailScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
};
