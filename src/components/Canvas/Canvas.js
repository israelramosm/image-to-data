import React, { useEffect, useRef, useState } from "react";

function App() {
  const canvasRef = useRef(null);
  const [context, setContext] = useState(null);
  // Set display size (vw/vh).
  const sizeWidth = (80 * window.innerWidth) / 100,
    sizeHeight = (100 * window.innerHeight) / 100 || 766;

  useEffect(() => {
    let mouseDown = false;
    let start = { x: 0, y: 0 };
    let end = { x: 0, y: 0 };
    let canvasOffsetLeft = 0;
    let canvasOffsetTop = 0;

    function handleMouseDown(evt) {
      mouseDown = true;

      start = {
        x: evt.clientX - canvasOffsetLeft,
        y: evt.clientY - canvasOffsetTop,
      };

      end = {
        x: evt.clientX - canvasOffsetLeft,
        y: evt.clientY - canvasOffsetTop,
      };
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
          x: evt.clientX - canvasOffsetLeft,
          y: evt.clientY - canvasOffsetTop,
        };

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

    if (canvasRef.current) {
      const renderCtx = canvasRef.current.getContext("2d");

      //Setting the canvas site and width to be responsive
      canvasRef.current.width = sizeWidth;
      canvasRef.current.height = sizeHeight;
      canvasRef.current.style.width = sizeWidth;
      canvasRef.current.style.height = sizeHeight;

      if (renderCtx) {
        canvasRef.current.addEventListener("mousedown", handleMouseDown);
        canvasRef.current.addEventListener("mouseup", handleMouseUp);
        canvasRef.current.addEventListener("mousemove", handleMouseMove);

        canvasOffsetLeft = canvasRef.current.offsetLeft;
        canvasOffsetTop = canvasRef.current.offsetTop;

        setContext(renderCtx);
      }
    }

    if (context) context.scale(10, 10)

    // Draw a rectangle
    if (context) {
      context.fillStyle = "#ff7f50";
      context.fillRect(5, 5, 5, 5);
      context.fill();
      context.fillStyle = "#ffff50";
      context.fillRect(15, 15, 5, 5);
      context.fill();
    }

    // Draw a circle
    if (context) {
      context.beginPath();
      context.fillStyle = "#ff7f50";
      context.arc(60, 20, 20, 0, Math.PI * 2, true);
      context.fill();
      context.fillStyle = "#000";
      context.closePath();
    }

    if (context) console.log(context.getImageData(0, 0, 100, 100));

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
      }}
    >
      <canvas
        id="canvas"
        ref={canvasRef}
        style={{
          border: "2px solid #000",
          marginTop: 10,
          height: "90vh",
          width: "90vw",
        }}
      ></canvas>
    </div>
  );
}

export default App;
