import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Link } from '@inertiajs/react';

function TrouserCustomizerFemale() {
  // State for overall trouser properties
  const [trouserColor, setTrouserColor] = useState('#ffffff'); // Base color of the Trouser
  const [fabric, setFabric] = useState(''); // Selected fabric texture
  const [pattern, setPattern] = useState(''); // Selected pattern
  const [trouserLayout, setTrouserLayout] = useState('trouser_layout_layout7'); // State for selected trouser layout

  // State for customizations (applies to the single selected trouser layout)
  const [customizations, setCustomizations] = useState({
    text: '',
    textColor: '#000000',
    textSize: 24,
    textPosition: { x: 0, y: 0 },
    logos: [], // Array of { id, src, x, y, size, rotation }
  });

  // State variables for fabric name, color code, and PATTERN NAME positions (global, as they apply to the whole trouser)
  const [fabricNamePosition, setFabricNamePosition] = useState({ x: 0, y: 50 });
  const [colorCodePosition, setColorCodePosition] = useState({ x: 0, y: 100 });
  const [patternNamePosition, setPatternNamePosition] = useState({ x: 0, y: 150 }); // New state for pattern name position

  // Ref to the trouser preview area for capturing with html2canvas and for drag boundaries
  const previewRef = useRef(null);

  // State for custom draggable logic
  const [isDragging, setIsDragging] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null); // { id, type, initialX, initialY, offsetX, offsetY }

  // States for download feedback and html2canvas readiness
  const [isLoadingDownload, setIsLoadingDownload] = useState(false);
  const [downloadError, setDownloadError] = useState('');
  const [isHtml2CanvasReady, setIsHtml2CanvasReady] = useState(false); // New state for html2canvas readiness

  // New state for tracking selected logo for resize/rotate/delete
  const [selectedLogoId, setSelectedLogoId] = useState(null);

  // Helper to get the currently selected logo object
  const selectedLogo = customizations.logos.find(logo => logo.id === selectedLogoId);

  // Handlers for updating state based on user input
  const handleTextChange = (event) => setCustomizations(prev => ({ ...prev, text: event.target.value }));
  const handleTextColorChange = (event) => setCustomizations(prev => ({ ...prev, textColor: event.target.value }));
  const handleTextSizeChange = (event) => setCustomizations(prev => ({ ...prev, textSize: parseInt(event.target.value, 10) }));

  const handleTrouserColorChange = (event) => setTrouserColor(event.target.value);
  const handleFabricChange = (event) => setFabric(event.target.value);
  const handlePatternChange = (event) => setPattern(event.target.value);
  const handleTrouserLayoutChange = (event) => setTrouserLayout(event.target.value);

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
          size: 1, // Default size
          rotation: 0, // Default rotation
        };
        setCustomizations(prev => ({
          ...prev,
          logos: [...prev.logos, newLogo]
        }));
        setSelectedLogoId(newLogo.id); // Select the newly uploaded logo
      };
      reader.readAsDataURL(file);
    }
  };

  // Handler for selecting a logo
  const handleLogoSelect = useCallback((id) => {
    setSelectedLogoId(id);
  }, []);

  // Handler for resizing a logo
  const handleLogoSizeChange = useCallback((event) => {
    const newSize = parseFloat(event.target.value);
    setCustomizations(prev => ({
      ...prev,
      logos: prev.logos.map(logo =>
        logo.id === selectedLogoId ? { ...logo, size: newSize } : logo
      )
    }));
  }, [selectedLogoId]);

  // Handler for rotating a logo
  const handleLogoRotateChange = useCallback((event) => {
    const newRotation = parseInt(event.target.value, 10);
    setCustomizations(prev => ({
      ...prev,
      logos: prev.logos.map(logo =>
        logo.id === selectedLogoId ? { ...logo, rotation: newRotation } : logo
      )
    }));
  }, [selectedLogoId]);

  // Handler for deleting a logo
  const handleDeleteLogo = useCallback(() => {
    setCustomizations(prev => ({
      ...prev,
      logos: prev.logos.filter(logo => logo.id !== selectedLogoId)
    }));
    setSelectedLogoId(null); // Deselect after deleting
  }, [selectedLogoId]);


  // Unified handler for initiating drag
  const handleMouseDown = useCallback((e, id, type, currentX, currentY) => {
    e.preventDefault(); // Prevent default browser drag behavior
    if (!previewRef.current) return;

    // Deselect logo if clicking on another element or empty space
    if (type !== 'logo' || id !== selectedLogoId) {
      setSelectedLogoId(null);
    }

    const previewRect = previewRef.current.getBoundingClientRect();
    const elementRect = e.currentTarget.getBoundingClientRect();

    // Calculate offset relative to the draggable element's top-left corner
    const offsetX = e.clientX - elementRect.left;
    const offsetY = e.clientY - elementRect.top;

    setDraggedItem({ id, type, initialX: currentX, initialY: currentY, offsetX, offsetY });
    setIsDragging(true);
  }, [selectedLogoId]);

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
      setCustomizations(prev => ({ ...prev, textPosition: { x: newX, y: newY } }));
    } else if (type === 'logo') {
      setCustomizations(prev => ({
        ...prev,
        logos: prev.logos.map(logo =>
          logo.id === id ? { ...logo, x: newX, y: newY } : logo
        )
      }));
    } else if (type === 'fabricName') {
      setFabricNamePosition({ x: newX, y: newY });
    } else if (type === 'colorCode') {
      setColorCodePosition({ x: newX, y: newY });
    } else if (type === 'patternName') { // Handle pattern name drag
      setPatternNamePosition({ x: newX, y: newY });
    }
  }, [isDragging, draggedItem, setCustomizations]);

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


  // Handler for downloading the Trouser design as an image
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
      link.download = `trouser-design-${trouserLayout}.png`; // Dynamic filename based on trouserLayout
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
          <div className="flex-1 p-5 md:border-r md:border-gray-200 overflow-y-auto bg-white rounded-xl shadow-lg mb-5 md:mr-5 md:mb-0 max-h-full">
                      <div className="flex justify-between items-center mb-6"> {/* Added flex container */}
              <h1 className="text-gray-800 text-3xl font-semibold">Trouser Customizer</h1>
              <Link
                href="/client-panel/signin"
                className="py-2 px-6 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-colors duration-200 no-underline"
              >
                Sign In
              </Link>
            </div>

            {/* Trouser Layout Selection */}
            <div className="mb-5">
              <label htmlFor="trouserLayout" className="block mb-2 font-medium text-gray-600">
                Select Trouser Layout:
              </label>
              <select
                id="trouserLayout"
                value={trouserLayout}
                onChange={handleTrouserLayoutChange}
                className="w-full p-2.5 rounded-lg border border-gray-300 bg-white cursor-pointer focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="trouser_layout_layout13">Skinny Jeans</option>
                <option value="trouser_layout_layout7">cargo pants</option>
                <option value="trouser_layout_layout8">Straight Jeans</option>
                <option value="trouser_layout_layout9">Distress Jeans</option>
                <option value="trouser_layout_layout10">Mom Jeans</option>
                <option value="trouser_layout_layout11">Flared Jeans</option>
                <option value="trouser_layout_layout12">Leggin Jeans</option>
                <option value="trouser_layout_layout15">Short Jeans 01 </option>
                <option value="trouser_layout_layout16">Short Jeans 02 </option>
              
              </select>
            </div>

            {/* Grid Layout for Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Trouser Color Picker */}
              <div>
                <label htmlFor="trouserColor" className="block mb-2 font-medium text-gray-600">
                  Trouser Color:
                </label>
                <input
                  type="color"
                  id="trouserColor"
                  value={trouserColor}
                  onChange={handleTrouserColorChange}
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
                  <option value="denim">Denim</option>
                  <option value="linen">Linen</option>
                  <option value="poplin">Poplin</option>
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
                    value={customizations.text}
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
                    value={customizations.textColor}
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
                    value={customizations.textSize}
                    onChange={handleTextSizeChange}
                    className="w-full cursor-pointer"
                  />
                  <span className="block text-center mt-1 text-gray-600">{customizations.textSize}px</span>
                </div>
              </div>

              {/* Logo Controls (Resize, Rotate, Delete) - Visible only when a logo is selected */}
              {selectedLogo && (
                <div className="col-span-full border-t border-gray-200 pt-5 mt-5">
                  <h2 className="text-gray-800 mb-4 text-xl font-semibold text-center">Selected Logo Controls</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Logo Size Slider */}
                    <div>
                      <label htmlFor="logoSize" className="block mb-2 font-medium text-gray-600">
                        Logo Size:
                      </label>
                      <input
                        type="range"
                        id="logoSize"
                        min="0.5"
                        max="2"
                        step="0.1"
                        value={selectedLogo.size}
                        onChange={handleLogoSizeChange}
                        className="w-full cursor-pointer"
                      />
                      <span className="block text-center mt-1 text-gray-600">Scale: {selectedLogo.size.toFixed(1)}x</span>
                    </div>

                    {/* Logo Rotation Slider */}
                    <div>
                      <label htmlFor="logoRotate" className="block mb-2 font-medium text-gray-600">
                        Logo Rotation:
                      </label>
                      <input
                        type="range"
                        id="logoRotate"
                        min="0"
                        max="360"
                        step="1"
                        value={selectedLogo.rotation}
                        onChange={handleLogoRotateChange}
                        className="w-full cursor-pointer"
                      />
                      <span className="block text-center mt-1 text-gray-600">{selectedLogo.rotation}°</span>
                    </div>
                  </div>
                  {/* Delete Logo Button */}
                  <button
                    onClick={handleDeleteLogo}
                    className="w-full mt-5 py-2.5 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition-colors duration-200"
                  >
                    Delete Selected Logo
                  </button>
                </div>
              )}

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

          {/* Right Side: Live Preview (This is where the Trouser design is rendered) */}
          <div className="flex-2 flex justify-center items-center bg-gray-100 ">
            {/* This is the main container for the Trouser design, where html2canvas will capture */}
            <div
              ref={previewRef}
              className="w-[550px] h-[600px] relative border border-gray-300 rounded-xl overflow-hidden shadow-2xl bg-white flex-shrink-0 max-w-full max-h-full"
              // Add a click handler to deselect logo when clicking on the preview area itself
              onClick={() => setSelectedLogoId(null)}
            >
              {/* Single div for Trouser with combined background for color and trouser image */}
              <div
                style={{
                  backgroundColor: trouserColor,
                  backgroundImage: `url('/Images/female-trouser/${trouserLayout}.png')`, // Dynamically load trouser image based on trouserLayout
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  backgroundBlendMode: 'multiply', // To let the color show through the white trouser
                }}
                className="absolute inset-0 z-0 w-full h-full"
              />

              {/* Pattern Overlay (blends with the colored trouser) */}
              {pattern && (
                <div
                  style={{
                    backgroundImage: `url('/Images/patterns/${pattern}.png')`, // Corrected path with leading slash
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    mixBlendMode: 'overlay', // Blend pattern with the trouser
                  }}
                  className="absolute inset-0 z-10 w-full h-full"
                />
              )}

              {/* Draggable Text */}
              {customizations.text && (
                <div
                  id={`draggable-text-text`} // Unique ID for the draggable element
                  onMouseDown={(e) => handleMouseDown(e, null, 'text', customizations.textPosition.x, customizations.textPosition.y)}
                  style={{
                    left: customizations.textPosition.x,
                    top: customizations.textPosition.y,
                    color: customizations.textColor,
                    fontSize: `${customizations.textSize}px`,
                  }}
                  className="absolute font-inter font-bold z-40 cursor-grab whitespace-nowrap p-1.5 select-none"
                >
                  {customizations.text}
                </div>
              )}

              {/* Draggable Logos */}
              {customizations.logos.map(logo => (
                <div
                  key={logo.id}
                  id={`draggable-logo-${logo.id}`} // Unique ID for the draggable element
                  onMouseDown={(e) => handleMouseDown(e, logo.id, 'logo', logo.x, logo.y)}
                  onClick={(e) => { // Prevent click from propagating to parent and deselecting
                    e.stopPropagation();
                    handleLogoSelect(logo.id);
                  }}
                  style={{
                    position: 'absolute', // Important for positioning
                    left: logo.x,
                    top: logo.y,
                    transform: `rotate(${logo.rotation}deg)`, // Apply rotation
                    border: selectedLogoId === logo.id ? '2px dashed #007bff' : 'none', // Highlight selected logo
                    cursor: 'grab',
                    userSelect: 'none',
                    display: 'inline-block', // To make the div wrap content
                    transformOrigin: 'center', // Set transform origin for rotation
                  }}
                >
                  <img
                    src={logo.src}
                    alt="Custom Logo"
                    style={{
                      width: `${100 * logo.size}px`, // Apply individual logo size
                      height: 'auto',
                      display: 'block', // Remove extra space below image
                    }}
                  />
                  {/* Close Icon for selected logo */}
                  {selectedLogoId === logo.id && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent drag from starting or logo deselection
                        handleDeleteLogo();
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold cursor-pointer hover:bg-red-700 transition-colors duration-200 z-50"
                      title="Delete Logo"
                    >
                      X
                    </button>
                  )}
                </div>
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
                Color: {trouserColor === '#ffffff' ? 'Default Color' : trouserColor.toUpperCase()}
              </div>

              {/* Draggable Pattern Name (NEW) */}
              {pattern && (
                <div
                  id={`draggable-patternName-patternName`} // Unique ID for the draggable element
                  onMouseDown={(e) => handleMouseDown(e, null, 'patternName', patternNamePosition.x, patternNamePosition.y)}
                  style={{
                    left: patternNamePosition.x,
                    top: patternNamePosition.y,
                  }}
                  className="absolute text-gray-700 text-sm font-medium z-60 cursor-grab whitespace-nowrap px-2 py-1 bg-white bg-opacity-70 rounded-md select-none"
                >
                  Pattern: {pattern.charAt(0).toUpperCase() + pattern.slice(1)}
                </div>
              )}
            </div> {/* End of previewRef div */}
          </div> {/* End of Right Side: Live Preview */}
        </div>
      </div>
    </>
  );
}

export default TrouserCustomizerFemale;