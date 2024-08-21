import React, { useState, useEffect } from 'react';
import { ScrollView, Alert, TouchableOpacity, Platform } from 'react-native';
import { Box, Heading, VStack, Text, HStack, Toast, Icon, Actionsheet, useDisclose } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import { styles, CustomInput, CustomButton, CarouselItem, RecentSearchItem } from '../components/sharedComponents';
import TimePickerModal from './TimePickerModal';
import { format, parse } from 'date-fns';
import * as api from '../components/api';

const carouselItems = [
  {
    title: "COVID-19: Show solidarity & travel safe",
    text: "See our recommendations",
    icon: "alert-circle-outline",
  },
  {
    title: "New Ride Offers Available",
    text: "Check out the latest offers",
    icon: "car-outline",
  },
  {
    title: "Refer & Earn",
    text: "Invite friends and earn rewards",
    icon: "gift-outline",
  },
];

const OfferRideScreen = () => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [fromCoords, setFromCoords] = useState(null);
  const [toCoords, setToCoords] = useState(null);
  const [time, setTime] = useState('');
  const [driverId, setDriverId] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const navigation = useNavigation();
  const route = useRoute();
  const { isOpen, onOpen, onClose } = useDisclose();
  const [selectedTime, setSelectedTime] = useState(format(new Date(), 'HH:mm'));
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);
  const [seats, setSeats] = useState(1);
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    const checkProfile = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        const driverId = await AsyncStorage.getItem('driverId');
  
        setDriverId(driverId);
  
        const vehicleResponse = await api.getVehiclesByDriver(driverId);
  
        if (!vehicleResponse.length) {
          navigation.navigate('AddVehicle');
        } else {
          setVehicles(vehicleResponse);
          const defaultVehicle = vehicleResponse.find(vehicle => vehicle.isDefault);
          setSelectedVehicle(defaultVehicle || vehicleResponse[0]);
        }
      } catch (error) {
        console.error('Error checking profile:', error);
        Alert.alert('Error', 'Failed to load profile information. Please try again.');
      }
    };
  
    checkProfile();
    loadRecentSearches();
    setSelectedTime(format(new Date(), 'HH:mm'));
    fetchRoutes();
  }, [navigation]);

  useEffect(() => {
    if (route.params && route.params.address) {
      if (route.params.isFrom) {
        setFrom(route.params.address);
        setFromCoords({
          latitude: route.params.latitude,
          longitude: route.params.longitude
        });
      } else {
        setTo(route.params.address);
        setToCoords({
          latitude: route.params.latitude,
          longitude: route.params.longitude
        });
      }
    }
  }, [route.params]);

  const loadRecentSearches = async () => {
    try {
      const searches = await AsyncStorage.getItem('recentSearches');
      if (searches) {
        const parsedSearches = JSON.parse(searches);
        const validSearches = parsedSearches.filter(search => search.from && search.to);
        setRecentSearches(validSearches);
      }
    } catch (error) {
      console.error('Error loading recent searches:', error);
    }
  };

  const saveRecentSearches = async () => {
    if (!from || !to) return;

    const searchEntry = {
      from: from,
      to: to,
      time: new Date().toLocaleString(),
    };

    try {
      let searches = recentSearches.filter(search =>
        !(search.from === searchEntry.from && search.to === searchEntry.to)
      );
      searches.unshift(searchEntry);
      if (searches.length > 3) {
        searches = searches.slice(0, 3);
      }
      setRecentSearches(searches);
      await AsyncStorage.setItem('recentSearches', JSON.stringify(searches));
    } catch (error) {
      console.error('Error saving recent searches:', error);
    }
  };

  const handleRecentSearchSelect = (search) => {
    setFrom(search.from);
    setTo(search.to);
    setFromCoords(null);
    setToCoords(null);
  };

  const formatTime = (time) => {
    if (!time) {
      console.error('Time is undefined or null');
      return '00:00:00';  
    }
    const [hours, minutes] = time.split(':');
    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:00`;
  };

  const fetchRoutes = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const routes = await api.getSavedRoutesByPassenger(userId);
      setRoutes(routes);
    } catch (error) {
      console.error('Error fetching routes:', error);
      setRoutes([]);
    }
  };

  const handleOfferRide = async () => {
    if (!from || !to || !selectedTime || !selectedVehicle) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
  
    setLoading(true);
    try {
      let fromCoordinates = fromCoords;
      let toCoordinates = toCoords;
  
      if (!fromCoordinates) {
        fromCoordinates = await api.getCoordinates(from);
        setFromCoords(fromCoordinates);
      }
      if (!toCoordinates) {
        toCoordinates = await api.getCoordinates(to);
        setToCoords(toCoordinates);
      }
  
      console.log('From coordinates:', fromCoordinates);
      console.log('To coordinates:', toCoordinates);
  
      if (!fromCoordinates || !toCoordinates) {
        Toast.show({
          title: 'Error',
          description: 'Failed to get location coordinates. Please try again.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        setLoading(false);
        return;
      }
  
      const formattedStartTime = format(parse(selectedTime, 'HH:mm', new Date()), 'HH:mm:ss');
      console.log('Formatted start time:', formattedStartTime);
  
      const rideData = {
        source: from,
        sourceLatitude: fromCoordinates.lat,
        sourceLongitude: fromCoordinates.lng,
        destination: to,
        destinationLatitude: toCoordinates.lat,
        destinationLongitude: toCoordinates.lng,
        rideDate: new Date().toISOString().split('T')[0],
        rideScheduledStartTime: formattedStartTime,
        rideScheduledEndTime: calculateEndTime(formattedStartTime),
        driverDetails: {
          id: driverId,
        },
        vehicleDto: {
          id: selectedVehicle.id,
        },
      };

      const response = await api.offerRide(rideData);
  
      await saveRecentSearches();
  
      if (response) {
        navigation.navigate('RideHistory', { initialTab: 1 });
      } else {
        Alert.alert('Error', 'Failed to offer ride. Please try again.');
      }
    } catch (error) {
      console.error('Error offering ride:', error);
      Alert.alert('Error', 'Failed to offer ride. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const calculateEndTime = (startTime) => {
    const [hours, minutes] = startTime.split(':');
    let endHours = parseInt(hours) + 1;
    if (endHours >= 24) endHours -= 24;
    return `${endHours.toString().padStart(2, '0')}:${minutes}:00`;
  };

  const handleVehicleSelect = (vehicle) => {
    setSelectedVehicle(vehicle);
    onClose();
  };

  const RouteItem = ({ route, onPress }) => (
    <TouchableOpacity onPress={onPress}>
      <HStack 
        bg="white" 
        borderRadius="md" 
        shadow={1} 
        p={4} 
        mb={3} 
        alignItems="center" 
        justifyContent="space-between"
      >
        <HStack space={3} alignItems="center" flex={1}>
          <Icon as={Ionicons} name="location-outline" size="sm" color="gray.500" />
          <VStack flex={1}>
            <Text fontSize="md" fontWeight="bold" numberOfLines={1} ellipsizeMode="tail">
              {route.source.split(',')[0]} → {route.destination.split(',')[0]}
            </Text>
            <Text fontSize="xs" color="gray.500" numberOfLines={1} ellipsizeMode="tail">
              {route.source} → {route.destination}
            </Text>
          </VStack>
        </HStack>
        <Icon as={Ionicons} name="chevron-forward-outline" size="sm" color="gray.400" />
      </HStack>
    </TouchableOpacity>
  );

  const handleRouteSelect = (route) => {
    setFrom(route.source);
    setTo(route.destination);
    setFromCoords({ lat: route.startLatitude, lng: route.startLongitude });
    setToCoords({ lat: route.endLatitude, lng: route.endLongitude });
  };

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={[
        styles.scrollContent,
        { paddingBottom: Platform.OS === 'ios' ? 90 : 70 }  
      ]}
    >
      <Box>
        <Heading style={styles.heading}>Offer a Ride</Heading>
        <VStack space={4}>
          <TouchableOpacity onPress={() => navigation.navigate('SelectLocation', { isPickup: true, onSelect: setFrom })}>
            <CustomInput
              label="From"
              value={from}
              placeholder="Enter starting location"
              icon="location-outline"
              editable={false}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('SelectLocation', { isPickup: false, onSelect: setTo })}>
            <CustomInput
              label="To"
              value={to}
              placeholder="Enter destination"
              icon="location-outline"
              editable={false}
            />
          </TouchableOpacity>
          <HStack space={4} alignItems="center">
            <Box flex={1}>
              <TouchableOpacity onPress={() => setIsTimePickerOpen(true)}>
                <CustomInput
                  label="Time"
                  value={selectedTime ? format(parse(selectedTime, 'HH:mm', new Date()), 'hh:mm a') : ''}
                  placeholder="Select time"
                  icon="time-outline"
                  editable={false}
                />
              </TouchableOpacity>
            </Box>
            <Box flex={1}>
              <CustomInput
                label="Seats"
                value={seats.toString()}
                placeholder="Select seats"
                icon="people-outline"
                editable={false}
                InputRightElement={
                  <HStack space={2} mr={2}>
                    <TouchableOpacity onPress={() => setSeats(prev => Math.max(1, prev - 1))}>
                      <Icon as={Ionicons} name="remove-circle-outline" size="sm" color="coolGray.400" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setSeats(prev => Math.min(4, prev + 1))}>
                      <Icon as={Ionicons} name="add-circle-outline" size="sm" color="coolGray.400" />
                    </TouchableOpacity>
                  </HStack>
                }
              />
            </Box>
          </HStack>
          <TouchableOpacity onPress={onOpen}>
            <CustomInput
              label="Vehicle"
              value={selectedVehicle ? `${selectedVehicle.make} ${selectedVehicle.model}` : 'Select vehicle'}
              placeholder="Select vehicle"
              icon="car-outline"
              editable={false}
            />
          </TouchableOpacity>
          <CustomButton
            title="Offer Ride"
            onPress={handleOfferRide}
            isLoading={loading}
          />
        </VStack>
      </Box>

      <Box mt={6}>
        <Text fontWeight="bold" fontSize="lg" color="black" mb={2}>Promotions</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {carouselItems.map((item, index) => (
            <CarouselItem key={index} item={item} />
          ))}
        </ScrollView>
      </Box>

      {recentSearches.length > 0 && (
        <Box mt={6}>
          <HStack justifyContent="space-between" alignItems="center" mb={2}>
            <Text fontWeight="bold" fontSize="lg" color="black">Recent Searches</Text>
          </HStack>
          {recentSearches.map((search, index) => (
            <RecentSearchItem
              key={index}
              search={search}
              onPress={() => handleRecentSearchSelect(search)}
            />
          ))}
        </Box>
      )}

      {Array.isArray(routes) && routes.length > 0 && (
        <Box mt={6}>
          <HStack justifyContent="space-between" alignItems="center" mb={2}>
            <Text fontWeight="bold" fontSize="lg" color="black">Saved Routes</Text>
          </HStack>
          {routes.map((route, index) => (
            <RouteItem
              key={index}
              route={route}
              onPress={() => handleRouteSelect(route)}
            />
          ))}
        </Box>
      )}

      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content>
          <Box w="100%" h={60} px={4} justifyContent="center">
            <Text fontSize="16" color="gray.500" _dark={{
              color: "gray.300"
            }}>
              Select a Vehicle
            </Text>
          </Box>
          {vehicles.map((vehicle) => (
            <Actionsheet.Item
              key={vehicle.id}
              startIcon={<Icon as={MaterialIcons} size="6" name="directions-car" />}
              onPress={() => handleVehicleSelect(vehicle)}
              >
              {`${vehicle.make} ${vehicle.model} (${vehicle.year})`}
              {vehicle.isDefault && (
                <Text fontSize="xs" color="gray.500"> (Default)</Text>
              )}
            </Actionsheet.Item>
          ))}
        </Actionsheet.Content>
      </Actionsheet>

      <TimePickerModal
        isOpen={isTimePickerOpen}
        onClose={() => setIsTimePickerOpen(false)}
        onSelect={(time) => {
          setSelectedTime(time);
          setIsTimePickerOpen(false);
        }}
        initialTime={selectedTime}
        is24Hour={true}
      />
    </ScrollView>
  );
};

export default OfferRideScreen;