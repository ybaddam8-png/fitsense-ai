import { Text, View, StyleSheet } from "react-native";
import { Colors } from "@/src/constants/Colors";
export function MetricBadge({ label, value, accent = Colors.accent }: { label: string; value: string; accent?: string }) { return <View style={styles.wrap}><Text style={styles.label}>{label}</Text><Text style={[styles.value, { color: accent }]}>{value}</Text></View>; }
const styles = StyleSheet.create({ wrap: { gap: 4 }, label: { color: Colors.muted, fontSize: 10, fontWeight: "800", letterSpacing: 1.4 }, value: { fontSize: 24, fontWeight: "900" } });
