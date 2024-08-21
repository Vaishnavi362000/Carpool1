import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Dimensions, FlatList, RefreshControl, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Box, Text, VStack, HStack, Button, useTheme, Pressable, Icon, Avatar } from 'native-base';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import RideCard from '../components/RideCard';
import * as api from '../components/api';
import SimpleTabBar from '../components/SimpleTabBar';

const { width } = Dimensions.get('window');


const RideListScreen = () => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [rideRequests, setRideRequests] = useState({});
  const navigation = useNavigation();
  const route = useRoute();
  const { pickupLocation, dropLocation, pickupCoords } = route.params;
  const theme = useTheme();

  const fetchRides = useCallback(async () => {
    setLoading(true);
    try {
      const passengerId = await AsyncStorage.getItem('passengerId');
      const ridesArray = await api.searchRides(pickupCoords.lat, pickupCoords.lng);

      // Filter and sort rides
      const filteredAndSortedRides = ridesArray
        .filter(ride => ride.status !== 'Completed' && new Date(ride.rideDate) >= new Date('2024-07-29'))
        .sort((a, b) => new Date(b.rideDate) - new Date(a.rideDate));

      setRides(filteredAndSortedRides);
      
      // Fetch ride requests for each ride
      const requests = {};
      for (const ride of filteredAndSortedRides) {
        const requestResponse = await api.getRideRequests(ride.id);
        const userRequest = requestResponse.data.find(request => request.passengerId.toString() === passengerId);
        if (userRequest) {
          requests[ride.id] = userRequest.status;
        }
      }
      setRideRequests(requests);
      
      setError(null);
    } catch (error) {
      console.error('Error fetching rides:', error);
      setError(error.response?.data?.message || 'Failed to fetch rides. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [pickupCoords]);

  useEffect(() => {
    fetchRides();
  }, [fetchRides]);

  useFocusEffect(
    useCallback(() => {
      fetchRides();
    }, [fetchRides])
  );

  const handleRidePress = (ride) => {
    navigation.navigate('RideDetails', { rideId: ride.id });
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchRides();
  }, [fetchRides]);

  const renderRideItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleRidePress(item)}>
      <RideCard data={item} onPress={() => handleRidePress(item)} />
      {rideRequests[item.id] && (
        <Box bg="gray.800" p={2} rounded="md" mt={2}>
          <Text fontSize="sm" color="white" textAlign="center">
            Request Status: <Text fontWeight="bold">{rideRequests[item.id]}</Text>
          </Text>
        </Box>
      )}
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <Box mb={6}>
      <HStack alignItems="center" mb={4}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon as={Ionicons} name="arrow-back" size="md" color="black" />
        </TouchableOpacity>
        <Text fontSize="3xl" fontWeight="bold" color="coolGray.800" ml={4}>
          Available Rides
        </Text>
      </HStack>
      <Text fontSize="md" color="coolGray.600" numberOfLines={1} ellipsizeMode="tail">
        {pickupLocation.split(',')[0]} → {dropLocation.split(',')[0]}
      </Text>
    </Box>
  );

  const renderDateHeader = ({ item }) => (
    <Box py={2} px={4} bg="coolGray.100" mb={2} rounded="md">
      <Text fontWeight="bold" color="coolGray.800">
        {new Date(item.rideDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
      </Text>
    </Box>
  );

  if (loading && !refreshing) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center" bg="white">
        <ActivityIndicator size="large" color={theme.colors.black} />
      </Box>
    );
  }

  return (
    <>
    <Box flex={1} bg="white" safeArea>
      <FlatList
        ListHeaderComponent={renderHeader}
        data={rides}
        renderItem={renderRideItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            colors={[theme.colors.black]}
            tintColor={theme.colors.black}
          />
        }
        ListEmptyComponent={
          <Box alignItems="center" justifyContent="center" height={300}>
            <Icon as={Ionicons} name="car-sport-outline" size="6xl" color="coolGray.300" />
            <Text fontSize="xl" fontWeight="bold" color="coolGray.800" mt={4}>
              No rides available
            </Text>
            <Text fontSize="md" color="coolGray.500" textAlign="center" mt={2} px={4}>
              Try adjusting your search or check back later for new rides.
            </Text>
          </Box>
        }
        stickyHeaderIndices={[]}
        sections={rides.reduce((acc, ride) => {
          const date = ride.rideDate;
          if (!acc[date]) {
            acc[date] = [];
          }
          acc[date].push(ride);
          return acc;
        }, {})}
        renderSectionHeader={renderDateHeader}
      />
    </Box>
    <SimpleTabBar navigation={navigation} currentTab="Rides" />
    </>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 20,
  },
});

export default RideListScreen;