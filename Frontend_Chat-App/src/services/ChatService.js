import axios from "axios"

export const accessChat = async (userId, token) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/chat`, { userId }, {
        headers: {
            'Content-type': 'application/json',
            'token': `Bearer ${token}`
        }
    })
    return res.data
}

export const fetchChats = async (token) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/chat`, {
        headers: {
            'token': `Bearer ${token}`
        }
    })
    return res.data
}

export const groupChat = async (name, users, token) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/chat/group`, { name, users }, {
        headers: {
            'token': `Bearer ${token}`
        }
    })
    return res.data
}

export const renameChat = async (chatId, chatName, token) => {
    const res = await axios.put(`${process.env.REACT_APP_API_URL}/chat/rename`, { chatId, chatName }, {
        headers: {
            'token': `Bearer ${token}`
        }
    })
    return res.data
}

export const addChat = async (chatId, userId, token) => {
    const res = await axios.put(`${process.env.REACT_APP_API_URL}/chat/addgroup`, { chatId, userId }, {
        headers: {
            'token': `Bearer ${token}`
        }
    })
    return res.data
}

export const removeChat = async (chatId, userId, token) => {
    const res = await axios.put(`${process.env.REACT_APP_API_URL}/chat/removegroup`, { chatId, userId }, {
        headers: {
            'token': `Bearer ${token}`
        }
    })
    return res.data
}