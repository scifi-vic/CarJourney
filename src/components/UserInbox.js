import React, { useState, useEffect } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import { db, auth } from "../firebaseConfig";
import {
  doc,
  onSnapshot,
  collection,
  query,
  where,
  getDocs,
  getDoc,
} from "firebase/firestore";
import { useRef } from "react";
import { TextField, Button } from "@mui/material";
import { listenToMessages } from "../helpers/MessageService";
import { useParams } from "react-router-dom";

function UserInbox({ selectedIndex, setSelectedIndex, chats }) {
  const [chatData, setChatData] = useState([]);

  const {chatId} = useParams()

  const getChatData = async (chats) => {
    setChatData([]);
    if (chats === null) return;
    chats.forEach((chat, i) => {
      if (chat.id === chatId) {
        setSelectedIndex(i);
      }
      getDoc(doc(db, "chats", chat.id)).then((d) => {
        if (d.exists()) {
          const otherUser = Object.keys(d.data().members).find(
            (m) => m !== auth.currentUser.uid
          );
          getDoc(doc(db, "users", otherUser)).then((d) => {
            if (d.exists()) {
              const user = d.data();
              setChatData((prevChatElements) => [
                ...prevChatElements,
                {
                  id: chat.id,
                  name: user.firstName + " " + user.lastName,
                  image: user.image,
                },
              ]);
            }
          });
        }
      });
    });
  };

  useEffect(() => {
    console.log(chats);
    setChatData([]);
    getChatData(chats);
  }, [chats]);

  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* Inbox List */}
      <Paper
        sx={{
          width: "200px",
          height: "100%",
          overflowY: "auto",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            padding: "10px",
            borderBottom: "1px solid #ccc",
            marginBottom: "10px",
          }}
        >
          Chats:
        </Typography>

        {chatData.map((data, index) => (
          <Box
            key={data.id}
            onClick={() => {
              if(index !== selectedIndex) {
                window.location.href= `/messaging/${data.id}`
              }
            }}
            sx={{
              display: "flex",
              alignItems: "center",
              padding: "10px",
              backgroundColor: `${
                index === selectedIndex ? "#f5f5f5" : "white"
              }`,
            }}
          >
            {data.name}
          </Box>
        ))}
      </Paper>
    </Box>
  );
}

export default UserInbox;
