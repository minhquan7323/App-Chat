import React, { useEffect, useState } from 'react'
import axios from 'axios'

const ChatsPage = () => {
    const [chats, setChats] = useState([])
    const fetchChats = async () => {
        const res = await axios.get('http://localhost:5000/api/chat')
        setChats(res.data)
    }

    useEffect(() => {
        fetchChats()
    }, [])
    return (
        <div>
            {chats.map((chat) => (
                <div key={chat._id}>{chat.chatName}</div>
            ))}
        </div>
    )
}

export default ChatsPage