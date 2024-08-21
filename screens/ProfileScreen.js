import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Box, VStack, HStack, Text, Icon, Pressable } from 'native-base';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const username = await AsyncStorage.getItem('username');
      const response = await axios.get(`http://ec2-3-104-95-118.ap-southeast-2.compute.amazonaws.com:8081/user/manage/get?username=${username}`);
      setUserData(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove([
        'username',
        'userToken',
        'driverId',
        'passengerId',
        'userId'
      ]);
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  if (!userData) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center" bg="white">
        <Text fontSize="lg" fontWeight="bold" color="black">Loading...</Text>
      </Box>
    );
  }

  const getInitials = () => {
    const firstInitial = userData.firstName ? userData.firstName[0] : '';
    const lastInitial = userData.lastName ? userData.lastName[0] : '';
    return (firstInitial + lastInitial).toUpperCase() || 'U';
  };

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return 'N/A';
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const renderInfoItem = (icon, label, value) => (
    <VStack alignItems="center" flex={1}>
      <Icon as={Feather} name={icon} size={5} color="black" mb={1} />
      <Text fontSize="xs" fontWeight="medium" color="gray.500" textAlign="center">{label}</Text>
      <Text fontSize="sm" fontWeight="semibold" color="gray.800" textAlign="center">{value || 'Not provided'}</Text>
    </VStack>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Box style={styles.profileCard}>
        <HStack space={4} alignItems="center" mb={6}>
          <Box style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitials()}</Text>
          </Box>
          <VStack>
            <Text style={styles.userName}>
              {userData.firstName || ''} {userData.lastName || ''}
            </Text>
           </VStack>
        </HStack>

        <VStack space={4}>
          <HStack justifyContent="space-between">
            {renderInfoItem('mail', 'Email', userData.email)}
            {renderInfoItem('phone', 'Phone', userData.phone)}
          </HStack>
          <HStack justifyContent="space-between">
            {renderInfoItem('user', 'Gender', userData.gender)}
            {renderInfoItem('calendar', 'Age', calculateAge(userData.dateOfBirth))}
          </HStack>
        </VStack>
      </Box>

      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <HStack flexWrap="wrap" justifyContent="space-between">
        {[
          { icon: 'truck', label: 'Vehicles', route: 'Vehicles' },
          { icon: 'user', label: 'Driver Profile', route: 'DriverProfile' },
          { icon: 'map', label: 'Routes', route: 'Routes' },
          { icon: 'map-pin', label: 'Locations', route: 'Locations' },
        ].map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.quickAction}
            onPress={() => navigation.navigate(item.route)}
          >
            <Icon as={Feather} name={item.icon} size={6} color="black" mb={2} />
            <Text style={styles.quickActionText}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </HStack>

      <Pressable style={styles.logoutButton} onPress={handleLogout}>
        <HStack space={2} alignItems="center">
          <Icon as={Feather} name="log-out" size={6} color="white" />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </HStack>
      </Pressable>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  profileCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 20,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 40,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: 'white',
    fontSize: 26,
    fontWeight: 'bold',
  },
  userName: {
    color: 'black',
    fontSize: 24,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 15,
  },
  quickAction: {
    width: '48%',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginBottom: 15,
  },
  quickActionText: {
    fontSize: 16,
    fontWeight: '500',
    color: 'black',
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: '#8B0000', // Dark Red
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  logoutButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
});

export default ProfileScreen;
