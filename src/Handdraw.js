import React, {useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";
import {Hands} from "@mediapipe/hands";
import {Camera} from "@mediapipe/camera_utils";

const Handdraw=()=>{
    const webcamref=useRef(null);
    const canvasRef=useRef(null);
    //prev finger position
    const prevposref=useRef(null);


    const clearCanvas = () => {
  const canvas = canvasRef.current;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  prevposref.current = null;
};

    useEffect(() =>{
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
      
      const landmarks=results.multiHandLandmarks[0];
      const indexFingerTip=landmarks[8];
      const thumbTip = landmarks[4];

      const dx = indexFingerTip.x - thumbTip.x;
      const dy = indexFingerTip.y - thumbTip.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      const isPinching = distance < 0.05;

      const canvas=canvasRef.current;
      const ctx=canvas.getContext("2d");

      const x=indexFingerTip.x * canvas.width;
      const y=indexFingerTip.y * canvas.height;

      if(isPinching){

      if(prevposref.current){
        ctx.beginPath();
        ctx.moveTo(prevposref.current.x, prevposref.current.y);
        ctx.lineTo(x,y);
        ctx.strokeStyle="red";
        ctx.lineWidth=3;
        ctx.stroke();
        ctx.closePath();
      }

      prevposref.current={x,y};
    } else{
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
  }, []);

  return(
    <div>
        <Webcam
        ref={webcamref}
        style={{
            position: "absolute",
            left: 0,
          top: 0,
          width: 640,
          height: 480,
          transform: "scaleX(-1)",
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

    </div>
  );
};
export default Handdraw;