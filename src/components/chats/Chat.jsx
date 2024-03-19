import { useState, useEffect, useContext } from "react";
import { AppContext } from "../../AppContext";
import { ChatUploadFile } from "./ChatUploadFile";
import { getMessages, editMessage, sendMessage, deleteMessage, reactToMessage } from "../../service/message.service";

export function Chat({ id, toolbar }) {
    const { user } = useContext(AppContext);
    const [newMessage, setNewMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [loadingMessages, setLoadingMessages] = useState(true);
    const [editedMessage, setEditedMessage] = useState(null);
    const [editedMessageContent, setEditedMessageContent] = useState('');
    const [activeOptionsMessageId, setActiveOptionsMessageId] = useState(null);

    const [pictureURL, setPictureURL] = useState(null);
    const handleFileUploaded = (url) => {
        setPictureURL(url);
    };
    useEffect(() => {
        const unsubscribe = getMessages(id, setMessages, setLoadingMessages);
        return () => {
            unsubscribe();
        };
    }, [id]);
    const handleInputMessage = (e) => {
        e.preventDefault();
        const message = e.target.value;
        setNewMessage(message);
    };

    const handleAcceptMessage = async (newMessage) => {
        if (!newMessage.trim()) return;
        if (!pictureURL) return;
        const messageToSend = pictureURL ? `${newMessage}\n${pictureURL}` : newMessage;
        await sendMessage(newMessage, id, user)
        setNewMessage("");
    };

    const handleEdit = async(mId, newContent) => {
        setEditedMessage(mId);
        try {
            const updatedMessages = await editMessage(mId, newContent, id, messages)
            setMessages(updatedMessages);
        } catch (error) {
            console.error('Error editing message:', error);
            return null;
        }
    };

    const handleIconClick = (messageId) => {
        // Toggle the options visibility specifically for the clicked message
        setActiveOptionsMessageId(activeOptionsMessageId === messageId ? null : messageId);
    };

    const startEdit = (message) => {
        setEditedMessage(message.id);
        setEditedMessageContent(message.content);
    };

    const handleEditKeyDown = (e, messageId) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (editedMessageContent.trim() !== '') {
                handleEdit(messageId, editedMessageContent, id, messages);
                cancelEdit()
            }
        } else if (e.key === 'Escape') {
            cancelEdit();
        }
    };

    const cancelEdit = () => {
        setEditedMessage(null);
        setEditedMessageContent('');
    };

    const handleDelete = async (mId) => {
        try {
            await deleteMessage(mId, id);
            setMessages((prevMessages) => prevMessages.filter((message) => message.id !== mId));
        } catch (error) {
            console.error('Error deleting message:', error);
        }
    };


    return (
        <>
            {/* <!-- Start User chat --> */}
            <div className="w-full overflow-hidden transition-all duration-150 bg-white user-chat dark:bg-zinc-800">
                <div className="lg:flex">
                    {/* <!-- start chat conversation section --> */}

                    <div className="relative w-full overflow-hidden ">
                        {toolbar}
                        {/* <!-- end chat user head --> */}

                        {/* <!-- start chat conversation --> */}
                        <div className="h-[80vh] overflow-scroll p-4 lg:p-6">
                            {/* {fetching Messages} */}
                            <ul className="mb-0">
                                {!id ? <p>Select a friend to start a chat.</p> : null}
                                {id && !messages.length ? <p>Your messages will appear here.</p> : null}

                                {messages.length > 0 &&
                                    messages.map((message) => (
                                        <li key={message.id} className="clear-both py-4" >
                                            <div className={`flex mr-7 items-end gap-3 ${message.senderId === user.uid ? 'justify-start' : 'justify-end'}`}>
                                                <div>
                                                    <img src={message?.avatar || "https://thinksport.com.au/wp-content/uploads/2020/01/avatar-.jpg"} alt="" className="rounded-full h-9 w-9" />
                                                </div>

                                                <div>
                                                    <div className="flex gap-2 mb-2  ">
                                                        <div className={`relative px-5 py-3 text-white rounded-lg ${message.senderName === user.username ? 'ltr:rounded-bl-none' : 'ltr:rounded-br-none'} bg-violet-500`}>
                                                            <div className="mb-0" >
                                                                {/* {message.content} */}
                                                                {editedMessage === message.id ? (
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
                                                                    </div>
                                                                ) : (
                                                                    message.content === pictureURL ? (
                                                                        <div>
                                                                            <img src={pictureURL} alt="Uploaded" style={{ maxHeight: '100px' }} />
                                                                            {/* <p>{message.content}</p> */}
                                                                        </div>
                                                                    ):
                                                                    message.content
                                                                )}
                                                            </div>
                                                            <p className="mt-1 mb-0 text-xs text-right text-white/50"><i className="align-middle ri-time-line"></i> <span className="align-middle">    {`${new Date(message.timestamp).toLocaleDateString()} ${new Date(message.timestamp).toLocaleTimeString().replace(/:\d+ [AP]M/, '')}`}</span></p>

                                                            <div className={`text-xs text-right mt-1 mb-0 cursor: pointer`} >
                                                                {/* Example reaction buttons/icons */}
                                                                <button onClick={() => reactToMessage(message.id, 'thumbsUp', user, id)}>
                                                                    👍 {message.reactions && message.reactions.thumbsUp ? message.reactions.thumbsUp.length : 0}
                                                                </button>
                                                                <button onClick={() => reactToMessage(message.id, 'heart', user, id)}>
                                                                    ❤️ {message.reactions && message.reactions.heart ? message.reactions.heart.length : 0}
                                                                </button>
                                                            </div>
                                                        </div>
                                                        <div className={`relative self-start dropdown ${message.senderId === user.uid ? 'right-0' : 'left-auto'}`}>                                                            <a className="p-0 text-gray-400 border-0 btn dropdown-toggle dark:text-gray-100" href="#" role="button" data-bs-toggle="dropdown" id="dropdownMenuButton12">
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
                                                    <div className={`font-medium ${message.senderName === user.username ? '' : 'text-right mr-4'} text-gray-700 text-14 dark:text-gray-300`}>{message.senderName}</div>                                                </div>

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
                                        <input type="text" value={newMessage} onChange={handleInputMessage}  onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                handleAcceptMessage(newMessage);
                                            }
                                        }} className="w-full border-transparent rounded bg-gray-50 placeholder:text-14 text-14 dark:bg-zinc-700 dark:placeholder:text-gray-300 dark:text-gray-300" placeholder="Enter Message..." />
                                    </div>
                                    <div>
                                        <div>
                                            <ul className="mb-0">
                                                <li className="inline-block" title="Emoji">
                                                    <button  onClick={() => { handleAcceptMessage(newMessage) }} type="button" className="border-transparent group/tooltip btn relative group-data-[theme-color=violet]:dark:text-violet-200 group-data-[theme-color=green]:dark:text-green-200 group-data-[theme-color=red]:dark:text-red-200 group-data-[theme-color=violet]:text-violet-500 group-data-[theme-color=green]:text-green-500 group-data-[theme-color=red]:text-red-500 text-16">
                                                        <div className="absolute items-center hidden -top-10 ltr:-left-2 group-hover/tooltip:flex rtl:-right-2">
                                                            <div className="absolute -bottom-1 left-[40%] w-3 h-3 rotate-45 bg-black"></div>
                                                            <span className="relative z-10 p-2 text-xs leading-none text-white whitespace-no-wrap bg-black rounded shadow-lg">Emoji</span>
                                                        </div>
                                                        <i className="ri-emotion-happy-line"></i>
                                                    </button>
                                                </li>

                                                <ChatUploadFile handleFileUploaded={handleFileUploaded} id={id}/>
                                                {/* Send Message */}
                                                <li className="inline-block">
                                                    <button type="submit" onClick={() => { handleAcceptMessage(newMessage) }} className="text-white border-transparent btn group-data-[theme-color=violet]:bg-violet-500 group-data-[theme-color=green]:bg-green-500 group-data-[theme-color=red]:bg-red-500 group-data-[theme-color=violet]:hover:bg-violet-600 group-data-[theme-color=green]:hover:bg-green-600">
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