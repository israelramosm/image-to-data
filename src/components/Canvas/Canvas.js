import React, { useEffect, useRef, useState } from "react";

import pickachuPNG from "./pikachu.png";

function App() {
  const canvasRef = useRef(null);
  const [context, setContext] = useState(null);

  // Set display size (vw/vh).

  const xSize = 540,
    ySize = 360,
    scale = 2, // Max scale 2
    shapeSize = 1, // Max shape size 5
    sizeWidth = Math.floor(xSize * shapeSize * scale),
    sizeHeight = Math.floor(ySize * shapeSize * scale);

  console.log({ scale, shapeSize, sizeWidth, sizeHeight });

  useEffect(() => {
    let mouseDown = false;
    let start = { x: 0, y: 0 };
    let end = { x: 0, y: 0 };
    let canvasOffsetLeft = xSize / 2;
    let canvasOffsetTop = ySize / 2;

    function handleMouseDown(evt) {
      mouseDown = true;

      start = {
        x: Math.floor(evt.clientX / scale - canvasOffsetLeft),
        y: Math.floor(evt.clientY / scale - canvasOffsetTop),
      };

      end = {
        x: Math.floor(evt.clientX / scale - canvasOffsetLeft),
        y: Math.floor(evt.clientY / scale - canvasOffsetTop),
      };

      // console.log("Mouse down", { start, end });
    }

    function handleMouseUp(evt) {
      mouseDown = false;
    }

    function handleMouseMove(evt) {
      if (mouseDown && context) {
        start = {
          x: end.x,
          y: end.y,
        };

        end = {
          x: Math.floor(evt.clientX / scale - canvasOffsetLeft),
          y: Math.floor(evt.clientY / scale - canvasOffsetTop),
        };

        // console.log("Mouse move", { start, end });

        // Draw our path
        context.beginPath();
        context.moveTo(start.x, start.y);
        context.lineTo(end.x, end.y);
        context.strokeStyle = `#${randomColor()}`;
        context.lineWidth = 3;
        context.stroke();
        context.closePath();
      }
    }

    function randomColor() {
      const color = [];

      for (let i = 0; i < 6; i++) {
        const val = Math.floor(Math.random() * 16);

        if (val < 10) {
          color[i] = val.toString();
        } else {
          color[i] = String.fromCharCode(val + 87);
        }
      }

      return color.join("");
    }

    function rgbToHex(r, g, b) {
      if (r > 255 || g > 255 || b > 255) throw "Invalid color component";
      return ((r << 16) | (g << 8) | b).toString(16);
    }

    if (canvasRef.current) {
      const renderCtx = canvasRef.current.getContext("2d");
      canvasRef.current.style.width = sizeWidth + "px";
      canvasRef.current.style.height = sizeHeight + "px";
      canvasRef.current.width = sizeWidth;
      canvasRef.current.height = sizeHeight;

      if (renderCtx) {
        canvasRef.current.addEventListener("mousedown", handleMouseDown);
        canvasRef.current.addEventListener("mouseup", handleMouseUp);
        canvasRef.current.addEventListener("mousemove", handleMouseMove);

        canvasOffsetLeft = canvasRef.current.offsetLeft;
        canvasOffsetTop = canvasRef.current.offsetTop;

        setContext(renderCtx);
      }
    }

    if (context) context.scale(scale, scale);

    // Draw a rectangle
    if (context) {
      for (
        let index = 0;
        index < sizeWidth / scale - shapeSize;
        index += shapeSize
      ) {
        context.fillRect(index, 0, shapeSize, shapeSize);
        context.fillStyle = `#${randomColor()}`;
        context.fill();
      }
      for (
        let index = 0;
        index < sizeHeight / scale - shapeSize;
        index += shapeSize
      ) {
        context.fillRect(0, index, shapeSize, shapeSize);
        context.fillStyle = `#${randomColor()}`;
        context.fill();
      }
    }

    // Draw a circle
    if (context) {
      context.beginPath();
      context.fillStyle = "#ff7f50";
      context.arc(40, 40, 20, 0, Math.PI * 2, true);
      context.fill();
      context.fillStyle = "#000";
      context.closePath();
    }

    if (context) {
      const data = context.getImageData(0, 0, 2, 2).data;
      const rgb = [];
      const hexData = [];
      data.forEach((cur) => {
        let hex = "#";
        rgb.push(cur);
        if (rgb.length === 4) {
          hex = `#${rgbToHex(rgb[0], rgb[1], rgb[2])}`;
          hexData.push(hex);
          rgb.length = 0;
        }
      });

      // // console.log({ hexData });
      // const imgPikachu = new Image();
      // imgPikachu.src=pickachuPNG
      // context.drawImage(imgPikachu, 0, 0);
    }

    // cleanUp
    return () => {
      if (canvasRef.current) {
        canvasRef.current.removeEventListener("mousedown", handleMouseDown);
        canvasRef.current.removeEventListener("mouseup", handleMouseUp);
        canvasRef.current.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, [context]);

  return (
    <div
      style={{
        textAlign: "center",
        width: "90vw",
        height: "90vh",
        overflow: "scroll",
        margin: "20px auto",
      }}
    >
      <canvas
        id="canvas"
        ref={canvasRef}
        style={{
          border: "2px solid #000",
          marginTop: 10,
        }}
      ></canvas>
    </div>
  );
}

export default App;
