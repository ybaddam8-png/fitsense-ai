import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ThemeProvider } from "@/lib/theme-provider";
import { Colors } from "@/src/constants/Colors";
export default function RootLayout() { return <ThemeProvider><StatusBar style="light" /><Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: Colors.background } }}><Stack.Screen name="(tabs)" /><Stack.Screen name="workout-selection" /><Stack.Screen name="camera-setup" /><Stack.Screen name="live-workout" /><Stack.Screen name="workout-summary" /></Stack></ThemeProvider>; }
