// src/services/ConversationService.js
import { db } from '../firebaseConfig';
import { collection, query, where, getDocs, addDoc, Timestamp } from 'firebase/firestore';

// Get or create a conversation between two users
export async function getOrCreateConversation(senderUID, receiverUID) {
  const conversationsRef = collection(db, 'conversations');
  
  // Query to find existing conversations
  const q = query(conversationsRef, where('participants', 'array-contains', senderUID));
  const snapshot = await getDocs(q);
  
  // Check if a conversation with both participants exists
  for (let doc of snapshot.docs) {
    const data = doc.data();
    if (data.participants.includes(receiverUID)) {
      return doc.id; // Return existing conversation ID
    }
  }

  // If no conversation exists, create a new one
  const newConversationRef = await addDoc(conversationsRef, {
    participants: [senderUID, receiverUID],
    lastMessage: '',
    lastUpdated: Timestamp.now(),
  });

  return newConversationRef.id; // Return new conversation ID
}
