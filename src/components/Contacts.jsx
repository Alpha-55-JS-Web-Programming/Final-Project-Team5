import React, { useContext, useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AppContext } from '../AppContext';
import { auth } from '../service/firebase-config';
import { useAuthState } from 'react-firebase-hooks/auth';
import { updateUserData, getUserByUid } from '../service/users.service';
import { get, query, orderByChild, equalTo, ref, update, onValue } from 'firebase/database';
import { db } from '../service/firebase-config';
import { addFriend, removeFriend, handleAcceptFriendRequest, handleRejectFriendRequest } from '../service/users.service';

export function Contacts() {
  const { userData } = useContext(AppContext);
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const [friendRequests, setFriendRequests] = useState([]);
  const [emailInputValue, setEmailInputValue] = useState('');
  const [isContactModalVisible, setIsContactModalVisible] = useState(false);
  const [hasPendingRequests, setHasPendingRequests] = useState(false);
  const [subscriptionMessage, setSubscriptionMessage] = useState('');

  useEffect(() => {
    if (!user) return;

    const fetchFriendRequests = async () => {
      try {
        const currentUser = await getUserByUid(user.uid).then((r) => r.val());

        if (!currentUser) {
          console.error('User data not found.');
          return;
        }

        // Set up real-time listener for pendingRequests
        const userRef = ref(db, `users/${user.uid}`);
        onValue(userRef, (snapshot) => {
          const updatedUser = snapshot.val();
          const receivedRequests = updatedUser.pendingRequests || {};
          const receivedRequestsArray = Object.values(receivedRequests);

          const receivedRequestsPromise = Promise.all(
            receivedRequestsArray.map((uid) => getUserByUid(uid).then((r) => ({ ...r.val(), type: 'received' })))
          );

          receivedRequestsPromise.then((receivedRequestsData) => {
            setFriendRequests(receivedRequestsData);
            setHasPendingRequests(receivedRequestsData.length > 0);
          });
        });
      } catch (error) {
        console.error('Error fetching friend requests:', error);
      }
    };

    if (user) {
      fetchFriendRequests();
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      const userRef = ref(db, `users/${user.uid}`);
      onValue(userRef, (snapshot) => {
        const userData = snapshot.val();
        const friendsList = userData.friendsList || {};
        // Now you have friendsList which is an array of userIDs
        // You need to fetch each friend's username from Firebase using these IDs
        // Then set the friends data to state and map over it to render the friends list
      });
    }
  }, [user]);

  // const [messageInputValue, setMessageInputValue] = useState('');
  const toggleModal = () => {
    setIsContactModalVisible(!isContactModalVisible);
  };

  const handleSendInvitation = async () => {
    try {
      const usersSnapshot = await get(query(ref(db, 'users')));
      const users = usersSnapshot.val();

      const userByEmail = Object.values(users).find(u => u.email === emailInputValue);

      if (userByEmail) {
        const recipientUid = userByEmail.uid;
        const senderUid = user.uid;

        const updatedSentRequests = [...(userData.sentRequests ?? []), recipientUid];
        await updateUserData(senderUid, { sentRequests: updatedSentRequests });

        const updatedPendingRequests = [...(userByEmail.pendingRequests ?? []), senderUid];
        await updateUserData(recipientUid, { pendingRequests: updatedPendingRequests });

        console.log('Friend request sent successfully.');
        setFriendRequests((prev) => {
          if (prev.find(u => u.uid === recipientUid)) return prev.at;
          const { uid, username } = userByEmail;
          return [...prev, { uid, username, type: 'sent' }];
        })

        setSubscriptionMessage(`Invitation sent to ${emailInputValue}`);
        setIsContactModalVisible(false);
        setTimeout(clearSubscriptionMessage, 2000);
      } else {
        console.log('User not found with the provided email.');
      }
    } catch (error) {
      console.error('Error sending friend request:', error);
      setSubscriptionMessage('Error sending invitation. Please try again.');
      setTimeout(clearSubscriptionMessage, 2000);
    }
  };

  const clearSubscriptionMessage = () => {
    setSubscriptionMessage('');
  };

  const handleAcceptRequest = async (senderUid) => {
    try {
      console.log('Attempting to accept friend request...');
      await handleAcceptFriendRequest(user.uid, senderUid);
    } catch (error) {
      console.error('Error accepting friend request:', error);
    }
  };

  const handleRejectRequest = async (senderUid) => {
    try {
      console.log('Rejecting friend request...');
      await handleRejectFriendRequest(user.uid, senderUid);
    } catch (error) {
      console.error('Error rejecting friend request:', error);
    }
  };

  const handleRemoveFriend = async (friendUid) => {
    try {
      await removeFriend(user.uid, friendUid);
    } catch (error) {
      console.error('Error removing friend:', error);
    }
  };

  return (
    <>
      {user ? (
        // User is logged in, display contact list
        <div>
          {/* Start chat content */}
          <div>

            <div className="p-6 pb-0">
              <div className="ltr:float-right rtl:float-left">
                <div className="relative">
                  {/* Button to open the modal */}
                  <button onClick={toggleModal} type="button" className="px-4 text-lg text-gray-500 group/tag">
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
              <div className="relative z-50 modal" id="modal-id2" aria-modal="true" role="modal-fifth">
                {isContactModalVisible && (
                  <div className="fixed inset-0 z-50">
                    <div className="absolute inset-0 transition-opacity bg-black bg-opacity-50 modal-overlay" />
                    <div className="flex items-center justify-center max-w-lg min-h-screen p-4 mx-auto text-center animate-translate">
                      <div className="relative w-full max-w-lg my-8 text-left transition-all transform bg-white rounded-lg shadow-xl -top-10 dark:bg-zinc-700">
                        {/* Modal content */}
                        <div className="bg-violet-800/10 dark:bg-zinc-700">
                          {/* Modal header */}
                          <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-zinc-500">
                            <h5 className="mb-0 text-gray-800 text-16 dark:text-gray-50" id="addgroup-exampleModaL">
                              Add Contact
                            </h5>
                            <button onClick={toggleModal} type="button" className="absolute top-3 ltr:right-2.5 rtl:left-2.5 text-gray-400 border-transparent hover:bg-gray-50/50/50 hover:text-gray-900 rounded-lg text-sm px-2 py-1 ml-auto inline-flex items-center dark:hover:bg-zinc-600 dark:text-gray-100" >
                              <i className="text-xl text-gray-500 mdi mdi-close dark:text-zinc-100/60" />
                            </button>
                          </div>

                          {/* Modal body */}
                          <div className="p-4">
                            <form>
                              <div className="mb-5 ltr:text-left rtl:text-right">
                                <label className="block mb-2 dark:text-gray-300"> Email </label>
                                <input onChange={(e) => setEmailInputValue(e.target.value)} value={emailInputValue} type="text" className="py-1.5 bg-transparent border-gray-100 rounded placeholder:text-13 w-full focus:border-violet-500 focus:ring-0 focus:ring-offset-0 dark:border-zinc-500 dark:placeholder:text-gray-300" id="addgroupname-input1" placeholder="Enter Email" />
                              </div>
                              {/* Other input fields can be added here */}

                              <div className="flex justify-end p-4 border-t border-gray-100 dark:border-zinc-500">
                                <div>
                                  <button onClick={toggleModal} type="button" className="border-0 btn hover:underline group-data-[theme-color=violet]:text-violet-500 group-data-[theme-color=green]:text-green-500 group-data-[theme-color=red]:text-red-500" >
                                    Close
                                  </button>
                                  <button onClick={handleSendInvitation} type="button" className="text-white border-transparent btn group-data-[theme-color=violet]:bg-violet-500 group-data-[theme-color=violet]:hover:bg-violet-600 group-data-[theme-color=green]:bg-green-500 group-data-[theme-color=green]:hover:bg-green-600 group-data-[theme-color=red]:bg-red-500 group-data-[theme-color=red]:hover:bg-red-600" >
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
                <span className="group-data-[theme-color=violet]:bg-slate-100 group-data-[theme-color=green]:bg-green-50 group-data-[theme-color=red]:bg-red-50 pe-1 ps-3 group-data-[theme-color=violet]:dark:bg-zinc-600 group-data-[theme-color=green]:dark:bg-zinc-600 group-data-[theme-color=red]:dark:bg-zinc-600" id="basic-addon">
                  <i className="text-lg text-gray-700 ri-search-line search-icon dark:text-gray-200" />
                </span>
                <input type="text" className="border-0 group-data-[theme-color=violet]:bg-slate-100 group-data-[theme-color=green]:bg-green-50 group-data-[theme-color=red]:bg-red-50 group-data-[theme-color=violet]:dark:bg-zinc-600 group-data-[theme-color=green]:dark:bg-zinc-600 group-data-[theme-color=red]:dark:bg-zinc-600 placeholder:text-[14px] focus:ring-offset-0 focus:outline-none focus:ring-0 placeholder:dark:text-gray-300" placeholder="Search users.." aria-describedby="basic-addon" />
              </div>

              {/* Contacts list */}
              <h5 className="px-6 mt-8 mb-4 text-16 dark:text-gray-50">Friend requests</h5>
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
                    <li key={request.uid} className="px-5 py-[15px] group-data-[theme-color=violet]:hover:bg-slate-100 group-data-[theme-color=green]:hover:bg-green-50/50 group-data-[theme-color=red]:hover:bg-red-50/50 transition-all ease-in-out border-b border-white/20 dark:border-zinc-700 group-data-[theme-color=violet]:dark:hover:bg-zinc-600 group-data-[theme-color=green]:dark:hover:bg-zinc-600 group-data-[theme-color=red]:dark:hover:bg-zinc-600 dark:hover:border-zinc-700">
                      <div className="flex">
                        <div className="relative self-center ltr:mr-3 rtl:ml-3">
                          <div className="flex items-center justify-center rounded-full w-9 h-9 group-data-[theme-color=violet]:bg-violet-500/20 group-data-[theme-color=green]:bg-green-500/20 group-data-[theme-color=red]:bg-red-500/20">
                            <span className="group-data-[theme-color=violet]:text-violet-500 group-data-[theme-color=green]:text-green-500 group-data-[theme-color=red]:text-red-500">
                              {request.username[0].toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="flex-grow overflow-hidden">
                          <h5 className="mb-1 text-base truncate dark:text-gray-50">{request.username}</h5>
                          {request.type === 'sent' ? (
                            <p className="mb-0 text-gray-500 truncate dark:text-gray-300 text-14">Pending</p>
                          ) : request.type === 'received' ? (
                            <div className="flex">
                              <button onClick={() => handleAcceptRequest(request.uid)} className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600" >
                                Accept
                              </button> &nbsp;
                              <button onClick={() => handleRejectRequest(request.uid)} className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600" >
                                Reject
                              </button>
                              {/* Add a button for rejecting the friend request if needed */}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </li>
                  ))
                ) : (
                  <div>
                    <p className="text-gray-500 dark:text-gray-300 text-center">You don't have any friend requests.</p>
                  </div>
                )}
              </ul>
              <h5 className="px-6 mt-8 mb-4 text-16 dark:text-gray-50">Friends</h5>
              <ul>
                {(userData.friendsList).map(friend => (
                  <li key={friend.uid}>{friend.username}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : (
        // User is not logged in, display a message
        <div className="flex justify-center items-center h-screen bg-blue-100 border-t border-b border-blue-500 text-blue-700 px-4 py-3" role="alert">
          <div className="text-center">
            <p className="font-bold text-2xl">Oops! You are not logged in.</p>
            <p className="text-xl">To explore your contacts, please log in or create an account.</p>
            <div className="flex mt-6 justify-center">
              <NavLink to="/login" className="mr-4 inline-block px-6 py-3 bg-blue-500 text-white rounded-full text-lg transition duration-300 transform hover:scale-105 focus:outline-none focus:shadow-outline-blue">
                Login
              </NavLink>
              <NavLink to="/register" className="inline-block px-6 py-3 border border-blue-500 text-blue-500 rounded-full text-lg transition duration-300 transform hover:scale-105 focus:outline-none focus:shadow-outline-blue">
                Create an account
              </NavLink>
            </div>
          </div>
        </div>
      )}
    </>
  );
}