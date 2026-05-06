import { useState, useEffect, useContext, useRef, useLayoutEffect, } from "react";
import { AppContext } from "../../AppContext";
import { ChatUploadFile } from "./ChatUploadFile";
import { getMessages, editMessage, sendMessage, deleteMessage, reactToMessage, handleDeletePicFromStorage, } from "../../service/message.service";
import { DEFAULT_IMAGE } from "../../service/MediaResolver.service";

export function Chat({ id, toolbar }) {
  const { user } = useContext(AppContext);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [editedMessage, setEditedMessage] = useState(null);
  const [editedMessageContent, setEditedMessageContent] = useState("");
  const [activeOptionsMessageId, setActiveOptionsMessageId] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const unsubscribe = getMessages(id, setMessages, setLoadingMessages);
    return () => {
      unsubscribe();
    };
  }, [id]);

  useLayoutEffect(() => {
    messagesEndRef.current?.scrollIntoView();
  }, [messages]);

  const handleInputMessage = (e) => {
    e.preventDefault();
    const message = e.target.value;
    setNewMessage(message);
  };

  const handleAcceptMessage = async (newMessage) => {
    if (!newMessage.trim()) return;
    await sendMessage(newMessage, id, user);
    setNewMessage("");
  };  

  const handleEdit = async (mId, newContent) => {
    setEditedMessage(mId);
    try {
      const updatedMessages = await editMessage(mId, newContent, id, messages);
      setMessages(updatedMessages);
    } catch (error) {
      console.error("Error editing message:", error);
      return null;
    }
  };

  const handleIconClick = (messageId) => {
    // Toggle the options visibility specifically for the clicked message
    setActiveOptionsMessageId(
      activeOptionsMessageId === messageId ? null : messageId
    );
  };

  const startEdit = (message) => {
    setEditedMessage(message.id);
    setEditedMessageContent(message.content);
  };

  const handleEditKeyDown = (e, messageId) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (editedMessageContent.trim() !== "") {
        handleEdit(messageId, editedMessageContent, id, messages);
        cancelEdit();
      }
    } else if (e.key === "Escape") {
      cancelEdit();
    }
  };

  const cancelEdit = () => {
    setEditedMessage(null);
    setEditedMessageContent("");
  };

  const handleDelete = async (mId, picURL) => {
    try {
      await deleteMessage(mId, id);

      if (picURL) {
        await handleDeletePicFromStorage(picURL);
      }

      setMessages((prevMessages) =>
        prevMessages.filter((message) => message.id !== mId)
      );
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  return (
    <>
      {/* <!-- Start User chat --> */}
      <div className="mt-2 ">
        <div className=" ">
          {/* <!-- start chat conversation section --> */}

          <div className="flex flex-col min-h-screen w-full">
            {toolbar}
            {/* <!-- end chat user head --> */}

            {/* <!-- start chat conversation --> */}
            <div className="flex-1 overflow-auto p-4 lg:p-6">
              {/* {fetching Messages} */}
              <ul className="mb-0">
                {!id ? <p>Select a friend to start a chat.</p> : null}
                {id && !messages.length ? (
                  <p>Your messages will appear here.</p>
                ) : null}

                {/* All message */}
                {messages.length > 0 &&
                  messages.map((message) => (
                    <li key={message.id} className="clear-both py-4">
                      <div className={`flex mr-7 items-end gap-3 ${message.senderId === user.uid ? "justify-start" : "justify-end"}`}>
                        <div>
                          <img src={message?.avatar || "https://thinksport.com.au/wp-content/uploads/2020/01/avatar-.jpg"} alt="" className="rounded-full h-9 w-9" />
                        </div>

                        <div>
                          <div className="flex gap-2 mb-2">
                            <div className={`relative px-5 py-3 text-white rounded-lg ${message.senderName === user.username ? "ltr:rounded-bl-none" : "ltr:rounded-br-none"} bg-violet-500`} >
                              <p className="mb-0">
                                {/* message.content */}
                                {editedMessage === message.id ? (
                                  <div>
                                    <input
                                      value={editedMessageContent}
                                      onChange={(e) => setEditedMessageContent(e.target.value)}
                                      onKeyDown={(e) => handleEditKeyDown(e, message.id)}
                                      onBlur={() => cancelEdit()}
                                      autoFocus // Focus the input field when editing starts
                                      type="text"
                                      className="w-full border-transparent bg-transparent focus:outline-none focus:ring-0"
                                    />
                                    <button onClick={() => cancelEdit()}>
                                      Cancel
                                    </button>
                                  </div>
                                ) :
                                  message.pic ? (
                                    <img src={message.pic || DEFAULT_IMAGE} 
                                    onError={(e) => {
                                      e.target.src = DEFAULT_IMAGE;
                                    }} 
                                    alt="Uploaded" 
                                    style={{ maxHeight: "100px" }} />
                                  ) : (
                                    message.content
                                  )}
                              </p>

                              {/* Date */}
                              <p className="mt-1 mb-0 text-xs text-right text-white/50">
                                <i className="align-middle ri-time-line"></i>{" "}
                                <span className="align-middle"> {" "}
                                  {`${new Date(message.timestamp).toLocaleDateString()} ${new Date(message.timestamp)
                                    .toLocaleTimeString()
                                    .replace(/:\d+ [AP]M/, "")}`}
                                </span>
                              </p>

                              {/* Example reaction buttons/icons */}
                              <div className={`text-xs text-right mt-1 mb-0 cursor: pointer`}>
                                <button onClick={() => reactToMessage(message.id, "thumbsUp", user, id)}>
                                  👍{" "} {message.reactions && message.reactions.thumbsUp ? message.reactions.thumbsUp.length : 0}
                                </button>
                                <button onClick={() => reactToMessage(message.id, "heart", user, id)} >
                                  ❤️{" "} {message.reactions && message.reactions.heart ? message.reactions.heart.length : 0}
                                </button>
                              </div>

                            </div>

                            {/* Dropdown for Edit and Delete */}
                            <div className={`relative self-start dropdown ${message.senderId === user.uid ? "right-0" : "left-auto"}`}>{" "}
                              <a href="#" className="p-0 text-gray-400 border-0 btn dropdown-toggle dark:text-gray-100" role="button" data-bs-toggle="dropdown" id="dropdownMenuButton12" >
                                <div>
                                  {message?.senderId === user?.uid && (
                                    <div onClick={() => handleIconClick(message.id)} >
                                      <i className="ri-more-2-fill"></i>
                                    </div>
                                  )}
                                  {message?.senderId === user?.uid && activeOptionsMessageId === message.id && (
                                    <div className="absolute z-50 w-auto py-2 my-6 text-left list-none bg-white border-none rounded shadow-lg ltr:left-auto ltr:right-0 xl:ltr:left-0 xl:ltr:right-auto rtl:left-0 rtl:right-auto xl:rtl:right-0 xl:rtl:left-auto dropdown-menu bg-clip-padding dark:bg-zinc-700 dark:border-gray-600/50" aria-labelledby="dropdownMenuButton12">
                                      <button onClick={() => startEdit(message)} className="block w-24 px-4 py-2 text-sm font-normal text-gray-700 bg-transparent dropdown-item whitespace-nowrap hover:bg-gray-100/50 dark:text-gray-100 dark:hover:bg-zinc-600 ltr:text-left rtl:text-right">
                                        Edit
                                        <i className="text-gray-500 rtl:float-left ltr:float-right dark:text-gray-200 ri-file-copy-line"></i>
                                      </button>
                                      <button onClick={() => handleDelete(message.id, message.pic)} className="block w-24 px-4 py-2 text-sm font-normal text-gray-700 bg-transparent dropdown-item whitespace-nowrap hover:bg-gray-100/50 dark:text-gray-100 dark:hover:bg-zinc-600 ltr:text-left rtl:text-right">
                                        Delete
                                        <i className="text-gray-500 rtl:float-left ltr:float-right dark:text-gray-200 ri-save-line"></i>
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </a>
                            </div>
                          </div>
                          <div className={`font-medium ${message.senderName === user.username ? "" : "text-right mr-4"} text-gray-700 text-14 dark:text-gray-300`}>
                            {message.senderName}
                          </div>{" "}
                        </div>
                      </div>
                    </li>
                  ))}
                <div ref={messagesEndRef} />
              </ul>
              {/* {End of fetching Messages} */}
            </div>
            {/* <!-- end chat conversation end --> */}

            {/* <!-- start chat input section --> */}
            {id ? (
              <div className="z-40 w-full p-6 mb-0 bg-white border-t lg:mb-1 border-gray-50 dark:bg-zinc-800 dark:border-zinc-700">
                <div className="flex gap-2">
                  <div className="flex-grow">
                    {/* handleSendMessage    sendMessage(messages) */}
                    <input
                      value={newMessage}
                      onChange={handleInputMessage}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAcceptMessage(newMessage);
                        }
                      }}
                      type="text"
                      className="w-full border-transparent rounded bg-gray-50 placeholder:text-14 text-14 dark:bg-zinc-700 dark:placeholder:text-gray-300 dark:text-gray-300"
                      placeholder="Enter Message..."
                    />
                  </div>
                  <div>
                    <div>
                      <ul className="mb-0">
                        <li className="inline-block" title="Emoji">
                          <button onClick={() => { handleAcceptMessage(newMessage); }} type="button" className="border-transparent group/tooltip btn relative group-data-[theme-color=violet]:dark:text-violet-200 group-data-[theme-color=green]:dark:text-green-200 group-data-[theme-color=red]:dark:text-red-200 group-data-[theme-color=violet]:text-violet-500 group-data-[theme-color=green]:text-green-500 group-data-[theme-color=red]:text-red-500 text-16" >
                          </button>
                        </li>

                        <ChatUploadFile id={id} />
                        {/* Send Message */}
                        <li className="inline-block">
                          <button type="submit" onClick={() => { handleAcceptMessage(newMessage); }} className="text-white border-transparent btn group-data-[theme-color=violet]:bg-violet-500 group-data-[theme-color=green]:bg-green-500 group-data-[theme-color=red]:bg-red-500 group-data-[theme-color=violet]:hover:bg-violet-600 group-data-[theme-color=green]:hover:bg-green-600" >
                            <i className="ri-send-plane-2-fill"></i>
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
            {/* <!-- end chat input section --> */}
          </div>
          {/* <!-- end chat conversation section --> */}
        </div>
      </div>
    </>
  );
}
