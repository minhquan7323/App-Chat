import axios from "axios"

export const signUpUser = async (data) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/user/`, data, {
        headers: {
            'Content-type': 'application/json'
        }
    })
    return res.data
}

export const signInUser = async (data) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/user/signin`, data, {
        headers: {
            'Content-type': 'application/json'
        }
    })
    return res.data
}

export const searchUser = async (search, token) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/user?search=${search}`, {
        headers: {
            'Content-type': 'application/json',
            'token': `Bearer ${token}`
        }
    })
    return res.data
}