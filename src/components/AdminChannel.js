import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  doc,
  updateDoc,
  arrayUnion,
  getDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { useNavigate } from "react-router-dom";

const AdminChannel = () => {
  const { state } = useLocation();
  const { channel } = state;
  const [members, setMembers] = useState([]);
  const [allUsers, setAllUsers] = useState([]); // List of all users
  const [selectedMember, setSelectedMember] = useState(""); // Selected member from dropdown
  const navigate = useNavigate();

  // Fetch the channel's data
  const fetchChannelData = async () => {
    const channelRef = doc(db, "channels", channel.id);
    const channelSnap = await getDoc(channelRef);
    if (channelSnap.exists()) {
      setMembers(channelSnap.data().members || []);
    }
  };

  // Fetch all users
  const fetchUsers = async () => {
    const usersRef = collection(db, "users");
    const querySnapshot = await getDocs(usersRef);
    const users = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setAllUsers(users);
  };

  // Add a member to the channel
  const addMember = async () => {
    if (!selectedMember) {
      alert("Please select a member.");
      return;
    }

    const channelRef = doc(db, "channels", channel.id);
    await updateDoc(channelRef, {
      members: arrayUnion(selectedMember), // Add the selected member to Firestore
    });

    setMembers((prev) => [...prev, selectedMember]); // Update local members state
    setSelectedMember(""); // Clear dropdown
    alert(`Added ${selectedMember} to ${channel.name}`);
  };

  useEffect(() => {
    fetchChannelData();
    fetchUsers(); // Fetch the list of users
  }, []);

  const BackToDashboard = () => {
    navigate("/Admin");
  };

  return (
    <div>
      <h1>Admin Channel: {channel.name}</h1>

      <div>
        <h2>Members</h2>
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {members.map((member, index) => (
            <li key={index}>{member}</li>
          ))}
        </ul>
      </div>

      <div>
        <h3>Add Member</h3>
        <div>
          <select
            value={selectedMember}
            onChange={(e) => setSelectedMember(e.target.value)}
          >
            <option value="">Select a member</option>
            {allUsers
              .filter((user) => !members.includes(user.email)) // Filter out already-added members
              .map((user) => (
                <option key={user.id} value={user.email}>
                  {user.email}
                </option>
              ))}
          </select>
          <button onClick={addMember}>Add Member</button>
        </div>
        <button onClick={BackToDashboard}>Go back to Dashboard</button>
      </div>
    </div>
  );
};

export default AdminChannel;