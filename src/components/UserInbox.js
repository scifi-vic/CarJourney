import React, { useState, useEffect } from 'react';
import { Box, List, ListItem, ListItemText, Paper, Typography } from '@mui/material';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebaseConfig';

function UserInbox({ onSelectConversation, currentUserId }) {
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    if (!currentUserId) return;

    // Reference to the conversations collection
    const conversationsRef = collection(db, 'conversations');

    // Query to get conversations for the current user
    const q = query(conversationsRef, where('participants', 'array-contains', currentUserId));

    // Listen for real-time updates
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedConversations = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setConversations(fetchedConversations);
    });

    return () => unsubscribe(); // Clean up listener on unmount
  }, [currentUserId]);

  return (
    <Paper
      sx={{
        width: '30%', // Fixed width for the inbox section
        height: '100%', // Fill the available height in the parent
        overflow: 'hidden',
      }}
    >
      <Typography variant="h6" sx={{ padding: 2 }}>Inbox</Typography>
      <List>
        {conversations.map((conversation) => (
          <ListItem
            button
            key={conversation.id}
            onMouseDown={(e) => e.preventDefault()} // Prevent default focus behavior
            onClick={() => onSelectConversation(conversation.id)}
            tabIndex="-1" // Prevents item from gaining focus
          >
            <ListItemText
              primary={`Conversation with ${conversation.participants.filter((id) => id !== currentUserId).join(', ')}`}
              secondary={conversation.lastMessage || 'No messages yet'}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}

export default UserInbox;
