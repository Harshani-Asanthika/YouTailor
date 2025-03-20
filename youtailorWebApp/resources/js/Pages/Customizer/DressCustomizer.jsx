import React, { useState, useRef } from 'react';
import Draggable from 'react-draggable';
import html2canvas from 'html2canvas';

function TShirtCustomizer() {
  const [text, setText] = useState('');
  const [textColor, setTextColor] = useState('#000000'); // Default text color is black
  const [textSize, setTextSize] = useState(24); // Default text size
  const [shirtColor, setShirtColor] = useState('#ffffff'); // Default shirt color is white
  const [textPosition, setTextPosition] = useState({ x: 0, y: 0 }); // Text position
  const [fabric, setFabric] = useState(''); // Selected fabric texture
  const [logo, setLogo] = useState(null); // Uploaded logo/image
  const [pattern, setPattern] = useState(''); // Selected pattern
  const [logoSize, setLogoSize] = useState(1); // Logo/image size (scale factor)
  const previewRef = useRef(null); // Reference for the preview container

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  const handleTextColorChange = (event) => {
    setTextColor(event.target.value);
  };

  const handleTextSizeChange = (event) => {
    setTextSize(parseInt(event.target.value, 10));
  };

  const handleShirtColorChange = (event) => {
    setShirtColor(event.target.value);
  };

  const handleFabricChange = (event) => {
    setFabric(event.target.value);
  };

  const handlePatternChange = (event) => {
    setPattern(event.target.value);
  };

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogo(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoResize = (event) => {
    const scale = parseFloat(event.target.value);
    setLogoSize(scale);
  };

  const handleDrag = (e, data) => {
    setTextPosition({ x: data.x, y: data.y });
  };

  const handleDownload = () => {
    if (previewRef.current) {
      // Capture the preview container as a canvas
      html2canvas(previewRef.current, { useCORS: true }).then((canvas) => {
        // Create a temporary canvas to crop the T-shirt shape
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');

        // Set the temporary canvas size to match the T-shirt dimensions
        const tshirtWidth = 300; // Width of the T-shirt preview
        const tshirtHeight = 400; // Height of the T-shirt preview
        tempCanvas.width = tshirtWidth;
        tempCanvas.height = tshirtHeight;

        // Draw the T-shirt area onto the temporary canvas
        tempCtx.drawImage(canvas, 0, 0, tshirtWidth, tshirtHeight, 0, 0, tshirtWidth, tshirtHeight);

        // Convert the temporary canvas to an image URL
        const imageUrl = tempCanvas.toDataURL('image/png');

        // Create a temporary link element
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = 'tshirt-design.png'; // File name
        link.click(); // Trigger the download
      });
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      {/* Left Side: Editable Options */}
      <div style={{ flex: 1, padding: '20px', borderRight: '1px solid #ccc', overflowY: 'auto' }}>
        <h1 style={{ color: '#333', marginBottom: '20px' }}>T-Shirt Customizer</h1>

        {/* Shirt Color Picker */}
        <div style={{ margin: '20px 0' }}>
          <label htmlFor="shirtColor" style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
            Shirt Color:
          </label>
          <input
            type="color"
            id="shirtColor"
            value={shirtColor}
            onChange={handleShirtColorChange}
            style={{ width: '100%', height: '40px', cursor: 'pointer' }}
          />
        </div>

        {/* Fabric Selector */}
        <div style={{ margin: '20px 0' }}>
          <label htmlFor="fabric" style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
            Select Fabric:
          </label>
          <select
            id="fabric"
            value={fabric}
            onChange={handleFabricChange}
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
          >
            <option value="">None</option>
            <option value="cotton">Cotton</option>
            <option value="silk">Silk</option>
            <option value="linen">Linen</option>
            <option value="wool">Wool</option>
          </select>
        </div>

        {/* Pattern Selector */}
        <div style={{ margin: '20px 0' }}>
          <label htmlFor="pattern" style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
            Select Pattern:
          </label>
          <select
            id="pattern"
            value={pattern}
            onChange={handlePatternChange}
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
          >
            <option value="">None</option>
            <option value="stripes">Stripes</option>
            <option value="polka">Polka Dots</option>
            <option value="grid">Grid</option>
          </select>
        </div>

        {/* Logo/Image Upload */}
        <div style={{ margin: '20px 0' }}>
          <label htmlFor="logo" style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
            Upload Logo/Image:
          </label>
          <input
            type="file"
            id="logo"
            accept="image/*"
            onChange={handleLogoUpload}
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
        </div>

        {/* Logo Resize Slider */}
        {logo && (
          <div style={{ margin: '20px 0' }}>
            <label htmlFor="logoSize" style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
              Logo Size:
            </label>
            <input
              type="range"
              id="logoSize"
              min="0.5"
              max="2"
              step="0.1"
              value={logoSize}
              onChange={handleLogoResize}
              style={{ width: '100%' }}
            />
            <span>{logoSize}x</span>
          </div>
        )}

        {/* Text Input */}
        <div style={{ margin: '20px 0' }}>
          <label htmlFor="text" style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
            Add Text:
          </label>
          <input
            type="text"
            id="text"
            value={text}
            onChange={handleTextChange}
            placeholder="Enter text"
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
        </div>

        {/* Text Color Picker */}
        <div style={{ margin: '20px 0' }}>
          <label htmlFor="textColor" style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
            Text Color:
          </label>
          <input
            type="color"
            id="textColor"
            value={textColor}
            onChange={handleTextColorChange}
            style={{ width: '100%', height: '40px', cursor: 'pointer' }}
          />
        </div>

        {/* Text Size Slider */}
        <div style={{ margin: '20px 0' }}>
          <label htmlFor="textSize" style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
            Text Size:
          </label>
          <input
            type="range"
            id="textSize"
            min="10"
            max="50"
            value={textSize}
            onChange={handleTextSizeChange}
            style={{ width: '100%' }}
          />
          <span>{textSize}px</span>
        </div>

        {/* Download Button */}
        <div style={{ margin: '20px 0' }}>
          <button
            onClick={handleDownload}
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px',
            }}
          >
            Download Design
          </button>
        </div>
      </div>

      {/* Right Side: Live Preview */}
      <div style={{ flex: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9f9f9' }}>
        <div
          ref={previewRef}
          style={{ width: '300px', height: '400px', position: 'relative', border: '1px solid #ccc' }}
        >
          {/* T-Shirt Image with Color Overlay */}
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: shirtColor,
              maskImage: `url('Images/shirt.png')`,
              maskSize: 'cover',
              maskPosition: 'center',
              position: 'absolute',
              top: 0,
              left: 0,
              zIndex: 1,
            }}
          />

          {/* Fabric Overlay */}
          {fabric && (
            <div
              style={{
                width: '100%',
                height: '100%',
                backgroundImage: `url('Images/fabrics/${fabric}.jpg')`,
                backgroundSize: 'cover',
                maskImage: `url('Images/shirt.png')`,
                maskSize: 'cover',
                maskPosition: 'center',
                mixBlendMode: 'multiply',
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex: 2,
              }}
            />
          )}

          {/* Pattern Overlay */}
          {pattern && (
            <div
              style={{
                width: '100%',
                height: '100%',
                backgroundImage: `url('Images/patterns/${pattern}.png')`,
                backgroundSize: 'cover',
                maskImage: `url('Images/shirt.png')`,
                maskSize: 'cover',
                maskPosition: 'center',
                mixBlendMode: 'overlay',
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex: 3,
              }}
            />
          )}

          {/* T-Shirt Image (for reference) */}
          <img
            src="Images/shirt.png"
            alt="T-Shirt"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              position: 'absolute',
              top: 0,
              left: 0,
              zIndex: 0,
            }}
          />

          {/* Draggable Text */}
          {text && (
            <Draggable position={textPosition} onDrag={handleDrag}>
              <div
                style={{
                  position: 'absolute',
                  color: textColor,
                  fontSize: `${textSize}px`,
                  fontFamily: 'Arial, sans-serif',
                  fontWeight: 'bold',
                  zIndex: 4,
                  cursor: 'move',
                }}
              >
                {text}
              </div>
            </Draggable>
          )}

          {/* Draggable Logo/Image */}
          {logo && (
            <Draggable>
              <img
                src={logo}
                alt="Logo"
                style={{
                  position: 'absolute',
                  width: `${100 * logoSize}px`, // Resize logo based on scale
                  height: 'auto',
                  zIndex: 5,
                  cursor: 'move',
                }}
              />
            </Draggable>
          )}
        </div>
      </div>
    </div>
  );
}

export default TShirtCustomizer;