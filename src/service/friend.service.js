import { db } from "./firebase-config";
import { ref, onValue } from "firebase/database";
import { getUserByUid, updateUserData as updateUser } from "./users.service";

// Friend Requests
export async function sendFriendRequest(senderUid, recipientUid) {
  await updateUser(senderUid, {
    [`sentRequests/${recipientUid}`]: true,
  });

  await updateUser(recipientUid, {
    [`pendingRequests/${senderUid}`]: true,
  });
}

export async function acceptFriendRequest(myUid, senderUid) {
  await updateUser(myUid, {
    [`pendingRequests/${senderUid}`]: null,
    [`friendsList/${senderUid}`]: true,
  });

  await updateUser(senderUid, {
    [`sentRequests/${myUid}`]: null,
    [`friendsList/${myUid}`]: true,
  });
}

export async function rejectFriendRequest(myUid, senderUid) {
  await updateUser(myUid, {
    [`pendingRequests/${senderUid}`]: null,
  });

  await updateUser(senderUid, {
    [`sentRequests/${myUid}`]: null,
  });
}

export async function removeFriend(myUid, friendUid) {
  await updateUser(myUid, { [`friendsList/${friendUid}`]: null });
  await updateUser(friendUid, { [`friendsList/${myUid}`]: null });
}

// Subscriptions
export function subscribeToFriendRequests(uid, callback) {
  const userRef = ref(db, `users/${uid}`);

  const unsubscribe = onValue(userRef, async (snapshot) => {
    const data = snapshot.val() || {};

    const pending = data.pendingRequests || {};
    const sent = data.sentRequests || {};

    const pendingList = await Promise.all(
      Object.keys(pending).map(async (senderUid) => {
        const user = await getUserByUid(senderUid);
        return { uid: senderUid, username: user.username, type: "received" };
      })
    );

    const sentList = await Promise.all(
      Object.keys(sent).map(async (receiverUid) => {
        const user = await getUserByUid(receiverUid);
        return { uid: receiverUid, username: user.username, type: "sent" };
      })
    );

    callback([...pendingList, ...sentList]);
  });

  return unsubscribe;
}

export function subscribeToUserFriendsListChanges(uid, callback) {
  const userRef = ref(db, `users/${uid}/friendsList`);

  const unsubscribe = onValue(userRef, async (snapshot) => {
    const friends = snapshot.val() || {};

    const friendList = await Promise.all(
      Object.keys(friends).map(async (friendUid) => {
        const user = await getUserByUid(friendUid);
        return { uid: friendUid, username: user.username, profilePhotoURL: user.profilePhotoURL };
      })
    );

    callback(friendList);
  });

  return unsubscribe;
}
