import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'native-base';

const ActionButton = ({ 
  rideState, 
  onStartRide, 
  onEndRide, 
  onGoBack, 
  droppedPassengersCount, 
  acceptedPassengersCount 
}) => {
  if (rideState === 'READY_TO_START') {
    return (
      <TouchableOpacity onPress={onStartRide} style={[styles.button, { backgroundColor: '#4CAF50' }]}>
        <Text style={styles.buttonText}>Start Ride</Text>
      </TouchableOpacity>
    );
  } else if (rideState === 'IN_PROGRESS') {
    return (
      <TouchableOpacity
        onPress={onEndRide}
        style={[
          styles.button, 
          { 
            backgroundColor: droppedPassengersCount === acceptedPassengersCount ? '#F44336' : '#9E9E9E' 
          }
        ]}
        disabled={droppedPassengersCount !== acceptedPassengersCount}
      >
        <Text style={styles.buttonText}>End Ride</Text>
      </TouchableOpacity>
    );
  } else if (rideState === 'COMPLETED') {
    return (
      <TouchableOpacity onPress={onGoBack} style={[styles.button, { backgroundColor: 'black' }]}>
        <Text style={styles.buttonText}>Back to Home</Text>
      </TouchableOpacity>
    );
  }
  return null;
};

const styles = StyleSheet.create({
  button: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ActionButton;