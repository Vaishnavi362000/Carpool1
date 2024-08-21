import React, { useRef, useEffect } from 'react';
import { Animated, Pressable } from 'react-native';
import { Box, Text, VStack, Icon, Center } from 'native-base';
import { Ionicons } from '@expo/vector-icons';

const ErrorMessage = ({ message, isVisible, onHide }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(100)).current;

  useEffect(() => {
    if (isVisible) {
      showErrorMessage();
    } else {
      hideErrorMessage();
    }
  }, [isVisible]);

  const showErrorMessage = () => {
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
    ]).start(onHide);
  };

  return (
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
              {message}
            </Text>
          </VStack>
          <Icon as={Ionicons} name="close-circle-outline" size="sm" color="white" onPress={hideErrorMessage} />
        </Box>
      </Pressable>
    </Animated.View>
  );
};

export default ErrorMessage;