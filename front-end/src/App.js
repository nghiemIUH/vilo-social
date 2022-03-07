import "./App.css";
import { useEffect } from "react";
function App() {
    useEffect(() => {
        const socket = new WebSocket(`ws://127.0.0.1:8000/ws/chat/123/`);
        socket.onopen = () => {
            console.log("connect");
        };
        socket.onmessage = (e) => {
            const data = JSON.parse(e.data);
            document.querySelector("#chat-log").value += data.message + "\n";
        };

        socket.onerror = (e) => {
            console.log(e);
        };

        socket.onclose = () => {
            console.log("disconnect");
        };
        document.querySelector("#chat-message-input").focus();
        document.querySelector("#chat-message-input").onkeyup = function (e) {
            if (e.keyCode === 13) {
                // enter, return
                document.querySelector("#chat-message-submit").click();
            }
        };

        document.querySelector("#chat-message-submit").onclick = function (e) {
            const messageInputDom = document.querySelector(
                "#chat-message-input"
            );
            const message = messageInputDom.value;
            socket.send(
                JSON.stringify({
                    message: message,
                })
            );
            messageInputDom.value = "";
        };
    }, []);

    return (
        <div className="App">
            <textarea id="chat-log" cols="30" rows="20"></textarea>
            <br />
            <input id="chat-message-input" />
            <button type="submit" id="chat-message-submit">
                Enter
            </button>
        </div>
    );
}

export default App;
