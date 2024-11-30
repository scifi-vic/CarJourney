// src/components/ConversationDisplay.js
import React, { useState, useRef, useEffect } from 'react';
import { Box, TextField, Button, Typography, Paper } from '@mui/material';

function ConversationDisplay({ conversationId, messages, addMessage }) {
  const [newMessage, setNewMessage] = useState('');
  const messageEndRef = useRef(null);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatTimestamp = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    {/* creates new message object */}
    const message = {
      sender: 'Me',
      text: newMessage,
      timestamp: formatTimestamp(new Date()),
    };

    {/* add message to the selected conversation */}
    addMessage(conversationId, message);
    setNewMessage('');
  };

  return (
    <Paper sx={{ display: 'flex', flexDirection: 'column', height: '100%', padding: 2 }}>
      <Typography variant="h6" gutterBottom>
        Conversation with {conversationId === '1' ? 'Henry' : conversationId === '2' ? 'Jill' : 'Victoria'}
      </Typography>

      {/* Scrollable Message Display Box */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          padding: 2,
          paddingLeft: 4,
          paddingRight: 4,
          border: '1px solid #ccc',
          borderRadius: '4px',
          maxHeight: '300px',
        }}
      >
        {messages.map((msg, index) => (
          <Box
            key={index}
            sx={{
              textAlign: msg.sender === 'Me' ? 'right' : 'left',
              backgroundColor: msg.sender === 'Me' ? '#e1f5fe' : '#f0f0f0',
              padding: 1,
              borderRadius: 1,
              marginY: 0.5,
              maxWidth: '75%',
              alignSelf: msg.sender === 'Me' ? 'flex-end' : 'flex-start',
            }}
          >
            <Typography variant="body2">
              <strong>{msg.sender}:</strong> {msg.text}
            </Typography>
            <Typography variant="caption" sx={{ display: 'block' }}>
              {msg.timestamp}
            </Typography>
          </Box>
        ))}
        <div ref={messageEndRef} />
      </Box>

      {/* chat input box */}
      <Box
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        sx={{ display: 'flex', gap: 1, mt: 2 }}
      >
        <TextField
          fullWidth
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          variant="outlined"
        />
        <Button type="submit" variant="contained">
          Send
        </Button>
      </Box>
    </Paper>
  );
}

export default ConversationDisplay;
