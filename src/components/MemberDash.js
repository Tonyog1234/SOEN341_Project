import React, { useEffect, useState } from "react";
import { auth, db } from "../config/firebase";
import { signOut } from "firebase/auth";
import {
  doc,
  getDocs,
  setDoc,
  addDoc,
  collection,
  query,
  where,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const MemberDash = () => {
  const [user] = useAuthState(auth);
  const [channels, setChannels] = useState([]);
  const navigate = useNavigate();
  const fetchChannels = async () => {
    const channelRef = collection(db, "channels");
    const querySnapshot = await getDocs(channelRef);
    const channelList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setChannels(channelList);
  };
  const GoToChannel = (channel) => {
    navigate(`/channelmember/${channel.id}`, { state: { channel } });
  };

  const Logout = () => {
    navigate("/");
  };

  useEffect(() => {
    fetchChannels();
  }, []);
  return (
    <div>
      <h1>Member Dashboard</h1>
      <p>Logged in as: <strong>{user?.email}</strong></p>
      <div>
        <h2>Channels</h2>
        <ul>
          {channels.map((channel) => (
            <li
              key={channel.id}
              className="Channel"
              onClick={() => GoToChannel(channel)}
            >
              {channel.name}
            </li>
          ))}
        </ul>
      </div>
      <button onClick={Logout}>Log out</button>
    </div>
  );
};

export default MemberDash;
