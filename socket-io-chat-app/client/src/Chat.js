import React, {useState, useEffect} from 'react'
import ScrollToBottom from 'react-scroll-to-bottom';

// chat function accepts props named socket, username, room
function Chat({socket, username, room}) {
    // function to mutate message state/input 
    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([]);

    // if message is not empty send info of messagedata.. -> time , sender , room  & the actual message
    const sendMessage = async () => {
        if (currentMessage !== "") {
            const messageData = {
                room: room,
                sender: username,
                message: currentMessage,
                // return current message time in hours & minutes
                time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
            };

            // send message data to socket server 
            await socket.emit("send_message", messageData);
            setMessageList((list) => [...list, messageData]);
            setCurrentMessage("");
        }
    };
    // calls function whenever change is made in socket server 
    useEffect(() => {
        socket.on("receive_message", (data) => {
    // grab current list of messages .. set as previous list then add new message that was just sent
            setMessageList((list) => [...list, data]);
            console.log(data);
        })
    }, [socket]);

    return (
        <div className='chat-window'>
            <div class="chat-header">
                <p>Live Chat</p>
            </div>
            <div class="chat-body">
                <ScrollToBottom className="message-container">
                {messageList.map((messageContent) => {
                    return ( 
                    <div className='message' id={username === messageContent.sender ? "you" : "other"}>
                        <div>
                            <div className='message-content'>
                                <p>{messageContent.message}</p>
                            </div>
                            <div className='message-meta'>
                                <p id='time'>{messageContent.time}</p>
                                <p id="author">{messageContent.sender}</p>
                            </div>
                        </div>                    
                </div>
                    );
                })}
                </ScrollToBottom>
            </div>
            <div class="chat-footer">
                <input type="text" placeholder="your message" value={currentMessage} onChange={(event) => {setCurrentMessage(event.target.value)}} onKeyPress={(event) => {event.key === "Enter" && sendMessage();}}/>
                <button onClick={sendMessage}>Send</button>
            </div>
            <p><a href='/'>Exit Chat Room</a></p>
        </div>
    )
}

export default Chat
