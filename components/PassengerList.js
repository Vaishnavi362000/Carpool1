import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Box, Text, VStack, HStack, Avatar } from 'native-base';

const PassengerList = ({ passengers, rideState, onCheckIn, onDropOff }) => {
  return (
    <Box mt={6}>
      <Text fontSize="xl" fontWeight="bold" mb={4}>Accepted Passengers</Text>
      <VStack space="3">
        {passengers.map(passenger => (
          <Box
            key={passenger.passengerJourneyId}
            bg="white"
            rounded="xl"
            shadow={2}
            p={4}
          >
            <HStack justifyContent="space-between" alignItems="center">
              <HStack space="2" alignItems="center">
                <Avatar bg="black" size="sm">
                  <Text color="white" fontWeight="bold">
                    {passenger.firstName && passenger.lastName
                      ? `${passenger.firstName[0]}${passenger.lastName[0]}`
                      : '??'}
                  </Text>
                </Avatar>
                <VStack>
                  <Text fontWeight="medium">
                    {passenger.firstName && passenger.lastName
                      ? `${passenger.firstName} ${passenger.lastName}`
                      : 'Unknown Passenger'}
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    {passenger.startLocation && passenger.endLocation
                      ? `${passenger.startLocation} → ${passenger.endLocation}`
                      : 'Route not specified'}
                  </Text>
                </VStack>
              </HStack>
              {rideState === 'IN_PROGRESS' && (
                <TouchableOpacity
                  onPress={() => {
                    if (!passenger.checkinStatus) {
                      onCheckIn(passenger);
                    } else if (!passenger.checkoutStatus) {
                      onDropOff(passenger);
                    }
                  }}
                  style={[
                    styles.actionButton,
                    {
                      backgroundColor: passenger.checkoutStatus ? '#4CAF50' :
                        passenger.checkinStatus ? '#2196F3' :
                          '#FFC107'
                    }
                  ]}
                >
                  <Text style={styles.buttonText}>
                    {passenger.checkoutStatus ? "Dropped" :
                      passenger.checkinStatus ? "Drop Off" :
                        "Check In"}
                  </Text>
                </TouchableOpacity>
              )}
            </HStack>
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

const styles = StyleSheet.create({
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
});

export default PassengerList;