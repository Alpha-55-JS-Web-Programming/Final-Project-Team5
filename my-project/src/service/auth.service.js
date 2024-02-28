import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, getAuth, updateEmail, updateProfile } from 'firebase/auth';
import { auth } from '../config/firebase-config';
import { storage } from '../config/firebase-config';
import { uploadBytes, ref, getDownloadURL } from "firebase/storage";

export const registerUser = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const loginUser = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const logoutUser = () => {
  return signOut(auth);
};

export const updateUserEmail = async (newEmail) => {
  const user = getAuth().currentUser;

  try {
    await updateEmail(user, newEmail);
    console.log("Email updated successfully.");
    return true;
  } catch (error) {
    console.error("Error updating email:", error);
    return false;
  }
};

// Storage
export async function uploadProfileImage (file, user, setLoading) {
    // const fileRef = ref(storage, `users/${user.uid}/profile-image`);
    const fileRef = ref(storage, user.uid + '.png');

    setLoading(true);

    const snapshot = await uploadBytes(fileRef, file);
    const photoURL = await getDownloadURL(fileRef);

    updateProfile(user, {photoURL});

    setLoading(false);
    alert('Profile image uploaded successfully.');
};