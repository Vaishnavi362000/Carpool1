import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Box, VStack, HStack, Text, Icon, Pressable, Divider } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';

const sampleChats = [
  {
    id: '1',
    name: 'John Doe',
    lastMessage: 'Hey, are you available for a ride?',
    time: '10:30 AM',
  },
  {
    id: '2',
    name: 'Jane Smith',
    lastMessage: 'Thanks for the ride!',
    time: '9:15 AM',
  },
];

const ChatsScreen = ({ navigation }) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <VStack space={4}>
        {sampleChats.map((chat) => (
          <Pressable
            key={chat.id}
            onPress={() => navigation.navigate('ChatDetail', { chatId: chat.id })}
            style={styles.chatItem}
          >
            <HStack justifyContent="space-between" alignItems="center">
              <HStack space={4} alignItems="center">
                <Icon as={MaterialIcons} name="person" size={10} color="black" />
                <VStack>
                  <Text style={styles.chatName}>{chat.name}</Text>
                  <Text style={styles.chatMessage}>{chat.lastMessage}</Text>
                </VStack>
              </HStack>
              <Text style={styles.chatTime}>{chat.time}</Text>
            </HStack>
            <Divider mt={2} />
          </Pressable>
        ))}
      </VStack>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'white',
  },
  chatItem: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
  },
  chatName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'black',
  },
  chatMessage: {
    color: 'gray',
  },
  chatTime: {
    color: 'gray',
    fontSize: 12,
  },
});

export default ChatsScreen;
