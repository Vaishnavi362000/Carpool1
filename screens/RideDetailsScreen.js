import React from 'react';
import { StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Box, Text, HStack, Icon, Button, useToast, Pressable } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RideCard, DriverCard, ActionCard } from '../components/RideComponents';
import { useRideDetails } from '../hooks/useRideDetails';
import RideActions from '../components/RideActions';
import SimpleTabBar from '../components/SimpleTabBar';

const RideDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { rideId } = route.params;
  const toast = useToast();

  const {
    rideDetails,
    loading,
    error,
    rideState,
    currentPassengerId,
    fetchRideDetails
  } = useRideDetails(rideId);

  const {
    joinRide,
    cancelRequest,
    startRide,
    endRide,
    callDriver,
    messageDriver
  } = RideActions(rideId, currentPassengerId, toast);

  

  if (loading) return <LoadingIndicator />;
  if (error) return <ErrorDisplay error={error} onRetry={fetchRideDetails} />;

  return (
    <Box flex={1} bg="coolGray.50" safeArea>
      <Header title="Ride Details" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <RideCard rideDetails={rideDetails} />
        <DriverCard driverDetails={rideDetails.driverDetails} vehicleDetails={rideDetails.vehicleDto} />
        <ActionCard
          rideState={rideState}
          rideDetails={rideDetails}
          onJoinRide={joinRide}
          onCancelRequest={cancelRequest}
          onStartRide={startRide}
          onEndRide={endRide}
          onCallDriver={callDriver}
          onMessageDriver={messageDriver}
        />
      </ScrollView>
      <SimpleTabBar navigation={navigation} currentTab="Rides" />
    </Box>
  );
};

const LoadingIndicator = () => (
  <Box flex={1} justifyContent="center" alignItems="center">
    <ActivityIndicator size="large" color="#000000" />
  </Box>
);

const ErrorDisplay = ({ error, onRetry }) => (
  <Box flex={1} justifyContent="center" alignItems="center" p={4}>
    <Text fontSize="lg" color="red.500" textAlign="center">{error}</Text>
    <Button mt={4} onPress={onRetry}>Try Again</Button>
  </Box>
);

const Header = ({ title, onBack }) => (
  <Box py="4" px="4">
    <HStack alignItems="center" justifyContent="space-between">
      <Pressable onPress={onBack}>
        <Icon as={Ionicons} name="arrow-back" size="md" color="black" />
      </Pressable>
      <Text fontSize="lg" fontWeight="semibold" color="black">{title}</Text>
      <Box width={8} />
    </HStack>
  </Box>
);

const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
  },
});

export default RideDetailsScreen;


{/*
import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Dimensions, Animated, ScrollView, ActivityIndicator, Linking } from 'react-native';
import { Box, Text, VStack, HStack, Avatar, Icon, Button, Input, useTheme, Pressable, Progress, useToast } from 'native-base';
import { MaterialIcons, Ionicons, FontAwesome5, Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import * as api from '../components/api';

const { width } = Dimensions.get('window');

const RideStates = {
  NOT_JOINED: 'NOT_JOINED',
  JOINING: 'JOINING',
  JOINED: 'JOINED',
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  DRIVER_ARRIVING: 'DRIVER_ARRIVING',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED'
};

const RideDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { rideId } = route.params;
  const [rideState, setRideState] = useState(RideStates.NOT_JOINED);
  const [otp, setOtp] = useState('');
  const [rideDetails, setRideDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [joiningRide, setJoiningRide] = useState(false);
  const [requestStatus, setRequestStatus] = useState(null);
  const theme = useTheme();
  const toast = useToast();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [currentPassengerId, setCurrentPassengerId] = useState(null);


  useEffect(() => {
    fetchRideDetails();
  }, []);

  useEffect(() => {
    if (rideDetails && rideDetails.status === "Scheduled") {
      checkRideRequest();
    }
  }, [rideDetails]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    if (rideState === RideStates.JOINING) {
      setTimeout(() => setRideState(RideStates.JOINED), 3000);
    } else if (rideState === RideStates.JOINED) {
      setTimeout(() => setRideState(RideStates.ARRIVING), 2000);
    } else if (rideState === RideStates.ARRIVING) {
      setTimeout(() => setRideState(RideStates.ARRIVED), 5000);
    }

    return () => fadeAnim.setValue(0);
  }, [rideState]);

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
            setRideState(RideStates.ACCEPTED);
          } else if (userRequest.status === 'PENDING') {
            setRideState(RideStates.PENDING);
          }
        } else {
          setRideState(RideStates.NOT_JOINED);
        }
      } catch (requestError) {
        if (requestError.response && requestError.response.status === 400) {
          // Handle 400 Bad Request silently
          console.log('No ride requests available');
          setRideState(RideStates.NOT_JOINED);
        } else {
          throw requestError; // Re-throw other errors to be caught by the outer catch block
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


  const checkRideRequest = async () => {
    if (rideDetails.status !== "Scheduled") {
      return;
    }

    try {
      const passengerId = await AsyncStorage.getItem('passengerId');
      const response = await api.getRideRequests(rideId);

      const userRequest = response.find(request => 
        request.passengerId.toString() === passengerId || 
        request.rideDto.passengers.some(p => p.passengerId.toString() === passengerId)
      );

      if (userRequest) {
        setRequestStatus(userRequest.status);
        if (userRequest.status === 'PENDING') {
          setRideState(RideStates.PENDING);
        } else if (userRequest.status === 'Accepted') {
          setRideState(RideStates.ACCEPTED);
        }
      }
    } catch (error) {
      console.error('Error checking ride request:', error);
    }
  };

  const joinRide = async () => {
    setJoiningRide(true);
    try {
      await api.joinRide(currentPassengerId, rideId);
      setRideState(RideStates.PENDING);
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
      const passengerId = await AsyncStorage.getItem('passengerId');
      const response = await api.cancelRideRequest(passengerId, rideId);

      if (response) {
        setRideState(RideStates.NOT_JOINED);
        setRequestStatus(null);
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

  const startRide = async () => {
    try {
      const passengerId = await AsyncStorage.getItem('passengerId');
      const response = await api.startRide1(rideId, passengerId, otp);

      if (response) {
        setRideState(RideStates.IN_PROGRESS);
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
      const passengerId = await AsyncStorage.getItem('passengerId');
      const response = await api.endRide1(rideId, passengerId);

      if (response) {
        setRideState(RideStates.COMPLETED);
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

  const callDriver = () => {
    if (rideDetails && rideDetails.driverDetails && rideDetails.driverDetails.driverPhone) {
      Linking.openURL(`tel:${rideDetails.driverDetails.driverPhone}`);
    } else {
      toast.show({
        title: "Unable to Call",
        status: "error",
        description: "Driver's phone number is not available.",
        placement: "top"
      });
    }
  };

  const messageDriver = () => {
    if (rideDetails && rideDetails.driverDetails && rideDetails.driverDetails.driverPhone) {
      Linking.openURL(`sms:${rideDetails.driverDetails.driverPhone}`);
    } else {
      toast.show({
        title: "Unable to Message",
        status: "error",
        description: "Driver's phone number is not available.",
        placement: "top"
      });
    }
  };

  const renderMainCard = () => (
    <LinearGradient
      colors={['#1a1a1a', '#2a2a2a']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ borderRadius: 12, padding: 24, marginBottom: 16 }}
    >
      <HStack justifyContent="space-between" alignItems="center" mb="4">
        <VStack flex={1}>
          <Text color="gray.400" fontSize="xs" fontWeight="medium">FROM</Text>
          <Text color="white" fontSize="md" fontWeight="bold" numberOfLines={1} ellipsizeMode="tail">
            {rideDetails.source.split(',')[0]}
          </Text>
        </VStack>
        <Icon as={MaterialIcons} name="arrow-forward" size="md" color="white" mx={2} />
        <VStack flex={1}>
          <Text color="gray.400" fontSize="xs" fontWeight="medium">TO</Text>
          <Text color="white" fontSize="md" fontWeight="bold" numberOfLines={1} ellipsizeMode="tail">
            {rideDetails.destination.split(',')[0]}
          </Text>
        </VStack>
      </HStack>
      <HStack justifyContent="space-between">
        <VStack>
          <Text color="gray.400" fontSize="xs" fontWeight="medium">DATE</Text>
          <Text color="white" fontSize="md" fontWeight="semibold">
            {new Date(rideDetails.rideDate).toLocaleDateString()}
          </Text>
        </VStack>
        <VStack>
          <Text color="gray.400" fontSize="xs" fontWeight="medium">DURATION</Text>
          <Text color="white" fontSize="md" fontWeight="semibold">
            {rideDetails.durationInMinutes ? `${rideDetails.durationInMinutes} min` : 'N/A'}
          </Text>
        </VStack>
        <VStack>
          <Text color="gray.400" fontSize="xs" fontWeight="medium">STATUS</Text>
          <Text color="white" fontSize="md" fontWeight="semibold">
            {rideDetails.status || 'Not Started'}
          </Text>
        </VStack>
      </HStack>
    </LinearGradient>
  );

  const renderDriverCard = () => (
    <Box bg="white" rounded="xl" p="6" shadow="2" mb="4">
      <HStack alignItems="center" space="4">
        <Avatar size="lg" source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }}>
          {rideDetails.vehicleDto.riderFirstName?.charAt(0) || 'D'}
        </Avatar>
        <VStack>
          <Text fontSize="lg" fontWeight="bold" color="black">
            {rideDetails.vehicleDto.riderFirstName || 'Driver'} {rideDetails.vehicleDto.riderLastName || ''}
          </Text>
          <HStack alignItems="center">
            <Icon as={Ionicons} name="star" size="sm" color="yellow.400" />
            <Text fontSize="md" color="coolGray.600" ml="1">{rideDetails.rating || 'N/A'}</Text>
          </HStack>
        </VStack>
      </HStack>
      <HStack mt="4" justifyContent="space-between">
        <VStack>
          <Text fontSize="sm" color="coolGray.400" fontWeight="medium">VEHICLE NUMBER</Text>
          <Text fontSize="md" fontWeight="semibold" color="black">{rideDetails.vehicleDto.vehicleNumber}</Text>
        </VStack>
        <VStack>
          <Text fontSize="sm" color="coolGray.400" fontWeight="medium">LICENSE</Text>
          <Text fontSize="md" fontWeight="semibold" color="black">{rideDetails.vehicleDto.drivingLicense}</Text>
        </VStack>
      </HStack>
    </Box>
  );

  const renderActionCard = () => {
    switch (rideState) {
      case RideStates.NOT_JOINED:
        return (
          <Animated.View style={{ opacity: fadeAnim }}>
            <Box bg="white" rounded="xl" p="6" shadow="2" mb="4">
              <HStack alignItems="center" mb="4">
                <Icon as={Feather} name="zap" size="6" color="green.500" mr="2" />
                <Text fontSize="lg" fontWeight="bold" color="black">Eco-Friendly Ride</Text>
              </HStack>
              <Text fontSize="md" color="coolGray.600" mb="4">Join this ride to save 2.5 kg of CO2</Text>
              <Button
                onPress={joinRide}
                isLoading={joiningRide}
                isLoadingText="Sending Request..."
                bg="black"
                _text={{ color: 'white', fontWeight: 'bold' }}
                rounded="full"
              >
                Request to Join
              </Button>
            </Box>
          </Animated.View>
        );
      case RideStates.PENDING:
        return (
          <Animated.View style={{ opacity: fadeAnim }}>
            <Box bg="white" rounded="xl" p="6" shadow="2" mb="4">
              <HStack alignItems="center" mb="4">
                <Icon as={Feather} name="clock" size="6" color="orange.500" mr="2" />
                <Text fontSize="lg" fontWeight="bold" color="black">Request Pending</Text>
              </HStack>
              <Text fontSize="md" color="coolGray.600" mb="4">Your request to join this ride is pending approval.</Text>
              <Button
                onPress={cancelRequest}
                bg="gray.400"
                _text={{ color: 'white', fontWeight: 'bold' }}
                rounded="full"
              >
                Cancel Request
              </Button>
            </Box>
          </Animated.View>
        );
      case RideStates.ACCEPTED:
        return (
          <Animated.View style={{ opacity: fadeAnim }}>
            <Box bg="white" rounded="xl" p="6" shadow="2" mb="4">
              <HStack alignItems="center" mb="4">
                <Icon as={Feather} name="check-circle" size="6" color="green.500" mr="2" />
                <Text fontSize="lg" fontWeight="bold" color="black">Request Accepted</Text>
              </HStack>
              <Text fontSize="md" color="coolGray.600" mb="4">Your request to join this ride has been accepted!</Text>
              <HStack space="4">
                <Button
                  onPress={callDriver}
                  leftIcon={<Icon as={Ionicons} name="call" size="sm" color="white" />}
                  bg="black"
                  _text={{ color: 'white' }}
                  rounded="full"
                  flex={1}
                >
                  Call
                </Button>
                <Button
                  onPress={messageDriver}
                  leftIcon={<Icon as={Ionicons} name="chatbubble" size="sm" color="black" />}
                  bg="coolGray.100"
                  _text={{ color: 'black' }}
                  rounded="full"
                  flex={1}
                >
                  Message
                </Button>
              </HStack>
            </Box>
          </Animated.View>
        );
      case RideStates.JOINED:
      case RideStates.ARRIVING:
        return (
          <Animated.View style={{ opacity: fadeAnim }}>
            <Box bg="white" rounded="xl" p="6" shadow="2" mb="4">
              <Text fontSize="lg" fontWeight="bold" color="black" mb="2">
                {rideState === RideStates.ARRIVING ? "Your ride is almost here!" : "Driver is on the way"}
              </Text>
              <Progress value={rideState === RideStates.ARRIVING ? 80 : 20} colorScheme="gray" mb="4" />
              <HStack space="4">
                <Button
                  onPress={callDriver}
                  leftIcon={<Icon as={Ionicons} name="call" size="sm" color="white" />}
                  bg="black"
                  _text={{ color: 'white' }}
                  rounded="full"
                  flex={1}
                >
                  Call
                </Button>
                <Button
                  onPress={messageDriver}
                  leftIcon={<Icon as={Ionicons} name="chatbubble" size="sm" color="black" />}
                  bg="coolGray.100"
                  _text={{ color: 'black' }}
                  rounded="full"
                  flex={1}
                >
                  Message
                </Button>
              </HStack>
            </Box>
          </Animated.View>
        );
      case RideStates.ARRIVED:
        return (
          <Animated.View style={{ opacity: fadeAnim }}>
            <Box bg="white" rounded="xl" p="6" shadow="2" mb="4">
              <Text fontSize="lg" fontWeight="bold" color="black" mb="4">Your ride has arrived!</Text>
              <Input
                value={otp}
                onChangeText={setOtp}
                keyboardType="number-pad"
                maxLength={4}
                placeholder="Enter 4-digit OTP"
                fontSize="xl"
                textAlign="center"
                bg="coolGray.100"
                mb="4"
              />
              <Button
                onPress={startRide}
                bg="black"
                _text={{ color: 'white', fontWeight: 'bold' }}
                rounded="full"
              >
                Start Ride
              </Button>
            </Box>
          </Animated.View>
        );
        case RideStates.DRIVER_ARRIVING:
          return (
            <Animated.View style={{ opacity: fadeAnim }}>
              <Box bg="white" rounded="xl" p="6" shadow="2" mb="4">
                <Text fontSize="lg" fontWeight="bold" color="black" mb="2">Driver is on the way!</Text>
                <Progress value={30} colorScheme="blue" mb="4" />
                <Text fontSize="md" color="coolGray.600" mb="4">
                  Your driver has started the ride and is coming to pick you up. Please be ready at your pickup location.
                </Text>
                <Text fontSize="sm" color="coolGray.500" mb="4">
                  Ride started at: {new Date(rideDetails.rideStartTime).toLocaleTimeString()}
                </Text>
                <HStack space="4">
                  <Button
                    onPress={callDriver}
                    leftIcon={<Icon as={Ionicons} name="call" size="sm" color="white" />}
                    bg="black"
                    _text={{ color: 'white' }}
                    rounded="full"
                    flex={1}
                  >
                    Call Driver
                  </Button>
                  <Button
                    onPress={messageDriver}
                    leftIcon={<Icon as={Ionicons} name="chatbubble" size="sm" color="black" />}
                    bg="coolGray.100"
                    _text={{ color: 'black' }}
                    rounded="full"
                    flex={1}
                  >
                    Message
                  </Button>
                </HStack>
              </Box>
            </Animated.View>
          );
        case RideStates.IN_PROGRESS:
          return (
            <Animated.View style={{ opacity: fadeAnim }}>
              <Box bg="white" rounded="xl" p="6" shadow="2" mb="4">
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
                  onPress={callDriver}
                  leftIcon={<Icon as={Ionicons} name="call" size="sm" color="white" />}
                  bg="black"
                  _text={{ color: 'white' }}
                  rounded="full"
                  mt="4"
                >
                  Contact Driver
                </Button>
              </Box>
            </Animated.View>
          );
          case RideStates.COMPLETED:
            return (
              <Animated.View style={{ opacity: fadeAnim }}>
                <Box bg="white" rounded="xl" p="6" shadow="2" mb="4">
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
                  <HStack justifyContent="space-between" mb="4">
                    <VStack alignItems="center">
                      <Text fontSize="sm" color="coolGray.400" fontWeight="medium">FROM</Text>
                      <Text fontSize="md" fontWeight="semibold" color="black">{rideDetails.source}</Text>
                    </VStack>
                    <VStack alignItems="center">
                      <Text fontSize="sm" color="coolGray.400" fontWeight="medium">TO</Text>
                      <Text fontSize="md" fontWeight="semibold" color="black">{rideDetails.destination}</Text>
                    </VStack>
                  </HStack>
                  <Button
                    onPress={() => navigation.navigate('RateRide', { rideId: rideDetails.id })}
                    bg="black"
                    _text={{ color: 'white', fontWeight: 'bold' }}
                    rounded="full"
                    mt="4"
                  >
                    Rate Your Ride
                  </Button>
                </Box>
              </Animated.View>
            );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center">
        <ActivityIndicator size="large" color="#000000" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center" p={4}>
        <Text fontSize="lg" color="red.500" textAlign="center">{error}</Text>
        <Button mt={4} onPress={fetchRideDetails}>Try Again</Button>
      </Box>
    );
  }

  return (
    <Box flex={1} bg="coolGray.50" safeArea>
      <Box py="4" px="4">
        <HStack alignItems="center" justifyContent="space-between">
          <Pressable onPress={() => navigation.goBack()}>
            <Icon as={Ionicons} name="arrow-back" size="md" color="black" />
          </Pressable>
          <Text fontSize="lg" fontWeight="semibold" color="black">Ride Details</Text>
          <Box width={8} /> 
        </HStack>
      </Box>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {renderMainCard()}
        {renderDriverCard()}
        {renderActionCard()}
      </ScrollView>
    </Box>
  );
};

 
const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
  },
});

export default RideDetailsScreen;
*/}