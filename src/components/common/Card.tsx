import { View, type ViewProps } from "react-native";
import { Colors } from "@/src/constants/Colors";
export function Card({ children, style, ...props }: ViewProps) { return <View {...props} style={[{ backgroundColor: Colors.surface, borderColor: Colors.border, borderWidth: 1, borderRadius: 24, padding: 18 }, style]}>{children}</View>; }
