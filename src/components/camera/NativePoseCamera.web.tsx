import { Text, View, StyleSheet } from "react-native";
import { Colors } from "@/src/constants/Colors";
import type { NativePoseEvent } from "@/src/core/pose/nativeMapper";
export function NativePoseCamera(_: { onLandmark: (event: NativePoseEvent) => void; width: number; height: number }) { return <View style={styles.container}><Text style={styles.text}>Native camera preview appears in an iOS or Android development build.</Text></View>; }
const styles = StyleSheet.create({ container: { ...StyleSheet.absoluteFillObject, alignItems: "center", justifyContent: "center", padding: 28 }, text: { color: Colors.muted, textAlign: "center", fontSize: 13, lineHeight: 19 } });
