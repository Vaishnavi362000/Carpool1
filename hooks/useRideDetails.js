import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as api from '../components/api';

export const useRideDetails = (rideId) => {
  const [rideDetails, setRideDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rideState, setRideState] = useState('NOT_JOINED');
  const [currentPassengerId, setCurrentPassengerId] = useState(null);

  useEffect(() => {
    fetchRideDetails();
  }, []);

  const fetchRideDetails = async () => {
    setLoading(true);
    try {
      const passengerId = await AsyncStorage.getItem('passengerId');
      setCurrentPassengerId(passengerId);
  
      const rideResponse = await api.getRideDetails(rideId);
      setRideDetails(rideResponse);
  
      try {
        const requestsResponse = await api.getRideRequests(rideId);
  
        const userRequest = requestsResponse.find(request => request.passengerId.toString() === passengerId);
        
        if (userRequest) {
          if (userRequest.status === 'Accepted') {
            setRideState('ACCEPTED');
          } else if (userRequest.status === 'PENDING') {
            setRideState('PENDING');
          }
        } else {
          setRideState('NOT_JOINED');
        }
      } catch (requestError) {
        if (requestError.response && requestError.response.status === 400) {
          console.log('No ride requests available');
          setRideState('NOT_JOINED');
        } else {
          throw requestError;
        }
      }
  
      setError(null);
    } catch (error) {
      console.error('Error fetching ride details:', error);
      if (error.response && error.response.status !== 400) {
        setError('Failed to fetch ride details. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    rideDetails,
    loading,
    error,
    rideState,
    currentPassengerId,
    fetchRideDetails
  };
};