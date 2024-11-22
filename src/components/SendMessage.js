// src/components/sendMessage.js
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../firebase';  // Firestore setup

export async function SendMessage(receiverUID, messageText) {
  const auth = getAuth();  // get Firebase Auth instance
  const user = auth.currentUser;  // get the current logged-in user (the sender)
  
  if (user) {
    const senderUID = user.uid;  // get the UID of the logged-in user (sender)
    
    try {
      // reference to the sender's and receiver's messages sub-collection
      const senderMessagesRef = collection(db, 'users', senderUID, 'messages');
      const receiverMessagesRef = collection(db, 'users', receiverUID, 'messages');
      
      // message data
      const messageData = {
        sender: senderUID,
        receiver: receiverUID,
        message: messageText,
        timestamp: serverTimestamp(),  // Firestore server timestamp
      };

      // add the message to both the sender/receiver messages collection
      await addDoc(senderMessagesRef, messageData);  // sender's collection
      await addDoc(receiverMessagesRef, messageData);  // receiver's collection

      console.log('Message sent successfully');
    } catch (error) {
      console.error('Error sending message: ', error);
    }
  } else {
    console.log('No user is logged in, unable to send message.');
  }
}
