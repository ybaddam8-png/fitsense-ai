# Native MediaPipe integration notes

The selected native dependency is `@thinksys/react-native-mediapipe@0.0.21`. Its published package includes iOS Swift services and Android Kotlin/Java services, a bundled `pose_landmarker_full.task` model, and the `RNMediapipe` view with `onLandmark` callbacks. The native event payload exposes 33 normalized landmarks with x/y/z/visibility and image dimensions.

Sources consulted on 2026-09-25:

- [ThinkSys MediaPipe npm package](https://www.npmjs.com/package/@raznak/react-native-mediapipe) — documentation page describes the ThinkSys package API, iOS 13+ requirement, Android SDK requirements, and `RNMediapipe`/`onLandmark` usage.
- [ThinkSys package metadata](https://www.npmjs.com/package/@thinksys/react-native-mediapipe) — package tarball inspection confirmed Android and iOS native sources and the bundled pose landmarker model.
- [Expo Pose Landmarks npm package](https://www.npmjs.com/package/expo-pose-landmarks) — evaluated but not selected because the published package contains only JS build output and declares an `expo-modules-core` peer mismatch for this SDK; it does not ship the native model implementation needed here.
- [MediaPipe Pose Landmarker Android guide](https://developers.google.com/edge/mediapipe/solutions/vision/pose_landmarker/android) — confirms the native task-based pose landmarking model and on-device inference approach.

The app uses `newArchEnabled: false` because the selected package exposes a legacy React Native native view bridge. Expo camera permissions are configured for iOS and Android, with iOS 13 and Android SDK 26 minimums.
