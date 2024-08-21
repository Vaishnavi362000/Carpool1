import React, { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Box, VStack, HStack, Input, IconButton, Icon, Text, Divider, Avatar, Button } from 'native-base';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { BackButton } from '../components/sharedComponents';

const sampleMessages = [
  {
    id: '1',
    text: 'Hey bro !',
    time: '5:08 PM',
    sender: 'Arjun Singh',
    delivered: true,
  },
  {
    id: '2',
    text: 'Hey !',
    time: '5:18 PM',
    sender: 'Me',
    delivered: true,
  },
  {
    id: '3',
    text: 'I approved your ride request bro!',
    time: '5:25 PM',
    sender: 'Arjun Singh',
    delivered: true,
  },
  {
    id: '4',
    text: 'Thanks bro!',
    time: '5:43 PM',
    sender: 'Me',
    delivered: true,
  },
];

const ChatDetailScreen = ({ route, navigation }) => {
  const { chatId } = route.params;
  const [messages, setMessages] = useState(sampleMessages);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    const newMsg = {
      id: messages.length + 1,
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sender: 'Me',
      delivered: true,
    };
    setMessages([...messages, newMsg]);
    setNewMessage('');
  };

  return (
    <VStack flex={1} bg="white">
      <HStack alignItems="center" p="4" borderBottomWidth={1} borderColor="gray.200">
        <BackButton onPress={() => navigation.goBack()} />
        <Avatar source={{ uri: 'https://via.placeholder.com/50' }} size="md" mr={3} />
        <VStack>
          <Text style={styles.headerTitle}>Arjun Singh</Text>
          <HStack space={4}>
            <Button variant="ghost" startIcon={<Ionicons name="call" size={16} color="black" />}>
              Call
            </Button>
            <Button variant="ghost" startIcon={<Ionicons name="chatbubble" size={16} color="black" />}>
              SMS
            </Button>
          </HStack>
        </VStack>
      </HStack>
      <Box px="4" py="2" borderBottomWidth={1} borderColor="gray.200">
        <Text fontWeight="bold">Gurgaon → Meerut</Text>
        <Text color="gray.500">15 May 2021, 11:30 AM</Text>
      </Box>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {messages.map((message) => (
          <Box key={message.id} style={message.sender === 'Me' ? styles.myMessage : styles.theirMessage}>
            <Text style={styles.messageText}>{message.text}</Text>
            <HStack justifyContent="space-between">
              <Text style={styles.messageTime}>{message.time}</Text>
              {message.delivered && message.sender === 'Me' && (
                <Text style={styles.deliveredText}>Delivered</Text>
              )}
            </HStack>
          </Box>
        ))}
      </ScrollView>
      <HStack space={2} alignItems="center" p={4} borderTopWidth={1} borderColor="gray.200">
        <Input
          flex={1}
          placeholder="Type a message"
          value={newMessage}
          onChangeText={setNewMessage}
          variant="filled"
          bg="gray.100"
          borderRadius="md"
          placeholderTextColor="gray.500"
          color="black"
        />
        <IconButton
          icon={<Icon as={MaterialIcons} name="send" size={6} color="black" />}
          onPress={handleSendMessage}
        />
      </HStack>
    </VStack>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 20,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  theirMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#E4E6EB',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  messageText: {
    fontSize: 16,
  },
  messageTime: {
    fontSize: 12,
    color: 'gray',
    marginTop: 5,
  },
  deliveredText: {
    fontSize: 12,
    color: 'gray',
    marginTop: 5,
    alignSelf: 'flex-end',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'left',
  },
});

export default ChatDetailScreen;
