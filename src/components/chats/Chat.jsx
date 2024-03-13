import { useState, useEffect, useContext } from "react";
import { useRecoilValue } from 'recoil';
import { remove, serverTimestamp } from "firebase/database";
import { get, query, ref, update, set, onChildAdded, push, child, onValue } from "firebase/database";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext, RoomContext } from "../../AppContext";
import { db } from "../../service/firebase-config";
import { ChatUploadFile } from "./ChatUploadFile";
import { ChatToolbar } from "./ChatToolbar";

export function Chat() {
    const navigate = useNavigate();
    let { id } = useParams();
    const { user, userData, updateUserData } = useContext(AppContext);
    // Add Message State: Create a state to store messages in the chat room.
    const [newMessage, setNewMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [loadingMessages, setLoadingMessages] = useState(true);
    const [editMessage, setEditMessage] = useState(null);
    const [editedMessageContent, setEditedMessageContent] = useState('');
    const [activeOptionsMessageId, setActiveOptionsMessageId] = useState(null);
    
    useEffect(() => {
        if (!id) return;
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
        });

        return () => {
            unsubscribe(); // Clean up the listener when the component unmounts
        };
    }, [id]);
    // useEffect(() => {
    //     const messagesRef = ref(db, 'messages');

    //     const unsubscribe = onValue(messagesRef, (snapshot) => {
    //         const data = snapshot.val();
    //         console.log('Data:', data);
    //         // Update local state or perform other actions based on the received data
    //     });

    //     return () => {
    //         // Clean up the listener when the component unmounts
    //         unsubscribe();
    //     };
    // }, [messages]); // Empty dependency array means this effect runs only once when the component mounts

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (id) {
                    const roomRef = ref(db, `rooms/${id}/messages`);
                    const queryRef = query(roomRef);
                    const snapshot = await get(queryRef);
                    const messageList = [];

                    if (snapshot.exists()) {
                        snapshot.forEach((childSnapshot) => {
                            messageList.push(childSnapshot.val());
                        });
                        setMessages(messageList);
                    } else {
                        setMessages([]);
                        console.log("No messages found in this room.");
                    }
                    setLoadingMessages(false);
                } else {
                    setMessages([]);
                    setLoadingMessages(false);
                }
            } catch (error) {
                console.error("Error fetching messages:", error);
                setLoadingMessages(false);
            }
        };
        fetchData();
    }, [id]);
    // [id, messages] is the dependency array. 
    useEffect(() => {
        console.log({ messages });
    }, [messages]);


    const handleInputMessage = (e) => {
        e.preventDefault();
        const message = e.target.value;
        setNewMessage(message);
    };

    const sendMessage = async () => {
        if (!newMessage.trim()) return;

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

        setNewMessage("");
        await set(ref(db, `rooms/${id}/messages/${messageId}`), message);
        setMessages((prevMessages) => [...prevMessages, message]);
        return {
            id: messageId,
            ...newMessageRef
        };
    };

    const handleIconClick = (messageId) => {
        // Toggle the options visibility specifically for the clicked message
        setActiveOptionsMessageId(activeOptionsMessageId === messageId ? null : messageId);
    };

    const startEdit = (message) => {
        setEditMessage(message.id);
        setEditedMessageContent(message.content);
    };

    const handleEditKeyDown = (e, messageId) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (editedMessageContent.trim() !== '') {
                handleEdit(messageId, editedMessageContent);
                cancelEdit()
            }
        } else if (e.key === 'Escape') {
            cancelEdit();
        }
    };

    const cancelEdit = () => {
        setEditMessage(null);
        setEditedMessageContent('');
    };
    const handleEdit = async (mId, newContent) => {
        setEditMessage(mId);
        try {
            const messageRef = ref(db, `rooms/${id}/messages/${mId}`);

            await update(messageRef, {
                content: newContent,
            });
            const updatedMessages = messages.map(message =>
                message.id === mId ? { ...message, content: newContent } : message
            );
            setMessages(updatedMessages);
            console.log('Message deleted successfully.');
        } catch (error) {
            console.error('Error deleting message:', error);
        }
    };

    const handleDelete = async (mId) => {
        try {
            const messageRef = ref(db, `rooms/${id}/messages/${mId}`);
            await remove(messageRef);
            setMessages((prevMessages) => prevMessages.filter((message) => message.id !== mId));
            console.log('Message deleted successfully.');
        } catch (error) {
            console.error('Error deleting message:', error);
            // Handle error, show error message to the user, etc.
        }
        console.log('Delete option clicked');
    };

    return (
        <>
            {/* <!-- Start User chat --> */}
            <div className="w-full overflow-hidden transition-all duration-150 bg-white user-chat dark:bg-zinc-800">
                <div className="lg:flex">
                    {/* <!-- start chat conversation section --> */}

                    <div className="relative w-full overflow-hidden ">
                        {id ? <ChatToolbar userData={userData} /> : null}
                        {/* <!-- end chat user head --> */}

                        {/* <!-- start chat conversation --> */}
                        <div className="h-[80vh] overflow-scroll p-4 lg:p-6">
                            {/* {fetching Messages} */}
                            <ul className="mb-0">
                                {!id ? <p>Select a friend to start a chat.</p> : null}
                                {id && !messages.length ? <p>The messages with your friend will appear here.</p> : null}
                                {messages.length > 0 &&
                                    messages.map((message) => (
                                        <li key={message.id} className="clear-both py-4" >
                                            <div className={`flex mr-7 items-end gap-3 ${message.senderId === userData.uid ? 'justify-start' : 'justify-end'}`}>
                                                <div>
                                                    <img src={message?.avatar|| "https://thinksport.com.au/wp-content/uploads/2020/01/avatar-.jpg"} alt="" className="rounded-full h-9 w-9" />
                                                </div>

                                                <div>
                                                    <div className="flex gap-2 mb-2  ">
                                                    <div className={`relative px-5 py-3 text-white rounded-lg ${message.senderName === userData.username ? 'ltr:rounded-bl-none' : 'ltr:rounded-br-none'} bg-violet-500`}>
                                                            <p className="mb-0" >
                                                                {/* {message.content} */}
                                                                {editMessage === message.id ? (
                                                                    <div>
                                                                        <input
                                                                            type="text"
                                                                            value={editedMessageContent}
                                                                            onChange={(e) => setEditedMessageContent(e.target.value)}
                                                                            onKeyDown={(e) => handleEditKeyDown(e, message.id)}
                                                                            onBlur={() => cancelEdit()}
                                                                            autoFocus // Focus the input field when editing starts
                                                                            className="w-full border-transparent bg-transparent focus:outline-none focus:ring-0"
                                                                        />
                                                                        <button onClick={() => cancelEdit()}>Cancel</button>
                                                                        {/* Currently, the "Save" button is not functional. Instead use Enter */}
                                                                        <button onClick={() => handleEdit(message.id, editedMessageContent)}>Save</button>
                                                                    </div>
                                                                ) : (
                                                                    message.content
                                                                )}
                                                            </p>
                                                            <p className="mt-1 mb-0 text-xs text-right text-white/50"><i className="align-middle ri-time-line"></i> <span className="align-middle">    {`${new Date(message.timestamp).toLocaleDateString()} ${new Date(message.timestamp).toLocaleTimeString()}`}</span></p>
                                                         </div>
                                                        <div className={`relative self-start dropdown ${message.senderId === userData.uid ? 'right-0' : 'left-auto'}`}>                                                            <a className="p-0 text-gray-400 border-0 btn dropdown-toggle dark:text-gray-100" href="#" role="button" data-bs-toggle="dropdown" id="dropdownMenuButton12">
                                                                <div>
                                                                    {message?.senderId === user?.uid && <div onClick={() => handleIconClick(message.id)}>
                                                                        <i className="ri-more-2-fill"></i>
                                                                    </div>}
                                                                    {message?.senderId === user?.uid && activeOptionsMessageId === message.id && (
                                                                        <div>
                                                                            <div>
                                                                                <button onClick={() => startEdit(message)}>Edit</button>
                                                                            </div>
                                                                            <button onClick={() => handleDelete(message.id)}>Delete</button>
                                                                        </div>
                                                                    )}
                                                                </div>

                                                            </a>
                                                           
                                                        </div>
                                                    </div>
                                                    <div className={`font-medium ${message.senderName === userData.username ? '' : 'text-right mr-4'} text-gray-700 text-14 dark:text-gray-300`}>{message.senderName}</div>                                                </div>
                                            </div>
                                        </li>
                                    ))
                                }
                            </ul>
                            {/* {End of fetching Messages} */}
                        </div>
                        {/* <!-- end chat conversation end --> */}
                        {/* <!-- start chat input section --> */}
                        {id ?
                            <div className="z-40 w-full p-6 mb-0 bg-white border-t lg:mb-1 border-gray-50 dark:bg-zinc-800 dark:border-zinc-700">
                                <div className="flex gap-2">
                                    <div className="flex-grow">
                                        {/* handleSendMessage    sendMessage(messages) */}
                                        <input type="text" value={newMessage} onChange={handleInputMessage} onClick={() => { sendMessage(messages) }} onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                sendMessage(messages);
                                            }
                                        }} className="w-full border-transparent rounded bg-gray-50 placeholder:text-14 text-14 dark:bg-zinc-700 dark:placeholder:text-gray-300 dark:text-gray-300" placeholder="Enter Message..." />
                                    </div>
                                    <div>
                                        <div>
                                            <ul className="mb-0">
                                                <li className="inline-block" title="Emoji">
                                                    <button type="button" className="border-transparent group/tooltip btn relative group-data-[theme-color=violet]:dark:text-violet-200 group-data-[theme-color=green]:dark:text-green-200 group-data-[theme-color=red]:dark:text-red-200 group-data-[theme-color=violet]:text-violet-500 group-data-[theme-color=green]:text-green-500 group-data-[theme-color=red]:text-red-500 text-16">
                                                        <div className="absolute items-center hidden -top-10 ltr:-left-2 group-hover/tooltip:flex rtl:-right-2">
                                                            <div className="absolute -bottom-1 left-[40%] w-3 h-3 rotate-45 bg-black"></div>
                                                            <span className="relative z-10 p-2 text-xs leading-none text-white whitespace-no-wrap bg-black rounded shadow-lg">Emoji</span>
                                                        </div>
                                                        <i className="ri-emotion-happy-line"></i>
                                                    </button>
                                                </li>

                                                <ChatUploadFile />
                                                {/* Send Message */}
                                                <li className="inline-block">
                                                    <button type="submit" onClick={() => { sendMessage() }} className="text-white border-transparent btn group-data-[theme-color=violet]:bg-violet-500 group-data-[theme-color=green]:bg-green-500 group-data-[theme-color=red]:bg-red-500 group-data-[theme-color=violet]:hover:bg-violet-600 group-data-[theme-color=green]:hover:bg-green-600">
                                                        <i className="ri-send-plane-2-fill"></i>
                                                    </button>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div> : null}
                        {/* <!-- end chat input section --> */}

                    </div>
                    {/* <!-- end chat conversation section --> */}
                </div>
            </div>

        </>
    );
}