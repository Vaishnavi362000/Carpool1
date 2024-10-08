import React, { useState, useRef } from 'react';
import { ScrollView, Animated } from 'react-native';
import { Box, Heading, VStack, FormControl, Input, Button as ChakraButton, Text, HStack, Icon, Pressable, Center } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { login, getUserData } from '../components/api';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(100)).current;

  const handleLogin = async () => {
    setLoading(true);
    setShowError(false);
    try {
      const data = await login(username, password);
      const [userId, token] = data.split(' ');

      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('userId', userId);
      await AsyncStorage.setItem('username', username);

      const userData = await getUserData(username, token);

      // Store passenger and driver IDs
      await AsyncStorage.setItem('passengerId', userData.customerId.toString());
      await AsyncStorage.setItem('driverId', userData.driverId.toString());

      // Check if all required fields are filled
      const requiredFields = ['firstName', 'lastName', 'dateOfBirth', 'phone', 'gender'];
      const isProfileComplete = requiredFields.every(field => userData[field] != null && userData[field] !== '');

      if (isProfileComplete) {
        navigation.replace('Main');
      } else {
        navigation.replace('Onboarding', { username });
      }
    } catch (error) {
      console.error('Login error:', error);
      showErrorMessage();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setLoading(false);
    }
  };

  const showErrorMessage = () => {
    setShowError(true);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => hideErrorMessage(), 5000);
  };

  const hideErrorMessage = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 100,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => setShowError(false));
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
      <Box p="6" bg="#f9f9f9" flex={1} justifyContent="center" alignItems="center">
        <Heading size="xl" fontWeight="700" color="coolGray.800" mb="1" textAlign="center">
          Let's Sign you in.
        </Heading>
        <Text fontSize="lg" color="coolGray.500" textAlign="center">
          Welcome back
        </Text>
        <Text fontSize="lg" color="coolGray.500" mb="6" textAlign="center">
          You've been missed!
        </Text>
        <VStack space={4} w="90%" maxW="300px">
          <FormControl>
            <Input
              value={username}
              onChangeText={setUsername}
              placeholder="Username"
              bg="white"
              borderRadius="md"
              borderColor="coolGray.300"
              px="4"
              py="3"
              _hover={{ bg: "coolGray.100" }}
              _focus={{ bg: "coolGray.100" }}
            />
          </FormControl>
          <FormControl>
            <Input
              type="password"
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              bg="white"
              borderRadius="md"
              borderColor="coolGray.300"
              px="4"
              py="3"
              _hover={{ bg: "coolGray.100" }}
              _focus={{ bg: "coolGray.100" }}
              secureTextEntry
            />
          </FormControl>
          <Text textAlign="center" color="coolGray.500" mb="4">
            OR
          </Text>
          <HStack space={4} justifyContent="center" mb="4">
            <Icon as={Ionicons} name="logo-google" size="lg" color="coolGray.800" />
            <Icon as={Ionicons} name="logo-facebook" size="lg" color="coolGray.800" />
            <Icon as={Ionicons} name="logo-apple" size="lg" color="coolGray.800" />
          </HStack>
          <ChakraButton
            mt="4"
            bg="black"
            onPress={handleLogin}
            isLoading={loading}
            rounded="full"
            px="8"
            py="4"
            _text={{ fontSize: 'lg', fontWeight: 'bold', color: 'white' }}
            _hover={{ bg: "black" }}
            _pressed={{ bg: "black" }}
          >
            Sign In
          </ChakraButton>
          <Text
            mt="4"
            textAlign="center"
            color="coolGray.600"
            onPress={() => navigation.navigate('Register')}
          >
            Don't have an account? <Text color="black">Register</Text>
          </Text>
        </VStack>
      </Box>
      {showError && (
        <Animated.View
          style={{
            position: 'absolute',
            bottom: 20,
            left: 20,
            right: 20,
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          <Pressable onPress={hideErrorMessage}>
            <Box bg="red.500"
              p="4"
              rounded="2xl"
              flexDirection="row"
              alignItems="center"
              shadow={5}
            >
              <Center w="60px" h="60px" mr="4">
                <Text fontSize="4xl">😕</Text>
              </Center>
              <VStack flex={1}>
                <Text color="white" fontWeight="bold" fontSize="lg">
                  Oops! Login Failed
                </Text>
                <Text color="white" fontSize="sm">
                  Invalid username or password. Please try again.
                </Text>
              </VStack>
              <Icon as={Ionicons} name="close-circle-outline" size="sm" color="white" onPress={hideErrorMessage} />
            </Box>
          </Pressable>
        </Animated.View>
      )}
    </ScrollView>
  );
};

export default LoginScreen;