# Native QA Record

## Scope

This pass covers the native MediaPipe camera adapter, camera permission configuration, authenticated sync entry points, and accessibility safeguards for the primary workout and profile flows.

## Verification matrix

| Area | Result | Evidence or limitation |
|---|---|---|
| Native MediaPipe module | Pass | `@thinksys/react-native-mediapipe@0.0.21` is installed; both iOS and Android include the bundled `pose_landmarker_full.task` model; `RNMediapipe.onLandmark` is mapped into the shared 33-point `PoseFrame`. |
| iOS camera permission | Pass by generated-project inspection | `NSCameraUsageDescription` is present with an on-device pose explanation. Generated iOS deployment target is 15.1, above the module’s iOS 13 requirement. |
| Android camera permission | Pass by generated-project inspection | `android.permission.CAMERA` is present and generated Android `minSdkVersion` is 26. |
| Expo dependency health | Pass | `npx --yes expo-doctor` reports 18/18 checks passed after adding `expo-asset`, registering native plugins, and aligning SDK 54 package ranges. |
| TypeScript and unit tests | Pass | `pnpm check` passes; `pnpm test` passes 4 tests across native payload mapping and pose engine behavior. The scaffolded auth logout test remains skipped because it requires external auth context. |
| Server bundle | Pass | `pnpm build` completes and emits `dist/index.js`; protected workout tRPC procedures compile. |
| Web fallback | Pass | Web screenshots verified profile sync controls, camera permission state, Demo Mode, and live workout without importing the native MediaPipe module. |
| Accessibility safeguards | Pass for implemented controls | Shared `Button` now supplies button roles and labels by default. Profile text fields, sign-in, sync, sign-out, camera permission, pause, finish, and live-workout close controls have explicit labels. |
| Android native compilation | Environment-blocked | Gradle configuration reached Expo project setup, but this Linux sandbox has no Android SDK / `ANDROID_HOME`; the failure is environmental rather than a Java/Kotlin compilation error. |
| iOS device compilation | Environment-blocked | The sandbox is Linux and has no Xcode or CocoaPods, so final iOS build and VoiceOver verification must run on macOS. |

## Device handoff checklist

On an Android host with Android Studio or a configured CI runner, set `ANDROID_HOME`, run `npx expo prebuild`, then `npx expo run:android`. Verify first-launch camera denial, permission grant, denial recovery through the in-app action, front-camera framing, landmark updates, pause/resume, and session completion. On macOS, run the equivalent iOS build and verify the permission prompt wording, background/foreground resume, VoiceOver focus order, Dynamic Type or larger text behavior, and the home indicator safe area.

For both platforms, confirm that the Profile sign-in flow returns to the app through the configured deep link, that SecureStore retains the session token, and that a sync action writes only the completed summary to the authenticated account. Raw camera frames and landmark arrays should not appear in network inspection.
