// src/pages/MessagePage.js
import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import UserInbox from '../components/UserInbox';
import ConversationDisplay from '../components/ConversationDisplay';
import { getOrCreateConversation } from '../helpers/ConversationService';
import { sendMessage, listenToMessages } from '../helpers/MessageService';
import { db, auth } from '../firebaseConfig';
import { doc, onSnapshot, collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { useParams } from 'react-router-dom';

function MessagePage({currentUserId}) {
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [messages, setMessages] = useState([]);


const {chatId} = useParams();

// ok so I'm going to add chats as a state

const [chats, setChats] = useState([]);

useEffect(() => {
  // Set up a real-time listener for the selected conversation
  if (chatId) {
    const messageCollection = collection(db, 'messages', chatId, 'messages');
    const q = query(messageCollection, orderBy('timestamp', 'asc'));
    const unsubscribe = onSnapshot(q, (doc) => {
      setMessages(doc.docs);
      console.log(doc.docs[0].data());
    })
  }
}, [chatId]);

useEffect(() => {
    // wait for the user is confirmed to be logged in
    auth.onAuthStateChanged(async (user) => {
      const chatsCollection = collection(db, "chats");

      // find all chats where the user is a member
      const q = query(
        chatsCollection,
        where(`members.${user.uid}`, "==", true),
      );

      const snapshot = await getDocs(q);

      // map the documents to a list of chat objects
      const allChats = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setChats(allChats);
    });

}, []);

return (
  <Box sx={{ display: 'grid', height: '100vh', gridTemplateColumns: '200px 1fr', gap: 2 }}>
    {/* Inbox Component */}
    <UserInbox selectedIndex={selectedIndex} setSelectedIndex={(index) => setSelectedIndex(index)} chats={chats} />

    {/* Conversation Component */}
    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      {selectedIndex != -1 ? (
        <Box>
        <ConversationDisplay
          chatId={chatId}
          messages={messages}
          onSendMessage={() => {
            
          }}
        />
      </Box>
      ) : (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <p>Select a conversation to view</p>
        </Box>
      )}
    </Box>
  </Box>
);
}

export default MessagePage;