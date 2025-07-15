import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from '@inertiajs/react';

function TShirtCustomizer() {
  // State for overall shirt properties
  const [shirtColor, setShirtColor] = useState('#ffffff'); // Base color of the T-shirt
  const [fabric, setFabric] = useState(''); // Selected fabric texture
  const [pattern, setPattern] = useState(''); // Selected pattern

  // State to manage current side ('front' or 'back')
  const [currentSide, setCurrentSide] = useState('front');

  // State for customizations specific to each side
  const [frontCustomizations, setFrontCustomizations] = useState({
    text: '',
    textColor: '#000000',
    textSize: 24,
    textPosition: { x: 0, y: 0 },
    logos: [], // Array of { id, src, x, y, size }
  });

  const [backCustomizations, setBackCustomizations] = useState({
    text: '',
    textColor: '#000000',
    textSize: 24,
    textPosition: { x: 0, y: 0 },
    logos: [], // Array of { id, src, x, y, size }
  });

  // State variables for fabric name and color code positions (global, as they apply to the whole shirt)
  const [fabricNamePosition, setFabricNamePosition] = useState({ x: 0, y: 50 });
  const [colorCodePosition, setColorCodePosition] = useState({ x: 0, y: 100 });
  // State variable for pattern label position (global, as it applies to the whole shirt)
  const [patternLabelPosition, setPatternLabelPosition] = useState({ x: 0, y: 150 });

  // Ref to the T-shirt preview area for capturing with html2canvas and for drag boundaries
  const previewRef = useRef(null);

  // State for custom draggable logic
  const [isDragging, setIsDragging] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null); // { id, type, initialX, initialY, offsetX, offsetY }

  // States for download feedback and html2canvas readiness
  const [isLoadingDownload, setIsLoadingDownload] = useState(false);
  const [downloadError, setDownloadError] = useState('');
  const [isHtml2CanvasReady, setIsHtml2CanvasReady] = useState(false); // New state for html2canvas readiness

  // Helper to get current side's customizations
  const currentCustomizations = currentSide === 'front' ? frontCustomizations : backCustomizations;
  const setCurrentCustomizations = currentSide === 'front' ? setFrontCustomizations : setBackCustomizations;

  // Handlers for updating state based on user input
  const handleTextChange = (event) => setCurrentCustomizations(prev => ({ ...prev, text: event.target.value }));
  const handleTextColorChange = (event) => setCurrentCustomizations(prev => ({ ...prev, textColor: event.target.value }));
  const handleTextSizeChange = (event) => setCurrentCustomizations(prev => ({ ...prev, textSize: parseInt(event.target.value, 10) }));

  const handleShirtColorChange = (event) => setShirtColor(event.target.value);
  const handleFabricChange = (event) => setFabric(event.target.value);
  const handlePatternChange = (event) => setPattern(event.target.value);

  // Handler for logo file upload (now adds multiple logos)
  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newLogo = {
          id: Date.now(), // Unique ID for each logo
          src: e.target.result,
          x: 0, // Initial position
          y: 0,
          size: 1, // Default size for now
        };
        setCurrentCustomizations(prev => ({
          ...prev,
          logos: [...prev.logos, newLogo]
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Unified handler for initiating drag
  const handleMouseDown = useCallback((e, id, type, currentX, currentY) => {
    e.preventDefault(); // Prevent default browser drag behavior
    if (!previewRef.current) return;

    const previewRect = previewRef.current.getBoundingClientRect();
    const elementRect = e.currentTarget.getBoundingClientRect();

    // Calculate offset relative to the draggable element's top-left corner
    const offsetX = e.clientX - elementRect.left;
    const offsetY = e.clientY - elementRect.top;

    setDraggedItem({ id, type, initialX: currentX, initialY: currentY, offsetX, offsetY });
    setIsDragging(true);
  }, []);

  // Handle mouse move for dragging
  const handleMouseMove = useCallback((e) => {
    if (!isDragging || !draggedItem || !previewRef.current) return;

    const previewRect = previewRef.current.getBoundingClientRect();
    const { id, type, offsetX, offsetY } = draggedItem;

    // Calculate new position relative to the preview container
    let newX = e.clientX - previewRect.left - offsetX;
    let newY = e.clientY - previewRect.top - offsetY;

    // Get the dimensions of the dragged element to apply bounds correctly
    const draggedElement = document.getElementById(`draggable-${type}-${id || 'text'}`);
    const elementWidth = draggedElement ? draggedElement.offsetWidth : 0;
    const elementHeight = draggedElement ? draggedElement.offsetHeight : 0;

    // Apply bounds checking
    newX = Math.max(0, Math.min(newX, previewRect.width - elementWidth));
    newY = Math.max(0, Math.min(newY, previewRect.height - elementHeight));

    if (type === 'text') {
      setCurrentCustomizations(prev => ({ ...prev, textPosition: { x: newX, y: newY } }));
    } else if (type === 'logo') {
      setCurrentCustomizations(prev => ({
        ...prev,
        logos: prev.logos.map(logo =>
          logo.id === id ? { ...logo, x: newX, y: newY } : logo
        )
      }));
    } else if (type === 'fabricName') {
      setFabricNamePosition({ x: newX, y: newY });
    } else if (type === 'colorCode') {
      setColorCodePosition({ x: newX, y: newY });
    } else if (type === 'patternLabel') { // Handle dragging for pattern label
      setPatternLabelPosition({ x: newX, y: newY });
    }
  }, [isDragging, draggedItem, setCurrentCustomizations]);

  // Handle mouse up to end dragging
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setDraggedItem(null);
  }, []);

  // Add and remove global mouse event listeners
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Effect to dynamically load html2canvas script
  useEffect(() => {
    // Check if html2canvas is already available
    if (typeof window.html2canvas !== 'undefined') {
      setIsHtml2CanvasReady(true);
      return;
    }

    const script = document.createElement('script');
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
    script.async = true; // Load asynchronously
    script.onload = () => {
      setIsHtml2CanvasReady(true);
      console.log('html2canvas script loaded successfully.');
    };
    script.onerror = (error) => {
      console.error('Failed to load html2canvas script:', error);
      setDownloadError('Failed to load image capture library. Please try again.');
    };

    document.body.appendChild(script);

    // Cleanup function to remove the script when the component unmounts
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []); // Empty dependency array means this runs once on mount


  // Handler for downloading the T-shirt design as an image
  const handleDownload = async () => {
    setIsLoadingDownload(true);
    setDownloadError('');

    if (!previewRef.current) {
      setDownloadError('Preview area not available for capture.');
      setIsLoadingDownload(false);
      return;
    }

    if (!isHtml2CanvasReady) {
      setDownloadError('Image capture library is still loading. Please wait a moment.');
      setIsLoadingDownload(false);
      return;
    }

    try {
      const canvas = await window.html2canvas(previewRef.current, {
        useCORS: true,
        scale: 1,
        logging: true,
        allowTaint: true,
        backgroundColor: null,
      });
      const imageUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = `tshirt-design-${currentSide}.png`; // Dynamic filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error capturing the preview:', error);
      setDownloadError('Failed to download image. Please try again.');
    } finally {
      setIsLoadingDownload(false);
    }
  };

  return (
    <>
      {/* Tailwind CSS and Inter Font CDN */}
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <script src="https://cdn.tailwindcss.com"></script>
      {/* html2canvas script is now loaded dynamically in useEffect */}

      <div className="flex flex-col h-screen p-5 font-inter bg-gray-100 overflow-auto">
        {/* Responsive Layout: Controls on top, Preview below on small screens */}
        <div className="flex flex-col md:flex-row flex-1">
          {/* Left Side: Editable Options (Control Panel) */}
          <div className="flex-1 p-3 md:border-r md:border-gray-200 overflow-y-auto bg-white rounded-xl shadow-lg mb-5 md:mr-5 md:mb-0">
                         <div className="flex justify-between items-center mb-6"> {/* Added flex container */}
                           <h1 className="text-gray-800 text-3xl font-semibold">T Shirt Customizer</h1>
                           <Link
                             href="/client-panel/signin"
                             className="py-2 px-6 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-colors duration-200 no-underline"
                           >
                             Sign In
                           </Link>
                         </div>
            {/* Side Selection Buttons */}
            <div className="flex justify-center mb-5 gap-3">
              <button
                onClick={() => setCurrentSide('front')}
                className={`px-5 py-2.5 rounded-lg text-lg font-medium transition-colors duration-200 
                  ${currentSide === 'front' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                Front Side
              </button>
              <button
                onClick={() => setCurrentSide('back')}
                className={`px-5 py-2.5 rounded-lg text-lg font-medium transition-colors duration-200 
                  ${currentSide === 'back' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                Back Side
              </button>
            </div>

            {/* Grid Layout for Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Shirt Color Picker */}
              <div>
                <label htmlFor="shirtColor" className="block mb-2 font-medium text-gray-600">
                  Shirt Color:
                </label>
                <input
                  type="color"
                  id="shirtColor"
                  value={shirtColor}
                  onChange={handleShirtColorChange}
                  className="w-full h-10 cursor-pointer rounded-lg border border-gray-300"
                />
              </div>

              {/* Fabric Selector */}
              <div>
                <label htmlFor="fabric" className="block mb-2 font-medium text-gray-600">
                  Select Fabric:
                </label>
                <select
                  id="fabric"
                  value={fabric}
                  onChange={handleFabricChange}
                  className="w-full p-2.5 rounded-lg border border-gray-300 bg-white cursor-pointer focus:ring-blue-500 focus:border-blue-500"
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
                <label htmlFor="pattern" className="block mb-2 font-medium text-gray-600">
                  Select Pattern:
                </label>
                <select
                  id="pattern"
                  value={pattern}
                  onChange={handlePatternChange}
                  className="w-full p-2.5 rounded-lg border border-gray-300 bg-white cursor-pointer focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">None</option>
                  <option value="stripes">Stripes</option>
                  <option value="polka">Polka Dots</option>
                  <option value="grid">Grid</option>
                </select>
              </div>

              {/* Logo/Image Upload */}
              <div>
                <label htmlFor="logo" className="block mb-2 font-medium text-gray-600">
                  Upload Logo/Image:
                </label>
                <input
                  type="file"
                  id="logo"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="w-full p-2.5 rounded-lg border border-gray-300 bg-white cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>

              {/* Text Input, Color, Size in a nested grid for better layout */}
              <div className="col-span-full grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div>
                  <label htmlFor="text" className="block mb-2 font-medium text-gray-600">
                    Add Text:
                  </label>
                  <input
                    type="text"
                    id="text"
                    value={currentCustomizations.text}
                    onChange={handleTextChange}
                    placeholder="Enter text"
                    className="w-full p-2.5 rounded-lg border border-gray-300 bg-white focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="textColor" className="block mb-2 font-medium text-gray-600">
                    Text Color:
                  </label>
                  <input
                    type="color"
                    id="textColor"
                    value={currentCustomizations.textColor}
                    onChange={handleTextColorChange}
                    className="w-full h-10 cursor-pointer rounded-lg border border-gray-300"
                  />
                </div>
                <div>
                  <label htmlFor="textSize" className="block mb-2 font-medium text-gray-600">
                    Text Size:
                  </label>
                  <input
                    type="range"
                    id="textSize"
                    min="10"
                    max="50"
                    value={currentCustomizations.textSize}
                    onChange={handleTextSizeChange}
                    className="w-full cursor-pointer"
                  />
                  <span className="block text-center mt-1 text-gray-600">{currentCustomizations.textSize}px</span>
                </div>
              </div>

              {/* Download Button and Feedback */}
              <div className="col-span-full mt-6">
                <button
                  onClick={handleDownload}
                  disabled={isLoadingDownload || !isHtml2CanvasReady} // Disable if loading or html2canvas not ready
                  className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoadingDownload ? 'Downloading...' : 'Download Design'}
                </button>
                {downloadError && (
                  <p className="text-red-600 text-sm mt-2 text-center">{downloadError}</p>
                )}
              </div>
            </div> {/* End of Grid Layout for Inputs */}
          </div> {/* End of Left Side: Editable Options (Control Panel) */}

          {/* Right Side: Live Preview (This is where the T-shirt design is rendered) */}
          <div className="flex-2 flex justify-center items-center bg-gray-100 p-5">
            {/* This is the main container for the T-shirt design, where html2canvas will capture */}
            <div
              ref={previewRef}
              className="w-[300px] h-[400px] relative border border-gray-300 rounded-xl overflow-hidden shadow-2xl bg-white flex-shrink-0 max-w-full max-h-full"
            >
              {/* Single div for T-shirt with combined background for color and shirt image */}
              <div
                style={{
                  backgroundColor: shirtColor,
                  backgroundImage: `url('Images/${currentSide}_shirt.png')`, // Dynamically load front or back shirt image
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  backgroundBlendMode: 'multiply', // To let the color show through the white shirt
                }}
                className="absolute inset-0 z-0 w-full h-full"
              />

              {/* Pattern Overlay (blends with the colored shirt) */}
              {pattern && (
                <div
                  style={{
                    backgroundImage: `url('Images/patterns/${pattern}.png')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    mixBlendMode: 'overlay', // Blend pattern with the shirt
                  }}
                  className="absolute inset-0 z-10 w-full h-full"
                />
              )}

              {/* Draggable Text */}
              {currentCustomizations.text && (
                <div
                  id={`draggable-text-text`} // Unique ID for the draggable element
                  onMouseDown={(e) => handleMouseDown(e, null, 'text', currentCustomizations.textPosition.x, currentCustomizations.textPosition.y)}
                  style={{
                    left: currentCustomizations.textPosition.x,
                    top: currentCustomizations.textPosition.y,
                    color: currentCustomizations.textColor,
                    fontSize: `${currentCustomizations.textSize}px`,
                  }}
                  className="absolute font-inter font-bold z-40 cursor-grab whitespace-nowrap p-1.5 select-none"
                >
                  {currentCustomizations.text}
                </div>
              )}

              {/* Draggable Logos */}
              {currentCustomizations.logos.map(logo => (
                <img
                  key={logo.id}
                  id={`draggable-logo-${logo.id}`} // Unique ID for the draggable element
                  src={logo.src}
                  alt="Custom Logo"
                  onMouseDown={(e) => handleMouseDown(e, logo.id, 'logo', logo.x, logo.y)}
                  style={{
                    left: logo.x,
                    top: logo.y,
                    width: `${100 * logo.size}px`, // Apply individual logo size
                  }}
                  className="absolute h-auto z-50 cursor-grab select-none"
                />
              ))}

              {/* Draggable Fabric Name */}
              {fabric && (
                <div
                  id={`draggable-fabricName-fabricName`} // Unique ID for the draggable element
                  onMouseDown={(e) => handleMouseDown(e, null, 'fabricName', fabricNamePosition.x, fabricNamePosition.y)}
                  style={{
                    left: fabricNamePosition.x,
                    top: fabricNamePosition.y,
                  }}
                  className="absolute text-gray-700 text-sm font-medium z-60 cursor-grab whitespace-nowrap px-2 py-1 bg-white bg-opacity-70 rounded-md select-none"
                >
                  Fabric: {fabric.charAt(0).toUpperCase() + fabric.slice(1)}
                </div>
              )}

              {/* Draggable Pattern Label */}
              {pattern && (
                <div
                  id={`draggable-patternLabel-patternLabel`} // Unique ID for the draggable element
                  onMouseDown={(e) => handleMouseDown(e, null, 'patternLabel', patternLabelPosition.x, patternLabelPosition.y)}
                  style={{
                    left: patternLabelPosition.x,
                    top: patternLabelPosition.y,
                  }}
                  className="absolute text-gray-700 text-sm font-medium z-60 cursor-grab whitespace-nowrap px-2 py-1 bg-white bg-opacity-70 rounded-md select-none"
                >
                  Pattern: {pattern.charAt(0).toUpperCase() + pattern.slice(1)}
                </div>
              )}

              {/* Draggable Color Code */}
              <div
                id={`draggable-colorCode-colorCode`} // Unique ID for the draggable element
                onMouseDown={(e) => handleMouseDown(e, null, 'colorCode', colorCodePosition.x, colorCodePosition.y)}
                style={{
                  left: colorCodePosition.x,
                  top: colorCodePosition.y,
                }}
                className="absolute text-gray-700 text-sm font-medium z-60 cursor-grab whitespace-nowrap px-2 py-1 bg-white bg-opacity-70 rounded-md select-none"
              >
                Color: {shirtColor.toUpperCase()}
              </div>
            </div> {/* End of previewRef div */}
          </div> {/* End of Right Side: Live Preview */}
        </div>
      </div>
    </>
  );
}

export default TShirtCustomizer;