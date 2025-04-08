import React, { useState, useEffect } from 'react';
import background from '../../assets/background.png';
import { MapPin, Hospital, X, Navigation, Map, Phone, Clock, Info, ExternalLink, Home, AlertTriangle, Check } from 'lucide-react';

const EnhancedHospitalFinder = () => {
  const [location, setLocation] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [searchRadius, setSearchRadius] = useState(5); // in kilometers
  const [searchTerm, setSearchTerm] = useState('');
  const [locationAccuracyWarning, setLocationAccuracyWarning] = useState(false);
  const [hospitalTypes, setHospitalTypes] = useState({
    hospital: true,
    clinic: false,
    doctors: false
  });

  // Get user location with high accuracy settings
  const getUserLocation = () => {
    setLoading(true);
    setError(null);
    setLocationAccuracyWarning(false);
    
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser.");
      setLoading(false);
      return;
    }

    const geoOptions = {
      enableHighAccuracy: true,  // Request high accuracy
      timeout: 10000,           // Time to wait for a location (10 seconds)
      maximumAge: 0             // Always get a fresh location
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Check position accuracy
        if (position.coords.accuracy > 100) { // If accuracy is worse than 100 meters
          setLocationAccuracyWarning(true);
        }
        
        setLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
        setLoading(false);
      },
      (err) => {
        console.error("Geolocation error:", err);
        setError(`Unable to fetch accurate location: ${err.message}. Please try again or check location permissions.`);
        setLoading(false);
      },
      geoOptions
    );
  };

  // Fetch hospitals based on selected filters
  const fetchHospitals = async () => {
    if (!location) {
      setError("Location not available. Please click 'Get My Location' button.");
      return;
    }

    setLoading(true);
    setError(null);
    setHospitals([]);

    try {
      // Build query based on selected types
      const typeQueries = [];
      if (hospitalTypes.hospital) typeQueries.push(`node["amenity"="hospital"](around:${searchRadius * 1000},${location.lat},${location.lon});way["amenity"="hospital"](around:${searchRadius * 1000},${location.lat},${location.lon});`);
      if (hospitalTypes.clinic) typeQueries.push(`node["amenity"="clinic"](around:${searchRadius * 1000},${location.lat},${location.lon});way["amenity"="clinic"](around:${searchRadius * 1000},${location.lat},${location.lon});`);
      if (hospitalTypes.doctors) typeQueries.push(`node["amenity"="doctors"](around:${searchRadius * 1000},${location.lat},${location.lon});way["amenity"="doctors"](around:${searchRadius * 1000},${location.lat},${location.lon});`);
      
      if (typeQueries.length === 0) {
        typeQueries.push(`node["amenity"="hospital"](around:${searchRadius * 1000},${location.lat},${location.lon});way["amenity"="hospital"](around:${searchRadius * 1000},${location.lat},${location.lon});`);
      }
      
      const queryString = typeQueries.join('');
      
      // Enhanced Overpass API query to include address data
      const overpassUrl = `https://overpass-api.de/api/interpreter?data=[out:json];(${queryString});out body;>;out skel qt;`;

      const response = await fetch(overpassUrl);
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();

      // Process and enhance hospital data
      const hospitalsWithDetails = data.elements
        .filter(element => element.tags && (element.tags.amenity === 'hospital' || 
                                          element.tags.amenity === 'clinic' || 
                                          element.tags.amenity === 'doctors'))
        .map((hospital, index) => {
          // Extract additional information from tags
          const {
            name,
            phone,
            website,
            opening_hours,
            healthcare,
            emergency,
            wheelchair,
            amenity,
            // Address related tags
            "addr:street": street,
            "addr:housenumber": houseNumber,
            "addr:city": city,
            "addr:postcode": postcode,
            "addr:country": country
          } = hospital.tags || {};

          // Construct address from available components
          let address = '';
          if (street) {
            address += (houseNumber ? `${houseNumber} ` : '') + street;
            if (city || postcode) {
              address += ', ';
            }
          }
          if (city) {
            address += city;
            if (postcode) {
              address += ' ';
            }
          }
          if (postcode) {
            address += postcode;
          }
          if (country && (street || city || postcode)) {
            address += `, ${country}`;
          } else if (country) {
            address += country;
          }

          // Calculate coordinates properly for different element types
          let lat = hospital.lat;
          let lon = hospital.lon;
          
          if (hospital.type === 'way' && hospital.center) {
            lat = hospital.center.lat;
            lon = hospital.center.lon;
          }

          // Healthcare specific image based on facility type
          const imageType = emergency === 'yes' ? 'emergency' :
                           amenity === 'hospital' ? 'hospital' :
                           amenity === 'clinic' ? 'clinic' : 'medical';

          return {
            id: hospital.id,
            type: hospital.type,
            lat,
            lon,
            display_name: name || `${amenity || 'Medical Facility'} ${index + 1}`,
            image: getHealthcareImage(imageType, hospital.id),
            distance: calculateDistance(location.lat, location.lon, lat, lon),
            phone: phone || null,
            website: website || null,
            openingHours: opening_hours || null,
            healthcareType: healthcare || amenity || 'Medical Facility',
            emergency: emergency === 'yes',
            wheelchair: wheelchair === 'yes',
            address: address || null,
            rating: (3 + Math.random() * 2).toFixed(1) // Simulated rating between 3-5
          };
        });

      // Sort hospitals by distance
      const sortedHospitals = hospitalsWithDetails.sort((a, b) => a.distance - b.distance);

      setHospitals(sortedHospitals);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching hospitals:", err);
      setError("Error fetching hospitals. Please try again.");
      setLoading(false);
    }
  };

  // Function to get healthcare related images instead of random images
  const getHealthcareImage = (type, id) => {
    // Define indices for specific healthcare image types
    const types = {
      hospital: [1, 2, 3, 4, 5, 6],
      emergency: [7, 8, 9, 10],
      clinic: [11, 12, 13, 14],
      medical: [15, 16, 17, 18, 19, 20]
    };
    
    // Generate a consistent index based on the facility ID
    const hash = id.toString().split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const imageArray = types[type] || types.medical;
    const imageIndex = hash % imageArray.length;
    const selectedIndex = imageArray[imageIndex];
    
    // Return a healthcare-specific image from a predefined set
    return `/api/placeholder/400/300?text=Medical+Facility+${selectedIndex}`;
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

  // Open directions in Google Maps
  const openDirections = (hospital) => {
    if (!hospital || !location) return;
    
    const url = `https://www.google.com/maps/dir/?api=1&origin=${location.lat},${location.lon}&destination=${hospital.lat},${hospital.lon}&travelmode=driving`;
    window.open(url, '_blank');
  };

  // Filter hospitals based on search term
  const filteredHospitals = hospitals.filter(hospital => 
    hospital.display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hospital.healthcareType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (hospital.address && hospital.address.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Toggle hospital type filter
  const toggleHospitalType = (type) => {
    setHospitalTypes(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  // Check if at least one hospital type is selected
  const isAnyTypeSelected = Object.values(hospitalTypes).some(value => value);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4 sm:p-6">
      <div className="bg-white shadow-xl rounded-2xl p-4 sm:p-8 w-full max-w-4xl">
        <h2 className="text-2xl sm:text-3xl font-bold text-blue-800 mb-4 sm:mb-6 flex items-center justify-center gap-2 sm:gap-3">
          <Hospital className="text-blue-600" />
          Emergency Hospital Finder
        </h2>

        {/* Location and Search Controls */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <button 
              onClick={getUserLocation}
              className="flex-1 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 sm:py-3 px-4 rounded-lg shadow-md transition duration-300"
              disabled={loading}
            >
              <Navigation className="mr-2 h-5 w-5" />
              {location ? 'Update My Location' : 'Get My Location'}
            </button>

            {location && (
              <div className="flex-1 flex items-center gap-2 sm:gap-3">
                <select 
                  value={searchRadius}
                  onChange={(e) => setSearchRadius(Number(e.target.value))}
                  className="w-full py-2 sm:py-3 px-3 sm:px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  {[1, 2, 5, 10, 15, 20, 30].map(radius => (
                    <option key={radius} value={radius}>
                      {radius} km
                    </option>
                  ))}
                </select>
                <button
                  onClick={fetchHospitals}
                  className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 sm:py-3 px-3 sm:px-4 rounded-lg shadow-md transition duration-300"
                  disabled={loading || !isAnyTypeSelected}
                >
                  Search
                </button>
              </div>
            )}
          </div>

          {/* Facility Type Filters */}
          <div className="flex flex-wrap gap-2 justify-center">
            <div className="text-sm text-gray-500 w-full text-center mb-1">Facility Type:</div>
            <button
              onClick={() => toggleHospitalType('hospital')}
              className={`px-3 py-1 rounded-full text-sm ${
                hospitalTypes.hospital ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              Hospitals
            </button>
            <button
              onClick={() => toggleHospitalType('clinic')}
              className={`px-3 py-1 rounded-full text-sm ${
                hospitalTypes.clinic ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              Clinics
            </button>
            <button
              onClick={() => toggleHospitalType('doctors')}
              className={`px-3 py-1 rounded-full text-sm ${
                hospitalTypes.doctors ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              Doctor Offices
            </button>
          </div>

          {/* Search Box */}
          {hospitals.length > 0 && (
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name, type, or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-2 px-4 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            </div>
          )}
        </div>

        {/* Location Accuracy Warning */}
        {locationAccuracyWarning && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4 text-sm text-yellow-800 flex items-center">
            <AlertTriangle className="mr-2 text-yellow-500" size={16} />
            <span>
              Location may not be accurate (±{location?.accuracy?.toFixed(0) || '100'}m). 
              For better results, try using a mobile device or enable high accuracy mode in your location settings.
            </span>
          </div>
        )}

        {/* Current Location Display */}
        {location && (
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mb-4 text-sm text-blue-800 flex items-center justify-center">
            <MapPin className="mr-1 text-blue-600" size={16} />
            <span>Your location: {location.lat.toFixed(5)}, {location.lon.toFixed(5)}</span>
          </div>
        )}

        {/* Error and Loading States */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-center">
            {error}
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center my-6 py-8">
            <div className="animate-spin h-10 w-10 border-t-4 border-blue-500 rounded-full"></div>
            <p className="text-gray-600 mt-3">Finding nearby medical facilities...</p>
          </div>
        )}

        {/* Hospitals List */}
        {hospitals.length > 0 && filteredHospitals.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm text-gray-500 border-b pb-2">
              Found {filteredHospitals.length} medical facilities within {searchRadius} km
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredHospitals.map((hospital) => (
                <div
                  key={hospital.id}
                  className="bg-white border rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
                >
                  <div className="relative">
                    <img 
                      src={hospital.image} 
                      alt={hospital.display_name} 
                      className="w-full h-40 object-cover"
                      style={{
                                  backgroundImage: `url(${background})`,
                                  backgroundSize: "cover",
                                  backgroundPosition: "center",
                                }}
                    />
                    <div className="absolute top-2 right-2 bg-white rounded-full px-2 py-1 text-xs font-bold flex items-center">
                      <span className="text-yellow-500 mr-1">★</span> 
                      {hospital.rating}
                    </div>
                    {hospital.emergency && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white text-xs rounded px-2 py-1">
                        EMERGENCY
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h4 className="text-lg font-semibold text-blue-800">{hospital.display_name}</h4>
                    <p className="text-xs text-gray-500 mt-1">{hospital.healthcareType}</p>
                    
                    <div className="flex items-center text-sm text-gray-600 mt-2">
                      <MapPin className="mr-1 w-4 h-4 text-blue-500" />
                      {hospital.distance.toFixed(1)} km away
                    </div>
                    
                    {hospital.address && (
                      <div className="flex items-start mt-2 text-sm text-gray-600">
                        <Home className="mr-1 w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{hospital.address}</span>
                      </div>
                    )}
                    
                    <div className="flex flex-wrap gap-2 mt-4">
                      <button
                        onClick={() => setSelectedHospital(hospital)}
                        className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-800 text-xs sm:text-sm py-2 px-3 rounded flex items-center justify-center"
                      >
                        <Info className="mr-1 w-4 h-4" />
                        Details
                      </button>
                      <button
                        onClick={() => openDirections(hospital)}
                        className="flex-1 bg-green-100 hover:bg-green-200 text-green-800 text-xs sm:text-sm py-2 px-3 rounded flex items-center justify-center"
                      >
                        <Map className="mr-1 w-4 h-4" />
                        Directions
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Hospitals Found State */}
        {hospitals.length > 0 && filteredHospitals.length === 0 && (
          <div className="text-center text-gray-600 bg-gray-50 p-6 rounded-lg">
            <p>No results match your search "{searchTerm}".</p>
            <button 
              onClick={() => setSearchTerm('')}
              className="text-blue-500 hover:text-blue-700 mt-2"
            >
              Clear search
            </button>
          </div>
        )}

        {hospitals.length === 0 && !loading && location && (
          <div className="text-center text-gray-600 bg-gray-50 p-6 rounded-lg">
            <p>No medical facilities found within {searchRadius} km.</p>
            <p className="mt-2">Try increasing the search radius or selecting different facility types.</p>
          </div>
        )}

        {/* Selected Hospital Modal */}
        {selectedHospital && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-md w-full relative shadow-2xl">
              <button
                onClick={() => setSelectedHospital(null)}
                className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 z-10 bg-white rounded-full p-1"
              >
                <X className="w-5 h-5" />
              </button>
              <img 
                src={selectedHospital.image} 
                alt={selectedHospital.display_name} 
                className="w-full h-48 sm:h-56 object-cover rounded-t-2xl"
                style={{
                            backgroundImage: `url(${background})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                          }}
              />
              <div className="p-5">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold text-blue-800">{selectedHospital.display_name}</h3>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    Rating: {selectedHospital.rating}/5
                  </span>
                </div>
                
                <div className="mt-4 space-y-3 text-gray-700 text-sm">
                  <div className="flex items-start">
                    <MapPin className="mr-2 w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Distance</p>
                      <p>{selectedHospital.distance.toFixed(1)} km from your location</p>
                    </div>
                  </div>
                  
                  {selectedHospital.address && (
                    <div className="flex items-start">
                      <Home className="mr-2 w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Address</p>
                        <p>{selectedHospital.address}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-start">
                    <Hospital className="mr-2 w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Type</p>
                      <p>{selectedHospital.healthcareType}</p>
                    </div>
                  </div>
                  
                  {selectedHospital.phone && (
                    <div className="flex items-start">
                      <Phone className="mr-2 w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Phone</p>
                        <p>{selectedHospital.phone}</p>
                      </div>
                    </div>
                  )}
                  
                  {selectedHospital.openingHours && (
                    <div className="flex items-start">
                      <Clock className="mr-2 w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Hours</p>
                        <p>{selectedHospital.openingHours}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedHospital.emergency && (
                      <div className="bg-red-50 border border-red-100 rounded-full px-3 py-1 text-red-700 text-xs flex items-center">
                        <Hospital className="mr-1 w-3 h-3" />
                        Emergency Services
                      </div>
                    )}
                    
                    {selectedHospital.wheelchair && (
                      <div className="bg-blue-50 border border-blue-100 rounded-full px-3 py-1 text-blue-700 text-xs flex items-center">
                        <Check className="mr-1 w-3 h-3" />
                        Wheelchair Accessible
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <button
                    onClick={() => openDirections(selectedHospital)}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg shadow-md transition duration-300 flex items-center justify-center"
                  >
                    <Map className="mr-2 w-5 h-5" />
                    Get Directions
                  </button>
                  
                  {selectedHospital.website ? (
                    <a
                      href={selectedHospital.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-4 rounded-lg shadow-md transition duration-300 flex items-center justify-center"
                    >
                      <ExternalLink className="mr-2 w-5 h-5" />
                      Website
                    </a>
                  ) : (
                    <button
                      onClick={() => setSelectedHospital(null)}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-4 rounded-lg shadow-md transition duration-300"
                    >
                      Close
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Information Footer */}
      <div className="w-full max-w-4xl mt-4 text-xs text-center text-gray-500">
        <p>This application uses the OpenStreetMap Overpass API, which is free and doesn't require an API key.</p>
        <p className="mt-1">For directions, we use Google Maps which works across all devices.</p>
      </div>
    </div>
  );
};

export default EnhancedHospitalFinder;