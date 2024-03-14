import { get, set, ref, getDatabase, push, child, remove, update } from 'firebase/database';
import { db } from './firebase-config';
import { format } from 'date-fns';
// Groups
export const createGroup = async (groupName, isPrivate, creatorId, creatorName) => {
  const readableDate = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
  const groupsRef = ref(getDatabase(), 'groups');
  const newGroupRef = push(groupsRef);

  const groupData = {
    id: newGroupRef?.key,
    name: groupName,
    createdOnReadable: readableDate,
    private: isPrivate,
    creatorId,
    creatorName,
  };

  try {
    await set(newGroupRef, groupData);
    console.log("Group created successfully with ID:", newGroupRef.key);
    await addChannel(newGroupRef.key, creatorName, { "creator": creatorId }, '#General');
    return groupData; // Return the full group object
  } catch (error) {
    console.error("Error creating group:", error);
    throw error;
  }
};

export const fetchGroups = async () => {
  const dbRef = ref(getDatabase());
  try {
    const snapshot = await get(child(dbRef, `groups`));
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      console.log("No groups available");
      return {};
    }
  } catch (error) {
    console.error("Error fetching groups:", error);
    throw error;
  }
};

export const deleteGroup = async (groupId) => {
  const groupRef = ref(getDatabase(), `groups/${groupId}`);

  try {
    await remove(groupRef);
    console.log('Group deleted successfully.');
  } catch (error) {
    console.error('Error deleting group:', error);
    throw error;
  }
};


export const addChannel = (groupId, creatorName, members, channelName = '#General') => {

  return push(ref(db, `groups/${groupId}/channels`), {})
    .then(response => {
      set(ref(db, `channels/${response.key}`),
        {
          name: `${channelName}`,
          createdOn: Date.now(),
          members: {
            ...members,
          },
          id: response.key,
        });
      return update(ref(db), {
        [`groups/${groupId}/channels/${response.key}`]: true,
      })
        .then(() => {
          return response.key;
        });
    })
    .catch(e => console.error(e));
}

export const fetchChannelsIdsByGroup = async (groupId) => {
  const dbRef = ref(getDatabase());
  try {
    const snapshot = await get(child(dbRef, `groups/${groupId}/channels`));
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      console.log("Err! Must have at least one channel");
      return {};
    }
  } catch (error) {
    console.log("Error fetching channels ids", error);
    throw error;
  }
};

export const fetchChannelsAll = async () => {
  const dbRef = ref(getDatabase());
  try {
    const snapshot = await get(child(dbRef, `channels`));
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      console.log("Err! Must have at least one channel");
      return {};
    }
  } catch (error) {
    console.log("Error fetching channels:", error);
    throw error;
  }
};

export const deleteChannel = async (channelId) => {
  const channelRef = ref(getDatabase(), `channels/${channelId}`);

  try {
    await remove(channelRef);
    console.log('Channel deleted successfully.');
  } catch (error) {
    console.error('Error deleting channel:', error);
    throw error;
  }
};