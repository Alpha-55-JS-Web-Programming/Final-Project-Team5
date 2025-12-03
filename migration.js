import { getDatabase, ref, get, update } from "firebase/database";

export async function migrateFriendData() {
  const db = getDatabase();
  const usersRef = ref(db, "users");

  const snapshot = await get(usersRef);
  if (!snapshot.exists()) {
    console.log("No users found.");
    return;
  }

  const users = snapshot.val();
  const updates = {};

  for (const uid of Object.keys(users)) {
    const user = users[uid];

    const fixList = (list) => {
      if (!list) return {};
      
      // Case 1: Already correct map
      if (!Array.isArray(list) && typeof list === "object") {
        const values = Object.values(list);
        // Detect: {0: "...", 1: "..."} (array-like object)
        if (values.every(v => typeof v === "string")) {
          const fixed = {};
          for (const v of values) fixed[v] = true;
          return fixed;
        }
        return list;
      }

      // Case 2: Array
      if (Array.isArray(list)) {
        const fixed = {};
        for (const v of list) fixed[v] = true;
        return fixed;
      }

      // Unknown case
      return {};
    };

    const fixedFriends = fixList(user.friendsList);
    const fixedSent = fixList(user.sentRequests);
    const fixedPending = fixList(user.pendingRequests);

    updates[`users/${uid}/friendsList`] = fixedFriends;
    updates[`users/${uid}/sentRequests`] = fixedSent;
    updates[`users/${uid}/pendingRequests`] = fixedPending;
  }

  // Write everything in one atomic update
  await update(ref(db), updates);

  console.log("Migration complete!");
}
