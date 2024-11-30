// src/pages/MessagePage.js
import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import UserInbox from '../components/UserInbox';
import ConversationDisplay from '../components/ConversationDisplay';
import { getOrCreateConversation } from '../helpers/ConversationService';
import { sendMessage, listenToMessages } from '../helpers/MessageService';
import { auth } from '../firebaseConfig';

function MessagePage({currentUserId}) {
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [messages, setMessages] = useState([]);

//   // Store all conversations' messages here
//   const [conversations, setConversations] = useState({
//     '1': [
//       { sender: 'Me', text: 'Hello Henry!', timestamp: '10:00 AM' },
//       { sender: 'Henry', text: 'Hi! How are you?', timestamp: '10:05 AM' },
//       { sender: 'Me', text: 'Doing well, thanks for asking!', timestamp: '10:10 AM' },
//     ],
//     '2': [
//       { sender: 'Me', text: 'Hey Jill!', timestamp: '2:00 PM' },
//       { sender: 'Jill', text: 'Hey! What’s up?', timestamp: '2:05 PM' },
//       { sender: 'Me', text: 'Just checking in on the project.', timestamp: '2:10 PM' },
//     ],
//     '3': [
//       { sender: 'Me', text: 'Hi Victoria!', timestamp: '4:00 PM' },
//       { sender: 'Victoria', text: 'Hello! How’s it going?', timestamp: '4:05 PM' },
//       { sender: 'Me', text: 'Pretty good! How about you?', timestamp: '4:10 PM' },
//     ],
//   });

//   const addMessage = (conversationId, message) => {
//     setConversations((prevConversations) => ({
//       ...prevConversations,
//       [conversationId]: [...(prevConversations[conversationId] || []), message],
//     }));
//   };

//   return (
//     <Box
//       sx={{
//         display: 'flex',
//         height: '100vh', // Full viewport height
//         overflow: 'hidden', // Prevent page scrolling
//         paddingTop: '18px', // Space for the navbar if necessary
//       }}
//     >
//       {/* Left Side: Fixed Inbox List */}
//       <UserInbox onSelectConversation={setSelectedConversationId} />

//       {/* Right Side: Fixed Conversation Display */}
//       <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
//         {selectedConversationId ? (
//           <ConversationDisplay
//             conversationId={selectedConversationId}
//             messages={conversations[selectedConversationId] || []}
//             addMessage={addMessage}
//           />
//         ) : (
//           <Box
//             sx={{
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               height: '100%',
//             }}
//           >
//             <Typography variant="h6">Select a conversation to view messages</Typography>
//           </Box>
//         )}
//       </Box>
//     </Box>
//   );
// }

// export default MessagePage;

useEffect(() => {
  // Set up a real-time listener for the selected conversation
  if (selectedConversationId) {
    const unsubscribe = listenToMessages(selectedConversationId, setMessages);
    return unsubscribe;
  }
}, [selectedConversationId]);

const handleSelectConversation = async (userId) => {
  const conversationId = await getOrCreateConversation(currentUserId, userId);
  setSelectedConversationId(conversationId);
};

const handleSendMessage = async (text) => {
  if (selectedConversationId) {
    await sendMessage(selectedConversationId, currentUserId, text);
  }
};

return (
  <Box sx={{ display: 'flex', height: '100vh' }}>
    {/* Inbox Component */}
    <UserInbox onSelectConversation={handleSelectConversation} currentUserId={currentUserId} />

    {/* Conversation Component */}
    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      {selectedConversationId ? (
        <ConversationDisplay
          conversationId={selectedConversationId}
          messages={messages}
          onSendMessage={handleSendMessage}
        />
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