import axios from "axios"

export const signUpUser = async (data) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/user/signup`, data, {
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