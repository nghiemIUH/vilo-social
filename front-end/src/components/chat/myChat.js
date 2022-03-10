import React from "react";
import style from "./myChat.module.scss";
import clsx from "clsx";
import Avatar from "@mui/material/Avatar";
import { url } from "../../utils/constant";

function MyChat({ avatar, message }) {
    return (
        <div className={clsx(style.my_chat)}>
            <Avatar
                alt="Remy Sharp"
                src={url + avatar}
                className={clsx(style.user_avatar)}
            />
            <span className={clsx(style.chat_box)}>{message}</span>
        </div>
    );
}

export default React.memo(MyChat);
