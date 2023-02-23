import * as Icon from "react-bootstrap-icons";
import { Form } from "react-bootstrap";
import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchChatsAction, setSelectedChatAction } from "../redux/actions";
import { SocketContent } from "../context/socket";
const WriteNewMessage = () => {
  const [message, setMessage] = useState("");
  const socket = useContext(SocketContent);
  const user = useSelector((state) => state.chats.user);
  const currentChat = useSelector((state) => state.chats.selectedChat);
  const accessToken = useSelector((state) => state.chats.accessToken);
  const selectedChatHistory = useSelector((state) => state.chats.selectedChat);
  const chats = useSelector((state) => state.chats.chatsStore);
  const dispatch = useDispatch();
  useEffect(() => {
    const refreshedChat = chats.find(
      (chat) => chat._id === selectedChatHistory._id
    );
    dispatch(setSelectedChatAction(refreshedChat));
  }, [chats, message]);

  const sendMessage = async () => {
    const newMessage = {
      sender: user._id,
      text: message,
      chatid: selectedChatHistory._id,
    };
    const room = currentChat.room;
    socket.emit("sendMessage", newMessage, room);
    console.log(currentChat.room, "ROOOOOOOOOOOOOOM");
    try {
      const options = {
        method: "POST",
        body: JSON.stringify(newMessage),
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      };
      let response = await fetch(
        `${process.env.REACT_APP_BE_URL}/chats/${currentChat._id}/messages`,
        options
      );
      if (response.ok) {
        dispatch(fetchChatsAction(accessToken));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="write-new-message-container bg-hover flex-utility justify-content-between align-items-center">
      <div className="mr-3">
        <Icon.EmojiSmile className="iconTop" />
      </div>
      <div className="mr-3">
        <Icon.Paperclip className="iconTop" />
      </div>
      <div className="flex-grow-1 h-75 mr-3">
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
            e.target.reset();
          }}
        >
          <Form.Control
            type="text"
            placeholder="Type a message"
            className="h-100"
            onChange={(e) => setMessage(e.target.value)}
          />
        </Form>
      </div>
      <div>
        <Icon.MicFill className="iconTop" />
      </div>
    </div>
  );
};

export default WriteNewMessage;
