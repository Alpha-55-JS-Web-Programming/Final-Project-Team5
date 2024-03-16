import { onValue, push, ref, remove, set, update, get } from "firebase/database";
import { db } from "./firebase-config";


export const fetchMessages = (id, setMessages, setLoadingMessages) => {
    try {
        if (!id) {
            console.log("No channel ID provided.");
            return () => {};
        }
        const messagesRef = ref(db, `rooms/${id}/messages`);
        const unsubscribe = onValue(messagesRef, (snapshot) => {
            const messageData = snapshot.val();
            if (messageData) {
                const messageList = Object.keys(messageData).map((key) => ({
                    id: key,
                    ...messageData[key],
                }));
                setMessages(messageList);
            } else {
                setMessages([]);
            }
            setLoadingMessages(false);
        });

        return unsubscribe; 
    } catch (error) {
        console.error("Error fetching messages:", error);
        return () => {};
    }
};

export const fetchPMs= async(id) => {
    try {
        if (!id) {
            // throw new Error("No room ID provided.");
            console.log("No room ID provided.");
        }
        const messagesRef = ref(db, `rooms/${id}/messages`);
        const unsubscribe = onValue(messagesRef, (snapshot) => {
            const messageData = snapshot.val();
            if (messageData) {
                const messageList = Object.keys(messageData).map((key) => ({
                    id: key,
                    ...messageData[key],
                }));
                return messageList;
            } else {
                console.log('No messages in the room');
            }
        });

        return () => {
            unsubscribe();
        };
    } catch (error) {
        console.error("Error fetching messages:", error);
    }
};

export const sendMessagePM = async (newMessage, id, userData ) => {
   

    const message = {
        senderId: userData.uid,
        senderName: userData.username,
        content: newMessage,
        timestamp: Date.now(),
        avatar: userData?.profilePhotoURL || null,
    };

    const newMessageRef = await push(ref(db, `rooms/${id}/messages`), message);
    const messageId = newMessageRef.key;
    message.id = messageId;

    await set(ref(db, `rooms/${id}/messages/${messageId}`), message);
    return {
        id: messageId,
        ...newMessageRef
    };
};

export const handleEditPM = async (mId, newContent, id, messages ) => {
    try {
        const messageRef = ref(db, `rooms/${id}/messages/${mId}`);

        await update(messageRef, {
            content: newContent,
        });
        const updatedMessages = messages.map(message =>
            message.id === mId ? { ...message, content: newContent } : message
        );
        return updatedMessages;
    } catch (error) {
        console.error('Error editing message:', error);
        return null;
    }
};

export const handleDeletePM = async (mId, id) => {
    try {
        const messageRef = ref(db, `rooms/${id}/messages/${mId}`);
        await remove(messageRef);
    } catch (error) {
        console.error('Error deleting message:', error);
    }
};

export const reactToMessagePM = async (messageId, reactionType, userData, id) => {
    try {
        const messageRef = ref(db, `rooms/${id}/messages/${messageId}`);
        const snapshot = await get(messageRef);
        if (snapshot.exists()) {
            const messageData = snapshot.val();
            const reactions = messageData.reactions || {};
            const userId = userData.uid;

            // Update or add the user's reaction to the message
            if (reactions[reactionType]) {
                if (reactions[reactionType].includes(userId)) {
                    // User has already reacted, remove the reaction
                    reactions[reactionType] = reactions[reactionType].filter(id => id !== userId);
                } else {
                    // User hasn't reacted yet, add the reaction
                    reactions[reactionType].push(userId);
                }
            } else {
                // No reactions of this type yet, create a new array
                reactions[reactionType] = [userId];
            }

            // Update the reactions in the database
            await update(messageRef, { reactions });
        }
    } catch (error) {
        console.error('Error reacting to message:', error);
    }
};