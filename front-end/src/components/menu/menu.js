import React, { useState, useContext } from "react";
import clsx from "clsx";
import style from "./menu.module.scss";
import Avatar from "@mui/material/Avatar";
import { Link } from "react-router-dom";

import { url } from "../../utils/constant";
import AuthContext from "../user/authContext";
import { default as MTMenu } from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import ListItemIcon from "@mui/material/ListItemIcon";
import Logout from "@mui/icons-material/Logout";
import PersonAdd from "@mui/icons-material/PersonAdd";
import Settings from "@mui/icons-material/Settings";
import SettingsIcon from "@mui/icons-material/Settings";
import IconButton from "@mui/material/IconButton";

function Menu() {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const [select, setSelect] = useState("1");
    const { user, logoutUser } = useContext(AuthContext);
    return (
        <div className={clsx(style.menu)}>
            <div className={clsx(style.menu_top)}>
                <Avatar
                    src={url + user.avatar}
                    style={{
                        width: "50px",
                        height: "50px",
                        alignItems: "center",
                    }}
                />
                <div className={clsx(style.list_menu)}>
                    <Link to="/" onClick={() => setSelect("1")}>
                        <i
                            className={"fab fa-rocketchat " + style.chat_icon}
                            style={{ color: select === "1" ? "#fff" : "#000" }}
                        ></i>
                    </Link>
                    <Link to="/add-friend" onClick={() => setSelect("2")}>
                        <i
                            className={"fas fa-address-book " + style.chat_icon}
                            style={{ color: select === "2" ? "#fff" : "#000" }}
                        ></i>
                    </Link>
                    <Link to="/social" onClick={() => setSelect("3")}>
                        <i
                            className={
                                "fas fa-calendar-week " + style.chat_icon
                            }
                            style={{ color: select === "3" ? "#fff" : "#000" }}
                        ></i>
                    </Link>
                </div>
            </div>

            <div className={clsx(style.logout)}>
                <IconButton
                    onClick={handleClick}
                    size="small"
                    sx={{ ml: 2 }}
                    aria-controls={open ? "account-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                    style={{ margin: "0 auto" }}
                >
                    <SettingsIcon sx={{ width: 32, height: 32 }}></SettingsIcon>
                </IconButton>
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
                    <MenuItem>
                        <Avatar src={url + user.avatar} /> Profile
                    </MenuItem>
                    <Divider />
                    <MenuItem>
                        <ListItemIcon>
                            <PersonAdd fontSize="small" />
                        </ListItemIcon>
                        Add friend
                    </MenuItem>
                    <MenuItem>
                        <ListItemIcon>
                            <Settings fontSize="small" />
                        </ListItemIcon>
                        Settings
                    </MenuItem>
                    <MenuItem onClick={logoutUser}>
                        <ListItemIcon>
                            <Logout fontSize="small" />
                        </ListItemIcon>
                        Logout
                    </MenuItem>
                </MTMenu>
            </div>
        </div>
    );
}

export default Menu;
