import { ViewIcon } from '@chakra-ui/icons'
import { Box, Button, FormControl, IconButton, Image, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { ChatState } from '../../context/ChatProvider'
import UserBadgeItem from '../UserAvatar/UserBadgeItem'
import * as ChatService from '../../services/ChatService'
import * as UserService from '../../services/UserService'
import UserListItem from '../UserAvatar/UserListItem'

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
    const { isOpen, onClose, onOpen } = useDisclosure()
    const { user, selectedChat, setSelectedChat } = ChatState()
    const [groupChatName, setGroupChatName] = useState()
    const [search, setSearch] = useState('')
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)
    const [renameLoading, setRenameLoading] = useState(false)

    const toast = useToast()

    const handleRemove = async (userRemove) => {
        if (selectedChat.groupAdmin._id !== user._id && userRemove._id !== user._id) {
            toast({
                title: 'Only admin can remove someone',
                status: 'error',
                duration: 2000,
                isClosable: true,
                position: 'top-right'
            })
            return
        }
        try {
            setLoading(true)
            const { data } = await ChatService.removeChat(selectedChat._id, userRemove._id, user?.token)
            userRemove._id === user._id ? setSelectedChat() : setSelectedChat(data)
            setFetchAgain(!fetchAgain)
            fetchMessages()
            setLoading(false)
        } catch (error) {
            toast({
                title: 'Error occured!',
                description: error.response.data.message,
                status: 'error',
                duration: 2000,
                isClosable: true,
                position: 'top-right'
            })
            setLoading(false)
        }
    }

    const handleRename = async () => {
        if (!groupChatName)
            return
        try {
            setRenameLoading(true)
            const data = await ChatService.renameChat(selectedChat._id, groupChatName, user?.token)
            setSelectedChat(data)
            setFetchAgain(!fetchAgain)
            setRenameLoading(false)
        } catch (error) {
            toast({
                title: 'Error occured!',
                description: error.response.data.message,
                status: 'error',
                duration: 2000,
                isClosable: true,
                position: 'top-right'
            })
            setRenameLoading(false)
        }
        setGroupChatName('')
    }

    const handleSearch = async (query) => {
        setSearch(query)
        if (!query) {
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

    const handleAddUser = async (userAdd) => {
        if (selectedChat.users.find((u) => u._id === userAdd._id)) {
            toast({
                title: 'User already in Group',
                status: 'error',
                duration: 2000,
                isClosable: true,
                position: 'top-right'
            })
            return
        }
        if (selectedChat.groupAdmin._id !== user._id) {
            toast({
                title: 'Only admin can add someone',
                status: 'error',
                duration: 2000,
                isClosable: true,
                position: 'top-right'
            })
            return
        }
        try {
            setLoading(true)
            const { data } = await ChatService.addChat(selectedChat._id, userAdd._id, user?.token)
            setSelectedChat(data)
            setFetchAgain(!fetchAgain)
            setLoading(false)
        } catch (error) {
            toast({
                title: 'Error occured!',
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
        <>
            <IconButton
                display={{ base: 'flex' }}
                icon=<i className="fa-solid fa-ellipsis-vertical"></i>
                onClick={onOpen}
            />
            <Modal size='lg' isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize='3xl'
                        display='flex'
                        justifyContent='center'
                    >
                        {selectedChat.chatName}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        display='flex'
                        flexDirection='column'
                        alignItems='center'
                    >
                        <Box
                            w='100%'
                            display='flex'
                            flexWrap='wrap'
                            pb={3}
                        >
                            {selectedChat.users.map((u) => {
                                return (
                                    <UserBadgeItem
                                        key={u._id}
                                        user={u}
                                        handleFunction={() => handleRemove(u)}
                                    />
                                )
                            })}
                        </Box>
                        <FormControl display='flex'>
                            <Input
                                placeholder='Chat Name'
                                mb={3}
                                value={groupChatName}
                                onChange={(e) => setGroupChatName(e.target.value)}
                            />
                            <Button
                                variant='solid'
                                colorScheme='teal'
                                ml={1}
                                isLoading={renameLoading}
                                onClick={handleRename}
                            >
                                Update
                            </Button>
                        </FormControl>
                        <FormControl display='flex'>
                            <Input
                                placeholder='Add Users to group'
                                mb={1}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </FormControl>
                        {loading ? (
                            <Spinner size='lg' />
                        ) : (
                            searchResult?.map((user) => {
                                return (
                                    <UserListItem
                                        key={user._id}
                                        user={user}
                                        handleFuntion={() => handleAddUser(user)}
                                    />
                                )
                            })
                        )}

                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='red' onClick={() => handleRemove(user)}>
                            Leave Group
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default UpdateGroupChatModal