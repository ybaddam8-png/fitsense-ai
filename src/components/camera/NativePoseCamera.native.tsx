import { RNMediapipe } from "@thinksys/react-native-mediapipe";
import { StyleSheet, View } from "react-native";
import type { NativePoseEvent } from "@/src/core/pose/nativeMapper";
export function NativePoseCamera({ onLandmark, width, height }: { onLandmark: (event: NativePoseEvent) => void; width: number; height: number }) { return <View style={[styles.container, { width, height }]} accessibilityLabel="Live camera pose tracking"><RNMediapipe style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }} width={width} height={height} onLandmark={onLandmark} face={false} leftArm rightArm leftWrist rightWrist torso leftLeg rightLeg leftAnkle rightAnkle frameLimit={30} /></View>; }
const styles = StyleSheet.create({ container: { overflow: "hidden", borderRadius: 26, backgroundColor: "#111813" } });
