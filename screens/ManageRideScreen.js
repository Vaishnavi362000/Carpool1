import React from 'react';
import { StyleSheet, ScrollView, Dimensions, ActivityIndicator, Alert } from 'react-native';
import { Box, Text, useTheme,HStack, Pressable, Icon } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import PassengerRequestCard from '../components/PassengerRequestCard';
import RideDetailsCard from '../components/RideDetailsCard';
import PassengerList from '../components/PassengerList';
import ActionButton from '../components/ActionButton';
import { useRideManagement } from '../hooks/useRideManagement';
import { formatTime, calculateDuration } from '../utils/timeUtils';
import SimpleTabBar from '../components/SimpleTabBar';

const { width } = Dimensions.get('window');

export const RideStates = {
  WAITING_FOR_REQUESTS: 'WAITING_FOR_REQUESTS',
  RECEIVING_REQUESTS: 'RECEIVING_REQUESTS',
  READY_TO_START: 'READY_TO_START',
  IN_PROGRESS: 'Ongoing',
  COMPLETED: 'Completed'
};


const ManageRideScreen = ({ route, navigation }) => {
  const { ride: initialRide } = route.params;
  const theme = useTheme();
  const {
    ride,
    rideState,
    acceptedPassengers,
    pendingRequests,
    droppedPassengers,
    loading,
    error,
    handleAcceptRequest,
    handleRejectRequest,
    handleStartRide,
    handleEndRide,
    handleCheckIn,
    handleDropPassenger
  } = useRideManagement(initialRide);


  if (loading) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center">
        <ActivityIndicator size="large" color={theme.colors.primary[500]} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center" p={4}>
        <Text fontSize="lg" color="red.500" textAlign="center">{error}</Text>
        <ActionButton
          label="Go Back"
          onPress={() => navigation.goBack()}
          style={styles.errorButton}
          textStyle={styles.errorButtonText}
        />
      </Box>
    );
  }

  return (
    <Box flex={1} bg="coolGray.50" safeArea>
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <RideDetailsCard
        ride={ride}
        rideState={rideState}
        acceptedPassengers={acceptedPassengers}
        calculateDuration={calculateDuration}
        formatTime={formatTime}
      />
      <PassengerList
        passengers={acceptedPassengers}
        rideState={rideState}
        onCheckIn={handleCheckIn}
        onDropOff={handleDropPassenger}
      />
      {pendingRequests.length > 0 && (
        <Box mt={6}>
          <Text fontSize="xl" fontWeight="bold" mb={4}>
            Passenger Requests ({pendingRequests.length})
          </Text>
          {pendingRequests.map((request) => (
            <PassengerRequestCard
              key={request.id}
              request={request}
              onAccept={handleAcceptRequest}
              onReject={handleRejectRequest}
            />
          ))}
        </Box>
      )}
      <ActionButton
        rideState={rideState}
        onStartRide={handleStartRide}
        onEndRide={handleEndRide}
        onGoBack={() => navigation.goBack()}
        droppedPassengersCount={droppedPassengers.length}
        acceptedPassengersCount={acceptedPassengers.length}
      />
      
    </ScrollView>
    <SimpleTabBar navigation={navigation} currentTab="Rides" />
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    padding: 16,
  },
  errorButton: {
    marginTop: 20,
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
  },
  errorButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ManageRideScreen;

{/*
import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, ScrollView, Animated, Dimensions, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Box, Text, VStack, HStack, Avatar, Progress, Icon, useTheme, Divider, Pressable } from 'native-base';
import { MaterialIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { FadeInRight, FadeOutLeft } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const RideStates = {
  WAITING_FOR_REQUESTS: 'WAITING_FOR_REQUESTS',
  RECEIVING_REQUESTS: 'RECEIVING_REQUESTS',
  READY_TO_START: 'READY_TO_START',
  IN_PROGRESS: 'Ongoing',
  COMPLETED: 'Completed'
};

const PassengerRequestCard = ({ request, onAccept, onReject }) => {
  const theme = useTheme();

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <Animated.View
      entering={FadeInRight.duration(300)}
      exiting={FadeOutLeft.duration(300)}
    >
      <Box
        bg="white"
        rounded="xl"
        shadow={3}
        p={4}
        mb={4}
        borderWidth={1}
        borderColor="gray.100"
      >
        <HStack space={4} alignItems="center">
          <Avatar
            bg={theme.colors.primary[500]}
            size="md"
          >
            {getInitials(request.passengerName)}
          </Avatar>
          <VStack flex={1}>
            <Text fontSize="lg" fontWeight="bold" color="gray.800">
              {request.passengerName}
            </Text>
            <Text fontSize="sm" color="gray.500">
              Requested at {new Date(request.requestTime).toLocaleTimeString()}
            </Text>
          </VStack>
        </HStack>
        <Divider my={3} />
        <HStack justifyContent="space-between" mt={2}>
          <Pressable
            onPress={() => onAccept(request)}
            bg="green.500"
            rounded="full"
            py={2}
            px={4}
            _pressed={{ bg: "green.600" }}
          >
            <HStack space={2} alignItems="center">
              <Icon as={Ionicons} name="checkmark-circle" size="sm" color="white" />
              <Text color="white" fontWeight="bold">Accept</Text>
            </HStack>
          </Pressable>
          <Pressable
            onPress={() => onReject(request)}
            bg="red.500"
            rounded="full"
            py={2}
            px={4}
            _pressed={{ bg: "red.600" }}
          >
            <HStack space={2} alignItems="center">
              <Icon as={Ionicons} name="close-circle" size="sm" color="white" />
              <Text color="white" fontWeight="bold">Reject</Text>
            </HStack>
          </Pressable>
        </HStack>
      </Box>
    </Animated.View>
  );
};

const ManageRideScreen = ({ route, navigation }) => {
  const { ride: initialRide } = route.params;
  const [ride, setRide] = useState(initialRide);
  const [rideState, setRideState] = useState(initialRide.status || RideStates.WAITING_FOR_REQUESTS);
  const [acceptedPassengers, setAcceptedPassengers] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [checkedInPassengers, setCheckedInPassengers] = useState([]);
  const [droppedPassengers, setDroppedPassengers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(width)).current;
  const theme = useTheme();

  useEffect(() => {
    const fetchRideDetails = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const response = await axios.get(`http://ec2-3-104-95-118.ap-southeast-2.compute.amazonaws.com:8081/rides/getById?id=${initialRide.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRide(response.data);

      } catch (error) {
        console.error('Error fetching ride details:', error);
        setError('Failed to fetch ride details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchRideDetails();
    fetchRideRequests();
  }, [initialRide.id, rideState]);

  const fetchRideRequests = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(`http://ec2-3-104-95-118.ap-southeast-2.compute.amazonaws.com:8081/rides/getRequestByRide?rideId=${initialRide.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPendingRequests(response.data.filter(request => request.status === "PENDING"));
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.log('No ride requests available');
        setPendingRequests([]);
      } else {
        console.error('Error fetching ride requests:', error);
      }
    }
  };

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const handleAcceptRequest = async (request) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      await axios.post(`http://ec2-3-104-95-118.ap-southeast-2.compute.amazonaws.com:8081/rides/respond?requestId=${request.id}&status=Accepted`, {
        rideDto: {
          id: ride.id
        },
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
      const token = await AsyncStorage.getItem('userToken');
      await axios.post(`http://ec2-3-104-95-118.ap-southeast-2.compute.amazonaws.com:8081/rides/respond?requestId=${request.id}&status=Rejected`, {
        rideDto: {
          id: ride.id
        }
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

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
      const token = await AsyncStorage.getItem('userToken');
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Please grant location permissions to start the ride.');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const response = await axios.put('http://ec2-3-104-95-118.ap-southeast-2.compute.amazonaws.com:8081/rides/start', {
        rideId: ride.id,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.status === RideStates.IN_PROGRESS) {
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
      const token = await AsyncStorage.getItem('userToken');
      let location = await Location.getCurrentPositionAsync({});
      const response = await axios.put('http://ec2-3-104-95-118.ap-southeast-2.compute.amazonaws.com:8081/rides/end', {
        rideId: ride.id,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.status === RideStates.COMPLETED) {
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
      const token = await AsyncStorage.getItem('userToken');
      let location = await Location.getCurrentPositionAsync({});
      const response = await axios.put('http://ec2-3-104-95-118.ap-southeast-2.compute.amazonaws.com:8081/passenger/start', {
        rideId: ride.id,
        passengerJourneyId: passenger.passengerJourneyId,
        checkinLatitude: location.coords.latitude,
        checkinLongitude: location.coords.longitude
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data === 'Ride Started!') {
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
      const token = await AsyncStorage.getItem('userToken');
      let location = await Location.getCurrentPositionAsync({});
      const response = await axios.put('http://ec2-3-104-95-118.ap-southeast-2.compute.amazonaws.com:8081/passenger/end', {
        rideId: ride.id,
        passengerJourneyId: passenger.passengerJourneyId,
        checkoutLatitude: location.coords.latitude,
        checkoutLongitude: location.coords.longitude
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data === 'Ride Completed!') {
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

  const renderRideDetails = () => (
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
      {rideState === RideStates.COMPLETED && (
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

  const renderPassengerRequests = () => (
    <Box mt={6}>
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        Passenger Requests ({pendingRequests.length})
      </Text>
      {pendingRequests.map((request) => (
        <PassengerRequestCard
          key={request.id}
          request={request}
          onAccept={handleAcceptRequest}
          onReject={handleRejectRequest}
        />
      ))}
    </Box>
  );

  const renderAcceptedPassengers = () => (
    <Box mt={6}>
      <Text fontSize="xl" fontWeight="bold" mb={4}>Accepted Passengers</Text>
      <VStack space="3">
        {acceptedPassengers.map(passenger => (
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
              {rideState === RideStates.IN_PROGRESS && (
                <TouchableOpacity
                  onPress={() => {
                    if (!passenger.checkinStatus) {
                      handleCheckIn(passenger);
                    } else if (!passenger.checkoutStatus) {
                      handleDropPassenger(passenger);
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

  const renderActionButton = () => {
    if (rideState === RideStates.READY_TO_START) {
      return (
        <TouchableOpacity onPress={handleStartRide} style={[styles.mainActionButton, { backgroundColor: '#4CAF50' }]}>
          <Text style={styles.mainActionButtonText}>Start Ride</Text>
        </TouchableOpacity>
      );
    } else if (rideState === RideStates.IN_PROGRESS) {
      return (
        <TouchableOpacity
          onPress={handleEndRide}
          style={[styles.mainActionButton, { backgroundColor: droppedPassengers.length === acceptedPassengers.length ? '#F44336' : '#9E9E9E' }]}
          disabled={droppedPassengers.length !== acceptedPassengers.length}
        >
          <Text style={styles.mainActionButtonText}>End Ride</Text>
        </TouchableOpacity>
      );
    } else if (rideState === RideStates.COMPLETED) {
      return (
        <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.mainActionButton, { backgroundColor: 'black' }]}>
          <Text style={styles.mainActionButtonText}>Back to Home</Text>
        </TouchableOpacity>
      );
    }
    return null;
  };

  const calculateDuration = (startTime, endTime) => {
    if (!startTime || !endTime) return 'N/A';
    const start = new Date(startTime);
    const end = new Date(endTime);
    const durationMs = end - start;
    const minutes = Math.floor(durationMs / 60000);
    return `${minutes} minutes`;
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    const date = new Date(timeString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center">
        <ActivityIndicator size="large" color={theme.colors.primary[500]} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center" p={4}>
        <Text fontSize="lg" color="red.500" textAlign="center">{error}</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.errorButton}>
          <Text style={styles.errorButtonText}>Go Back</Text>
        </TouchableOpacity>
      </Box>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {renderRideDetails()}
      {renderAcceptedPassengers()}
      {pendingRequests.length > 0 && renderPassengerRequests()}
      {renderActionButton()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    padding: 16,
  },
  gradientCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
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
  mainActionButton: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignItems: 'center',
  },
  mainActionButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorButton: {
    marginTop: 20,
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
  },
  errorButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ManageRideScreen;
*/}