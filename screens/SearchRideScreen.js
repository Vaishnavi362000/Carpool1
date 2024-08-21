import React, { useState, useEffect } from 'react';
import { ScrollView, Alert, TouchableOpacity, Platform } from 'react-native';
import { Box, Heading, VStack, Text, HStack, Icon } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import { styles, CustomInput, CustomButton, CarouselItem, RecentSearchItem } from '../components/sharedComponents';
import { Ionicons } from '@expo/vector-icons';
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

const SearchRideScreen = () => {
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropLocation, setDropLocation] = useState('');
  const [pickupCoords, setPickupCoords] = useState(null);
  const [dropCoords, setDropCoords] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [routes, setRoutes] = useState([]);
  const navigation = useNavigation();
  const route = useRoute();

  useEffect(() => {
    const initializeScreen = async () => {
      try {
        await loadRecentSearches();
        await fetchRoutes();
      } catch (error) {
        console.error('Error initializing screen:', error);
      }
    };

    initializeScreen();
  }, []);

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
    if (!pickupLocation || !dropLocation) return;

    const searchEntry = {
      from: pickupLocation,
      to: dropLocation,
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

  const handleSearch = async () => {
    if (!pickupLocation || !dropLocation) {
      Alert.alert('Error', 'Please select both pickup and drop-off locations.');
      return;
    }

    setLoading(true);
    try {
      let pickup = pickupCoords;
      let drop = dropCoords;

      if (!pickup) {
        pickup = await api.getCoordinates(pickupLocation);
        setPickupCoords(pickup);
      }
      if (!drop) {
        drop = await api.getCoordinates(dropLocation);
        setDropCoords(drop);
      }
      
      await saveRecentSearches();
      
      navigation.navigate('RideList', { 
        pickupLocation,
        dropLocation,
        pickupCoords: pickup,
        dropCoords: drop
      });
    } catch (error) {
      console.error('Error getting coordinates:', error);
      Alert.alert('Error', 'Failed to get location coordinates. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRecentSearchSelect = (search) => {
    setPickupLocation(search.from);
    setDropLocation(search.to);
    setPickupCoords(null);
    setDropCoords(null);
  };

  const fetchRoutes = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const fetchedRoutes = await api.getSavedRoutesByPassenger(userId);
      setRoutes(fetchedRoutes);
    } catch (error) {
      console.error('Error fetching routes:', error);
      setRoutes([]);
    }
  };

  const handleRouteSelect = (route) => {
    setPickupLocation(route.source);
    setDropLocation(route.destination);
    setPickupCoords({ lat: route.startLatitude, lng: route.startLongitude });
    setDropCoords({ lat: route.endLatitude, lng: route.endLongitude });
  };

  useEffect(() => {
    if (route.params && route.params.address) {
      if (route.params.isPickup) {
        setPickupLocation(route.params.address);
        setPickupCoords(null);
      } else {
        setDropLocation(route.params.address);
        setDropCoords(null);
      }
    }
  }, [route.params]);

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={[
        styles.scrollContainer,
        { paddingBottom: Platform.OS === 'ios' ? 90 : 70 }  
      ]}
    >
      <Box>
        <Heading style={styles.heading}>Search a Ride</Heading>
        <VStack space={4}>
          <TouchableOpacity onPress={() => navigation.navigate('SelectLocation', { isPickup: true, onSelect: setPickupLocation })}>
            <CustomInput
              label="Pickup Location"
              value={pickupLocation}
              placeholder="Select pickup location"
              icon="location-outline"
              editable={false}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('SelectLocation', { isPickup: false, onSelect: setDropLocation })}>
            <CustomInput
              label="Drop Location"
              value={dropLocation}
              placeholder="Select drop location"
              icon="location-outline"
              editable={false}
            />
          </TouchableOpacity>
          <CustomButton
            title="Search Ride"
            onPress={handleSearch}
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

      {Array.isArray(routes) && routes.length > 0 && (
        <Box mt={6}>
          <HStack justifyContent="space-between" alignItems="center" mb={2}>
            <Text fontWeight="bold" fontSize="lg" color="black">Saved Routes</Text>
          </HStack>
          {routes.map((route, index) => (
            <RouteItem key={index} route={route} onPress={() => handleRouteSelect(route)} />
          ))}
        </Box>
      )}

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
    </ScrollView>
  );
};

export default SearchRideScreen;