import React, { useEffect, useState } from "react";
import { auth, db } from "../config/firebase";
import { signOut } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const MemberDash = () => {
  const [user] = useAuthState(auth);
  const [channels, setChannels] = useState([]);
  const navigate = useNavigate();

  const fetchChannels = async () => {
     if (!user) return; // Ensure user is logged in before fetching channels

    // Reference to the "channels" collection
    const channelRef = collection(db, "channels");

    // Query for channels where the current user's UID exists in the "users" array
    const q = query(channelRef, where("members", "array-contains", user.email));
    const querySnapshot = await getDocs(q);

    // Map the query results to a channel list
    const channelList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Update state with the filtered channel list
    setChannels(channelList);
  };

  const GoToChannel = (channel) => {
    navigate(`/channelmember/${channel.id}`, { state: { channel } });
  };

  const Logout = () => {
    signOut(auth).then(() => navigate("/"));
  };

  useEffect(() => {
    fetchChannels();
  }, [user]); // Re-fetch channels whenever the user changes

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
      <button onClick={Logout}>Log out</button>
    </div>
  );
};

export default MemberDash;
