import axios from "axios"

export const sendMessage = async (content, chatId, token) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/message`, { content, chatId }, {
        headers: {
            'Content-type': 'application/json',
            'token': `Bearer ${token}`
        }
    })
    return res.data
}

export const allMessage = async (chatId, token) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/message/${chatId}`, {
        headers: {
            'token': `Bearer ${token}`
        }
    })
    return res.data
}