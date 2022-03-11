import React, { useState, useEffect, useRef, useContext } from "react";
import clsx from "clsx";
import style from "./chatContent.module.scss";
import { styled } from "@mui/material/styles";
import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";
import Picker from "emoji-picker-react";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import { url } from "../../utils/constant";
import AuthContext from "../user/authContext";
import MyChat from "./myChat";
import FriendChat from "./friendChat";

function ChatContent({ currentUser }) {
    const [showPickerIcon, setShowPickerIcon] = useState(false);
    const { user } = useContext(AuthContext);
    const [chat, setChat] = useState({
        chat: [],
        typing: false,
    });
    const ws = useRef();
    const text_input = useRef();

    const closePicker = (e) => {
        if (
            e.path[0] !== document.querySelector("#icon_picker") &&
            e.path[0].className !== "emoji-img"
        ) {
            setShowPickerIcon(false);
        }
    };

    // send message to socket
    const sendMessage = () => {
        const text = document.querySelector("#chat_input").value;
        document.querySelector("#chat_input").value = "";
        ws.current.send(
            JSON.stringify({
                type: "chat",
                message: text,
                user_id: user.id,
            })
        );

        setChat((prev) => {
            return {
                ...prev,
                chat: [...prev.chat, { message: text, user_id: user.id }],
            };
        });
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

    useEffect(() => {
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
    }, [chat, currentUser.chatID, user.id]);

    useEffect(() => {
        const element = document.querySelector("#chat_input");
        element.addEventListener("keydown", (e) => {
            if (e.keyCode === 13 && !e.shiftKey) {
                e.preventDefault();
                document.querySelector("#send").click();
            }
        });
    }, [user.id]);

    // close icon picker
    useEffect(() => {
        window.addEventListener("click", closePicker);
        return () => {
            window.addEventListener("click", closePicker);
        };
    }, []);

    useEffect(() => {
        const element = document.getElementById("chat_body");
        element.scrollTop = element.scrollHeight;
    }, [chat]);

    const pickerIcon = (_event, emoji) => {
        document.querySelector("#chat_input").value += emoji.emoji;
    };

    return (
        <div className={clsx(style.chat_content)}>
            {}
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
            </div>
            <div className={clsx(style.chat_body)} id="chat_body">
                {chat.chat.map((value, index) => {
                    return value.user_id === user.id ? (
                        <MyChat
                            avatar={user.avatar}
                            message={value.message}
                            key={index}
                        />
                    ) : (
                        <FriendChat
                            avatar={currentUser.avatar}
                            message={value.message}
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

                <img
                    src="1f600.png"
                    alt=""
                    className={clsx(style.select_icon)}
                    id="icon_picker"
                    onClick={() => {
                        setShowPickerIcon((show) => !show);
                    }}
                />

                <div
                    className={clsx(style.picker_icon)}
                    style={{ display: showPickerIcon ? "block" : "none" }}
                >
                    <Picker onEmojiClick={pickerIcon} disableSearchBar={true} />
                </div>
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
