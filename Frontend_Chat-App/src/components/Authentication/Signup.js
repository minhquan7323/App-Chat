import React, { useState } from 'react'
import { Button, FormControl, FormLabel, Input, useToast, VStack } from '@chakra-ui/react'
import * as UserService from '../../services/UserService'

const Signup = ({ setSelectedTab }) => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const toast = useToast()
    // const [avatar, setAvatar] = useState('')

    // const postDetails = (avatar) => {
    //     setLoading(true)
    //     if (avatar === undefined) {
    //         toast({
    //             title: 'Please select an image!',
    //             status: 'warning',
    //             duration: 2000,
    //             isClosable: true,
    //             position: 'top-right'
    //         })
    //         setLoading(false)
    //         return
    //     }

    //     if (avatar.type === 'image/jpeg' || avatar.type === 'image/png') {
    //         const data = new FormData()
    //         data.append('file', avatar)
    //         data.append('upload_preset', 'chat-app')
    //         data.append('cloud_name', 'minhquan73')
    //         fetch('https://api.cloudinary.com/v1_1/minhquan73/image/upload', {
    //             method: 'post',
    //             body: data
    //         }).then((res) => res.json())
    //             .then((data) => {
    //                 setAvatar(data.url.toString())
    //                 setLoading(false)
    //             })
    //             .catch((err) => {
    //                 console.log(err)
    //                 setLoading(false)
    //             })
    //     } else {
    //         toast({
    //             title: 'Image must be jpeg or png',
    //             status: 'warning',
    //             duration: 2000,
    //             isClosable: true,
    //             position: 'top-right'
    //         })
    //         setLoading(false)
    //         return
    //     }
    // }

    const submitHandler = async () => {
        setLoading(true)
        if (!name || !email || !password || !confirmPassword) {
            toast({
                title: 'Please fill all the fields',
                status: 'warning',
                duration: 2000,
                isClosable: true,
                position: 'top-right'
            })
            setLoading(false)
            return
        }

        if (password !== confirmPassword) {
            toast({
                title: 'Passwords do not match',
                status: 'warning',
                duration: 2000,
                isClosable: true,
                position: 'top-right'
            })
            setLoading(false)
            return
        }

        try {
            const userData = { name, email, password }
            const { data } = await UserService.signUpUser(userData)

            toast({
                title: 'Sign up successful',
                status: 'success',
                duration: 2000,
                isClosable: true,
                position: 'top-right'
            })

            localStorage.setItem('userInfo', JSON.stringify(data))

            setLoading(false)
            setSelectedTab(0)
        } catch (error) {
            toast({
                title: 'Error occurred',
                description: error.response.data.message,
                status: 'error',
                duration: 2000,
                isClosable: true,
                position: 'top-right'
            })
            setLoading(false)
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            submitHandler()
        }
    }

    const isError = password === '' || email === '' || name === '' || confirmPassword === ''

    return (
        <VStack spacing='10px'>
            <FormControl id='name' isRequired>
                <FormLabel mb='0'>Name</FormLabel>
                <Input
                    placeholder='Enter your name'
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
            </FormControl>
            <FormControl id='email' isRequired>
                <FormLabel mb='0'>Email</FormLabel>
                <Input
                    placeholder='Enter your email'
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
            </FormControl>
            <FormControl id='password' isRequired>
                <FormLabel mb='0'>Password</FormLabel>
                <Input
                    type='password'
                    placeholder='Enter your password'
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
            </FormControl>
            <FormControl id='confirmPassword' isRequired>
                <FormLabel mb='0'>Confirm password</FormLabel>
                <Input
                    type='password'
                    placeholder='Enter your confirm password'
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
            </FormControl>
            {/* <FormControl id='Avatar' isRequired>
                <FormLabel mb='0'>Upload your avatar</FormLabel>
                <Input type='file' onChange={(e) => postDetails(e.target.files[0])} />
            </FormControl> */}
            <Button
                w='100%'
                variant={isError ? 'outline' : 'solid'}
                colorScheme='green'
                onClick={submitHandler}
                isLoading={loading}
            >
                Sign Up
            </Button>
        </VStack>
    )
}

export default Signup
