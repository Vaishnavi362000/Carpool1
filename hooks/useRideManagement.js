import { useState, useEffect } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { Alert } from 'react-native';
import * as Haptics from 'expo-haptics';
import { RideStates } from '../screens/ManageRideScreen';
import * as api from '../components/api';

export const useRideManagement = (initialRide) => {
  const [ride, setRide] = useState(initialRide);
  const [rideState, setRideState] = useState(initialRide.status || RideStates.WAITING_FOR_REQUESTS);
  const [acceptedPassengers, setAcceptedPassengers] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [checkedInPassengers, setCheckedInPassengers] = useState([]);
  const [droppedPassengers, setDroppedPassengers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  

  useEffect(() => {
    fetchRideDetails();
    fetchRideRequests();
  }, [initialRide.id, rideState]);

  const fetchRideDetails = async () => {
    try {
      const response = await api.getRideDetails(initialRide.id);
      setRide(response);
    } catch (error) {
      console.error('Error fetching ride details:', error);
      setError('Failed to fetch ride details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchRideRequests = async () => {
    try {
      const response = await api.getRideRequests(initialRide.id);
      setPendingRequests(response.filter(request => request.status === "PENDING"));
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.log('No ride requests available');
        setPendingRequests([]);
      } else {
        console.error('Error fetching ride requests:', error);
      }
    }
  };

  const handleAcceptRequest = async (request) => {
    try {
      await api.acceptRideRequest(ride.id, request);
      setRide(prevRide => ({
        ...prevRide,
        passengers: [...prevRide.passengers, request]
      }));
      setAcceptedPassengers(prev => [...prev, request]);
      setPendingRequests(prev => prev.filter(req => req.id !== request.id));
      setRideState(RideStates.READY_TO_START);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Success', 'Request accepted successfully');
    } catch (error) {
      console.error('Error accepting request:', error);
      Alert.alert('Error', 'Failed to accept request. Please try again.');
    }
  };

  const handleRejectRequest = async (request) => {
    try {
      await api.rejectRideRequest(ride.id, request.id);
      setPendingRequests(prev => prev.filter(req => req.id !== request.id));
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Success', 'Request rejected successfully');
    } catch (error) {
      console.error('Error rejecting request:', error);
      Alert.alert('Error', 'Failed to reject request. Please try again.');
    }
  };

  const handleStartRide = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Please grant location permissions to start the ride.');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const response = await api.startRide(ride.id, location.coords.latitude, location.coords.longitude);

      if (response.status === RideStates.IN_PROGRESS) {
        setRide(prevRide => ({
          ...prevRide,
          status: RideStates.IN_PROGRESS,
          rideStartTime: new Date().toISOString()
        }));
        setRideState(RideStates.IN_PROGRESS);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert('Success', 'Ride started successfully!');
      }
    } catch (error) {
      console.error('Error starting ride:', error);
      Alert.alert('Error', 'Failed to start ride. Please try again.');
    }
  };

  const handleEndRide = async () => {
    try {
      let location = await Location.getCurrentPositionAsync({});
      const response = await api.endRide(ride.id, location.coords.latitude, location.coords.longitude);

      if (response.status === RideStates.COMPLETED) {
        setRide(prevRide => ({
          ...prevRide,
          status: RideStates.COMPLETED,
          rideEndTime: new Date().toISOString()
        }));
        setRideState(RideStates.COMPLETED);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert('Success', 'Ride ended successfully!');
      }
    } catch (error) {
      console.error('Error ending ride:', error);
      Alert.alert('Error', 'Failed to end ride. Please try again.');
    }
  };

  const handleCheckIn = async (passenger) => {
    try {
      let location = await Location.getCurrentPositionAsync({});
      const response = await api.checkInPassenger(ride.id, passenger.passengerJourneyId, location.coords.latitude, location.coords.longitude);

      if (response === 'Ride Started!') {
        setRide(prevRide => ({
          ...prevRide,
          passengers: prevRide.passengers.map(p =>
            p.passengerJourneyId === passenger.passengerJourneyId
              ? { ...p, checkinStatus: true }
              : p
          )
        }));
        setCheckedInPassengers(prev => [...prev, passenger]);
        setAcceptedPassengers(prev =>
          prev.map(p =>
            p.passengerJourneyId === passenger.passengerJourneyId
              ? { ...p, checkinStatus: true }
              : p
          )
        );
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert('Success', 'Passenger checked in successfully!');
      }
    } catch (error) {
      console.error('Error checking in passenger:', error);
      Alert.alert('Error', 'Failed to check in passenger. Please try again.');
    }
  };

  const handleDropPassenger = async (passenger) => {
    try {
      let location = await Location.getCurrentPositionAsync({});
      const response = await api.dropOffPassenger(ride.id, passenger.passengerJourneyId, location.coords.latitude, location.coords.longitude);

      if (response === 'Ride Completed!') {
        setRide(prevRide => ({
          ...prevRide,
          passengers: prevRide.passengers.map(p =>
            p.passengerJourneyId === passenger.passengerJourneyId
              ? { ...p, checkoutStatus: true }
              : p
          )
        }));
        setDroppedPassengers(prev => [...prev, passenger]);
        setCheckedInPassengers(prev => prev.filter(p => p.passengerJourneyId !== passenger.passengerJourneyId));
        setAcceptedPassengers(prev =>
          prev.map(p =>
            p.passengerJourneyId === passenger.passengerJourneyId
              ? { ...p, checkoutStatus: true }
              : p
          )
        );
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert('Success', 'Passenger dropped off successfully!');
      }
    } catch (error) {
      console.error('Error dropping off passenger:', error);
      Alert.alert('Error', 'Failed to drop off passenger. Please try again.');
    }
  };



  return {
    ride,
    rideState,
    acceptedPassengers,
    pendingRequests,
    checkedInPassengers,
    droppedPassengers,
    loading,
    error,
    handleAcceptRequest,
    handleRejectRequest,
    handleStartRide,
    handleEndRide,
    handleCheckIn,
    handleDropPassenger
  };
};