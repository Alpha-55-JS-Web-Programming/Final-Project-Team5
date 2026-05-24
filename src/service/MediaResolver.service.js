import { get, ref } from "firebase/database";
import { db } from "./firebase-config";

export const DEFAULT_AVATAR = "https://thinksport.com.au/wp-content/uploads/2020/01/avatar-.jpg";
export const DEFAULT_BG = "https://images.pexels.com/photos/271160/pexels-photo-271160.jpeg"
export const DEFAULT_IMAGE = "https://via.placeholder.com/100?text=No+Image";

export const profilePhotoResolverByUserUid = async (userUid) => {
  try {
    const snapshot = await get(ref(db, `users/${userUid}/profilePhotoId`));

    if (!snapshot.exists()) return DEFAULT_AVATAR;

    const profilePhotoId = snapshot.val();

    if (!profilePhotoId) return DEFAULT_AVATAR;

    const mediaSnap = await get(ref(db, `media/${profilePhotoId}`));

    if (!mediaSnap.exists()) return DEFAULT_AVATAR;

    const media = mediaSnap.val();

    if (!media?.url || !media.url.trim()) return DEFAULT_AVATAR;

    return media.url;
  } catch (err) {
    console.error("Resolver error:", err);
    return DEFAULT_AVATAR;
  }
};

export const mediaResolverMessagePic = async(mediaId)=>{

  const mediaSnap = await get(ref(db, `media/${mediaId}`));

  if (!mediaSnap.exists()) return DEFAULT_IMAGE;

  const media = mediaSnap.val();

  if (!media?.url || !media.url.trim()) return DEFAULT_IMAGE;

  return media.url;
}

export const profileBackgroundResolverByUserUid = async (userUid) => {
  try {
    const snapshot = await get(ref(db, `users/${userUid}/profileBackgroundId`));
    const profileBackgroundId = snapshot.val();
    console.log({profileBackgroundId});

    const mediaSnap = await get(ref(db, `media/${profileBackgroundId}`));
    const media = mediaSnap.val();
    console.log({media});

    if (!mediaSnap.exists()) return DEFAULT_BG;
    if (!media.url.trim()) return DEFAULT_BG;

    return media.url;
  } catch (err) {
    console.error("Resolver error:", err);
    return DEFAULT_BG;
  }
};