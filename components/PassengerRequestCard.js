import React from 'react';
import { StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Box, Text, HStack, VStack, Avatar, Icon, Pressable } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { FadeInRight, FadeOutLeft } from 'react-native-reanimated';

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

export default PassengerRequestCard;

