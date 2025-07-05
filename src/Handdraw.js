import React, { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";
import { Hands } from "@mediapipe/hands";
import { Camera } from "@mediapipe/camera_utils";

const Handdraw = () => {
  const webcamref = useRef(null);
  const canvasRef = useRef(null);
  //prev finger position
  const prevposref = useRef(null);
  const colorRef = useRef("white");

  const [drawColor, setDrawColor] = useState("red");

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    prevposref.current = null;
  };

  useEffect(() => {
    const hands = new Hands({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });
    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.8,
      minTrackingConfidence: 0.9,
    });

    hands.onResults((results) => {
      if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0)
        return;

      const landmarks = results.multiHandLandmarks[0];
      const indexFingerTip = landmarks[8];
      const thumbTip = landmarks[4];

      const dx = indexFingerTip.x - thumbTip.x;
      const dy = indexFingerTip.y - thumbTip.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      const isPinching = distance < 0.05;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      const x = indexFingerTip.x * canvas.width;
      const y = indexFingerTip.y * canvas.height;

      if (isPinching) {

        if (prevposref.current) {
          ctx.beginPath();
          ctx.moveTo(prevposref.current.x, prevposref.current.y);
          ctx.lineTo(x, y);
          ctx.strokeStyle = colorRef.current;
          ctx.lineWidth = 3;
          ctx.lineJoin = "round";
          ctx.lineCap = "round";
          ctx.globalAlpha = 1.0;
          ctx.stroke();
          ctx.closePath();
        }

        prevposref.current = { x, y };
      } else {
        prevposref.current = null;
      }
    });

    if (
      typeof webcamref.current !== "undefined" &&
      webcamref.current !== null
    ) {
      const camera = new Camera(webcamref.current.video, {
        onFrame: async () => {
          await hands.send({ image: webcamref.current.video });
        },
        width: 640,
        height: 480,
      });
      camera.start();
    }
    colorRef.current = drawColor;
  }, [drawColor]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        position: "relative",
        
      }}
    >
      <div style={{ position: "relative", width: 640, height: 480 }}>
        <Webcam
          ref={webcamref}
          style={{

            width: 640,
            height: 480,
            transform: "scaleX(-1)",
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 1,
          }}></Webcam>
        <canvas
          ref={canvasRef}
          width={640}
          height={480}
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            transform: "scaleX(-1)",
            zIndex: 2,
            backgroundColor: "transparent",
          }}
        ></canvas>
      </div>
      <button
        onClick={clearCanvas}
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          zIndex: 3,
          padding: "10px 20px",
          backgroundColor: "#ff4444",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        clear canvas
      </button>

      <div
        style={{
          marginTop: "20px",
          display: "flex",
          gap: "10px",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        {[
          "black",
          "white",
          "gray",
          "green",
          "lightgreen",
          "blue",
          "lightblue",
          "yellow",
          "red",
          "orange",
          "pink",
          "purple",
          "#fcd5b5",
          "brown"
        ].map((color) => (
          <button
            key={color}
            onClick={() => setDrawColor(color)}
            title={color}
            style={{
              width: 30,
              height: 30,
              backgroundColor: color,
              borderRadius: "15%",
              border: drawColor === color ? "3px solid gray" : "1px solid #ccc",
              outline: drawColor === color ? "2px solid black" : "none",
              cursor: "pointer",
            }}
          ></button>
        ))}
      </div>
    </div>
  );
};
export default Handdraw;