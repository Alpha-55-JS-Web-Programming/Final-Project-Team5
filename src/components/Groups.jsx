import React, { useState, useEffect, useContext } from "react";
import { createGroup, getGroups, deleteGroup, removeUserFromGroup } from "../service/groupAndChannel.service";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { AppContext } from "../AppContext";
import { useNavigate, useParams } from "react-router-dom";
import { Channels } from "./Channels";
import { subscribeToUserFriendsListChanges } from '../service/friend.service';

export function Groups() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isMemberPickerVisible, setIsMemberPickerVisible] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [groups, setGroups] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const { user } = useContext(AppContext);
  let { idGroup } = useParams();
  const navigate = useNavigate();
  const [visibleGroupDropdown, setVisibleGroupDropdown] = useState(null);
  const [friendsList, setFriendsList] = useState([]);
  const [chosenFriends, setChosenFriends] = useState([]);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    });
    updateGroups().catch(console.error);
  }, []);

  useEffect(() => {
    if (user) {
      subscribeToUserFriendsListChanges(user.uid, setFriendsList);
    }
  }, [user]);

  useEffect(() => {
    if (isModalVisible) {
      setIsMemberPickerVisible(false);
      setChosenFriends([]);
    }
  }, [isModalVisible]);

  useEffect(() => {
    if (!groups) return;
    const filteredGroups = groups.filter((group) => group.name.toLowerCase().includes(searchQuery.toLowerCase()));
    setFilteredGroups(filteredGroups);
  }, [groups, searchQuery])

  const updateGroups = async () => {
    if (!user) return;
    const groups = await getGroups(user.uid);
    const groupsArr = Object.values(groups);
    setGroups(groupsArr);
    setFilteredGroups(groupsArr);
  }

  const toggleModal = () => {
    setIsModalVisible(prev => !prev);
  };

  const handleCreateGroup = async (event) => {
    event.preventDefault();

    if (groupName.length < 3 || groupName.length > 40) {
      alert("The name of the group must be between 3 and 40 characters long.");
      return;
    }

    if (!currentUser) {
      console.error("No current user found. Cannot create group.");
      return;
    }

    try {
      const creatorId = currentUser?.uid;
      const creatorName = user.username
      const members = [creatorId, ...chosenFriends];
      const newGroup = await createGroup(groupName, creatorId, creatorName, members);
      setGroups(prevGroups => [...prevGroups, newGroup]);
      setIsModalVisible(false);
      setGroupName('');
    } catch (error) {
      console.error("Failed to create group:", error);
    }
  };


  const handleDeleteGroup = async (event, groupId) => {
    event.stopPropagation();
    try {
      await deleteGroup(groupId);
      await updateGroups();
    } catch (error) {
      console.error("Error deleting group:", error);
    }
  };

  const handleLeaveGroup = async (event, groupId) => {
    event.stopPropagation();
    await removeUserFromGroup(groupId, user.uid)
    await updateGroups();
  }

  const handleClickGroupDropdown = (event, index) => {
    event.stopPropagation();
    if (visibleGroupDropdown === index) {
      setVisibleGroupDropdown(null);
    } else {
      setVisibleGroupDropdown(index);
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
      {idGroup ? <Channels groupId={idGroup} /> : <div className="">
        {/* Start chat content */}
        <div className="h-screen lg:h-auto">
          <div className="p-6">
            <div className="ltr:float-right rtl:float-left">
              <div className="relative">
                {/* Button trigger modal */}
                <button onClick={toggleModal} type="button" className="px-4 text-lg text-gray-500 group/tag dark:text-gray-300" data-tw-toggle="modal" data-tw-target="#modal-id" >
                  <i className="ri-group-line me-1 ms-0" />
                  <span className="absolute items-center hidden mb-6 top-8 group-hover/tag:flex ltr:-left-8 rtl:-right-8">
                    <span className="relative z-10 p-2 text-xs leading-none text-white whitespace-no-wrap bg-black rounded shadow-lg">
                      Create group
                    </span>
                    <span className="w-3 h-3 -mt-6 rotate-45 bg-black ltr:-ml-12 rtl:-mr-12" />
                  </span>
                </button>
              </div>
            </div>

            <h4 className="mb-6 dark:text-gray-50">Groups</h4>

            {/* Modal */}
            {isModalVisible && (
              <div className="relative z-50  modal" id="modal-id">
                <div className="fixed inset-0 z-50 ">
                  <div className="absolute inset-0 transition-opacity bg-black bg-opacity-50 modal-overlay" />
                  <div className="flex items-center justify-center max-w-lg min-h-screen p-4 mx-auto text-center animate-translate">
                    <div className="relative w-full max-w-lg my-8 text-left transition-all transform bg-white rounded-lg shadow-xl -top-10 dark:bg-zinc-700">
                      <div className="group-data-[theme-color=violet]:bg-violet-800/10 group-data-[theme-color=green]:bg-green-800/10 group-data-[theme-color=red]:bg-red-800/10 group-data-[theme-color=violet]:dark:bg-zinc-700 group-data-[theme-color=red]:dark:bg-zinc-700 group-data-[theme-color=green]:dark:bg-zinc-700">
                        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-zinc-500">
                          <h5 className="mb-0 text-gray-800 text-16 dark:text-gray-50" id="addgroup-exampleModalLabel" >
                            Create New Group
                          </h5>
                          <button onClick={toggleModal} className="text-gray-600 hover:text-gray-900"> &times; </button>
                        </div>
                        <div className="p-4">
                          <form onSubmit={handleCreateGroup}>
                            {/* Group Name */}
                            <div className="mb-8">
                              <label htmlFor="groupName" className="block mb-2 ltr:text-left dark:text-gray-200 rtl:text-right">Group Name</label>
                              <input id="groupName" type="text" value={groupName} onChange={(e) => setGroupName(e.target.value)} className="py-1.5 bg-transparent border-gray-100 rounded placeholder:text-13 w-full focus:border-violet-500 focus:ring-0 focus:ring-offset-0 placeholder:dark:text-gray-200 dark:border-zinc-500" placeholder="Enter Group Name" required />
                            </div>

                            {/* Group Members */}
                            <div className="mb-8 ltr:text-left rtl:text-right">
                              <label className="dark:text-gray-300 "> Group Members </label>
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
                                            {friendsList.map((friend) => (
                                              <li className="px-5 py-[10px]">
                                                <div className="flex items-center gap-3">
                                                  <input type="checkbox" id={`friend-${friend.uid}`} defaultChecked="" onChange={(e) => handleFriendChecked(e, friend)} className="border-gray-100 rounded group-data-[theme-color=violet]:bg-violet-50 group-data-[theme-color=green]:bg-green-50 group-data-[theme-color=red]:bg-red-50 focus:ring-1 group-data-[theme-color=violet]:focus:ring-violet-500/20 group-data-[theme-color=green]:focus:ring-green-500/20 group-data-[theme-color=red]:focus:ring-red-500/20 group-data-[theme-color=violet]:checked:bg-violet-500 group-data-[theme-color=green]:checked:bg-green-500 group-data-[theme-color=red]:checked:bg-red-500 checked:ring-1 group-data-[theme-color=red]:checked:ring-violet-500/20 focus:ring-offset-0 focus:outline-0 group-data-[theme-color=violet]:dark:border-zinc-500 group-data-[theme-color=green]:dark:border-zinc-500 group-data-[theme-color=red]:dark:border-zinc-500" />
                                                  <label htmlFor={`friend-${friend.uid}`} className="dark:text-gray-300" >
                                                    {friend.username}
                                                  </label>
                                                </div>
                                              </li>
                                            ))}
                                          </ul>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div> : null}
                            </div>
                            <div className="flex justify-between items-center mt-4">
                              <div className="flex p-4 border-t border-gray-100 ltr:justify-end dark:border-zinc-500 rtl:justify-start">
                                <button onClick={toggleModal} type="button" className="border-0 btn hover:underline group-data-[theme-color=violet]:text-violet-500 group-data-[theme-color=green]:text-green-500 group-data-[theme-color=red]:text-red-500" data-tw-dismiss="modal">
                                  Close
                                </button>
                                <button type="submit" className="text-white border-transparent btn group-data-[theme-color=violet]:bg-violet-500 group-data-[theme-color=violet]:hover:bg-violet-600 group-data-[theme-color=green]:bg-green-500 group-data-[theme-color=green]:hover:bg-green-600 group-data-[theme-color=red]:bg-red-500 group-data-[theme-color=red]:hover:bg-red-600">
                                  Create Group
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

            {/* search bar */}
            <div className="py-1 mt-5 mb-5 rounded group-data-[theme-color=violet]:bg-slate-100 group-data-[theme-color=green]:bg-green-50 group-data-[theme-color=red]:bg-red-50 group-data-[theme-color=violet]:dark:bg-zinc-600 group-data-[theme-color=green]:dark:bg-zinc-600 group-data-[theme-color=red]:dark:bg-zinc-600">
              <span className="group-data-[theme-color=violet]:bg-slate-100 group-data-[theme-color=green]:bg-green-50 group-data-[theme-color=red]:bg-red-50 group-data-[theme-color=violet]:dark:bg-zinc-600 group-data-[theme-color=green]:dark:bg-zinc-600 group-data-[theme-color=red]:dark:bg-zinc-600 pe-1 ps-3 " id="basic-addon2">
                <i className="text-lg text-gray-700 ri-search-line search-icon dark:text-gray-200"></i>
              </span>
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="border-0 group-data-[theme-color=violet]:bg-slate-100 group-data-[theme-color=green]:bg-green-50 group-data-[theme-color=red]:bg-red-50 group-data-[theme-color=violet]:dark:bg-zinc-600 group-data-[theme-color=green]:dark:bg-zinc-600 group-data-[theme-color=red]:dark:bg-zinc-600 placeholder:text-[14px] focus:ring-offset-0 focus:outline-none focus:ring-0 dark:text-gray-400" placeholder="Search messages or users" aria-label="Search messages or users" aria-describedby="basic-addon2" />
            </div>

            <div className="chat-message-list chat-group-list">
              <div className="mt-2">
                <ul>
                  {/* Display groups here */}
                  {filteredGroups.map((group, index) => (
                    <li key={group.id} className="px-5 py-[15px] group-data-[theme-color=violet]:hover:bg-slate-100 group-data-[theme-color=green]:hover:bg-green-50/50 group-data-[theme-color=red]:hover:bg-red-50/50 group-data-[theme-color=violet]:dark:hover:bg-zinc-600 group-data-[theme-color=green]:dark:hover:bg-zinc-600 group-data-[theme-color=red]:dark:hover:bg-zinc-600 transition-all ease-in-out rounded">
                      <a href="#" onClick={(e) => { e.preventDefault(); navigate(`/groups/${group.id}`) }}>
                        <div className="flex items-center relative">
                          <div className="ltr:mr-5 rtl:ml-5">
                            <div className="flex items-center justify-center rounded-full w-10 h-10 group-data-[theme-color=violet]:bg-violet-500/20 group-data-[theme-color=green]:bg-green-500/20 group-data-[theme-color=red]:bg-red-500/20">
                              <span className="group-data-[theme-color=violet]:text-violet-500 group-data-[theme-color=green]:text-green-500 group-data-[theme-color=red]:text-red-500">
                                <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                                  <path fillRule="evenodd" d="M12 6a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm-1.5 8a4 4 0 0 0-4 4c0 1.1.9 2 2 2h7a2 2 0 0 0 2-2 4 4 0 0 0-4-4h-3Zm6.8-3.1a5.5 5.5 0 0 0-2.8-6.3c.6-.4 1.3-.6 2-.6a3.5 3.5 0 0 1 .8 6.9Zm2.2 7.1h.5a2 2 0 0 0 2-2 4 4 0 0 0-4-4h-1.1l-.5.8c1.9 1 3.1 3 3.1 5.2ZM4 7.5a3.5 3.5 0 0 1 5.5-2.9A5.5 5.5 0 0 0 6.7 11 3.5 3.5 0 0 1 4 7.5ZM7.1 12H6a4 4 0 0 0-4 4c0 1.1.9 2 2 2h.5a6 6 0 0 1 3-5.2l-.4-.8Z" clipRule="evenodd" />
                                </svg>
                              </span>
                            </div>
                          </div>
                          <div className="flex-grow overflow-hidden">
                            <h5 className="mb-0 text-gray-700 truncate dark:text-gray-50"> {group.name}</h5>
                          </div>
                          {/* Dropdown menu */}
                          <button className="p-2 ml-2 text-gray-500 hover:text-gray-800 dark:text-gray-300" onClick={(e) => handleClickGroupDropdown(e, index)}>
                            <i className="ri-more-2-fill"></i>
                          </button>
                          {visibleGroupDropdown === index && (
                            <div className="absolute z-50 block w-40 mt-32 py-2 text-left list-none bg-white border border-transparent rounded shadow-lg ltr:left-auto ltr:right-0 bg-clip-padding dark:bg-zinc-700 dark:border-zinc-500/50 dark:shadow-sm">
                              <ul>
                                {/* Remove button */}
                                {group.creatorId === user.uid && (
                                  <li>
                                    <button onClick={(e) => handleDeleteGroup(e, group.id)} className="block w-full px-6 py-2 text-sm font-normal text-red-500 bg-red dropdown-item whitespace-nowrap hover:bg-gray-100/50 dark:text-red-300 dark:hover:bg-zinc-500/50" type="button">
                                      Remove
                                      <i className="float-right text-red-500 dark:text-red-300 ri-delete-bin-line"></i>
                                    </button>
                                  </li>
                                )}
                                {/* Leave the group button */}
                                <li>
                                  <button onClick={(e) => handleLeaveGroup(e, group.id)} className="block w-full px-6 py-2 text-sm font-normal text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-zinc-500" type="button">
                                    Leave
                                    <i className="float-right ri-logout-box-r-line"></i>
                                  </button>
                                </li>
                              </ul>
                            </div>
                          )}
                          {/* End of dropdown menu */}
                        </div>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      }
    </>
  );
}
