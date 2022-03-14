import React, { useState, useEffect, useRef, useContext } from "react";
import clsx from "clsx";
import style from "./chatContent.module.scss";
import { styled } from "@mui/material/styles";
import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import { url } from "../../utils/constant";
import AuthContext from "../user/authContext";
import MyChat from "./myChat";
import FriendChat from "./friendChat";
import { EmojiButton } from "@joeattardi/emoji-button";
import AddIcCallOutlinedIcon from "@mui/icons-material/AddIcCallOutlined";
import VideocamOutlinedIcon from "@mui/icons-material/VideocamOutlined";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import axios from "axios";

function ChatContent({ currentUser }) {
    const { user, authTokens } = useContext(AuthContext);
    const [chat, setChat] = useState({
        chat: [],
        typing: false,
        page: 1,
        isScroll: true,
    });
    const ws = useRef();
    const text_input = useRef();
    const chat_body = useRef();
    const select_file = useRef();

    // send message to socket
    const sendMessage = () => {
        const text = text_input.current.value;
        if (text.trim() === "") return;
        text_input.current.value = "";
        ws.current.send(
            JSON.stringify({
                type: "chat",
                message: text,
                user_id: user.id,
                status: "TEXT",
            })
        );
    };

    // typing
    const checkTyping = (e) => {
        if (e.target.value.length !== 0) {
            ws.current.send(
                JSON.stringify({
                    type: "start_typing",
                    user_id: user.id,
                })
            );
        } else {
            ws.current.send(
                JSON.stringify({
                    type: "end_typing",
                    user_id: user.id,
                })
            );
        }
    };

    /**
     * get chat
     */
    useEffect(() => {
        const formData = new FormData();
        formData.append("chatID", currentUser.chatID);
        formData.append("page", 1);
        const getChat = async () => {
            const response = await axios({
                url: url + "/chat/get-chat-page/",
                method: "POST",
                headers: {
                    Authorization: "Bearer " + authTokens.access,
                },
                data: formData,
            });
            return response;
        };
        getChat().then((response) => {
            setChat((prev) => {
                return { ...prev, chat: response.data };
            });
        });
    }, [authTokens.access, currentUser.chatID]);

    useEffect(() => {
        const picker = new EmojiButton({
            autoHide: false,
            emojiSize: "1.5rem",
            showAnimation: false,
        });
        const trigger = document.querySelector("#icon_picker");

        picker.on("emoji", (selection) => {
            document.querySelector("#chat_input").value += selection.emoji;
        });

        trigger.addEventListener("click", () => picker.togglePicker(trigger));
        text_input.current.focus();
    }, []);

    // connect websocket
    useEffect(() => {
        ws.current = new WebSocket(
            `ws://${url.split("//")[1]}/ws/chat/${currentUser.chatID}/`
        );
        ws.current.onopen = () => {
            console.log("connect ");
        };

        ws.current.onmessage = (e) => {
            const data = JSON.parse(e.data);
            if (data.type === "chat") {
                setChat((prev) => {
                    return {
                        ...prev,
                        chat: [...prev.chat, data],
                        typing: false,
                        isScroll: true,
                    };
                });
            } else if (data.type === "start_typing") {
                if (data.user_id !== user.id)
                    setChat((prev) => {
                        return { ...prev, typing: true };
                    });
            } else if (data.type === "end_typing") {
                if (data.user_id !== user.id)
                    setChat((prev) => {
                        return { ...prev, typing: false };
                    });
            }
        };

        // close
        const wsCurrent = ws.current;
        return () => {
            wsCurrent.close();
        };
    }, [currentUser.chatID, user.id]);

    useEffect(() => {
        const element = document.querySelector("#chat_input");
        element.addEventListener("keydown", (e) => {
            if (e.keyCode === 13 && !e.shiftKey) {
                e.preventDefault();
                document.querySelector("#send").click();
            }
        });
    }, [user.id]);

    useEffect(() => {
        if (chat.isScroll)
            chat_body.current.scrollTop = chat_body.current.scrollHeight;
        else chat_body.current.scrollTop = chat_body.current.scrollHeight / 5;
    }, [chat]);

    const handleScroll = async (e) => {
        const scroll = e.target;
        if (scroll.scrollTop === 0) {
            const formData = new FormData();
            formData.append("chatID", currentUser.chatID);
            formData.append("page", chat.page);
            await axios({
                url: url + "/chat/get-chat-page/",
                method: "POST",
                headers: {
                    Authorization: "Bearer " + authTokens.access,
                },
                data: formData,
            })
                .then((response) => {
                    const data = response.data;
                    if (response.status === 200) {
                        setChat((prev) => {
                            return {
                                ...prev,
                                chat: [...data, ...prev.chat],
                                page: prev.page + 1,
                                isScroll: false,
                            };
                        });
                    }
                })
                .catch((e) => console.log(e));
        }
    };

    const handleSendFile = async () => {
        const formData = new FormData();
        formData.append("file", select_file.current.files[0]);
        formData.append("user_id", user.id);
        formData.append("chatID", currentUser.chatID);
        await axios({
            url: url + "/chat/save-file/",
            method: "POST",
            headers: {
                Authorization: "Bearer " + authTokens.access,
            },
            data: formData,
        }).then((response) => {
            const message = response.data.message;
            const status = response.data.status;
            ws.current.send(
                JSON.stringify({
                    type: "chat_file",
                    message: message,
                    user_id: user.id,
                    status: status,
                })
            );
        });
    };
    return (
        <div className={clsx(style.chat_content)}>
            <div className={clsx(style.chat_header)}>
                <div className={clsx(style.friend_item)}>
                    <StyledBadge
                        overlap="circular"
                        anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "right",
                        }}
                        variant="dot"
                    >
                        <Avatar
                            alt="Remy Sharp"
                            src={url + currentUser.avatar}
                            className={clsx(style.user_avatar)}
                        />
                    </StyledBadge>
                    <div
                        className={clsx(style.friend_name)}
                    >{`${currentUser.first_name} ${currentUser.last_name}`}</div>
                </div>
                <div className={clsx(style.call)}>
                    <AddIcCallOutlinedIcon fontSize="inderhit" />
                    <VideocamOutlinedIcon fontSize="inderhit" />
                </div>
            </div>
            <div
                className={clsx(style.chat_body)}
                id="chat_body"
                ref={chat_body}
                onScroll={handleScroll}
            >
                {chat.chat.map((value, index) => {
                    return value.user_id === user.id ? (
                        <MyChat
                            avatar={user.avatar}
                            message={value.message}
                            status={value.status}
                            key={index}
                        />
                    ) : (
                        <FriendChat
                            avatar={currentUser.avatar}
                            message={value.message}
                            status={value.status}
                            key={index}
                        />
                    );
                })}
            </div>

            {/* chat footer */}
            <div className={clsx(style.chat_footer)}>
                {chat.typing ? (
                    <div className={clsx(style.typing)}>
                        {currentUser.first_name +
                            " " +
                            currentUser.last_name +
                            " đang soạn tin nhắn ..."}
                    </div>
                ) : (
                    ""
                )}
                <div className={clsx(style.chat_input)}>
                    <TextareaAutosize
                        placeholder="Input text..."
                        id="chat_input"
                        maxRows={2}
                        ref={text_input}
                        onChange={checkTyping}
                    />
                </div>
                <label
                    htmlFor="select_file"
                    className={clsx(style.attach_file)}
                    title="Attach file"
                >
                    <AttachFileIcon />
                </label>
                <input
                    type="file"
                    id="select_file"
                    hidden
                    ref={select_file}
                    onChange={handleSendFile}
                />

                <img
                    src="1f600.png"
                    alt=""
                    className={clsx(style.select_icon)}
                    id="icon_picker"
                />

                <div
                    className={clsx(style.string_send)}
                    id="send"
                    onClick={sendMessage}
                >
                    Gửi
                </div>
            </div>
        </div>
    );
}

const StyledBadge = styled(Badge)(({ theme }) => ({
    "& .MuiBadge-badge": {
        backgroundColor: "#44b700",
        color: "#44b700",
        boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
        "&::after": {
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            animation: "ripple 1.2s infinite ease-in-out",
            border: "1px solid currentColor",
            content: '""',
        },
    },
    "@keyframes ripple": {
        "0%": {
            transform: "scale(.8)",
            opacity: 1,
        },
        "100%": {
            transform: "scale(2.4)",
            opacity: 0,
        },
    },
}));

export default React.memo(ChatContent);
// export default ChatContent;
