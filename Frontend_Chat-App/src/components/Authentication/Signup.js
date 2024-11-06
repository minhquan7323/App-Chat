import React, { useState } from 'react'
import { Button, FormControl, FormLabel, Input, VStack } from '@chakra-ui/react'
const Signup = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [avatar, setAvatar] = useState('')

    // const postDetails = (avatar) => {

    // }

    const submitHandler = () => {

    }
    return (
        <VStack spacing='10px'>
            <FormControl id='name' isRequired>
                <FormLabel mb='0'>Name</FormLabel>
                <Input placeholder='Enter your name' onChange={(e) => setName(e.target.value)} />
            </FormControl>
            <FormControl id='email' isRequired>
                <FormLabel mb='0'>Email</FormLabel>
                <Input placeholder='Enter your email' onChange={(e) => setEmail(e.target.value)} />
            </FormControl>
            <FormControl id='password' isRequired>
                <FormLabel mb='0'>Password</FormLabel>
                <Input type='password' placeholder='Enter your password' onChange={(e) => setPassword(e.target.value)} />
            </FormControl>
            <FormControl id='confirmPassword' isRequired>
                <FormLabel mb='0'>Confirm password</FormLabel>
                <Input type='password' placeholder='Enter your confirm password' onChange={(e) => setConfirmPassword(e.target.value)} />
            </FormControl>
            {/* <FormControl id='Avatar' isRequired>
                <FormLabel mb='0'>Upload your avatar</FormLabel>
                <Input type='file' onChange={(e) => postDetails(e.target.files[0])} />
            </FormControl> */}
            <Button w='100%' colorScheme='green' onClick={submitHandler}>
                Sign Up
            </Button>
        </VStack>
    )
}

export default Signup