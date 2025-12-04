import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../../AppContext";
import { ChatButton } from "./ChatButton";
import { subscribeToUserFriendsListChanges } from "../../service/friend.service";
import { createRoom, getRoomByParticipants } from "../../service/message.service";

export function Chats() {
    const { user } = useContext(AppContext);
    const [friendsList, setFriendsList] = useState([]);
    const [filteredFriendsList, setFilteredFriendsList] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedFriend, setSelectedFriend] = useState();
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        if (user) {
            updateFriendsList().catch(console.error);
        }
    }, [user]);

    useEffect(() => {
        if (!search) {
            setFilteredFriendsList(friendsList);
            return;
        }
        setFilteredFriendsList(friendsList.filter(friend => ((friend.username).toLocaleLowerCase()).includes(search.toLocaleLowerCase())));
    }, [search, friendsList]);

    useEffect(() => {
        const lastSelectedFriendUid = localStorage.getItem('lastSelectedFriendUid');
        if (!lastSelectedFriendUid) return;

        const friend = filteredFriendsList.find((friend) => friend.uid === lastSelectedFriendUid);
        if (!friend) return;
        selectFriend(friend);
    }, [filteredFriendsList]);

    const updateFriendsList = async () => {
        await subscribeToUserFriendsListChanges(user.uid, setFriendsList);
    };

    const selectFriend = async (friend) => {
        localStorage.setItem('lastSelectedFriendUid', friend.uid);

        const participants = [user?.uid, friend.uid];
        try {

            const room = await getRoomByParticipants(participants);

            if (!room) {
                const newRoom = await createRoom(participants);

                if (newRoom.id) {
                    navigate(`/chats/${newRoom.id}`);
                }
            } else if (room.id) {
                navigate(`/chats/${room.id}`);
            }
            setSelectedFriend(friend);
        } catch (error) {
            console.error("Error selecting friend:", error);
        }
    }

    useEffect(() => {
        if (!id) setSelectedFriend(undefined);
    }, [id]);

    const handleSearchChange = async (e) => {
        setSearch(e.target.value);
    };

    return (
        <>
            <div>
                <div className="px-6 pt-6">
                    <h4 className="mb-0 text-gray-700 dark:text-gray-50">Chats</h4>
                    <div className="py-1 mt-5 mb-5 rounded group-data-[theme-color=violet]:bg-slate-100 group-data-[theme-color=violet]:dark:bg-zinc-600">
                        <span className="group-data-[theme-color=violet]:bg-slate-100 group-data-[theme-color=violet]:dark:bg-zinc-600  pe-1 ps-3 " id="basic-addon2">
                            <i className="text-gray-700 ri-search-line search-icon dark:text-gray-200"></i>
                        </span>
                        <input type="text" value={search} onChange={handleSearchChange} className="border-0 group-data-[theme-color=violet]:bg-slate-100 group-data-[theme-color=violet]:dark:bg-zinc-600  placeholder:text-[14px] focus:ring-offset-0 focus:outline-none focus:ring-0 dark:text-gray-400" placeholder="Search users" aria-label="Search users" aria-describedby="basic-addon2" />
                    </div>

                </div>

                <div className="overflow-auto">
                    <h5 className="px-6 mb-6 text-16 dark:text-gray-50">Friends</h5>
                    <div className="h-auto px-2">
                        <ul className="chat-user-list">
                            {filteredFriendsList.map((user) => (
                                <li key={user.username}>
                                    <ChatButton selected={selectedFriend === user} user={user} onClick={() => (selectFriend(user))} />
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
}