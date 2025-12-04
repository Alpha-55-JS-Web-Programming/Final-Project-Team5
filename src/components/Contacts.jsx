import { useCallback, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../service/firebase-config";
import {
  sendFriendRequest,
  subscribeToFriendRequests,
  removeFriend,
  acceptFriendRequest,
  rejectFriendRequest,
  subscribeToUserFriendsListChanges,
} from "../service/friend.service";
import { getUserByUid, getUserByUsername } from "../service/users.service";

export function Contacts() {
  const [user] = useAuthState(auth);
  const [friendRequests, setFriendRequests] = useState([]);
  const [usernameInputValue, setUsernameInputValue] = useState("");
  const [isContactModalVisible, setIsContactModalVisible] = useState(false);
  const [hasPendingRequests, setHasPendingRequests] = useState(false);
  const [subscriptionMessage, setSubscriptionMessage] = useState("");
  const [friendsList, setFriendsList] = useState([]);

  const [searchInputValue, setSearchInputValue] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  
  const handleFriendMenu = (index) => {
    const updatedFriendsList = [...friendsList];
    updatedFriendsList[index].isOpen = !updatedFriendsList[index].isOpen;
    setFriendsList(updatedFriendsList);
  };

  const filteredFriends = friendsList.filter((f) =>
    f.username.toLowerCase().includes(searchInputValue.toLowerCase())
  );



  const toggleModal = () => setIsContactModalVisible((v) => !v);

  // Subscribe to incoming + sent requests
  useEffect(() => {
    if (!user) return;

    const unsubscribe = subscribeToFriendRequests(user.uid, (list) => {
      setFriendRequests(list);
      setHasPendingRequests(list.length > 0);
    });

    return unsubscribe;
  }, [user]);

  // Subscribe to friends list
  useEffect(() => {
    if (!user) return;

    const unsubscribe = subscribeToUserFriendsListChanges(
      user.uid,
      (list) => setFriendsList(list)
    );

    return unsubscribe;
  }, [user]);

  const clearAfterDelay = (setter, ms = 2000) =>
    setTimeout(() => setter(""), ms);

  // Send Invitation
  const handleSendInvitation = useCallback(async () => {
    try {
      if (!usernameInputValue.trim()) return;

      const found = await getUserByUsername(usernameInputValue.trim());
      if (!found) {
        setErrorMessage("User not found.");
        return clearAfterDelay(setErrorMessage);
      }

      const [recipientUid, recipientData] = Object.entries(found)[0];
      const senderUid = user.uid;

      // Prevent inviting yourself
      if (recipientUid === senderUid) {
        setErrorMessage("You cannot send a request to yourself.");
        return clearAfterDelay(setErrorMessage);
      }

      const me = await getUserByUid(senderUid);

      // Already friends
      if (me.friendsList?.[recipientUid]) {
        setErrorMessage("User is already a friend.");
        return clearAfterDelay(setErrorMessage);
      }

      // Already sent request
      if (me.sentRequests?.[recipientUid]) {
        setErrorMessage("You already sent a request.");
        return clearAfterDelay(setErrorMessage);
      }

      // They sent you a request already
      if (me.pendingRequests?.[recipientUid]) {
        setErrorMessage("This user already sent you a request.");
        return clearAfterDelay(setErrorMessage);
      }

      // Send request
      await sendFriendRequest(senderUid, recipientUid);

      setSubscriptionMessage(`Invitation sent to ${recipientData.username}`);
      setIsContactModalVisible(false);
      clearAfterDelay(setSubscriptionMessage);
    } catch (err) {
      console.error(err);
      setErrorMessage("Error sending invitation.");
      clearAfterDelay(setErrorMessage);
    }
  }, [usernameInputValue, user]);

  // Accept / Reject / Remove
  const handleAcceptRequest = (uid) => acceptFriendRequest(user.uid, uid);
  const handleRejectRequest = (uid) => rejectFriendRequest(user.uid, uid);
  const handleRemoveFriend = (uid) => removeFriend(user.uid, uid);


  return (
    <>
      <div>
        <div>
          <div className="p-6 pb-0">
            <div className="ltr:float-right rtl:float-left">
              <div className="relative">
                {/* Button to open the modal */}
                <button
                  onClick={toggleModal}
                  type="button"
                  className="px-4 text-lg text-gray-500 group/tag"
                >
                  <i className="mr-1 ri-user-add-line ms-0 dark:text-violet-200" />
                  <span className="absolute items-center hidden mb-6 top-8 group-hover/tag:flex ltr:-left-8 rtl:-right-8">
                    <span className="relative z-10 p-2 text-xs leading-none text-white whitespace-no-wrap bg-black rounded shadow-lg">
                      Add Contact
                    </span>
                    <span className="w-3 h-3 -mt-6 rotate-45 bg-black ltr:-ml-12 rtl:-mr-12" />
                  </span>
                </button>
              </div>
            </div>
            <h4 className="mb-6 dark:text-gray-50">Contacts</h4>
            <div
              className="relative z-50 modal"
              id="modal-id2"
              aria-modal="true"
              role="modal-fifth"
            >
              {isContactModalVisible && (
                <div className="fixed inset-0 z-50">
                  <div className="absolute inset-0 transition-opacity bg-black bg-opacity-50 modal-overlay" />
                  <div className="flex items-center justify-center max-w-lg min-h-screen p-4 mx-auto text-center animate-translate">
                    <div className="relative w-full max-w-lg my-8 text-left transition-all transform bg-white rounded-lg shadow-xl -top-10 dark:bg-zinc-700">
                      {/* Modal content */}
                      <div className="bg-violet-800/10 dark:bg-zinc-700">
                        {/* Modal header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-zinc-500">
                          <h5
                            className="mb-0 text-gray-800 text-16 dark:text-gray-50"
                            id="addgroup-exampleModaL"
                          >
                            Add Contact
                          </h5>
                          <button
                            onClick={toggleModal}
                            type="button"
                            className="absolute top-3 ltr:right-2.5 rtl:left-2.5 text-gray-400 border-transparent hover:bg-gray-50/50/50 hover:text-gray-900 rounded-lg text-sm px-2 py-1 ml-auto inline-flex items-center dark:hover:bg-zinc-600 dark:text-gray-100"
                          >
                            <i className="text-xl text-gray-500 mdi mdi-close dark:text-zinc-100/60" />
                          </button>
                        </div>

                        {/* Modal body */}
                        <div className="p-4">
                          <form>
                            <div className="mb-5 ltr:text-left rtl:text-right">
                              {errorMessage && (
                                <div className="bg-red-200 p-4 mb-4">
                                  {errorMessage}
                                </div>
                              )}
                              <label className="block mb-2 dark:text-gray-300">
                                {" "}
                                Username{" "}
                              </label>
                              <input
                                onChange={(e) =>
                                  setUsernameInputValue(e.target.value)
                                }
                                value={usernameInputValue}
                                type="text"
                                className="py-1.5 bg-transparent border-gray-100 rounded placeholder:text-13 w-full focus:border-violet-500 focus:ring-0 focus:ring-offset-0 dark:border-zinc-500 dark:placeholder:text-gray-300"
                                id="addgroupname-input1"
                                placeholder="Enter Username"
                              />
                            </div>
                            <div className="flex justify-end p-4 border-t border-gray-100 dark:border-zinc-500">
                              <div>
                                <button
                                  onClick={toggleModal}
                                  type="button"
                                  className="border-0 btn hover:underline group-data-[theme-color=violet]:text-violet-500 group-data-[theme-color=green]:text-green-500 group-data-[theme-color=red]:text-red-500"
                                >
                                  Close
                                </button>
                                <button
                                  onClick={handleSendInvitation}
                                  type="button"
                                  className="text-white border-transparent btn group-data-[theme-color=violet]:bg-violet-500 group-data-[theme-color=violet]:hover:bg-violet-600 group-data-[theme-color=green]:bg-green-500 group-data-[theme-color=green]:hover:bg-green-600 group-data-[theme-color=red]:bg-red-500 group-data-[theme-color=red]:hover:bg-red-600"
                                >
                                  Invite Contact
                                </button>
                              </div>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Search bar */}
            <div className="py-1 mt-5 mb-5 group-data-[theme-color=violet]:bg-slate-100 group-data-[theme-color=green]:bg-green-50 group-data-[theme-color=red]:bg-red-50 rounded group-data-[theme-color=violet]:dark:bg-zinc-600 group-data-[theme-color=green]:dark:bg-zinc-600 group-data-[theme-color=red]:dark:bg-zinc-600">
              <span
                className="group-data-[theme-color=violet]:bg-slate-100 group-data-[theme-color=green]:bg-green-50 group-data-[theme-color=red]:bg-red-50 pe-1 ps-3 group-data-[theme-color=violet]:dark:bg-zinc-600 group-data-[theme-color=green]:dark:bg-zinc-600 group-data-[theme-color=red]:dark:bg-zinc-600"
                id="basic-addon"
              >
                <i className="text-lg text-gray-700 ri-search-line search-icon dark:text-gray-200" />
              </span>
              <input
                onChange={(e) => setSearchInputValue(e.target.value)}
                value={searchInputValue}
                type="text"
                placeholder="Search users.."
                aria-describedby="basic-addon"
                className="border-0 group-data-[theme-color=violet]:bg-slate-100 group-data-[theme-color=green]:bg-green-50 group-data-[theme-color=red]:bg-red-50 group-data-[theme-color=violet]:dark:bg-zinc-600 group-data-[theme-color=green]:dark:bg-zinc-600 group-data-[theme-color=red]:dark:bg-zinc-600 placeholder:text-[14px] focus:ring-offset-0 focus:outline-none focus:ring-0 placeholder:dark:text-gray-300"
              />
            </div>

            {/* Friend requests */}
            <h5 className="px-6 mt-8 mb-4 text-16 dark:text-gray-50">
              Friend requests
            </h5>
            <ul className="list-unstyled contact-list">
              {hasPendingRequests && (
                <div className="bg-yellow-200 p-4 mb-4">
                  You have {friendRequests.length} new pending requests.
                </div>
              )}
              {subscriptionMessage && (
                <div className="bg-blue-200 p-4 mb-4">
                  {subscriptionMessage}
                </div>
              )}

              {friendRequests && friendRequests.length > 0 ? (
                friendRequests.map((request) => (
                  <li
                    key={request.uid}
                    className="px-5 py-[15px] group-data-[theme-color=violet]:hover:bg-slate-100 group-data-[theme-color=green]:hover:bg-green-50/50 group-data-[theme-color=red]:hover:bg-red-50/50 group-data-[theme-color=violet]:dark:hover:bg-zinc-600 group-data-[theme-color=green]:dark:hover:bg-zinc-600 group-data-[theme-color=red]:dark:hover:bg-zinc-600 transition-all ease-in-out rounded"
                  >
                    <div className="flex items-center relative">
                      <div className="ltr:mr-5 rtl:ml-5">
                        <div className="flex items-center justify-center rounded-full w-10 h-10 group-data-[theme-color=violet]:bg-violet-500/20 group-data-[theme-color=green]:bg-green-500/20 group-data-[theme-color=red]:bg-red-500/20">
                          <span className="group-data-[theme-color=violet]:text-violet-500 group-data-[theme-color=green]:text-green-500 group-data-[theme-color=red]:text-red-500">
                            {request.username[0].toUpperCase()}
                          </span>
                        </div>
                      </div>

                      <div className="flex-grow overflow-hidden">
                        <h5 className="mb-1 text-base truncate text-gray-700 dark:text-gray-50">
                          {request.username}
                        </h5>
                        {/* Friend request */}
                        {request.type === "sent" ? (
                          <p className="mb-0 text-gray-500 truncate dark:text-gray-300 text-14">
                            Pending
                          </p>
                        ) : request.type === "received" ? (
                          <div className="flex ">
                            <button
                              onClick={() => handleAcceptRequest(request.uid)}
                              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-700 w-15 h-10"
                            >
                              Accept
                            </button>{" "}
                            &nbsp;
                            <button
                              onClick={() => handleRejectRequest(request.uid)}
                              className="ml-3 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-700 w-15 h-10"
                            >
                              Reject
                            </button>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <div>
                  <p className="text-gray-500 dark:text-gray-300 text-center">
                    You don't have any friend requests.
                  </p>
                </div>
              )}
            </ul>

            {/* Friends list */}
            <h5 className="px-6 mt-8 mb-4 text-16 dark:text-gray-50">
              Friends
            </h5>
            <ul>
              {filteredFriends && filteredFriends.length > 0 ? (
                filteredFriends.map((friend, index) => (
                  <li
                    key={`${friend.uid}-${index}`}
                    className="px-5 py-[15px] group-data-[theme-color=violet]:hover:bg-slate-100 group-data-[theme-color=green]:hover:bg-green-50/50 group-data-[theme-color=red]:hover:bg-red-50/50 group-data-[theme-color=violet]:dark:hover:bg-zinc-600 group-data-[theme-color=green]:dark:hover:bg-zinc-600 group-data-[theme-color=red]:dark:hover:bg-zinc-600 transition-all ease-in-out rounded"
                  >
                    <div className="flex items-center relative">
                      <div className="ltr:mr-5 rtl:ml-5">
                        <div className="flex items-center justify-center rounded-full w-10 h-10 group-data-[theme-color=violet]:bg-violet-500/20 group-data-[theme-color=green]:bg-green-500/20 group-data-[theme-color=red]:bg-red-500/20">
                          <span className="group-data-[theme-color=violet]:text-violet-500 group-data-[theme-color=green]:text-green-500 group-data-[theme-color=red]:text-red-500">
                            <img
                              src={
                                friend?.profilePhotoURL ||
                                "https://thinksport.com.au/wp-content/uploads/2020/01/avatar-.jpg"
                              }
                              alt="Avatar"
                              className="rounded-full w-9 h-9"
                            />
                          </span>
                        </div>
                      </div>
                      <div className="flex-grow overflow-hidden">
                        <h5 className="mb-0 text-gray-700 truncate dark:text-gray-50">
                          {friend.username}
                        </h5>
                      </div>
                      {/* Dropdown menu */}
                      <button
                        className="p-2 ml-2 text-gray-500 hover:text-gray-800 dark:text-gray-300"
                        onClick={() => handleFriendMenu(index)}
                      >
                        <i className="ri-more-2-fill"></i>
                      </button>
                      {friend.isOpen && (
                        <div className="absolute z-50 block w-40 mt-32 py-2 text-left list-none bg-white border border-transparent rounded shadow-lg ltr:left-auto ltr:right-0 bg-clip-padding dark:bg-zinc-700 dark:border-zinc-500/50 dark:shadow-sm">
                          <ul>
                            <li>
                              <button
                                onClick={() => handleRemoveFriend(friend.uid)}
                                className="block w-full px-6 py-2 text-sm font-normal text-red-500 bg-red dropdown-item whitespace-nowrap hover:bg-gray-100/50 dark:text-red-300 dark:hover:bg-zinc-500/50"
                                type="button"
                              >
                                Remove
                                <i className="float-right text-red-500 dark:text-red-300 ri-delete-bin-line"></i>
                              </button>
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </li>
                ))
              ) : (
                <li>
                  <div>
                    <p className="text-gray-500 dark:text-gray-300 text-center">
                      You don't have any friends yet.
                    </p>
                  </div>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

