import React from 'react';
import { StyleSheet, Animated } from 'react-native';
import { Box, Text, VStack, HStack, Avatar, Icon, Button, Input, Progress, Pressable } from 'native-base';
import { MaterialIcons, Ionicons, Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import RideDetailsCard from './RideDetailsCard';

export const RideCard = ({ rideDetails }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatDuration = (minutes) => {
    return minutes ? `${minutes} min` : 'N/A';
  };


  return (
    <RideDetailsCard
      ride={{
        source: rideDetails.source.split(',')[0],
        destination: rideDetails.destination.split(',')[0],
        rideDate: formatDate(rideDetails.rideDate),
        vehicleDto: { capacity: rideDetails.capacity },
        rideStartTime: rideDetails.rideStartTime,
        rideEndTime: rideDetails.rideEndTime
      }}
      rideState={rideDetails.status || 'Not Started'}
      acceptedPassengers={[]} // You may need to pass the actual accepted passengers if available
      calculateDuration={() => formatDuration(rideDetails.durationInMinutes)}
      formatTime={(time) => new Date(time).toLocaleTimeString()}
    />
  );
};

export const DriverCard = ({ driverDetails, vehicleDetails }) => (
  <Box bg="white" rounded="xl" p="6" shadow="2" mb="4">
    <HStack alignItems="center" space="4">
      <Avatar size="lg" source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }}>
        {vehicleDetails.riderFirstName?.charAt(0) || 'D'}
      </Avatar>
      <VStack>
        <Text fontSize="lg" fontWeight="bold" color="black">
          {vehicleDetails.riderFirstName || 'Driver'} {vehicleDetails.riderLastName || ''}
        </Text>
        <HStack alignItems="center">
          <Icon as={Ionicons} name="star" size="sm" color="yellow.400" />
          <Text fontSize="md" color="coolGray.600" ml="1">{driverDetails.rating || 'N/A'}</Text>
        </HStack>
      </VStack>
    </HStack>
    <HStack mt="4" justifyContent="space-between">
      <VStack>
        <Text fontSize="sm" color="coolGray.400" fontWeight="medium">VEHICLE NUMBER</Text>
        <Text fontSize="md" fontWeight="semibold" color="black">{vehicleDetails.vehicleNumber}</Text>
      </VStack>
      <VStack>
        <Text fontSize="sm" color="coolGray.400" fontWeight="medium">LICENSE</Text>
        <Text fontSize="md" fontWeight="semibold" color="black">{vehicleDetails.drivingLicense}</Text>
      </VStack>
    </HStack>
  </Box>
);

export const ActionCard = ({ 
  rideState, 
  rideDetails, 
  onJoinRide, 
  onCancelRequest, 
  onStartRide, 
  onEndRide, 
  onCallDriver, 
  onMessageDriver 
}) => {
  const [otp, setOtp] = React.useState('');

  const renderContent = () => {
    switch (rideState) {
      case 'NOT_JOINED':
        return (
          <>
            <HStack alignItems="center" mb="4">
              <Icon as={Feather} name="zap" size="6" color="green.500" mr="2" />
              <Text fontSize="lg" fontWeight="bold" color="black">Eco-Friendly Ride</Text>
            </HStack>
            <Text fontSize="md" color="coolGray.600" mb="4">Join this ride to save 2.5 kg of CO2</Text>
            <Button
              onPress={onJoinRide}
              bg="black"
              _text={{ color: 'white', fontWeight: 'bold' }}
              rounded="full"
            >
              Request to Join
            </Button>
          </>
        );
      case 'PENDING':
        return (
          <>
            <HStack alignItems="center" mb="4">
              <Icon as={Feather} name="clock" size="6" color="orange.500" mr="2" />
              <Text fontSize="lg" fontWeight="bold" color="black">Request Pending</Text>
            </HStack>
            <Text fontSize="md" color="coolGray.600" mb="4">Your request to join this ride is pending approval.</Text>
            <Button
              onPress={onCancelRequest}
              bg="gray.400"
              _text={{ color: 'white', fontWeight: 'bold' }}
              rounded="full"
            >
              Cancel Request
            </Button>
          </>
        );
      case 'ACCEPTED':
        return (
          <>
            <HStack alignItems="center" mb="4">
              <Icon as={Feather} name="check-circle" size="6" color="green.500" mr="2" />
              <Text fontSize="lg" fontWeight="bold" color="black">Request Accepted</Text>
            </HStack>
            <Text fontSize="md" color="coolGray.600" mb="4">Your request to join this ride has been accepted!</Text>
            <HStack space="4">
              <Button
                onPress={onCallDriver}
                leftIcon={<Icon as={Ionicons} name="call" size="sm" color="white" />}
                bg="black"
                _text={{ color: 'white' }}
                rounded="full"
                flex={1}
              >
                Call
              </Button>
              <Button
                onPress={onMessageDriver}
                leftIcon={<Icon as={Ionicons} name="chatbubble" size="sm" color="black" />}
                bg="coolGray.100"
                _text={{ color: 'black' }}
                rounded="full"
                flex={1}
              >
                Message
              </Button>
            </HStack>
          </>
        );
      case 'IN_PROGRESS':
        return (
          <>
            <Text fontSize="lg" fontWeight="bold" color="black" mb="4">Enjoy your ride!</Text>
            <HStack justifyContent="space-between" mb="4">
              <VStack alignItems="center">
                <Icon as={Feather} name="clock" size="6" color="black" mb="2" />
                <Text fontSize="sm" color="coolGray.400" fontWeight="medium">START TIME</Text>
                <Text fontSize="md" fontWeight="semibold" color="black">
                  {new Date(rideDetails.rideStartTime).toLocaleTimeString()}
                </Text>
              </VStack>
              <VStack alignItems="center">
                <Icon as={Feather} name="map-pin" size="6" color="black" mb="2" />
                <Text fontSize="sm" color="coolGray.400" fontWeight="medium">DESTINATION</Text>
                <Text fontSize="md" fontWeight="semibold" color="black">{rideDetails.destination}</Text>
              </VStack>
            </HStack>
            <Button
              onPress={onCallDriver}
              leftIcon={<Icon as={Ionicons} name="call" size="sm" color="white" />}
              bg="black"
              _text={{ color: 'white' }}
              rounded="full"
              mt="4"
            >
              Contact Driver
            </Button>
          </>
        );
      case 'COMPLETED':
        return (
          <>
            <Icon as={Feather} name="check-circle" size="12" color="green.500" alignSelf="center" mb="4" />
            <Text fontSize="lg" fontWeight="bold" color="black" textAlign="center" mb="2">Ride Completed!</Text>
            <Text fontSize="md" color="coolGray.600" textAlign="center" mb="4">Thank you for choosing our service.</Text>
            <HStack justifyContent="space-between" mb="4">
              <VStack alignItems="center">
                <Text fontSize="sm" color="coolGray.400" fontWeight="medium">START TIME</Text>
                <Text fontSize="md" fontWeight="semibold" color="black">
                  {new Date(rideDetails.rideStartTime).toLocaleTimeString()}
                </Text>
              </VStack>
              <VStack alignItems="center">
                <Text fontSize="sm" color="coolGray.400" fontWeight="medium">END TIME</Text>
                <Text fontSize="md" fontWeight="semibold" color="black">
                  {rideDetails.rideEndTime ? new Date(rideDetails.rideEndTime).toLocaleTimeString() : 'N/A'}
                </Text>
              </VStack>
            </HStack>
            <Button
              onPress={onEndRide}
              bg="black"
              _text={{ color: 'white', fontWeight: 'bold' }}
              rounded="full"
              mt="4"
            >
              Rate Your Ride
            </Button>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Box bg="white" rounded="xl" p="6" shadow="2" mb="4">
      {renderContent()}
    </Box>
  );
};

const styles = StyleSheet.create({
  gradientCard: {
    borderRadius: 12,
    padding: 24,
    marginBottom: 16,
  },
});