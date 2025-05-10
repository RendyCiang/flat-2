import React, { useEffect, useState } from "react";

const EyeTracking: React.FC = () => {
  const [gazeData, setGazeData] = useState({ docX: 0, docY: 0, state: -1 });
  const [isTracking, setIsTracking] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [scriptError, setScriptError] = useState<string | null>(null);

  // Load GazeCloudAPI script dynamically
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://api.gazerecorder.com/GazeCloudAPI.js";
    script.async = true;

    script.onload = () => {
      setIsScriptLoaded(true);
    };

    script.onerror = () => {
      setScriptError("Failed to load GazeCloudAPI script");
    };

    document.body.appendChild(script);

    // Cleanup: Remove script when component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Initialize GazeCloudAPI callbacks
  useEffect(() => {
    if (isScriptLoaded && window.GazeCloudAPI) {
      window.GazeCloudAPI.OnResult = (GazeData) => {
        setGazeData({
          docX: GazeData.docX,
          docY: GazeData.docY,
          state: GazeData.state,
        });
        console.log("GazeData:", GazeData);
      };

      window.GazeCloudAPI.OnCalibrationComplete = () => {
        console.log("Gaze Calibration Complete");
      };

      window.GazeCloudAPI.OnCamDenied = () => {
        console.log("Camera access denied");
      };

      window.GazeCloudAPI.OnError = (msg) => {
        console.error("Error:", msg);
      };

      window.GazeCloudAPI.UseClickRecalibration = true;
    }
  }, [isScriptLoaded]);

  // Start eye tracking
  const startTracking = () => {
    if (isScriptLoaded && window.GazeCloudAPI && !isTracking) {
      window.GazeCloudAPI.StartEyeTracking();
      setIsTracking(true);
    }
  };

  // Stop eye tracking
  const stopTracking = () => {
    if (isScriptLoaded && window.GazeCloudAPI && isTracking) {
      window.GazeCloudAPI.StopEyeTracking();
      setIsTracking(false);
    }
  };

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (isTracking) {
        stopTracking();
      }
    };
  }, [isTracking]);

  if (scriptError) {
    return <div className="text-red-500">Error: {scriptError}</div>;
  }

  return (
    <div className="mt-6 p-4 border rounded-lg">
      <h2 className="text-2xl font-semibold mb-2">Eye Tracking</h2>
      {!isScriptLoaded && <p>Loading eye tracking module...</p>}
      <div className="flex space-x-4 mb-4">
        <button
          onClick={startTracking}
          disabled={isTracking || !isScriptLoaded}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          Start Eye Tracking
        </button>
        <button
          onClick={stopTracking}
          disabled={!isTracking || !isScriptLoaded}
          className="px-4 py-2 bg-red-500 text-white rounded disabled:bg-gray-300"
        >
          Stop Eye Tracking
        </button>
      </div>
      <div>
        <h3 className="text-xl font-medium">Gaze Data</h3>
        <p>X: {gazeData.docX.toFixed(2)}</p>
        <p>Y: {gazeData.docY.toFixed(2)}</p>
        <p>
          State:{" "}
          {gazeData.state === 0
            ? "Valid"
            : gazeData.state === -1
            ? "Face Tracking Lost"
            : "Uncalibrated"}
        </p>
      </div>
    </div>
  );
};

export default EyeTracking;
