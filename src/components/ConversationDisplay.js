// src/components/ConversationDisplay.js
import React, { useState, useRef, useEffect } from "react";
import { Box, TextField, Button, Typography, Paper, Avatar } from "@mui/material";
import { listenToMessages } from "../helpers/MessageService";
import { auth, db, serverTimestamp } from "../firebaseConfig";
import { collection, addDoc, getDoc, doc } from "firebase/firestore";

function ConversationDisplay({ chatId, messages, addMessage }) {
  const [newMessage, setNewMessage] = useState("");
  const chatWindowRef = useRef(null);
  const [chatNames, setChatNames] = useState({});
  const [otherUserNames, setOtherUserNames] = useState("");
  const [profilePictures, setProfilePictures] = useState({});

  useEffect(() => {
    setChatNames(getChatNames());
  }, []);

  useEffect(() => {
    //scroll to the bottom of the chat window
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  const formatTimestamp = (date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const getChatNames = async () => {
    const chatRef = doc(db, "chats", chatId);
    const chatSnapshot = await getDoc(chatRef);
    const chatIds = Object.keys(chatSnapshot.data().members);
    const idToName = chatIds.map((id) => {
      getDoc(doc(db, "users", id)).then((userSnapshot) => {
        const userData = userSnapshot.data();
        const name = userData.firstName + " " + userData.lastName;
        if (id !== auth.currentUser.uid) {
          setOtherUserNames(name);
        }
        setChatNames((prevNames) => ({ ...prevNames, [id]: name }));
        setProfilePictures((prevPictures) => ({
          ...prevPictures,
          [id]: userData.profilePicture,  
        }))
      });
    });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    console.log(auth.currentUser);
    /* creates new message object */
    const message = {
      sender_id: auth.currentUser.uid,
      text: newMessage,
      timestamp: serverTimestamp(),
    };
    addDoc(collection(db, "messages", chatId, "messages"), message);
    //clear the message box
    setNewMessage("");
  };
  // add message to the select
  return (
    <Paper
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        padding: 2,
      }}
    >
      <Typography variant="h6" gutterBottom>
        Conversation with {otherUserNames}
      </Typography>

      {/* Scrollable Message Display Box */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          padding: 2,
          paddingLeft: 4,
          paddingRight: 4,
          border: "1px solid #ccc",
          borderRadius: "4px",
          maxHeight: "600px",
        }}
        ref={chatWindowRef}
      >
        {messages.map((msg, index) => (
          <Box
            key={index}
            sx={{
              textAlign:
                msg.data().sender_id === auth.currentUser.uid
                  ? "right"
                  : "left",
              padding: 1,
              borderRadius: 1,
              marginY: 0.5,
              display: "flex",
              alignItems: "center",
              gap: 1,
              alignSelf:
                msg.data().sender_id === auth.currentUser.uid
                  ? "flex-end"
                  : "flex-start",
            }}
          >
            <Avatar
              src={profilePictures[msg.data().sender_id]}
              />
              <Box sx={{ backgroundColor:
                msg.data().sender_id === auth.currentUser.uid
                  ? "#e1f5fe"
                  : "#f0f0f0",
                  padding: "1rem",
                  borderRadius: "1rem",
              }} >
            <Typography variant="body2">
              <strong>{chatNames[msg.data().sender_id]}:</strong>{" "}
              {msg.data().text}
            </Typography>
            </Box>
            <Typography variant="caption" sx={{ display: "block" }}>
              {"now"}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* chat input box */}
      <Box
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        sx={{ display: "flex", gap: 1, mt: 2 }}
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
