import React, { useState, useEffect, useContext } from "react";
import clsx from "clsx";
import Input from "@mui/material/Input";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import axios from "axios";
import Avatar from "@mui/material/Avatar";
import { styled } from "@mui/material/styles";
import Badge from "@mui/material/Badge";

import style from "./listFriend.module.scss";
import AuthContext from "../user/authContext";
import ChatContent from "./chatContent";
import { url } from "../../utils/constant";

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

function ListFriend() {
    const [friend, setFriend] = useState([]);
    const { user, authTokens } = useContext(AuthContext);
    const [currentUser, setCurrentUser] = useState();

    // show list friends
    useEffect(() => {
        const fetchData = async () => {
            const response = await axios({
                url: url + "/user/get-friend/",
                method: "POST",
                headers: {
                    Authorization: `Bearer ${authTokens.access}`,
                },
                data: { text: "text" },
            });
            return response;
        };
        fetchData().then((response) => {
            const listFriend = [];
            response.data.forEach((value) => {
                if (value.userFirst.username === user.username) {
                    listFriend.push({
                        ...value.userSecond,
                        chatID: value.chatID,
                    });
                } else {
                    listFriend.push({
                        ...value.userFirst,
                        chatID: value.chatID,
                    });
                }
            });

            setFriend(listFriend);
        });
        return () => fetchData;
    }, [authTokens.access, user.username]);
    return (
        <div className={clsx(style.chat)}>
            <div className={clsx(style.friend)}>
                <div className={clsx(style.search_friend)}>
                    <Input id="search_input" placeholder="Search..." />
                    <IconButton
                        type="submit"
                        sx={{ p: "10px" }}
                        aria-label="search"
                    >
                        <SearchIcon />
                    </IconButton>
                </div>
                <div className={clsx(style.friend_chatted)}>
                    {friend.map((value, index) => {
                        return (
                            <div
                                className={clsx(style.friend_item)}
                                key={index}
                                onClick={() => {
                                    setCurrentUser(value);
                                }}
                            >
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
                                        src={`${url}${value.avatar}`}
                                        className={clsx(style.user_avatar)}
                                    />
                                </StyledBadge>
                                <div className={clsx(style.friend_name)}>
                                    {`${value.first_name} ${value.last_name}`}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {currentUser ? (
                <ChatContent
                    currentUser={currentUser}
                    className={clsx(style.chat_content)}
                />
            ) : (
                <div className={clsx(style.chat_content)}></div>
            )}
        </div>
    );
}

export default ListFriend;
