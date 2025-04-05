// import { useState } from "react";

// const FindHospitals = () => {
//   const [location, setLocation] = useState(null);
//   const [hospitals, setHospitals] = useState([]);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [selectedHospital, setSelectedHospital] = useState(null);

//   const getUserLocation = () => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           setLocation({
//             lat: position.coords.latitude,
//             lon: position.coords.longitude,
//           });
//           setError(null);
//         },
//         () => {
//           setError("Unable to fetch location. Please allow location access.");
//         }
//       );
//     } else {
//       setError("Geolocation is not supported by this browser.");
//     }
//   };

//   const fetchHospitals = async () => {
//     if (!location) {
//       setError("Location not available. Click the button to get location.");
//       return;
//     }

//     setLoading(true);
//     const url = `https://nominatim.openstreetmap.org/search?format=json&q=hospital&bounded=1&viewbox=${location.lon-0.1},${location.lat+0.1},${location.lon+0.1},${location.lat-0.1}`;

//     try {
//       const response = await fetch(url);
//       const data = await response.json();

//       // Add image URLs (Dummy images from Unsplash for now)
//       const hospitalsWithImages = data.map((hospital, index) => ({
//         ...hospital,
//         image: `https://source.unsplash.com/400x300/?hospital&sig=${index}`,
//       }));

//       setHospitals(hospitalsWithImages);
//       setLoading(false);
//     } catch {
//       setError("Error fetching hospitals.");
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
//       <div className="bg-white shadow-lg rounded-lg p-6 max-w-lg w-full text-center">
//         <h2 className="text-2xl font-bold text-gray-800 mb-4">Find Hospitals Near You</h2>

//         <div className="flex flex-col md:flex-row justify-center gap-4">
//           <button
//             onClick={getUserLocation}
//             className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300"
//           >
//             Get My Location
//           </button>

//           {location && (
//             <button
//               onClick={fetchHospitals}
//               className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300"
//             >
//               Search Hospitals
//             </button>
//           )}
//         </div>

//         {error && <p className="text-red-500 mt-4">{error}</p>}

//         {loading && (
//           <div className="mt-4">
//             <div className="animate-spin h-6 w-6 border-t-4 border-blue-500 rounded-full mx-auto"></div>
//             <p className="text-gray-600 mt-2">Fetching hospitals...</p>
//           </div>
//         )}

//         {hospitals.length > 0 && (
//           <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
//             {hospitals.map((hospital, index) => (
//               <div
//                 key={index}
//                 onClick={() => setSelectedHospital(hospital)}
//                 className="cursor-pointer bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300"
//               >
//                 <img src={hospital.image} alt="Hospital" className="w-full h-40 object-cover rounded-md" />
//                 <h4 className="text-lg font-semibold mt-2">{hospital.display_name}</h4>
//                 <p className="text-gray-500 text-sm">📍 {hospital.lat}, {hospital.lon}</p>
//               </div>
//             ))}
//           </div>
//         )}

//         {selectedHospital && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-6">
//             <div className="bg-white rounded-lg p-6 max-w-md w-full">
//               <button
//                 className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
//                 onClick={() => setSelectedHospital(null)}
//               >
//                 ✖
//               </button>
//               <img src={selectedHospital.image} alt="Hospital" className="w-full h-40 object-cover rounded-md" />
//               <h3 className="text-xl font-semibold mt-4">{selectedHospital.display_name}</h3>
//               <p className="text-gray-600 mt-2">📍 Latitude: {selectedHospital.lat}, Longitude: {selectedHospital.lon}</p>
//               <p className="text-gray-500 mt-2">For more details, please search in OpenStreetMap.</p>
//             </div>
//           </div>
//         )}

//         {hospitals.length === 0 && !loading && (
//           <p className="text-gray-600 mt-4">No hospitals found nearby.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default FindHospitals;
import React, { useState, useEffect } from 'react';
import { MapPin, Hospital, X, Navigation } from 'lucide-react';

const FindHospitals = () => {
  const [location, setLocation] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [searchRadius, setSearchRadius] = useState(5); // in kilometers

  // Improved error handling for geolocation
  const getUserLocation = () => {
    setLoading(true);
    setError(null);
    
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
        setLoading(false);
      },
      (err) => {
        setError(err.message || "Unable to fetch location. Please allow location access.");
        setLoading(false);
      }
    );
  };

  // Enhanced hospital fetching with more robust error handling
  const fetchHospitals = async () => {
    if (!location) {
      setError("Location not available. Click the button to get location.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Use Overpass API for more reliable hospital search
      const overpassUrl = `https://overpass-api.de/api/interpreter?data=[out:json];
        (
          node["amenity"="hospital"](around:${searchRadius * 1000},${location.lat},${location.lon});
          way["amenity"="hospital"](around:${searchRadius * 1000},${location.lat},${location.lon});
          relation["amenity"="hospital"](around:${searchRadius * 1000},${location.lat},${location.lon});
        );
        out center;`;

      const response = await fetch(overpassUrl);
      const data = await response.json();

      // Generate more unique and consistent hospital images
      const hospitalsWithDetails = data.elements.map((hospital, index) => ({
        ...hospital,
        display_name: hospital.tags?.name || `Hospital ${index + 1}`,
        image: `https://picsum.photos/seed/hospital${index}/400/300`,
        distance: calculateDistance(location.lat, location.lon, hospital.lat, hospital.lon)
      }));

      // Sort hospitals by distance
      const sortedHospitals = hospitalsWithDetails.sort((a, b) => a.distance - b.distance);

      setHospitals(sortedHospitals);
      setLoading(false);
    } catch (err) {
      setError("Error fetching hospitals. Please try again.");
      setLoading(false);
    }
  };

  // Haversine formula to calculate distance between two coordinates
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      <div className="bg-white shadow-2xl rounded-2xl p-8 max-w-xl w-full">
        <h2 className="text-3xl font-bold text-blue-800 mb-6 flex items-center justify-center gap-3">
          <Hospital className="text-blue-600" />
          Hospital Finder
        </h2>

        {/* Location and Search Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <button 
            onClick={getUserLocation}
            className="flex-1 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg shadow-md transition duration-300 group"
            disabled={loading}
          >
            <Navigation className="mr-2 group-disabled:animate-pulse" />
            {location ? 'Relocate' : 'Get My Location'}
          </button>

          {location && (
            <div className="flex-1 flex items-center gap-3">
              <select 
                value={searchRadius}
                onChange={(e) => setSearchRadius(Number(e.target.value))}
                className="w-full py-3 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {[1, 2, 5, 10, 20].map(radius => (
                  <option key={radius} value={radius}>
                    {radius} km Radius
                  </option>
                ))}
              </select>
              <button
                onClick={fetchHospitals}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg shadow-md transition duration-300"
                disabled={loading}
              >
                Search
              </button>
            </div>
          )}
        </div>

        {/* Error and Loading States */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-center">
            {error}
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center my-6">
            <div className="animate-spin h-10 w-10 border-t-4 border-blue-500 rounded-full"></div>
            <p className="text-gray-600 mt-3">Finding nearby hospitals...</p>
          </div>
        )}

        {/* Hospitals Grid */}
        {hospitals.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {hospitals.map((hospital, index) => (
              <div
                key={index}
                onClick={() => setSelectedHospital(hospital)}
                className="bg-white border rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
              >
                <img 
                  src={hospital.image} 
                  alt={hospital.display_name} 
                  className="w-full h-48 object-cover hover:scale-105 transition-transform"
                />
                <div className="p-4">
                  <h4 className="text-lg font-semibold text-blue-800">{hospital.display_name}</h4>
                  <div className="flex items-center text-sm text-gray-600 mt-2">
                    <MapPin className="mr-2 w-4 h-4" />
                    {hospital.distance.toFixed(1)} km away
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Selected Hospital Modal */}
        {selectedHospital && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-6 z-50">
            <div className="bg-white rounded-2xl max-w-md w-full relative shadow-2xl">
              <button
                onClick={() => setSelectedHospital(null)}
                className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 z-10"
              >
                <X className="w-6 h-6" />
              </button>
              <img 
                src={selectedHospital.image} 
                alt={selectedHospital.display_name} 
                className="w-full h-64 object-cover rounded-t-2xl"
              />
              <div className="p-6">
                <h3 className="text-2xl font-bold text-blue-800 mb-4">{selectedHospital.display_name}</h3>
                <div className="space-y-2 text-gray-700">
                  <p className="flex items-center">
                    <MapPin className="mr-2 w-5 h-5 text-blue-600" />
                    Distance: {selectedHospital.distance.toFixed(1)} km
                  </p>
                  <p className="flex items-center">
                    <Hospital className="mr-2 w-5 h-5 text-green-600" />
                    Coordinates: {selectedHospital.lat.toFixed(4)}, {selectedHospital.lon.toFixed(4)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* No Hospitals Found State */}
        {hospitals.length === 0 && !loading && location && (
          <div className="text-center text-gray-600 bg-gray-50 p-6 rounded-lg">
            <p>No hospitals found within {searchRadius} km.</p>
            <p className="mt-2">Try increasing the search radius.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FindHospitals;
