import React, { useEffect, useState } from 'react'
import { ChatState } from '../context/ChatProvider'
import { Box, Button, Stack, Text, useToast } from '@chakra-ui/react'
import * as ChatService from '../services/ChatService'
import { AddIcon } from '@chakra-ui/icons'
import ChatLoaing from './ChatLoaing'
import { getSender } from '../config/ChatLogics'
import GroupChatModal from './miscellaneous/GroupChatModal'

const MyChats = ({ fetchAgain }) => {
    const [loggedUser, setLoggedUser] = useState()

    const { user, selectedChat, setSelectedChat, chats, setChats, notification, setNotification } = ChatState()

    const toast = useToast()

    const fetchChats = async () => {
        try {
            const data = await ChatService.fetchChats(user?.token)
            setChats(data)
        } catch (error) {
            toast({
                title: 'Error occurred!',
                description: 'Failed to load the chats',
                status: 'error',
                duration: 2000,
                isClosable: true,
                position: 'top-right'
            })
        }
    }

    useEffect(() => {
        setLoggedUser(JSON.parse(localStorage.getItem('userInfo')))
        fetchChats()
    }, [fetchAgain])

    return (
        <Box
            display={{ base: selectedChat ? 'none' : 'flex', md: 'flex' }}
            flexDir='column'
            alignItems='center'
            p={3}
            bg='white'
            w={{ base: '100%', md: '31%' }}
            borderRadius='lg'
            borderWidth='1px'
        >
            <Box
                alignItems='center'
                justifyContent='space-between'
                pb={3}
                display='flex'
                fontSize={{ base: '24px', md: '24px' }}
                bg='white'
                w='100%'
            >
                My Chats
                <GroupChatModal>
                    <Button
                        d='flex'
                        fontSize={{ base: '14px', md: '14px', lg: '17px' }}
                        rightIcon={<AddIcon />}
                    >
                        New Group
                    </Button>
                </GroupChatModal>
            </Box>
            <Box
                display='flex'
                flexDir='column'
                p={3}
                bg='#f8f8f8'
                w='100%'
                h='100%'
                borderRadius='lg'
                overflowY='hidden'
            >
                {chats ? (
                    <Stack overflowY="scroll">
                        {chats.map((chat) => {
                            const isNotified = notification && notification.some((notif) => notif.chat._id === chat._id)

                            return (
                                <Box
                                    cursor="pointer"
                                    bg={selectedChat === chat ? "#38B2AC" : isNotified ? "#C0EBA6" : "#E8E8E8"}
                                    color={selectedChat === chat ? "white" : "black"}
                                    px={3}
                                    py={2}
                                    borderRadius="lg"
                                    key={chat._id}
                                    onClick={() => {
                                        setSelectedChat(chat)
                                        if (isNotified) {
                                            setNotification(notification.filter((notif) => notif.chat._id !== chat._id))
                                        }
                                    }}
                                >
                                    <Text>
                                        {!chat.isGroupChat
                                            ? getSender(loggedUser, chat.users)
                                            : chat.chatName}
                                    </Text>
                                    {chat.latestMessage && (
                                        <Text fontSize="xs">
                                            <b>{chat.latestMessage.sender.name} : </b>
                                            {chat.latestMessage.content.length > 50
                                                ? chat.latestMessage.content.substring(0, 51) + "..."
                                                : chat.latestMessage.content}
                                        </Text>
                                    )}
                                </Box>
                            )
                        })}
                    </Stack>
                ) : (
                    <ChatLoaing />
                )}
            </Box>
        </Box>
    )
}

export default MyChats