import React, { useState } from "react";
import clsx from "clsx";
import style from "./friendChat.module.scss";
import { url } from "../../utils/constant";
import Avatar from "@mui/material/Avatar";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { default as MTMenu } from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import ListItemIcon from "@mui/material/ListItemIcon";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

function FriendChat({ avatar, message, status }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <div className={clsx(style.friend_chat)}>
            <Avatar
                alt="Remy Sharp"
                src={url + avatar}
                className={clsx(style.user_avatar)}
            />
            {status === "TEXT" ? (
                <span className={clsx(style.chat_box)}>{message}</span>
            ) : status === "IMAGE" ? (
                <img
                    src={url + message}
                    alt=""
                    className={clsx(style.chat_img)}
                />
            ) : (
                <span className={clsx(style.chat_box)}>
                    <a href={url + message}>
                        {decodeURIComponent(message.split("/")[3])}
                    </a>
                </span>
            )}
            <MoreVertIcon
                className={clsx(style.more_icon)}
                onClick={handleClick}
            />
            <MTMenu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: "visible",
                        filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                        mt: 1.5,
                        "& .MuiAvatar-root": {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                        "&:before": {
                            content: '""',
                            display: "block",
                            position: "absolute",
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: "background.paper",
                            transform: "translateY(-50%) rotate(45deg)",
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
                <Divider />
                <MenuItem>
                    <ListItemIcon>
                        <DeleteOutlineIcon fontSize="small" />
                    </ListItemIcon>
                    Xóa tin nhắn
                </MenuItem>
            </MTMenu>
        </div>
    );
}

// export default React.memo(FriendChat);
export default FriendChat;
