import React from "react";
import clsx from "clsx";
import style from "./social.module.scss";
import { EmojiButton } from "@joeattardi/emoji-button";

function Social() {
    React.useEffect(() => {
        const picker = new EmojiButton();
        const trigger = document.querySelector("#emoji-trigger");

        picker.on("emoji", (selection) => {
            // handle the selected emoji here
            console.log(selection.emoji);
        });

        trigger.addEventListener("click", () => picker.togglePicker(trigger));
    }, []);

    return (
        <div className={clsx(style.social)}>
            <button id="emoji-trigger">Emoji</button>
        </div>
    );
}

export default Social;
