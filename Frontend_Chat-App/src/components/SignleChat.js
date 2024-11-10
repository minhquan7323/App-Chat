import React, { useEffect, useState } from 'react'
import { ChatState } from '../context/ChatProvider'
import { Avatar, Box, FormControl, HStack, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react'
import { ArrowBackIcon } from '@chakra-ui/icons'
import { getSender, getSenderFull } from '../config/ChatLogics'
import ProfileModal from './miscellaneous/ProfileModal'
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal'
import * as MessageService from '../services/MessageService'
import './style.css'
import ScrollableChat from './ScrollableChat'
import io from 'socket.io-client'
import Lottie from 'react-lottie'
import animationData from '../animations/typing.json'

var socket, selectedChatCompare

const SignleChat = ({ fetchAgain, setFetchAgain }) => {
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState()
    const [loading, setLoading] = useState(false)
    const [socketConnected, setSocketConnected] = useState(false)
    const [typing, setTyping] = useState(false)
    const [isTyping, setIsTyping] = useState(false)

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    }

    const toast = useToast()
    const { user, selectedChat, setSelectedChat, notification, setNotification } = ChatState()

    const fetchMessages = async () => {
        if (!selectedChat) return
        try {
            setLoading(true)
            const data = await MessageService.allMessage(selectedChat._id, user?.token)
            setMessages(data)
            setLoading(false)

            socket.emit('join chat', selectedChat._id)
        } catch (error) {
            toast({
                title: 'Error occured!',
                description: 'Failed to load the messages',
                status: 'error',
                duration: 2000,
                isClosable: true,
                position: 'top-right'
            })
        }
    }

    useEffect(() => {
        socket = io(process.env.REACT_APP_ENDPOINT)
        socket.emit('setup', user)
        socket.on('connected', () => setSocketConnected(true))
        socket.on('typing', () => setIsTyping(true))
        socket.on('stop typing', () => setIsTyping(false))
    }, [])

    useEffect(() => {
        fetchMessages()
        selectedChatCompare = selectedChat
    }, [selectedChat])

    useEffect(() => {
        socket.on('message recieved', (newMessageRecieved) => {
            if (!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id) {
                if (!notification.find((notif) => notif._id === newMessageRecieved._id)) {
                    setNotification([newMessageRecieved, ...notification])
                    setFetchAgain(!fetchAgain)
                }
            } else {
                setMessages((prevMessages) => {
                    const isDuplicate = prevMessages.some(msg => msg._id === newMessageRecieved._id)
                    if (!isDuplicate) {
                        return [...prevMessages, newMessageRecieved]
                    }
                    return prevMessages
                })
            }
        })
    }, [selectedChat, notification])



    const sendMessage = async (event) => {
        if (event.key === 'Enter' && newMessage && newMessage.trim() !== '') {
            socket.emit('stop typing', selectedChat._id)
            try {
                const data = await MessageService.sendMessage(newMessage, selectedChat._id, user?.token)
                setNewMessage('')
                setMessages((prevMessages) => [...prevMessages, data])
                socket.emit('new message', data)
            } catch (error) {
                toast({
                    title: 'Error occured!',
                    description: 'Failed to send the message',
                    status: 'error',
                    duration: 2000,
                    isClosable: true,
                    position: 'top-right'
                })
            }
        }
    }

    const typingHandler = (e) => {
        setNewMessage(e.target.value)

        if (!socketConnected) return

        if (!typing) {
            setTyping(true)
            socket.emit("typing", selectedChat._id)
        }
        let lastTypingTime = new Date().getTime()
        var timerLength = 3000
        setTimeout(() => {
            var timeNow = new Date().getTime()
            var timeDiff = timeNow - lastTypingTime
            if (timeDiff >= timerLength && typing) {
                socket.emit("stop typing", selectedChat._id)
                setTyping(false)
            }
        }, timerLength)
    }


    return (
        <>
            {selectedChat ? (
                <>
                    <Text
                        fontSize={{ base: '28px', md: '30px' }}
                        pb={3}
                        px={2}
                        w='100%'
                        display='flex'
                        justifyContent={{ base: 'space-between' }}
                        alignItems='center'
                    >
                        <IconButton
                            display={{ base: 'flex', md: 'none' }}
                            icon={<ArrowBackIcon />}
                            onClick={() => setSelectedChat('')}
                        />
                        {!selectedChat.isGroupChat ? (
                            <>
                                <HStack spacing={2}>
                                    <Avatar
                                        mr={2}
                                        size="sm"
                                        cursor="pointer"
                                        name={selectedChat.users[1].name}
                                        src={selectedChat.users[1].avatar}
                                    />
                                    <Text
                                        fontSize="16px"
                                        display={{ base: "none", sm: "block" }}
                                    >
                                        {getSender(user, selectedChat.users)}
                                    </Text>
                                </HStack>
                                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
                            </>
                        ) : (
                            <>
                                <Text fontSize='16px'>
                                    {selectedChat.chatName}
                                </Text>
                                {/* {selectedChat.chatName.toUpperCase()} */}
                                <UpdateGroupChatModal
                                    fetchAgain={fetchAgain}
                                    setFetchAgain={setFetchAgain}
                                />
                            </>
                        )}
                    </Text>
                    <Box
                        display='flex'
                        flexDir='column'
                        justifyContent='flex-end'
                        p={3}
                        bg='#e8e8e8'
                        w='100%'
                        h='100%'
                        borderRadius='lg'
                        overflowY='hidden'
                    >
                        {loading ? (
                            <Spinner
                                size='xl'
                                w={20}
                                h={20}
                                alignItems='center'
                                margin='auto'
                            />
                        ) : (
                            <div className='messages'>
                                <ScrollableChat messages={messages} />
                            </div>
                        )}
                        <FormControl onKeyDown={sendMessage} mt={3} isRequired>
                            {isTyping ?
                                <div>
                                    <Lottie
                                        options={defaultOptions}
                                        width={70}
                                        style={{
                                            marginBottom: '15px', marginLeft: '0'
                                        }}
                                    />
                                </div>
                                :
                                null
                            }
                            <Input
                                variant='filled'
                                bg='#e0e0e0'
                                placeholder='Enter the message...'
                                onChange={typingHandler}
                                value={newMessage}
                            />
                        </FormControl>
                    </Box>
                </>
            ) : (
                <Box
                    display='flex' alignItems='center' justifyContent='center' h='100%'
                >
                    <Text fontSize='3xl' pb={3}  >
                        cc
                    </Text>
                </Box>
            )
            }
        </>
    )
}

export default SignleChat