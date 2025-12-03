import { get, set, ref, query, equalTo, orderByChild, update, onValue } from "firebase/database";
import { db } from "./firebase-config";
import { format } from "date-fns";

export const getAllUsers = async () => {
  const snapshot = await get(query(ref(db, "users")));
  if (!snapshot.exists()) {
    return [];
  }
  const users = Object.keys(snapshot.val()).map((key) => ({
    id: key,
    ...snapshot.val()[key],
  }));

  return users;
};

export const getUserByUid = async (uid) => {
  const snapshot = await get(ref(db, `users/${uid}`));
  if (!snapshot.exists()) {
    throw new Error("User " + uid + " does not exist.");
  }
  return snapshot.val();
};

export const createUserProfile = (
  uid,
  username,
  email,
  phoneNumber,
  password,
  role = "user",
  status,
  friendsList,
  sentRequests,
  pendingRequests
) => {
  const readableDate = format(new Date(), "yyyy-MM-dd HH:mm:ss");

  return set(ref(db, `users/${uid}`), {
    uid,
    username,
    email,
    password,
    phoneNumber,
    createdOnReadable: readableDate,
    role,
    status,
    friendsList,
    sentRequests,
    pendingRequests,
    profilePhotoURL: "",
    profileBackgroundURL: "",
    fileURL: "",
    location: "",
  });
};

export const updateUserData = async (uid, data) => {
  const userRef = ref(db, `users/${uid}`);

  try {
    await update(userRef, data);
    console.log("User data updated successfully.");
  } catch (error) {
    console.error("Error updating user data:", error);
    throw error;
  }
};

export const getUserByUsername = async (username) => {
  const usersRef = query(
    ref(db, "users"),
    orderByChild("username"),
    equalTo(username)
  );
  const snapshot = await get(usersRef);
  if (!snapshot.exists()) {
    throw new Error("User with username " + username + " does not exist.");
  }
  return snapshot.val();
};

// Friends List Management
// export const sendFriendRequest = async (currentUserUid, targetUserUid) => {
//   try {
//     const currentUserData = await getUserByUid(currentUserUid);
//     const existingSentRequests = currentUserData.sentRequests || {};
//     if (existingSentRequests[targetUserUid]) {
//       console.log("Friend request already sent.");
//       return{message:"Friend request already sent. Wait for response"};
//     }
//     const updatedSentRequests = { ...existingSentRequests, [targetUserUid]: true };
//     await update(ref(db, `users/${currentUserUid}`), { sentRequests: updatedSentRequests });

//     const targetUserData = await getUserByUid(targetUserUid);
//     const existingPendingRequests = targetUserData.pendingRequests || {};
//     const updatedPendingRequests = { ...existingPendingRequests, [currentUserUid]: true };
//     await update(ref(db, `users/${targetUserUid}`), { pendingRequests: updatedPendingRequests });
//     console.log("Friend request sent successfully.");
//     return {message:"Friend request sent successfully."};
//   } catch (error) {
//     console.error("Error sending friend request:", error);
//     return {message:"Error sending friend request."};
//   }
// }
export const sendFriendRequest = async (currentUserUid, targetUserUid) => {
  try {
    await update(ref(db), {
      [`users/${currentUserUid}/sentRequests/${targetUserUid}`]: true,
      [`users/${targetUserUid}/pendingRequests/${currentUserUid}`]: true
    });

    return { message: "Friend request sent successfully." };
  } catch (error) {
    console.error("Error sending friend request:", error);
    return { message: "Error sending friend request." };
  }
};

export const subscribeToFriendRequests = (uid, onChange) => {
  const userRef = ref(db, `users/${uid}`);
  onValue(userRef, async (snapshot) => {
    const userData = snapshot.val();
    const pendingRequests = userData.pendingRequests || {};

    const requestSenderIds = Object.keys(pendingRequests);

    const requestSendersData = await Promise.all(
      requestSenderIds.map(async (senderUid) => {
        try {
          return await getUserByUid(senderUid);
        } catch (error) {
          console.error("Error fetching sender data:", error);
          return null;
        }
      })
    );

    const filteredSendersData = requestSendersData.filter((sender) => sender !== null);
    onChange(filteredSendersData);
  });
}

const addFriend = async (currentUserUid, friendUid) => {
  try {
    const currentUserData = await getUserByUid(currentUserUid);
    const updatedFriendsList = { ...(currentUserData.friendsList || {}), [friendUid]: true };

    await updateUserData(currentUserUid, { friendsList: updatedFriendsList });
    console.log(`Friend added to ${currentUserUid}'s friendsList successfully.`);
  } catch (error) {
    console.error(`Error adding friend to ${currentUserUid}'s friendsList:`, error);
  }
};

export const removeFriend = async (currentUserUid, friendUid) => {
  try {
    const currentUserData = await getUserByUid(currentUserUid);
    const updatedCurrentUserFriendsList = { ...currentUserData.friendsList };
    delete updatedCurrentUserFriendsList[friendUid];
    await updateUserData(currentUserUid, { friendsList: updatedCurrentUserFriendsList });
    console.log(`Friend ${friendUid} removed successfully.`);
  } catch (error) {
    console.error("Error deleting friend:", error);
    throw error;
  }
};

export const acceptFriendRequest = async (currentUserUid, senderUid) => {
  try {
    console.log("Attempting to accept friend request...");
    const senderUserData = await getUserByUid(senderUid);
    const currentUserData = await getUserByUid(currentUserUid);

    await addFriend(senderUid, currentUserUid);
    await addFriend(currentUserUid, senderUid);

    const updatedPendingRequests = { ...currentUserData.pendingRequests };
    delete updatedPendingRequests[senderUid];
    await updateUserData(currentUserUid, { pendingRequests: updatedPendingRequests, });

    const updatedSenderSentRequests = { ...senderUserData.sentRequests };
    delete updatedSenderSentRequests[currentUserUid];
    await updateUserData(senderUid, { sentRequests: updatedSenderSentRequests, });

    console.log("Friend request accepted successfully.");
  } catch (error) {
    console.error("Error accepting friend request:", error);
  }
};

export const rejectFriendRequest = async (currentUserUid, senderUid) => {
  try {
    await update(ref(db), {
      [`users/${currentUserUid}/pendingRequests/${senderUid}`]: null,
      [`users/${senderUid}/sentRequests/${currentUserUid}`]: null
    });

    console.log("Friend request rejected successfully.");
    return { message: "Friend request rejected successfully." };
  } catch (error) {
    console.error("Error rejecting friend request:", error);
  }
};

export const subscribeToUserFriendsListChanges = async (uid, onChange) => {
  try {
    const userRef = ref(db, `users/${uid}`);

    onValue(userRef, async (snapshot) => {
      const userData = snapshot.val();
      const friendsList = userData.friendsList || {};

      const friendIds = Object.keys(friendsList);  // FIXED

      const friendsData = await Promise.all(
        friendIds.map(async (friendUid) => {
          try {
            return await getUserByUid(friendUid);
          } catch (error) {
            console.error("Error fetching friend data:", error);
            return null;
          }
        })
      );

      onChange(friendsData.filter(f => f !== null));
    });
  } catch (error) {
    console.error("Error getting friends list:", error);
    throw error;
  }
};
