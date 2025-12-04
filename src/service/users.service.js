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
