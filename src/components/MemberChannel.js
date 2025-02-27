import React, { useState, useEffect } from "react";
import {
  doc,
  updateDoc,
  arrayUnion,
  getDoc,
  collection,
  getDocs,
  addDoc,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db, auth } from "../config/firebase"; // Import Firestore & Auth

const MemberChannel = ({ channel, onClose }) => {
  const [members, setMembers] = useState([]); 
  const [messages, setMessages] = useState([]); 
  const [newMessage, setNewMessage] = useState(""); 

  useEffect(() => {
    fetchChannelData();
    listenForMessages();
  }, []);

  // Fetch channel members
  const fetchChannelData = async () => {
    const channelRef = doc(db, "channels", channel.id);
    const channelSnap = await getDoc(channelRef);
    if (channelSnap.exists()) {
      setMembers(channelSnap.data().members || []);
    }
  };

  // Listen for chat messages
  const listenForMessages = () => {
    const messagesRef = collection(db, "channels", channel.id, "messages");
    const q = orderBy("timestamp"); 

    onSnapshot(collection(db, "channels", channel.id, "messages"), (snapshot) => {
      setMessages(snapshot.docs.map((doc) => doc.data()));
    });
  };

  // Send message
  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const messagesRef = collection(db, "channels", channel.id, "messages");
    await addDoc(messagesRef, {
      text: newMessage,
      sender: auth.currentUser.email, 
      timestamp: serverTimestamp(),
    });

    setNewMessage(""); // Clear input after sending
  };

  return (
    <div>
      <h1>Channel: {channel.name}</h1>

      <div>
        <h2>Channel Members</h2>
        <ul>
          {members.map((member, index) => (
            <li key={index}>{member}</li>
          ))}
        </ul>
      </div>

      {/* Chat Section */}
      <div>
        <h2>Chat</h2>
        <div className="chat-window">
          {messages.map((msg, index) => (
            <p key={index}>
              <strong>{msg.sender}:</strong> {msg.text}
            </p>
          ))}
        </div>
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>

      <button onClick={onClose}>Return to Channel List</button>
    </div>
  );
};

export default MemberChannel;
