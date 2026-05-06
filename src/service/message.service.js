import { onValue, push, ref, remove, set, update, get, serverTimestamp } from "firebase/database";
import { db } from "./firebase-config";
import { getStorage, ref as refFromURL, deleteObject } from 'firebase/storage';
import { mediaResolverMessagePic } from "./MediaResolver.service";

const date2 = serverTimestamp();

export const getMessages = (id, setMessages, setLoadingMessages) => {
  try {
    if (!id) {
      console.log("No channel ID provided.");
      return () => { };
    }
    const messagesRef = ref(db, `rooms/${id}/messages`);
    const unsubscribe = onValue(messagesRef, async (snapshot) => {
      const messageData = snapshot.val();
      if (messageData) {
        const messageList = Object.keys(messageData).map((key) => ({
          id: key,
          ...messageData[key],
        }));
        // Resolve media
        const resolvedMessages = await Promise.all(
          messageList.map(async (msg) => {
            if (msg.pic) {
              const url = await mediaResolverMessagePic(msg.pic);
              return {
                ...msg,
                picURL: url, 
              };
            }
            return msg;
          })
        );

        setMessages(resolvedMessages);
      } else {
        setMessages([]);
      }
      setLoadingMessages(false);
    });

    return unsubscribe;
  } catch (error) {
    console.error("Error fetching messages:", error);
    return () => { };
  }
};

export const sendMessage = async (newMessage, id, userData) => {
  const message = {
    senderId: userData.uid,
    senderName: userData.username,
    content: newMessage,
    timestamp: date2,
  };

  const newMessageRef = await push(ref(db, `rooms/${id}/messages`), message);
  const messageId = newMessageRef.key;
  message.id = messageId;

  await set(ref(db, `rooms/${id}/messages/${messageId}`), message);
};

export const editMessage = async (mId, newContent, id, messages) => {
  try {
    const messageRef = ref(db, `rooms/${id}/messages/${mId}`);

    await update(messageRef, {
      content: newContent,
    });
    const updatedMessages = messages.map((message) =>
      message.id === mId ? { ...message, content: newContent } : message
    );
    return updatedMessages;
  } catch (error) {
    console.error("Error editing message:", error);
    return null;
  }
};

export const deleteMessage = async (mId, id) => {
  try {
    const messageRef = ref(db, `rooms/${id}/messages/${mId}`);
    await remove(messageRef);
  } catch (error) {
    console.error("Error deleting message:", error);
  }
};

export const reactToMessage = async (messageId, reactionType, userData, id) => {
  try {
    const messageRef = ref(db, `rooms/${id}/messages/${messageId}`);
    const snapshot = await get(messageRef);
    if (snapshot.exists()) {
      const messageData = snapshot.val();
      const reactions = messageData.reactions || {};
      const userId = userData.uid;

      if (reactions[reactionType]) {
        if (reactions[reactionType].includes(userId)) {
          reactions[reactionType] = reactions[reactionType].filter(
            (id) => id !== userId
          );
        } else {
          reactions[reactionType].push(userId);
        }
      } else {
        reactions[reactionType] = [userId];
      }

      await update(messageRef, { reactions });
    }
  } catch (error) {
    console.error("Error reacting to message:", error);
  }
};

export const getRoomByParticipants = async (participants) => {
  try {
    const roomsRef = ref(db, "rooms");
    const snapshot = await get(roomsRef);

    if (snapshot.exists()) {
      const allRooms = snapshot.val();
      const roomId = Object.keys(allRooms).find((roomId) => {
        const room = allRooms[roomId];
        const roomParticipants = Object.keys(room.participants);
        return (
          room.type === "direct" &&
          roomParticipants.length === participants.length &&
          roomParticipants.every((participant) =>
            participants.includes(participant)
          )
        );
      });

      if (roomId) {
        return {
          id: roomId,
          ...allRooms[roomId],
        };
      }
    }
    return null;
  } catch (error) {
    console.error("Error fetching room:", error);
    return null;
  }
};

export const getRoomById = async (id) => {
  const snapshot = await get(ref(db, `rooms/${id}`));
  if (!snapshot.exists()) throw new Error(`Room with id ${id} does not exist.`);
  return snapshot.val();
};

export const createRoom = async (participants) => {
  const newRoom = {
    type: "direct",
    participants: participants.reduce(
      (acc, key) => ({
        ...acc,
        [key]: true,
      }), {}
    ),
  };

  const roomRef = push(ref(db, "rooms"));
  await update(roomRef, newRoom);

  for (const participant of participants) {
    await update(ref(db, `users/${participant}/rooms`), {
      [roomRef.key]: true,
    });
  }

  return {
    id: roomRef.key,
    ...newRoom,
  };
};

export const sendPicMessage = async (newMessage = '', id, userData, mediaId) => {
  const message = {
    senderId: userData.uid,
    pic: mediaId,// reference to media
    senderName: userData.username,
    content: newMessage,
    timestamp: date2,
  };

  const newMessageRef = await push(ref(db, `rooms/${id}/messages`), message);
  const messageId = newMessageRef.key;
  message.id = messageId;

  await set(ref(db, `rooms/${id}/messages/${messageId}`), message);
};

export const handleDeletePicFromStorage = async (picURL) => {
  const storage = getStorage();
  const fileRef = refFromURL(storage, picURL);
  try {
    await deleteObject(fileRef);
    console.log("Picture deleted successfully");
  } catch (error) {
    console.error("Error deleting picture:", error);
  }
};