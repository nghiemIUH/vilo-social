import React from "react";
import clsx from "clsx";
import style from "./friendChat.module.scss";
import { url } from "../../utils/constant";
import Avatar from "@mui/material/Avatar";

function FriendChat({ avatar, message }) {
    return (
        <div className={clsx(style.friend_chat)}>
            <Avatar
                alt="Remy Sharp"
                src={url + avatar}
                className={clsx(style.user_avatar)}
            />
            <span className={clsx(style.chat_box)}>{message}</span>
        </div>
    );
}

// export default React.memo(FriendChat);
export default FriendChat;
