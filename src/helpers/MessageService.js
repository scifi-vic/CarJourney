// src/services/MessageService.js
import { collection, query, orderBy, onSnapshot, addDoc, doc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { runTransaction } from 'firebase/firestore';

export async function sendMessage(conversationId, senderId, text) {
  if (!conversationId || !senderId || !text.trim()) {
    console.error('Missing required parameters.');
    return;
  }

  const messagesRef = collection(db, `conversations/${conversationId}/messages`);
  const message = {
    senderId,
    text,
    timestamp: Timestamp.now(),
  };

  // Add message to Firestore
  await addDoc(messagesRef, message);

  // Update conversation metadata
  const conversationRef = doc(db, 'conversations', conversationId);
  await updateDoc(conversationRef, {
    lastMessage: text,
    lastUpdated: Timestamp.now(),
  });
}

// Listen for real-time updates to messages
export function listenToMessages(conversationId, callback) {
    const messagesRef = collection(db, `conversations/${conversationId}/messages`);
    const q = query(messagesRef, orderBy('timestamp', 'asc'));
  
    return onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(messages);
    });

  // try {
  //   await runTransaction(db, async (transaction) => {
  //     const messagesRef = collection(db, `conversations/${conversationId}/messages`);
  //     const conversationRef = doc(db, 'conversations', conversationId);

  //     // Add message
  //     const message = {
  //       senderId,
  //       text,
  //       timestamp: Timestamp.now(),
  //     };
  //     transaction.set(doc(messagesRef), message);

  //     // Update conversation metadata
  //     transaction.update(conversationRef, {
  //       lastMessage: text,
  //       lastUpdated: Timestamp.now(),
  //     });
  //   });

  //   console.log('Message sent successfully.');
  // } catch (error) {
  //   console.error('Error sending message:', error);
  // }
}
  
