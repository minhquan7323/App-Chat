import { useNavigate } from "react-router-dom"
const { createContext, useContext, useState, useEffect } = require("react")

const ChatContext = createContext()

const ChatProvider = ({ children }) => {
    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [selectedChat, setSelectedChat] = useState()
    const [chats, setChats] = useState([])
    const [notification, setNotification] = useState([])

    useEffect(() => {
        const userInfo = localStorage.getItem('userInfo')
        if (userInfo) {
            try {
                const parsedUser = JSON.parse(userInfo)
                setUser(parsedUser)
            } catch (error) {
                localStorage.removeItem('userInfo')
                navigate('/')
            }
        } else {
            navigate('/')
        }
    }, [navigate])

    return (
        <ChatContext.Provider
            value={{
                user, setUser,
                selectedChat, setSelectedChat,
                chats, setChats,
                notification, setNotification
            }}
        >
            {children}
        </ChatContext.Provider>
    )
}

export const ChatState = () => {
    return useContext(ChatContext)
}

export default ChatProvider
