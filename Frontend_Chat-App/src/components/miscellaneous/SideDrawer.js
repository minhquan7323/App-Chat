import { Avatar, Box, Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Input, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Spinner, Text, Tooltip, useDisclosure, useToast } from '@chakra-ui/react'
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons'
import React, { useState } from 'react'
import { ChatState } from '../../context/ChatProvider'
import ProfileModal from './ProfileModal'
import { useNavigate } from 'react-router-dom'
import * as UserService from '../../services/UserService'
import * as ChatService from '../../services/ChatService'
import ChatLoaing from '../ChatLoaing'
import UserListItem from '../UserAvatar/UserListItem'
import { getSender } from '../../config/ChatLogics'
// import { Effect } from 'react-notification-badge'
// import NotificationBadge from 'react-notification-badge'

const SideDrawer = () => {
    const [search, setSearch] = useState('')
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)
    const [loadingChat, setLoadingChat] = useState()

    const navigate = useNavigate()
    const { isOpen, onClose, onOpen } = useDisclosure()
    const { user, setSelectedChat, chats, setChats, notification, setNotification } = ChatState()

    const logoutHandler = () => {
        localStorage.removeItem('userInfo')
        navigate('/')
    }

    const toast = useToast()

    const handleSearch = async () => {
        if (!search) {
            toast({
                title: 'Please enter something to search',
                status: 'warning',
                duration: 2000,
                isClosable: true,
                position: 'top-right'
            })
            return
        }
        try {
            setLoading(true)
            const data = await UserService.searchUser(search, user?.token)
            setSearchResult(data)
            setLoading(false)
        } catch (error) {
            toast({
                title: 'Error occurred',
                description: 'Failed to load the search results',
                status: 'error',
                duration: 2000,
                isClosable: true,
                position: 'top-right'
            })
            setLoading(false)
        }
    }

    const accessChat = async (userId) => {
        try {
            setLoadingChat(true)
            const data = await ChatService.accessChat(userId, user?.token)

            if (!chats.find((c) => c._id === data._id))
                setChats([data, ...chats])

            setSelectedChat(data)
            setLoadingChat(false)
            onClose()
        } catch (error) {
            toast({
                title: 'Error fetching the chat',
                description: error.message,
                status: 'error',
                duration: 2000,
                isClosable: true,
                position: 'top-right'
            })
        }
    }

    return (
        <>
            <Box
                display='flex'
                justifyContent='space-between'
                alignItems='center'
                bg='white'
                w='100%'
                p='5px 10px'
                borderBottomWidth='5px'
            >
                {/* <Tooltip label='Search user' hasArrow placement='bottom'> */}
                <Button variant='ghost' onClick={onOpen}>
                    <i className="fas fa-magnifying-glass"></i>
                    <Text display={{ base: 'none', md: 'flex' }} px='4'>
                        Search
                    </Text>
                </Button>
                {/* </Tooltip> */}
                <Text fontSize='2xl'>
                    Chat App
                </Text>
                <div>
                    <Menu>
                        <MenuButton p={1}>
                            {/* <NotificationBadge
                                count={notification.length}
                                effect={Effect.SCALE}
                            /> */}
                            <BellIcon fontSize='2xl' m={1} />
                        </MenuButton>
                        <MenuList p={2}>
                            {!notification.length && 'No new messages'}
                            {notification.map((notif) => {
                                return (
                                    <MenuItem
                                        key={notif._id}
                                        onClick={() => {
                                            setSelectedChat(notif.chat)
                                            setNotification(notification.filter((n) => n !== notif))
                                        }}>
                                        {notif.chat.isGroupChat ?
                                            `New message in ${notif.chat.chatName}`
                                            :
                                            `New message from ${getSender(user, notif.chat.users)}`
                                        }
                                    </MenuItem>
                                )
                            })}
                        </MenuList>
                    </Menu>
                    <Menu>
                        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                            <Avatar size='sm' cursor='pointer' name={user.name} src={user.avatar} />
                        </MenuButton>
                        <MenuList>
                            <ProfileModal user={user}>
                                <MenuItem>My profile</MenuItem>
                            </ProfileModal>
                            <MenuDivider />
                            <MenuItem onClick={logoutHandler}>Log out</MenuItem>
                        </MenuList>
                    </Menu>
                </div>
            </Box>
            <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader borderBottomWidth='1px'>
                        Search users
                    </DrawerHeader>
                    <DrawerBody>
                        <Box
                            display='flex'
                            pb={2}
                        >
                            <Input
                                placeholder='Search user or email'
                                mr={2}
                                value={search}
                                onChange={(e) => { setSearch(e.target.value) }}
                            />
                            <Button onClick={handleSearch}>Go</Button>
                        </Box>
                        {loading ? (
                            <ChatLoaing />
                        ) : (
                            Array.isArray(searchResult) && searchResult.length > 0 ? (
                                searchResult.map((user) => (
                                    <UserListItem
                                        key={user._id}
                                        user={user}
                                        handleFuntion={() => accessChat(user._id)}
                                    />
                                ))
                            ) : (
                                <Text>No users found</Text>
                            )
                        )}
                        {loadingChat && <Spinner ml='auto' display='flex' />}
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    )
}

export default SideDrawer
