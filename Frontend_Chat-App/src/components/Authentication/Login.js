import React, { useState } from 'react'
import { Button, FormControl, FormLabel, Input, useToast, VStack } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import * as UserService from '../../services/UserService'

const Login = () => {
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const toast = useToast()
    const navigate = useNavigate()

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            submitHandler()
        }
    }

    const submitHandler = async () => {
        setLoading(true)
        if (!email || !password) {
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

        try {
            const userData = { email, password }
            const data = await UserService.signInUser(userData)
            localStorage.setItem('userInfo', JSON.stringify(data))
            toast({
                title: 'Sign in successful',
                status: 'success',
                duration: 2000,
                isClosable: true,
                position: 'top-right'
            })

            setLoading(false)
            navigate('/chats')
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

    const isError = !email || !password

    const handleGuestLogin = async () => {
        setLoading(true)
        const guestEmail = 'guest@gmail.com'
        const guestPassword = 'guest@gmail.com'
        try {
            const userData = { email: guestEmail, password: guestPassword }
            const data = await UserService.signInUser(userData)
            localStorage.setItem('userInfo', JSON.stringify(data))
            toast({
                title: 'Sign in successful',
                status: 'success',
                duration: 2000,
                isClosable: true,
                position: 'top-right'
            })

            setLoading(false)
            navigate('/chats')
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

    return (
        <VStack spacing='20px'>
            <FormControl id='email' isRequired>
                <FormLabel mb='0'>Email</FormLabel>
                <Input
                    placeholder='Enter your email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
            </FormControl>
            <FormControl id='password' isRequired>
                <FormLabel mb='0'>Password</FormLabel>
                <Input
                    type='password'
                    placeholder='Enter your password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
            </FormControl>
            <Button
                w='100%'
                colorScheme='green'
                variant={isError ? 'outline' : 'solid'}
                onClick={submitHandler}
                isLoading={loading}
            >
                Login
            </Button>
            <Button
                w='100%'
                colorScheme='blue'
                variant='solid'
                onClick={handleGuestLogin}
                isDisabled={loading}
            >
                Login as Guest
            </Button>
        </VStack>
    )
}

export default Login