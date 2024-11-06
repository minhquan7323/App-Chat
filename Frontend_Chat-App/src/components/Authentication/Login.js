import React, { useState } from 'react'
import { Button, FormControl, FormLabel, Input, VStack } from '@chakra-ui/react'

const Login = () => {
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const submitHandler = () => { }

    return (
        <VStack spacing='20px'>
            <FormControl id='email' isRequired>
                <FormLabel mb='0'>Email</FormLabel>
                <Input placeholder='Enter your email' onChange={(e) => setEmail(e.target.value)} />
            </FormControl>
            <FormControl id='password' isRequired>
                <FormLabel mb='0'>Password</FormLabel>
                <Input type='password' placeholder='Enter your password' onChange={(e) => setPassword(e.target.value)} />
            </FormControl>
            <Button w='100%' colorScheme='green' onClick={submitHandler}>
                Login
            </Button>
        </VStack>
    )
}

export default Login
