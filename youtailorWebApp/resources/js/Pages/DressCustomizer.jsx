import React, { useState, useEffect, useRef } from "react";
import fabric from "fabric"; // Default import for fabric.js


const DressCustomizer = () => {
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [dressImage, setDressImage] = useState(null);
  const [category, setCategory] = useState("casual");

  useEffect(() => {
    const newCanvas = new fabric.Canvas("dressCanvas");
    setCanvas(newCanvas);

    // Load default dress image
    loadDressImage("casual");

    return () => newCanvas.dispose(); // Cleanup
  }, []);

  const loadDressImage = (category) => {
    // Change this path dynamically based on category
    const imageUrl = `/storage/images/${category}-dress.png`; // Update with correct path for your categories
    fabric.Image.fromURL(imageUrl, (img) => {
      img.scaleToWidth(300);
      img.scaleToHeight(400);
      img.set({
        left: 50,
        top: 50,
        selectable: true,
      });
      canvas.clear(); // Clear the canvas before adding a new image
      canvas.add(img);
      setDressImage(img); // Save the image reference in state
    });
  };

  const changeColor = (color) => {
    if (dressImage) {
      dressImage.filters = [
        new fabric.Image.filters.Tint({
          color,
          opacity: 0.6,
        }),
      ];
      dressImage.applyFilters();
      canvas.renderAll();
    }
  };

  const addText = (text) => {
    const textObj = new fabric.Textbox(text, {
      left: 100,
      top: 100,
      fontSize: 30,
      fill: "#000",
      fontFamily: "Arial",
    });
    canvas.add(textObj);
  };

  const addImage = (imageUrl) => {
    fabric.Image.fromURL(imageUrl, (img) => {
      img.scaleToWidth(100);
      img.scaleToHeight(100);
      img.set({
        left: 150,
        top: 150,
      });
      canvas.add(img);
    });
  };

  const handleCategoryChange = (category) => {
    setCategory(category);
    loadDressImage(category);
  };

  return (
    <div className="customizer-container">
      <h1>Dress Customization</h1>
      <div className="canvas-container">
        <canvas id="dressCanvas" width="400" height="600"></canvas>
      </div>
      <div className="customization-options">
        <div className="category-selector">
          <button onClick={() => handleCategoryChange("casual")} className={category === "casual" ? "active" : ""}>
            Casual
          </button>
          <button onClick={() => handleCategoryChange("formal")} className={category === "formal" ? "active" : ""}>
            Formal
          </button>
          <button onClick={() => handleCategoryChange("evening")} className={category === "evening" ? "active" : ""}>
            Evening
          </button>
        </div>
        <div className="color-picker">
          <button className="color-btn" onClick={() => changeColor("#ff6f00")} style={{ backgroundColor: "#ff6f00" }}></button>
          <button className="color-btn" onClick={() => changeColor("#4caf50")} style={{ backgroundColor: "#4caf50" }}></button>
          <button className="color-btn" onClick={() => changeColor("#3f51b5")} style={{ backgroundColor: "#3f51b5" }}></button>
          <button className="color-btn" onClick={() => changeColor("#e91e63")} style={{ backgroundColor: "#e91e63" }}></button>
        </div>
        <div className="text-tools">
          <input
            type="text"
            placeholder="Add text"
            onKeyDown={(e) => {
              if (e.key === "Enter") addText(e.target.value);
            }}
          />
        </div>
        <div className="upload-tools">
          <button onClick={() => addImage("/storage/images/flower.png")}>Add Image</button>
        </div>
      </div>
    </div>
  );
};

export default DressCustomizer;
