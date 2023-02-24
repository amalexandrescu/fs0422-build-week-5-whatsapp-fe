/* eslint-disable react-hooks/exhaustive-deps */
import { Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import * as Icon from "react-bootstrap-icons";
import { format, parseISO } from "date-fns";

import { useContext, useEffect } from "react";
import { getChat } from "../redux/actions";
import { SocketContent } from "../context/socket";

const MainChat = () => {
  const socket = useContext(SocketContent);

  const selectedChatHistory = useSelector((state) => state.chats.selectedChat);

  const myProfile = useSelector((state) => state.chats.user);
  const accessToken = useSelector((state) => state.chats.accessToken);
  const dispatch = useDispatch();

  useEffect(() => {
    socket.on("newMessage", (message) => {
      console.log("MESSAGE IS:", message);
      dispatch(getChat(accessToken, message.chatid));
    });
    return () => {
      socket.removeAllListeners("newMessage");
    };
  }, []);
  useEffect(() => {
    socket.emit("join-room", selectedChatHistory.room);
  }, []);

  return (
    <div className="chat-scroll">
      {selectedChatHistory && selectedChatHistory.history ? (
        selectedChatHistory.history.map((msg) => {
          if (msg.sender.toString() !== myProfile._id.toString()) {
            return (
              <div className="incomingMessage">
                <Row>
                  <div className="d-flex flex-row-reverse pl-4 mt-2">
                    {myProfile.avatar ? (
                      <img
                        src={myProfile.avatar}
                        alt="avarat"
                        className="messageAvatar"
                      />
                    ) : (
                      <Icon.PersonFill />
                    )}
                  </div>
                  <div className="d-flex align-items-end">
                    <div className="d-flex flex-column bg-secondary2 mt-2 ml-2 px-3 py-2 messageBox">
                      <div className="messageName">{myProfile.username}</div>
                      <div>{msg.text}</div>
                    </div>
                    <div className="messageTime">
                      {format(parseISO(msg.createdAt), "HH:mm")}
                    </div>
                  </div>
                </Row>
              </div>
            );
          } else {
            return (
              <div className="outcommingMessage">
                <Row className="outMesssageRow">
                  <div className="d-flex flex-row-reverse pl-4 mt-2">
                    {msg.sender.avatar ? (
                      <img
                        src={msg.sender.avatar}
                        alt="avarat"
                        className="messageAvatar"
                      />
                    ) : (
                      <Icon.PersonFill />
                    )}
                  </div>
                  <div className="d-flex align-items-end">
                    <div className="d-flex flex-column bg-green mt-2 ml-2 px-3 py-2 messageBox">
                      <div className="messageName">{msg.sender.username}</div>
                      <div>{msg.text}</div>
                    </div>
                    <div className="messageTime">
                      {format(parseISO(msg.createdAt), "HH:mm")}
                    </div>
                  </div>
                </Row>
              </div>
            );
          }
        })
      ) : (
        <></>
      )}
    </div>
  );
};

export default MainChat;
