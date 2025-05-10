interface GazeData {
  state: number; // 0: valid gaze data; -1: face tracking lost, 1: gaze data uncalibrated
  docX: number; // gaze x in document coordinates
  docY: number; // gaze y in document coordinates
  time: number; // timestamp
}

interface GazeCloudAPI {
  StartEyeTracking: () => void;
  StopEyeTracking: () => void;
  OnResult?: (gazeData: GazeData) => void;
  OnCalibrationComplete?: () => void;
  OnCamDenied?: () => void;
  OnError?: (msg: string) => void;
  UseClickRecalibration?: boolean;
}

interface Window {
  GazeCloudAPI: GazeCloudAPI;
}
