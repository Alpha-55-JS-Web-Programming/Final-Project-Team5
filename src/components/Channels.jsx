import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getChannelsIdsByGroup, getChannelsAll, createChannel, deleteChannel, addPeopleToGroup, getGroup } from "../service/groupAndChannel.service";
import { AppContext } from "../AppContext";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { subscribeToUserFriendsListChanges } from "../service/friend.service";

export function Channels() {
  const [channels, setChannels] = useState({});
  let { groupId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AppContext);
  const [isCreateChannelModalVisible, setIsCreateChannelModalVisible] = useState(false);
  const [channelName, setChannelName] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [visibleChannelDropdown, setVisibleChannelDropdown] = useState(null);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [isAddPeopleModalVisible, setIsAddPeopleModalVisible] = useState(false);
  const [chosenFriends, setChosenFriends] = useState([]);
  const [isMemberPickerVisible, setIsMemberPickerVisible] = useState(false);
  const [friendsList, setFriendsList] = useState([]);
  const [filteredFriends, setFilteredFriends] = useState([]);

  const handleGoBack = () => {
    navigate('/groups');
  };

  const toggleModal = () => {
    setIsCreateChannelModalVisible(prev => !prev);
  };

  const toggleModalTwo = () => {
    setIsAddPeopleModalVisible(prev => !prev);
  };

  useEffect(() => {
    const getChannels = async () => {
      const fetchedChannelsIds = await getChannelsIdsByGroup(groupId);
      const fetchedChannels = await getChannelsAll();
      const filteredChannels = Object.keys(fetchedChannelsIds).reduce((acc, key) => {
        if (fetchedChannels[key]) {
          acc[key] = fetchedChannels[key];
        }
        return acc;
      }, {});

      setChannels(filteredChannels);
    };
    getChannels();
  }, [groupId]);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    });
  }, []);

  const initializeFriendsMemberPicker = async () => {
    setIsMemberPickerVisible(false);
    setChosenFriends([]);
    const group = await getGroup(groupId);
    const memberIds = Object.keys(group.members);
    setFilteredFriends(friendsList.filter(friend => !memberIds.includes(friend.uid)));
  }

  useEffect(() => {
    if (isAddPeopleModalVisible) {
      initializeFriendsMemberPicker().catch(console.error);
    }
  }, [isAddPeopleModalVisible, friendsList]);

  useEffect(() => {
    if (user) {
      subscribeToUserFriendsListChanges(user.uid, setFriendsList);
    }
  }, [user]);

  const handleClickCannelDropdown = (event, index) => {
    event.stopPropagation();
    if (visibleChannelDropdown === index) {
      setVisibleChannelDropdown(null);
    } else {
      setVisibleChannelDropdown(index);
    }
  };

  const handleCreateChannel = async (event) => {
    event.preventDefault();

    if (channelName.length < 3 || channelName.length > 40) {
      alert("The name of the channel must be between 3 and 40 characters long.");
      return;
    }

    if (!user) {
      console.error("No current user found. Cannot create channel.");
      return;
    }

    try {
      const creatorId = currentUser?.uid;
      const creatorName = user.username;
      console.log("Creating channel with creator ID:", currentUser?.uid);
      console.log("Creating channel with creator name:", user.username);
      await createChannel(groupId, creatorName, [user.uid], channelName, creatorId);
      getAndUpdateChannels();
      console.log("Channel created:", channelName);
      setIsCreateChannelModalVisible(false);
      setChannelName('');
    } catch (error) {
      console.error("Failed to create channel:", error);
    }
  };

  const getAndUpdateChannels = async () => {
    const fetchedChannelsIds = await getChannelsIdsByGroup(groupId);
    const fetchedChannels = await getChannelsAll();
    const filteredChannels = Object.keys(fetchedChannelsIds).reduce((acc, key) => {
      if (fetchedChannels[key]) {
        acc[key] = fetchedChannels[key];
      }
      return acc;
    }, {});

    setChannels(filteredChannels);
  };

  const handleDeleteChannel = async (channelId) => {
    try {
      await deleteChannel(channelId);
      console.log("Channel deleted successfully");
      const updatedChannelIds = await getChannelsIdsByGroup(groupId);
      const allChannels = await getChannelsAll();

      const updatedChannels = Object.keys(updatedChannelIds).reduce((acc, key) => {
        if (allChannels[key]) {
          acc[key] = allChannels[key];
        }
        return acc;
      }, {});

      setChannels(updatedChannels);
    } catch (error) {
      console.error("Error deleting channel:", error);
    }
  };

  const handleAddPeopleToGroup = async (event) => {
    event.preventDefault();
    if (chosenFriends.length === 0) {
      alert("Please select friends to add to the group.");
      return;
    }

    try {
      await addPeopleToGroup(groupId, chosenFriends);
      alert("Friends added to the group successfully!");

      setIsAddPeopleModalVisible(false);
      setChosenFriends([]);
    } catch (error) {
      console.error("Failed to add friends to the group:", error);
    }
  };

  const handleFriendChecked = (event, friend) => {
    if (event.target.checked) {
      setChosenFriends((prev) => [...prev, friend.uid]);
    } else {
      setChosenFriends((prev) => prev.filter(value => value !== friend.uid));
    }
  }

  return (
    <>
      <div className="h-screen lg:h-auto">
        <div className="p-6">
          <div className="ltr:float-right rtl:float-left flex items-center space-x-4">
            {/* Add People button */}
            <div className="relative">
              <button onClick={toggleModalTwo} type="button" className="px-4 text-lg text-gray-500 group/tag dark:text-gray-300" data-tw-toggle="modal" data-tw-target="#modal-id" >
                <i className="ri-user-add-line me-1 ms-0" />
                <span className="absolute items-center hidden mb-6 top-8 group-hover/tag:flex ltr:-left-8 rtl:-right-8">
                  <span className="relative z-10 p-2 text-xs leading-none text-white whitespace-no-wrap bg-black rounded shadow-lg">
                    Add people
                  </span>
                  <span className="w-3 h-3 -mt-6 rotate-45 bg-black ltr:-ml-12 rtl:-mr-12" />
                </span>
              </button>
            </div>
            <div className="relative">
              {/* Button trigger modal */}
              <button onClick={toggleModal} type="button" className="px-4 text-lg text-gray-500 group/tag dark:text-gray-300" data-tw-toggle="modal" data-tw-target="#modal-id" >
                <i className="ri-group-line me-1 ms-0" />
                <span className="absolute items-center hidden mb-6 top-8 group-hover/tag:flex ltr:-left-8 rtl:-right-8">
                  <span className="relative z-10 p-2 text-xs leading-none text-white whitespace-no-wrap bg-black rounded shadow-lg">
                    Create channel
                  </span>
                  <span className="w-3 h-3 -mt-6 rotate-45 bg-black ltr:-ml-12 rtl:-mr-12" />
                </span>
              </button>
            </div>
          </div>

          {/* Go Back */}
          <div className="flex items-center ">
            <button onClick={handleGoBack} type="button" className="relative px-4 text-lg text-gray-500 group/tag dark:text-gray-300" data-tw-toggle="modal" data-tw-target="#modal-id" >
              <svg className="w-5 h-5 text-gray-700 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" >
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m15 19-7-7 7-7" />
              </svg>
              <span className="absolute items-center hidden group-hover/tag:flex ltr:-left-8 rtl:-right-8">
                <span className="w-3 h-3 rotate-45 bg-black ltr:-ml-12 rtl:-mr-12" />
              </span>
            </button>
            <h4 className=" mb-0 dark:text-gray-50">Channels</h4>
          </div>

          {/* Modal */}
          {isCreateChannelModalVisible && (
            <div className="relative z-50  modal" id="modal-id">
              <div className="fixed inset-0 z-50 ">
                <div className="absolute inset-0 transition-opacity bg-black bg-opacity-50 modal-overlay" />
                <div className="flex items-center justify-center max-w-lg min-h-screen p-4 mx-auto text-center animate-translate">
                  <div className="relative w-full max-w-lg my-8 text-left transition-all transform bg-white rounded-lg shadow-xl -top-10 dark:bg-zinc-700">
                    <div className="group-data-[theme-color=violet]:bg-violet-800/10 group-data-[theme-color=green]:bg-green-800/10 group-data-[theme-color=red]:bg-red-800/10 group-data-[theme-color=violet]:dark:bg-zinc-700 group-data-[theme-color=red]:dark:bg-zinc-700 group-data-[theme-color=green]:dark:bg-zinc-700">
                      <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-zinc-500">
                        <h5 className="mb-0 text-gray-800 text-16 dark:text-gray-50" id="addgroup-exampleModalLabel" >
                          Create New Channel
                        </h5>
                        <button onClick={toggleModal} className="text-gray-600 hover:text-gray-900"> &times; </button>
                      </div>
                      <div className="p-4">
                        <form onSubmit={handleCreateChannel}>
                          {/* Channel Name */}
                          <div className="mb-8">
                            <label htmlFor="channelName" className="block mb-2 ltr:text-left dark:text-gray-200 rtl:text-right">Channel Name</label>
                            <input id="channelName" type="text" value={channelName} onChange={(e) => setChannelName(e.target.value)} className="py-1.5 bg-transparent border-gray-100 rounded placeholder:text-13 w-full focus:border-violet-500 focus:ring-0 focus:ring-offset-0 placeholder:dark:text-gray-200 dark:border-zinc-500" placeholder="Enter Group Name" required />
                          </div>

                          <div className="flex justify-between items-center mt-4">
                            <div className="flex p-4 border-t border-gray-100 ltr:justify-end dark:border-zinc-500 rtl:justify-start">
                              <button onClick={toggleModal} type="button" className="border-0 btn hover:underline channel-data-[theme-color=violet]:text-violet-500 channel-data-[theme-color=green]:text-green-500 channel-data-[theme-color=red]:text-red-500" data-tw-dismiss="modal">
                                Close
                              </button>
                              <button type="submit" className="text-white border-transparent btn group-data-[theme-color=violet]:bg-violet-500 group-data-[theme-color=violet]:hover:bg-violet-600 group-data-[theme-color=green]:bg-green-500 group-data-[theme-color=green]:hover:bg-green-600 group-data-[theme-color=red]:bg-red-500 group-data-[theme-color=red]:hover:bg-red-600">
                                Create Channel
                              </button>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {isAddPeopleModalVisible && (
            <div className="relative z-50  modal" id="modal-id">
              <div className="fixed inset-0 z-50 ">
                <div className="absolute inset-0 transition-opacity bg-black bg-opacity-50 modal-overlay" />
                <div className="flex items-center justify-center max-w-lg min-h-screen p-4 mx-auto text-center animate-translate">
                  <div className="relative w-full max-w-lg my-8 text-left transition-all transform bg-white rounded-lg shadow-xl -top-10 dark:bg-zinc-700">
                    <div className="group-data-[theme-color=violet]:bg-violet-800/10 group-data-[theme-color=green]:bg-green-800/10 group-data-[theme-color=red]:bg-red-800/10 group-data-[theme-color=violet]:dark:bg-zinc-700 group-data-[theme-color=red]:dark:bg-zinc-700 group-data-[theme-color=green]:dark:bg-zinc-700">
                      <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-zinc-500">
                        <h5 className="mb-0 text-gray-800 text-16 dark:text-gray-50" id="addgroup-exampleModalLabel" >
                          Add New People
                        </h5>
                        <button onClick={toggleModalTwo} className="text-gray-600 hover:text-gray-900"> &times; </button>
                      </div>
                      <div className="p-4">
                        <form onSubmit={() => handleAddPeopleToGroup(event)}>

                          {/* Select New Members to Add */}
                          <div className="mb-8 ltr:text-left rtl:text-right">
                            <label className="dark:text-gray-300 "> Select New Members to Add </label>
                            <div className="mt-2 mb-3">
                              <button className={` border-0 btn dark:text-gray-50 ${isMemberPickerVisible ? 'bg-violet-200' : 'group-data-[theme-color=violet]:bg-slate-200 group-data-[theme-color=green]:bg-white group-data-[theme-color=red]:bg-white group-data-[theme-color=violet]:dark:bg-zinc-600 group-data-[theme-color=green]:dark:bg-zinc-600 group-data-[theme-color=red]:dark:bg-zinc-600'}`} type="button" id="toggleButton" onClick={() => setIsMemberPickerVisible((prev) => !prev)} >
                                Select Members
                              </button>
                            </div>
                            {isMemberPickerVisible ?
                              <div id="collapseElement">
                                <div className="border border-gray-100 rounded dark:border-zinc-500">
                                  <div className="px-3 py-2 rounded bg-gray-100/50 dark:bg-zinc-600">
                                    <h5 className="mb-0 text-base text-gray-800 dark:text-gray-50">
                                      Contacts
                                    </h5>
                                  </div>
                                  <div className="p-2 bg-white dark:bg-zinc-800">
                                    <div className="h-[150px]">
                                      <div>
                                        <ul>
                                          {
                                            filteredFriends.map((friend) => (
                                              <li className="px-5 py-[10px]">
                                                <div className="flex items-center gap-3">
                                                  <input type="checkbox" id={`friend-${friend.uid}`} defaultChecked="" onChange={(e) => handleFriendChecked(e, friend)} className="border-gray-100 rounded group-data-[theme-color=violet]:bg-violet-50 group-data-[theme-color=green]:bg-green-50 group-data-[theme-color=red]:bg-red-50 focus:ring-1 group-data-[theme-color=violet]:focus:ring-violet-500/20 group-data-[theme-color=green]:focus:ring-green-500/20 group-data-[theme-color=red]:focus:ring-red-500/20 group-data-[theme-color=violet]:checked:bg-violet-500 group-data-[theme-color=green]:checked:bg-green-500 group-data-[theme-color=red]:checked:bg-red-500 checked:ring-1 group-data-[theme-color=red]:checked:ring-violet-500/20 focus:ring-offset-0 focus:outline-0 group-data-[theme-color=violet]:dark:border-zinc-500 group-data-[theme-color=green]:dark:border-zinc-500 group-data-[theme-color=red]:dark:border-zinc-500" />
                                                  <label htmlFor={`friend-${friend.uid}`} className="dark:text-gray-300" >
                                                    {friend.username}
                                                  </label>
                                                </div>
                                              </li>
                                            ))
                                          }
                                        </ul>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div> : null}
                          </div>
                          <div className="flex justify-between items-center mt-4">
                            <div className="flex p-4 border-t border-gray-100 ltr:justify-end dark:border-zinc-500 rtl:justify-start">
                              <button onClick={toggleModalTwo} type="button" className="border-0 btn hover:underline group-data-[theme-color=violet]:text-violet-500 group-data-[theme-color=green]:text-green-500 group-data-[theme-color=red]:text-red-500" data-tw-dismiss="modal">
                                Close
                              </button>
                              <button type="submit" className="text-white border-transparent btn group-data-[theme-color=violet]:bg-violet-500 group-data-[theme-color=violet]:hover:bg-violet-600 group-data-[theme-color=green]:bg-green-500 group-data-[theme-color=green]:hover:bg-green-600 group-data-[theme-color=red]:bg-red-500 group-data-[theme-color=red]:hover:bg-red-600">
                                Add New People
                              </button>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <ul className="mt-5">
            {/* Display channels here */}
            {Object.entries(channels).map(([key, channel], index) => (
              <li key={key} className={`px-5 py-[15px] ${selectedChannel === key ? 'bg-slate-100 dark:bg-slate-700' : ' px-5 py-[15px] group-data-[theme-color=violet]:hover:bg-slate-100 group-data-[theme-color=green]:hover:bg-green-50/50 group-data-[theme-color=red]:hover:bg-red-50/50 transition-all ease-in-out border-b border-white/20 dark:border-zinc-700 group-data-[theme-color=violet]:dark:hover:bg-zinc-600 group-data-[theme-color=green]:dark:hover:bg-zinc-600 group-data-[theme-color=red]:dark:hover:bg-zinc-600 dark:hover:border-zinc-700 cursor-pointer'}`}>
                <div key={key} idChannel={key} onClick={() => { setSelectedChannel(key); navigate(`/groups/${groupId}/channels/${key}`) }}>
                  <div className="flex items-center relative">
                    <div className="ltr:mr-5 rtl:ml-5">
                      <div className="flex items-center justify-center rounded-full w-10 h-10 group-data-[theme-color=violet]:bg-violet-500/20 group-data-[theme-color=green]:bg-green-500/20 group-data-[theme-color=red]:bg-red-500/20">
                        <span className="group-data-[theme-color=violet]:text-violet-500 group-data-[theme-color=green]:text-green-500 group-data-[theme-color=red]:text-red-500">
                          <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                            <path fill-rule="evenodd" d="M8 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4H6Zm7.3-2a6 6 0 0 0 0-6A4 4 0 0 1 20 8a4 4 0 0 1-6.7 3Zm2.2 9a4 4 0 0 0 .5-2v-1a6 6 0 0 0-1.5-4H18a4 4 0 0 1 4 4v1a2 2 0 0 1-2 2h-4.5Z" clip-rule="evenodd" />
                          </svg>
                        </span>
                      </div>
                    </div>
                    <div className="flex-grow overflow-hidden">
                      <h5 className="mb-0 text-gray-700 truncate dark:text-gray-50">{channel.name}</h5>
                    </div>

                    {/* Dropdown menu */}
                    {channel?.creatorId === currentUser?.uid && (
                      <>
                        <button onClick={(e) => handleClickCannelDropdown(e, index)} className="p-2 ml-2 text-gray-500 hover:text-gray-800 dark:text-gray-300" >
                          <i className="ri-more-2-fill"></i>
                        </button>
                        {visibleChannelDropdown === index && (
                          <div className="absolute z-50 block w-40 mt-20 py-2 text-left list-none bg-white border border-transparent rounded shadow-lg ltr:left-auto ltr:right-0 bg-clip-padding dark:bg-zinc-700 dark:border-zinc-500/50 dark:shadow-sm">
                            <ul>
                              <li>
                                <div className="text-right">
                                  <button onClick={(e) => { e.stopPropagation(); handleDeleteChannel(key) }} className="block w-full px-6 py-2 text-sm font-normal text-red-500 bg-red dropdown-item whitespace-nowrap hover:bg-gray-100/50 dark:text-red-300 dark:hover:bg-zinc-500/50" type="button">
                                    Remove
                                    <i className="float-right text-red-500 dark:text-red-300 ri-delete-bin-line"></i>
                                  </button>
                                </div>
                              </li>
                            </ul>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}