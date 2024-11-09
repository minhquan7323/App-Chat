import { Box, Button, FormControl, Image, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { ChatState } from '../../context/ChatProvider'
import * as UserService from '../../services/UserService'
import * as ChatService from '../../services/ChatService'
import UserListItem from '../UserAvatar/UserListItem'
import UserBadgeItem from '../UserAvatar/UserBadgeItem'

const GroupChatModal = ({ children }) => {
    const { isOpen, onClose, onOpen } = useDisclosure()
    const [groupChatName, setGroupChatName] = useState()
    const [selectedUsers, setSelectedUsers] = useState([])
    const [search, setSearch] = useState('')
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)

    const toast = useToast()

    const { user, chats, setChats } = ChatState()

    const handleSearch = async (query) => {
        setSearch(query)
        if (!query) {
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
    const handleSubmit = async () => {
        if (!groupChatName || !selectedUsers) {
            toast({
                title: 'Please fill all the fields',
                status: 'warning',
                duration: 2000,
                isClosable: true,
                position: 'top-right'
            })
            return
        }
        try {
            const users = JSON.stringify(selectedUsers.map(u => u._id))
            const data = await ChatService.groupChat(groupChatName, users, user?.token)
            setChats([data, ...chats])
            onClose()
            toast({
                title: 'New group chat created',
                status: 'success',
                duration: 2000,
                isClosable: true,
                position: 'top-right'
            })
        } catch (error) {
            toast({
                title: 'Failed to create the chat!',
                description: error.response.data,
                status: 'error',
                duration: 2000,
                isClosable: true,
                position: 'top-right'
            })
        }
    }
    const handleGroup = (userToAdd) => {
        if (selectedUsers.includes(userToAdd)) {
            toast({
                title: 'User already added',
                status: 'warning',
                duration: 2000,
                isClosable: true,
                position: 'top-right'
            })
            return
        }
        setSelectedUsers([...selectedUsers, userToAdd])
    }

    const handleDelete = (userToDelete) => {
        console.log('userToDelete', userToDelete);

        setSelectedUsers(selectedUsers.filter(sel => sel._id !== userToDelete._id))
    }
    return (
        <>
            <span onClick={onOpen}>{children}</span>
            <Modal size='lg' isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize='3xl'
                        display='flex'
                        justifyContent='center'
                    >
                        Create Group Chat
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        display='flex'
                        flexDirection='column'
                        alignItems='center'
                    >
                        <FormControl>
                            <Input
                                placeholder='Chat Name'
                                mb={3}
                                onChange={(e) => setGroupChatName(e.target.value)}
                            />
                        </FormControl>
                        <FormControl>
                            <Input
                                placeholder='Add Users'
                                mb={1}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </FormControl>
                        <Box w='100%' display='flex' flexWrap='wrap'>
                            {selectedUsers.map(u => {
                                return (
                                    <UserBadgeItem
                                        key={u._id}
                                        user={u}
                                        handleFunction={() => handleDelete(u)}
                                    />
                                )
                            })}

                        </Box>
                        {loading ? <div>loading...</div> : (
                            searchResult?.slice(0, 4).map(user => {
                                return (
                                    <UserListItem
                                        key={user._id}
                                        user={user}
                                        handleFuntion={() => handleGroup(user)}
                                    />
                                )
                            })
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='green' onClick={handleSubmit}>
                            Create Group
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default GroupChatModal