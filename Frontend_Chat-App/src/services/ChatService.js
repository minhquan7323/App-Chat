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
