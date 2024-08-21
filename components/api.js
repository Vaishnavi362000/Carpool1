import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://ec2-3-104-95-118.ap-southeast-2.compute.amazonaws.com:8081';
const HERE_API_KEY = 'BLiCQHHuN3GFygSHe27hv4rRBpbto7K35v7HXYtANC8';

export const login = async (username, password) => {
  const response = await axios.post(`${BASE_URL}/user/token`, {
    username,
    password,
  });
  return response.data;
};

export const getUserData = async (username, token) => {
  const response = await axios.get(`${BASE_URL}/user/manage/get?username=${username}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const register = async (username, password, email, phone) => {
  const response = await axios.post(`${BASE_URL}/user/manage/create`, {
    username,
    password,
    email,
    phone,
  });
  return response.data;
};

export const createDriver = async (driverData) => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) {
      throw new Error('No authentication token found');
    }
    const response = await axios.post(`${BASE_URL}/driver/create`, driverData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating driver profile:', error);
    throw error;
  }
};



export const getDriverById = async (driverId) => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) {
      throw new Error('No authentication token found');
    }
    const response = await axios.get(`${BASE_URL}/driver/getById?id=${driverId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching driver data:', error);
    throw error;
  }
};


export const getVehiclesByDriver = async (driverId) => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    const response = await axios.get(`${BASE_URL}/vehicle/getByDriver?id=${driverId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    throw error;
  }
};

export const getSavedLocationsByPassengerId = async (passengerId) => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) {
      throw new Error('User authentication failed. Please log in again.');
    }
    const response = await axios.get(`${BASE_URL}/saveLocation/getByPassengerId?passengerId=${passengerId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching locations:', error);
    throw error;
  }
};

export const saveLocation = async (userId, locationData) => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) {
      throw new Error('No authentication token found');
    }
    const response = await axios.post(
      `${BASE_URL}/saveLocation/passenger?passengerId=${userId}`,
      locationData,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error saving location:', error);
    throw error;
  }
};

export const updateLocation = async (locationId, locationData) => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) {
      throw new Error('No authentication token found');
    }
    const response = await axios.put(
      `${BASE_URL}/saveLocation/edit?locationId=${locationId}`,
      locationData,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating location:', error);
    throw error;
  }
};

export const deleteSavedLocation = async (locationId) => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) {
      throw new Error('User authentication failed. Please log in again.');
    }
    const response = await axios.delete(`${BASE_URL}/saveLocation/delete?locationId=${locationId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting location:', error);
    throw error;
  }
};

export const getSavedRoutesByPassenger = async (passengerId) => {
  try{
  const token = await AsyncStorage.getItem('userToken');
  const response = await axios.get(`${BASE_URL}/saved-routes/getByPassenger?passengerId=${passengerId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (Array.isArray(response.data)) {
    return response.data;
  } else {
    console.error('Unexpected data format:', response.data);
    throw new Error('Received invalid data format from server.');
  }
    } catch (error) {
      console.error('Error fetching routes:', error);
      throw error;
    }
};

export const saveRoute = async (passengerId, routeData) => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    const response = await axios.post(
      `${BASE_URL}/saved-routes/passenger?passengerId=${passengerId}`,
      routeData,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error('Error saving route:', error);
    throw error;
  }
};

export const updateRoute = async (routeId, routeData) => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    const response = await axios.put(
      `${BASE_URL}/saved-routes/edit?routeId=${routeId}`,
      routeData,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating route:', error);
    throw error;
  }
};

export const deleteSavedRoute = async (routeId) => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    const response = await axios.delete(`${BASE_URL}/saved-routes/delete?routeId=${routeId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting saved route:', error);
    throw error;
  }
};

export const getVehicleById = async (vehicleId) => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    const response = await axios.get(`${BASE_URL}/vehicle/getById?id=${vehicleId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching vehicle details:', error);
    throw error;
  }
};

export const createVehicle = async (vehicleData) => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    const response = await axios.post(`${BASE_URL}/vehicle/create`, vehicleData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating vehicle:', error);
    throw error;
  }
};

export const updateVehicle = async (vehicleId, vehicleData) => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    const response = await axios.put(`${BASE_URL}/vehicle/edit?id=${vehicleId}`, vehicleData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating vehicle:', error);
    throw error;
  }
};


export const deleteVehicle = async (vehicleId) => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    const response = await axios.delete(`${BASE_URL}/vehicle/delete?id=${vehicleId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting vehicle:', error);
    throw error;
  }
};

export const updateVehicleStatus = async (vehicleId, isDefault) => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    const response = await axios.put(`${BASE_URL}/vehicle/update?id=${vehicleId}`,
      { isDefault },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating vehicle status:', error);
    throw error;
  }
};





export const getCoordinates = async (location) => {
  const response = await axios.get(`https://geocode.search.hereapi.com/v1/geocode?q=${encodeURIComponent(location)}&apiKey=${HERE_API_KEY}`);
  if (response.data.items && response.data.items.length > 0) {
    return response.data.items[0].position;
  }
  throw new Error('Location not found');
};

export const searchRides = async (latitude, longitude) => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) {
      throw new Error('No authentication token found');
    }
    const response = await axios.get(`${BASE_URL}/passenger/searchRide`, {
      params: { latitude, longitude },
      headers: { Authorization: `Bearer ${token}` }
    });
    return Array.isArray(response.data) ? response.data : response.data.rides;
  } catch (error) {
    console.error('Error searching rides:', error);
    throw error;
  }
};



export const offerRide = async (rideData) => {
  const token = await AsyncStorage.getItem('userToken');
  const response = await axios.post(`${BASE_URL}/rides/add`, rideData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};


export const getRideDetails = async (rideId) => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    const response = await axios.get(`${BASE_URL}/rides/getById?id=${rideId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching ride details:', error);
    throw error;
  }
};

export const getRideRequests = async (rideId) => {
  try{
  const token = await AsyncStorage.getItem('userToken');
  const response = await axios.get(`${BASE_URL}/rides/getRequestByRide?rideId=${rideId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
  } catch (error) {
    console.error('Error fetching ride requests:', error);
    throw error;
  }
};

export const joinRide = async (passengerId, rideId) => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    const response = await axios.post(`${BASE_URL}/rides/request?passengerId=${passengerId}&rideId=${rideId}`, null, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error joining ride:', error);
    throw error;
  }
};

export const cancelRideRequest = async (passengerId, rideId) => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    const response = await axios.post(
      `${BASE_URL}/rides/cancelRequest?passengerId=${passengerId}&rideId=${rideId}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error('Error cancelling request:', error);
    throw error;
  }
};

export const acceptRideRequest = async (rideId, request) => {
  const token = await AsyncStorage.getItem('userToken');
  const response = await axios.post(`${BASE_URL}/rides/respond?requestId=${request.id}&status=Accepted`, {
    rideDto: { id: rideId },
    customerId: request.passengerId,
    startLocation: request.startLocation,
    startLatitude: request.startLatitude,
    startLongitude: request.startLongitude,
    endLocation: request.endLocation,
    endLatitude: request.endLatitude,
    endLongitude: request.endLongitude
  }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const rejectRideRequest = async (rideId, requestId) => {
  const token = await AsyncStorage.getItem('userToken');
  const response = await axios.post(`${BASE_URL}/rides/respond?requestId=${requestId}&status=Rejected`, {
    rideDto: { id: rideId }
  }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const getPassengerRideHistory = async (passengerId) => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    const response = await axios.get(`${BASE_URL}/rides/getRequestByPassenger?passengerId=${passengerId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching passenger ride history:', error);
    throw error;
  }
};

export const getScheduledRides = async (driverId) => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    const response = await axios.get(`${BASE_URL}/rides/scheduledRides?id=${driverId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching scheduled rides:', error);
    throw error;
  }
};

export const getDriverRideHistory = async (driverId) => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    const response = await axios.get(`${BASE_URL}/rides/getByDriver?id=${driverId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching driver ride history:', error);
    throw error;
  }
};

export const startRide = async (rideId, latitude, longitude) => {
  const token = await AsyncStorage.getItem('userToken');
  const response = await axios.put(`${BASE_URL}/rides/start`, {
    rideId,
    latitude,
    longitude
  }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const startRide1 = async (rideId, passengerId, otp) => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    const response = await axios.post(
      `${BASE_URL}/rides/start`,
      { rideId, passengerId, otp },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error('Error starting ride:', error);
    throw error;
  }
};

export const endRide = async (rideId, latitude, longitude) => {
  const token = await AsyncStorage.getItem('userToken');
  const response = await axios.put(`${BASE_URL}/rides/end`, {
    rideId,
    latitude,
    longitude
  }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const endRide1 = async (rideId, passengerId) => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    const response = await axios.post(
      `${BASE_URL}/rides/end`,
      { rideId, passengerId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error('Error ending ride:', error);
    throw error;
  }
};

export const checkInPassenger = async (rideId, passengerJourneyId, checkinLatitude, checkinLongitude) => {
  const token = await AsyncStorage.getItem('userToken');
  const response = await axios.put(`${BASE_URL}/passenger/start`, {
    rideId,
    passengerJourneyId,
    checkinLatitude,
    checkinLongitude
  }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const dropOffPassenger = async (rideId, passengerJourneyId, checkoutLatitude, checkoutLongitude) => {
  const token = await AsyncStorage.getItem('userToken');
  const response = await axios.put(`${BASE_URL}/passenger/end`, {
    rideId,
    passengerJourneyId,
    checkoutLatitude,
    checkoutLongitude
  }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};


