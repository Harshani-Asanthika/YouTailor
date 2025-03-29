import React, { useState, useRef } from 'react';
import Draggable from 'react-draggable';
import html2canvas from 'html2canvas';

function TrouserCustomizer() {
  const [text, setText] = useState('');
  const [textColor, setTextColor] = useState('#000000');
  const [textSize, setTextSize] = useState(24);
  const [trouserColor, setTrouserColor] = useState('#ffffff');
  const [textPosition, setTextPosition] = useState({ x: 0, y: 0 });
  const [fabric, setFabric] = useState('');
  const [logo, setLogo] = useState(null);
  const [pattern, setPattern] = useState('');
  const [logoSize, setLogoSize] = useState(1);
  const previewRef = useRef(null);

  const handleTextChange = (event) => setText(event.target.value);
  const handleTextColorChange = (event) => setTextColor(event.target.value);
  const handleTextSizeChange = (event) => setTextSize(parseInt(event.target.value, 10));
  const handleTrouserColorChange = (event) => setTrouserColor(event.target.value);
  const handleFabricChange = (event) => setFabric(event.target.value);
  const handlePatternChange = (event) => setPattern(event.target.value);
  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setLogo(e.target.result);
      reader.readAsDataURL(file);
    }
  };
  const handleLogoResize = (event) => setLogoSize(parseFloat(event.target.value));
  const handleDrag = (e, data) => setTextPosition({ x: data.x, y: data.y });

  const handleDownload = () => {
    if (previewRef.current) {
      html2canvas(previewRef.current, {
        useCORS: true,
        scale: 1,
        logging: true,
        allowTaint: true,
        backgroundColor: null,
      })
        .then((canvas) => {
          const imageUrl = canvas.toDataURL('image/png');
          const link = document.createElement('a');
          link.href = imageUrl;
          link.download = 'trouser-design.png';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        })
        .catch((error) => {
          console.error('Error capturing the preview:', error);
        });
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', padding: '20px', fontFamily: "'Inter', sans-serif", backgroundColor: '#f8f9fa' }}>
      {/* Left Side: Editable Options */}
      <div style={{ flex: 1, padding: '20px', borderRight: '1px solid #e0e0e0', overflowY: 'auto', backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
        <h1 style={{ color: '#333', marginBottom: '24px', fontSize: '28px', fontWeight: '600' }}>Trouser Customizer</h1>

        {/* Grid Layout for Inputs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
          {/* Trouser Color Picker */}
          <div>
            <label htmlFor="trouserColor" style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#555' }}>
              Trouser Color:
            </label>
            <input
              type="color"
              id="trouserColor"
              value={trouserColor}
              onChange={handleTrouserColorChange}
              style={{ width: '100%', height: '40px', cursor: 'pointer', borderRadius: '8px', border: '1px solid #e0e0e0' }}
            />
          </div>

          {/* Fabric Selector */}
          <div>
            <label htmlFor="fabric" style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#555' }}>
              Select Fabric:
            </label>
            <select
              id="fabric"
              value={fabric}
              onChange={handleFabricChange}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e0e0e0', backgroundColor: '#fff', cursor: 'pointer' }}
            >
              <option value="">None</option>
              <option value="cotton">Cotton</option>
              <option value="silk">Silk</option>
              <option value="linen">Linen</option>
              <option value="wool">Wool</option>
            </select>
          </div>

          {/* Pattern Selector */}
          <div>
            <label htmlFor="pattern" style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#555' }}>
              Select Pattern:
            </label>
            <select
              id="pattern"
              value={pattern}
              onChange={handlePatternChange}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e0e0e0', backgroundColor: '#fff', cursor: 'pointer' }}
            >
              <option value="">None</option>
              <option value="stripes">Stripes</option>
              <option value="polka">Polka Dots</option>
              <option value="grid">Grid</option>
            </select>
          </div>

          {/* Logo/Image Upload */}
          <div>
            <label htmlFor="logo" style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#555' }}>
              Upload Logo/Image:
            </label>
            <input
              type="file"
              id="logo"
              accept="image/*"
              onChange={handleLogoUpload}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e0e0e0', backgroundColor: '#fff', cursor: 'pointer' }}
            />
          </div>

          {/* Logo Resize Slider */}
          {logo && (
            <div>
              <label htmlFor="logoSize" style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#555' }}>
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
                style={{ width: '100%', cursor: 'pointer' }}
              />
              <span style={{ display: 'block', textAlign: 'center', marginTop: '4px', color: '#777' }}>{logoSize}x</span>
            </div>
          )}

          {/* Text Input */}
          <div>
            <label htmlFor="text" style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#555' }}>
              Add Text:
            </label>
            <input
              type="text"
              id="text"
              value={text}
              onChange={handleTextChange}
              placeholder="Enter text"
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e0e0e0', backgroundColor: '#fff' }}
            />
          </div>

          {/* Text Color Picker */}
          <div>
            <label htmlFor="textColor" style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#555' }}>
              Text Color:
            </label>
            <input
              type="color"
              id="textColor"
              value={textColor}
              onChange={handleTextColorChange}
              style={{ width: '100%', height: '40px', cursor: 'pointer', borderRadius: '8px', border: '1px solid #e0e0e0' }}
            />
          </div>

          {/* Text Size Slider */}
          <div>
            <label htmlFor="textSize" style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#555' }}>
              Text Size:
            </label>
            <input
              type="range"
              id="textSize"
              min="10"
              max="50"
              value={textSize}
              onChange={handleTextSizeChange}
              style={{ width: '100%', cursor: 'pointer' }}
            />
            <span style={{ display: 'block', textAlign: 'center', marginTop: '4px', color: '#777' }}>{textSize}px</span>
          </div>
        </div>

        {/* Download Button */}
        <div style={{ marginTop: '24px' }}>
          <button
            onClick={handleDownload}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '500',
              transition: 'background-color 0.2s',
              ':hover': { backgroundColor: '#0056b3' },
            }}
          >
            Download Design
          </button>
        </div>
      </div>

      {/* Right Side: Live Preview */}
      <div style={{ flex: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f9fa' }}ref={previewRef}  >
        <div
         ref={previewRef}
          style={{ width: '300px', height: '400px', position: 'relative', border: '1px solid #e0e0e0', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
        >
          {/* Trouser Image with Color Overlay */}
          <div
          ref={previewRef}
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: trouserColor,
              maskImage: `url('Images/trouser.png')`,
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
                maskImage: `url('/Images/trouser.png')`,
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
                maskImage: `url('Images/trouser.png')`,
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

          {/* Trouser Image (for reference) */}
          <img
            src="Images/trouser.png"
            alt="Trouser"
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
                  fontFamily: "'Inter', sans-serif",
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
                  width: `${100 * logoSize}px`,
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

export default TrouserCustomizer;