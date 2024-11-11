import { ViewIcon } from '@chakra-ui/icons'
import { Button, FormControl, FormLabel, IconButton, Image, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { ChatState } from '../../context/ChatProvider'

const ProfileModal = ({ user, children }) => {
    const { isOpen, onClose, onOpen } = useDisclosure()
    const toast = useToast()

    // const [loading, setLoading] = useState(false)
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

    return (
        <div>
            {children ? (
                <span onClick={onOpen}>{children}</span>
            ) : (
                <IconButton
                    display={{ base: 'flex' }}
                    icon=<i className="fa-solid fa-ellipsis-vertical"></i>
                    // icon={<ViewIcon />}
                    onClick={onOpen}
                />
            )}
            <Modal size='lg' isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize='3xl'
                        display='flex'
                        justifyContent='center'
                    >
                        {user.name}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        display='flex'
                        flexDirection='column'
                        alignItems='center'
                    >
                        <Image
                            borderRadius='full'
                            boxSize='150px'
                            src={user.avatar}
                            alt={user.name}
                            mb={4}
                        />
                        {/* <FormControl id='Avatar'>
                            <FormLabel mb='0'>Change your avatar</FormLabel>
                            <Input type='file' onChange={(e) => postDetails(e.target.files[0])} />
                        </FormControl> */}
                        <Text>
                            Email: {user.email}
                        </Text>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='green' mr={3} onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    )
}

export default ProfileModal