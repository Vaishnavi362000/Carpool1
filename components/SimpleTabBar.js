import React from 'react';
import { HStack, Icon, Pressable, Text, Box } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';

const tabs = [
  { name: 'Home', icon: 'home' },
  { name: 'Rides', icon: 'directions-car' },
  { name: 'Chats', icon: 'chat' },
  { name: 'Profile', icon: 'person' }
];

const SimpleTabBar = ({ navigation, currentTab = 'Rides' }) => {
  return (
    <Box
      bg="white"
      height={70}
      borderTopLeftRadius={20}
      borderTopRightRadius={20}
      shadow={6}
      position="absolute"
      left={0}
      right={0}
      bottom={0}
    >
      <HStack alignItems="center" height="100%">
        {tabs.map((tab, index) => (
          <Pressable 
            key={index} 
            flex={1} 
            py={2}
            alignItems="center"
            onPress={() => navigation.navigate(tab.name)}
          >
            <Icon 
              as={MaterialIcons}
              name={tab.icon} 
              size={6}
              color={tab.name === currentTab ? "black" : "#999"}
              mb={1}
            />
            <Text 
              fontSize={12} 
              fontWeight="600" 
              color={tab.name === currentTab ? "black" : "#999"}
              fontFamily="Poppins_400Regular"
            >
              {tab.name}
            </Text>
          </Pressable>
        ))}
      </HStack>
    </Box>
  );
};

export default SimpleTabBar;