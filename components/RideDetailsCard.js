import React from 'react';
import { StyleSheet } from 'react-native';
import { Box, Text, HStack, VStack, Icon } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const RideDetailsCard = ({ ride, rideState, acceptedPassengers, calculateDuration, formatTime }) => {
  return ( 
    <LinearGradient
      colors={['#1a1a1a', '#2a2a2a']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradientCard}
    >
      <HStack justifyContent="space-between" mb="2">
        <VStack>
          <Text fontSize="xs" color="gray.400" fontWeight="medium">FROM</Text>
          <Text fontSize="md" fontWeight="bold" color="white">{ride.source}</Text>
        </VStack>
        <Icon as={MaterialIcons} name="arrow-forward" size="md" color="white" />
        <VStack>
          <Text fontSize="xs" color="gray.400" fontWeight="medium">TO</Text>
          <Text fontSize="md" fontWeight="bold" color="white">{ride.destination}</Text>
        </VStack>
      </HStack>
      <HStack justifyContent="space-between" mt="2">
        <VStack>
          <Text fontSize="xs" color="gray.400" fontWeight="medium">DATE</Text>
          <Text fontSize="md" fontWeight="bold" color="white">{ride.rideDate}</Text>
        </VStack>
        <VStack>
          <Text fontSize="xs" color="gray.400" fontWeight="medium">SEATS</Text>
          <Text fontSize="md" fontWeight="bold" color="white">{acceptedPassengers.length}/{ride.vehicleDto?.capacity || 'N/A'}</Text>
        </VStack>
        <VStack>
          <Text fontSize="xs" color="gray.400" fontWeight="medium">STATUS</Text>
          <Text fontSize="md" fontWeight="bold" color="white">{rideState}</Text>
        </VStack>
      </HStack>
      {rideState === 'COMPLETED' && (
        <HStack justifyContent="space-between" mt="4" alignItems="center">
          <VStack>
            <Text fontSize="xs" color="gray.400" fontWeight="medium">DURATION</Text>
            <Text fontSize="md" fontWeight="bold" color="white">
              {calculateDuration(ride.rideStartTime, ride.rideEndTime)}
            </Text>
          </VStack>
          <VStack>
            <Text fontSize="xs" color="gray.400" fontWeight="medium">START</Text>
            <Text fontSize="md" fontWeight="bold" color="white">
              {formatTime(ride.rideStartTime)}
            </Text>
          </VStack>
          <VStack>
            <Text fontSize="xs" color="gray.400" fontWeight="medium">END</Text>
            <Text fontSize="md" fontWeight="bold" color="white">
              {formatTime(ride.rideEndTime)}
            </Text>
          </VStack>
        </HStack>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
});

export default RideDetailsCard;