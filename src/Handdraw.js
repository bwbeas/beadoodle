import React, { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";
import { Hands } from "@mediapipe/hands";
import { Camera } from "@mediapipe/camera_utils";
import bgImage from "./background2.gif";

const Handdraw = () => {
  const webcamref = useRef(null);
  const canvasRef = useRef(null);
  //prev finger position
  const prevposref = useRef(null);
  const colorRef = useRef("white");

  const [filter, setFilter] = useState("original");

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
    height: "100vh",
    backgroundImage: `url(${bgImage})`,

    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    padding: "20px",
    boxSizing: "border-box",
  }}
>
  
  <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
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
          filter:
            filter === "vintage"
              ? "sepia(0.6) contrast(0.8) brightness(1.1) saturate(0.7)"
              : "none",
        }}
      />
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
      />
    </div>

    <div
      style={{
        marginTop: 10,
        
        display: "flex",
        gap: "10px",
        justifyContent: "center",
      }}
    >
      <button
        onClick={() => setFilter("original")}
        style={{
          padding: "6px 12px",
          cursor: "pointer",
          backgroundColor: filter === "original" ? "lightpink" : "grey",
          
          borderRadius: "20px",
          fontWeight: filter === "original" ? "bold" : "normal",
        }}
      >
        original
      </button>
      <button
        onClick={() => setFilter("vintage")}
        style={{
          padding: "6px 12px",
          cursor: "pointer",
          backgroundColor: filter === "vintage" ? "lightpink" : "grey",
          
          borderRadius: "20px",
          fontWeight: filter === "vintage" ? "bold" : "normal",
        }}
      >
        vintage
      </button>
    </div>

    <div
      style={{
        marginTop: "20px",
        display: "flex",
        gap: "10px",
        justifyContent: "center",
        flexWrap: "wrap",
        maxWidth: "90%",
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
        "brown",
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

  <div
    style={{
      width: "250px",
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      paddingLeft: "20px",
      paddingTop: "20px",
    }}
  >
    <button
      onClick={clearCanvas}
      style={{
        padding: "10px 20px",
        backgroundColor: "#c3074fff",
        color: "white",
        border: "none",
        borderRadius: "20px",
        cursor: "pointer",
        fontWeight: "bold",
        marginBottom: "20px",
      }}
    >
      🫐clear canvas🫐
    </button>

    <h3 style={{ margin: 0, color: "lightpink" }}>🍒 how do i use? 🍒</h3>
    <p style={{ fontSize: "16px", color: "#f0f0f0",fontWeight: "bold" }}>
      🐡pinch with your fingers to draw. <br />
      🐡show your palm or stop pinching to stop drawing. <br />
      🐡use the 'clear canvas button' to start over!
    </p>

 <button
  onClick={() => {
    const webcamVideo = webcamref.current.video;
    const drawingCanvas = canvasRef.current;

    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = drawingCanvas.width;
    tempCanvas.height = drawingCanvas.height;

    const ctx = tempCanvas.getContext("2d");

    ctx.save();
    ctx.scale(-1, 1);
if (filter === "vintage") {
    ctx.filter = "sepia(0.6) contrast(0.8) brightness(1.1) saturate(0.7)";
  } else {
    ctx.filter = "none";
  }
    ctx.drawImage(webcamVideo, -tempCanvas.width, 0, tempCanvas.width, tempCanvas.height);
ctx.filter = "none";
    ctx.drawImage(drawingCanvas, -tempCanvas.width, 0, tempCanvas.width, tempCanvas.height);
 
    ctx.restore();

    const link = document.createElement("a");
    link.download = "webcam-drawing.png";
    link.href = tempCanvas.toDataURL("image/png");
    link.click();
  }}
  style={{
    marginTop: "20px",
    padding: "10px 20px",
    backgroundColor: "#026402ff",
    color: "white",
    border: "none",
    borderRadius: "20px",
    cursor: "pointer",
    fontWeight: "bold",
  }}
>
  🍋‍🟩download my photo!🍋‍🟩
</button>


  </div>
</div>

  );
};
export default Handdraw;