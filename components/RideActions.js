import { useState } from 'react';
import * as Haptics from 'expo-haptics';
import * as api from '../components/api';
import { Linking } from 'react-native';

const RideActions = (rideId, currentPassengerId, toast) => {
  const [joiningRide, setJoiningRide] = useState(false);

  const joinRide = async () => {
    setJoiningRide(true);
    try {
      await api.joinRide(currentPassengerId, rideId);
      toast.show({
        title: "Request Sent",
        status: "success",
        description: "Your request to join the ride has been sent.",
        placement: "top"
      });
    } catch (error) {
      console.error('Error joining ride:', error);
      toast.show({
        title: "Failed to Join",
        status: "error",
        description: "There was an error sending your request. Please try again.",
        placement: "top"
      });
    } finally {
      setJoiningRide(false);
    }
  };

  const cancelRequest = async () => {
    try {
      const response = await api.cancelRideRequest(currentPassengerId, rideId);
      if (response) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        toast.show({
          title: "Request Cancelled",
          status: "success",
          description: "Your ride request has been cancelled.",
          placement: "top"
        });
      } else {
        throw new Error('Failed to cancel request');
      }
    } catch (error) {
      console.error('Error cancelling request:', error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      toast.show({
        title: "Failed to Cancel Request",
        status: "error",
        description: error.response?.data?.message || "Please try again later.",
        placement: "top"
      });
    }
  };

  const startRide = async (otp) => {
    try {
      const response = await api.startRide1(rideId, currentPassengerId, otp);
      if (response) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        toast.show({
          title: "Ride Started",
          status: "success",
          description: "Your ride has started. Enjoy your journey!",
          placement: "top"
        });
      } else {
        throw new Error('Failed to start ride');
      }
    } catch (error) {
      console.error('Error starting ride:', error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      toast.show({
        title: "Failed to Start Ride",
        status: "error",
        description: error.response?.data?.message || "Please check your OTP and try again.",
        placement: "top"
      });
    }
  };

  const endRide = async () => {
    try {
      const response = await api.endRide1(rideId, currentPassengerId);
      if (response) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        toast.show({
          title: "Ride Completed",
          status: "success",
          description: "Your ride has been completed. Thank you for traveling with us!",
          placement: "top"
        });
      } else {
        throw new Error('Failed to end ride');
      }
    } catch (error) {
      console.error('Error ending ride:', error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      toast.show({
        title: "Failed to End Ride",
        status: "error",
        description: error.response?.data?.message || "Please try again later.",
        placement: "top"
      });
    }
  };

  const callDriver = (driverPhone) => {
    if (driverPhone) {
      Linking.openURL(`tel:${driverPhone}`);
    } else {
      toast.show({
        title: "Unable to Call",
        status: "error",
        description: "Driver's phone number is not available.",
        placement: "top"
      });
    }
  };

  const messageDriver = (driverPhone) => {
    if (driverPhone) {
      Linking.openURL(`sms:${driverPhone}`);
    } else {
      toast.show({
        title: "Unable to Message",
        status: "error",
        description: "Driver's phone number is not available.",
        placement: "top"
      });
    }
  };

  return {
    joinRide,
    cancelRequest,
    startRide,
    endRide,
    callDriver,
    messageDriver,
    joiningRide
  };
};

export default RideActions;