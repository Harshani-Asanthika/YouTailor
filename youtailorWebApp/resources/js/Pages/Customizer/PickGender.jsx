import React, { useState } from 'react';

function PickGender() {
  // State to manage the selected gender ('male', 'female', 'unisex', or null)
  const [selectedGender, setSelectedGender] = useState(null);
  // State to manage the selected clothing category
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Define clothing categories based on gender
  const clothingCategories = {
    male: [
      { name: 'T-Shirt', image: 'https://cdn-icons-png.flaticon.com/128/4488/4488005.png', url: '/tshirt-customizer' },
      { name: 'Trouser', image: 'https://cdn-icons-png.flaticon.com/128/5571/5571282.png', url: '/pant-customizer-male' },
    ],
    female: [
      { name: 'Frock', image: 'https://cdn-icons-png.flaticon.com/128/11069/11069803.png', url: '/gown-customizer' },
      { name: 'T-Shirt', image: 'https://cdn-icons-png.flaticon.com/128/4488/4488005.png', url: '/tshirt-customizer' },
      { name: 'Trouser', image: 'https://cdn-icons-png.flaticon.com/128/9381/9381606.png', url: '/pant-customizer-female' },
    ],
    // Removed 'unisex' as it was commented out in the provided code
  };

  // Function to handle gender selection
  const handleGenderSelect = (gender) => {
    setSelectedGender(gender);
    setSelectedCategory(null); // Reset category when gender changes
  };

  // Function to handle category selection
  const handleCategorySelect = (categoryName, categoryUrl) => {
    setSelectedCategory(categoryName);
    // Redirect to the specific customizer URL
    window.location.href = categoryUrl;
  };

  return (
    <>
      {/* Tailwind CSS and Inter Font CDN */}
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <script src="https://cdn.tailwindcss.com"></script>

      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6 font-inter">
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-2xl">
          <h1 className="text-3xl font-semibold text-gray-800 mb-8 text-center">
            Choose Gender and Clothing Category
          </h1>

          {/* Gender Selection Section */}
          <div className="mb-10">
            <h2 className="text-xl font-medium text-gray-700 mb-4 text-center">Select Gender:</h2>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => handleGenderSelect('male')}
                className={`py-3 px-6 rounded-lg text-lg font-medium transition-all duration-200 
                  ${selectedGender === 'male' ? 'bg-orange-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-blue-100 hover:text-blue-700'}`}
              >
                <img src="https://cdn-icons-png.flaticon.com/128/16341/16341510.png" width="50" alt="Male Icon" className="inline-block mr-2 rounded-full" />
                Male
              </button>
              <button
                onClick={() => handleGenderSelect('female')}
                className={`py-3 px-6 rounded-lg text-lg font-medium transition-all duration-200 
                  ${selectedGender === 'female' ? 'bg-orange-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-pink-100 hover:text-pink-700'}`}
              >
                <img src="https://cdn-icons-png.flaticon.com/128/53/53176.png" width="50" alt="Female Icon" className="inline-block mr-2 rounded-full" />
                Female
              </button>
              {/* Unisex button commented out as per your provided code */}
              {/* <button
                onClick={() => handleGenderSelect('unisex')}
                className={`py-3 px-6 rounded-lg text-lg font-medium transition-all duration-200 
                  ${selectedGender === 'unisex' ? 'bg-purple-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-purple-100 hover:text-purple-700'}`}
              >
                <img src="https://placehold.co/50x50/800080/ffffff?text=⚤" alt="Unisex Icon" className="inline-block mr-2 rounded-full" />
                Unisex
              </button> */}
            </div>
          </div>

          {/* Clothing Category Selection Section (conditionally rendered) */}
          {selectedGender && (
            <div>
              <h2 className="text-xl font-medium text-gray-700 mb-4 text-center">Select Category for {selectedGender}:</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                {clothingCategories[selectedGender].map((category) => (
                  <button
                    key={category.name}
                    onClick={() => handleCategorySelect(category.name, category.url)}
                    className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all duration-200 
                      ${selectedCategory === category.name ? 'border-blue-600 bg-blue-50 shadow-md' : 'border-gray-200 bg-gray-50 hover:border-blue-300 hover:bg-blue-50'}`}
                  >
                    <img src={category.image} alt={category.name} className="w-10 h-10 mb-3 object-cover t" />
                    <span className="text-lg font-medium text-gray-800">{category.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Confirmation/Next Step (Optional) */}
          {selectedCategory && (
            <div className="mt-8 text-center">
              <p className="text-lg text-gray-700">
                You've selected: <span className="font-semibold">{selectedCategory}</span> for <span className="font-semibold">{selectedGender}</span>.
              </p>
              {/* The button now triggers redirection directly from handleCategorySelect */}
              {/* This button is now redundant as selection immediately redirects, but kept for visual continuity if desired */}
              {/* <button
                className="mt-4 py-3 px-8 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-colors duration-200"
                onClick={() => alert(`Proceeding to ${selectedCategory} Customizer for ${selectedGender}...`)}
              >
                Proceed to Customizer
              </button> */}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default PickGender;
