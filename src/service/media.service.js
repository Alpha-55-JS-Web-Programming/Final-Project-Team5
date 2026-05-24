import { push, ref, update, get, remove } from "firebase/database";
import { db } from "./firebase-config";

export const uploadPictureURL = async (url, user, setLoading) => {
     // get old profile photo id
     const userSnap = await get(ref(db, `users/${user.uid}/profilePhotoId`));

     const oldMediaId = userSnap.exists()
       ? userSnap.val()
       : null;
 
     // delete old media if exists
     if (oldMediaId) {
       await remove(ref(db, `media/${oldMediaId}`));
     }

    const mediaRef = ref(db, "media");
    const newMediaRef = push(mediaRef);
    const mediaId = newMediaRef?.key
  
    const mediaData = {
      id: mediaId,
      url: url,
      owner: user.uid,
      type: "profile",
      createdAt: Date.now(),
    };
    try {
      await update(ref(db, `media/${mediaId}`), mediaData );;
      await update(ref(db, `users/${user.uid}`), { profilePhotoId: mediaId });
  
      setLoading(false);
      alert("Profile image uploaded successfully.");
      return mediaData;
    } catch (error) {
      console.error("Error uploading profile image:", error);
      setLoading(false);
    }
  }
  
/*
  ===========
  | STORAGE |
  ===========
 */
  export async function uploadProfileImage(file, user, setLoading) {
    const fileRef = storageRef(storage, user.uid + ".png");
    setLoading(true);
  
    try {
      await uploadBytes(fileRef, file);
      const photoURL = await getDownloadURL(fileRef);
  
      const newMediaRef = push(ref(db, 'media'));
      const mediaId = newMediaRef.key;
  
      await set(newMediaRef, {
        id: mediaId,
        url: photoURL,
        owner: user.uid,
        type: "profile",
        createdAt: Date.now(),
      });
  
      await updateUserData(user.uid, { profilePhotoId: mediaId });
  
      setLoading(false);
      alert("Profile image uploaded successfully.");
      return photoURL;
    } catch (error) {
      console.error("Error uploading profile image:", error);
      setLoading(false);
    }
  }
  
  export async function uploadBackgroundPhoto(backgroundfile, user, setLoading2) {
    const backgroundFileRef = storageRef(storage, user.uid + "_background.png");
    setLoading2(true);
  
    try {
      await uploadBytes(backgroundFileRef, backgroundfile);
      const photoURL = await getDownloadURL(backgroundFileRef);
      const newMediaRef = push(ref(db, "media"));
      const mediaId = newMediaRef.key;
  
      await set(newMediaRef, {
        id: mediaId,
        url: photoURL,
        owner: user.uid,
        type: "background",
        createdAt: Date.now(),
      });
  
      await updateUserData(user.uid, { profileBackgroundId: mediaId });
  
      setLoading2(false);
      alert("Background image uploaded successfully.");
      return photoURL;
    } catch (error) {
      console.error("Error uploading background image:", error);
      setLoading2(false);
    }
  }
  
  // uploadFile
  export async function uploadFile(file, user) {
    const fileRef = storageRef(storage, `${user.uid}/files/${Date.now()}_${file.name}`);
  
    try {
      await uploadBytes(fileRef, file);
      const fileURL = await getDownloadURL(fileRef);
  
      const newMediaRef = push(ref(db, "media"));
      const mediaId = newMediaRef.key;
  
      await set(newMediaRef, {
        id: mediaId,
        url: fileURL,
        owner: user.uid,
        type: "file",
        name: file.name,
        createdAt: Date.now(),
      });
  
      await update(ref(db, `users/${user.uid}/fileIds/${mediaId}`), true);
  
      return mediaId;
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  }