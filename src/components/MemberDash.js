import React, { useEffect, useState } from "react";
import { auth, db } from "../config/firebase";
import { signOut } from "firebase/auth";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  arrayUnion,
  addDoc,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const MemberDash = () => {
  const [user] = useAuthState(auth); //it listens to users authentication state
  const [channels, setChannels] = useState([]);
  const [searchEmail, setSearchEmail] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [friends, setFriends] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchChannels();
    fetchFriends();
  }, [user]); //it only gets triggered when user changes

  const fetchChannels = async () => {
    if (!user) return;
    const channelRef = collection(db, "channels");
    const q = query(channelRef, where("members", "array-contains", user.email));
    const querySnapshot = await getDocs(q);
    const channelList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setChannels(channelList);
  };

  const fetchFriends = async () => {
    if (!user) return;
    const userRef = doc(db, "users", user.uid);
    const userSnapshot = await getDocs(
      query(collection(db, "users"), where("email", "==", user.email))
    );
    if (!userSnapshot.empty) {
      const userData = userSnapshot.docs[0].data();
      setFriends(userData.friends || []);
    }
  };

  const searchUsers = async () => {
    if (!searchEmail.trim()) return;
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", searchEmail));
    const querySnapshot = await getDocs(q);
    const results = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setSearchResults(results);
  };

  const addFriend = async (friend) => {
    if (!user) return;
    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, { friends: arrayUnion(friend.email) });
    setFriends((prevFriends) => [...prevFriends, friend.email]);
  };

  const selectFriend = async (friend) => {
    setSelectedFriend(friend);
    const chatId = [user.email, friend].sort().join("_");
    const messagesRef = collection(db, "chats", chatId, "messages");
    const q = query(messagesRef, orderBy("timestamp"));
    onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => doc.data()));
    });
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedFriend) return;
    const chatId = [user.email, selectedFriend].sort().join("_");
    const messagesRef = collection(db, "chats", chatId, "messages");
    await addDoc(messagesRef, {
      text: newMessage,
      sender: user.email,
      timestamp: serverTimestamp(),
    });
    setNewMessage("");
  };

  const GoToChannel = (channel) => {
    navigate(`/channelmember/${channel.id}`, { state: { channel } });
  };

  const CloseSearch = () => {
    setSearchResults([]);
    setSearchEmail("");
  }
  const CloseChat = () => {
    setSelectedFriend(null);
    setMessages([]);
  };

  const Logout = () => {
    signOut(auth).then(() => navigate("/"));
  };

  return (
    <div>
      <h1>Member Dashboard</h1>
      <p>
        Logged in as: <strong>{user?.email}</strong>
      </p>
      <div>
        <h2>Channels</h2>
        <ul>
          {channels.length > 0 ? (
            channels.map((channel) => (
              <li
                key={channel.id}
                className="Channel"
                onClick={() => GoToChannel(channel)}
              >
                {channel.name}
              </li>
            ))
          ) : (
            <p>No channels available</p>
          )}
        </ul>
      </div>
      <div>
        <h2>Add Friends</h2>
        <input
          value={searchEmail}
          type="email"
          placeholder="Enter user email"
          onChange={(e) => setSearchEmail(e.target.value)}
        />
        <button onClick={searchUsers}>Search</button>
        <ul>
          {searchResults.map((result) => (
            <li key={result.id}>
              {result.email}{" "}
              <button onClick={() => addFriend(result)}>Add</button>
              <button onClick={CloseSearch}>Return</button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Friends</h2>
        <ul>
          {friends.length > 0 ? (
            friends.map((friend, index) => (
              <li
                className="FriendsList"
                key={index}
                onClick={() => selectFriend(friend)}
              >
                {friend}
              </li>
            ))
          ) : (
            <p>No friends added yet</p>
          )}
        </ul>
      </div>
      {selectedFriend && (
        <div>
          <h2>Chat with {selectedFriend}</h2>
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
          <button onClick={CloseChat}>Return</button>
        </div>
      )}
      <button onClick={Logout}>Log out</button>
    </div>
  );
};

export default MemberDash;
