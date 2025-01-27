import React, { useEffect, useRef } from "react";
import fabric from "fabric"; // Correct import

const DressCustomizer = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Initialize the Fabric.js canvas
    const canvas = new fabric.Canvas("dressCanvas");
    canvasRef.current = canvas;

    // Load a basic dress outline
    fabric.Image.fromURL("/images/dress-outline.png", (img) => {
      img.scaleToWidth(300);
      img.scaleToHeight(400);
      img.set({
        left: 50,
        top: 50,
        selectable: false,
      });
      canvas.add(img);
    });

    return () => canvas.dispose(); // Cleanup on component unmount
  }, []);

  // Change dress color
  const changeColor = (color) => {
    const objects = canvasRef.current.getObjects();
    objects.forEach((obj) => {
      if (obj.type === "image") {
        obj.filters = [
          new fabric.Image.filters.Tint({
            color,
            opacity: 0.6,
          }),
        ];
        obj.applyFilters();
        canvasRef.current.renderAll();
      }
    });
  };

  // Add a pattern
  const addPattern = () => {
    fabric.Image.fromURL("/images/pattern.png", (patternImg) => {
      patternImg.scaleToWidth(300);
      patternImg.scaleToHeight(400);
      patternImg.set({
        left: 50,
        top: 50,
        selectable: false,
      });
      canvasRef.current.add(patternImg);
    });
  };

  return (
    <div>
      <h1>Dress Customization</h1>
      <div style={{ textAlign: "center", margin: "20px 0" }}>
        <canvas id="dressCanvas" width="400" height="600"></canvas>
      </div>
      <div style={{ textAlign: "center" }}>
        <button onClick={() => changeColor("#ff6f00")}>Orange</button>
        <button onClick={() => changeColor("#4caf50")}>Green</button>
        <button onClick={() => changeColor("#3f51b5")}>Blue</button>
        <button onClick={addPattern}>Add Pattern</button>
      </div>
    </div>
  );
};

export default DressCustomizer;
