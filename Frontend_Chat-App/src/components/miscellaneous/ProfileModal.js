import { Button, FormControl, FormLabel, IconButton, Image, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import * as UserService from '../../services/UserService'
import imageCompression from 'browser-image-compression'

const ProfileModal = ({ user, children }) => {
    const { isOpen, onClose, onOpen } = useDisclosure()
    const toast = useToast()

    const [loading, setLoading] = useState(false)
    const [avatar, setAvatar] = useState(user.avatar)
    const [selectedFile, setSelectedFile] = useState(null)
    console.log('user', user);

    // Function to upload image to Cloudinary
    const uploadToCloudinary = async (file) => {
        try {
            const options = {
                maxSizeMB: 1,
                maxWidthOrHeight: 1024,
                useWebWorker: true,
            }
            const compressedFile = await imageCompression(file, options)

            const data = new FormData()
            data.append('file', compressedFile)
            data.append('upload_preset', 'chat-app')
            data.append('cloud_name', 'minhquan73')

            const response = await fetch('https://api.cloudinary.com/v1_1/minhquan73/image/upload', {
                method: 'POST',
                body: data,
            })

            const result = await response.json()
            if (!result.url) {
                throw new Error('No URL returned from Cloudinary')
            }

            return result.url
        } catch (error) {
            console.error('Error uploading image:', error)
            toast({
                title: 'Error uploading image!',
                description: error.message,
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: 'top-right',
            })
            throw error
        }
    }

    // Handle file selection
    const handleFileChange = async (file) => {
        if (!file) {
            toast({
                title: 'Please select an image!',
                status: 'warning',
                duration: 2000,
                isClosable: true,
                position: 'top-right',
            })
            return
        }

        const validImageTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp', 'image/bmp']
        if (!validImageTypes.includes(file.type)) {
            toast({
                title: 'Unsupported image format!',
                status: 'warning',
                duration: 2000,
                isClosable: true,
                position: 'top-right',
            })
            return
        }

        try {
            setSelectedFile(file)
        } catch (error) {
            console.error('Error handling file:', error)
        }
    }

    // Update avatar
    const handleUpdate = async () => {
        if (!selectedFile) {
            toast({
                title: 'No new avatar selected!',
                status: 'info',
                duration: 2000,
                isClosable: true,
                position: 'top-right',
            })
            return
        }

        setLoading(true)

        try {
            // Upload the image to Cloudinary
            const uploadedUrl = await uploadToCloudinary(selectedFile)
            setAvatar(uploadedUrl)

            // Prepare the data for the update
            const userData = {
                avatar: uploadedUrl,
            }
            // Pass the user ID and token to the API function
            const token = localStorage.getItem('token') // Or use context to get the token
            const data = { avatarUrl: uploadedUrl }  // Send the avatarUrl in the request body

            // Update user information with the new avatar
            const response = await UserService.updateUser(user._id, data, token)
            console.log("API Response:", response)  // Log để kiểm tra phản hồi

            setSelectedFile(null)

            toast({
                title: 'Avatar updated successfully!',
                status: 'success',
                duration: 2000,
                isClosable: true,
                position: 'top-right',
            })
        } catch (error) {
            console.error('Error updating avatar:', error)
            toast({
                title: 'Failed to update avatar',
                description: error.message,
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: 'top-right',
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            {children ? (
                <span onClick={onOpen}>{children}</span>
            ) : (
                <IconButton
                    display={{ base: 'flex' }}
                    icon={<i className="fa-solid fa-ellipsis-vertical"></i>}
                    onClick={onOpen}
                />
            )}
            <Modal size="lg" isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader fontSize="3xl" display="flex" justifyContent="center">
                        {user.name}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody display="flex" flexDirection="column" alignItems="center">
                        <Image
                            borderRadius="full"
                            boxSize="150px"
                            src={selectedFile ? URL.createObjectURL(selectedFile) : avatar}
                            alt={user.name}
                            mb={4}
                        />
                        {/* <FormControl id="Avatar">
                            <FormLabel mb="0">Change your avatar</FormLabel>
                            <Input type="file" onChange={(e) => handleFileChange(e.target.files[0])} />
                        </FormControl> */}
                        <Text>Email: {user.email}</Text>
                    </ModalBody>
                    <ModalFooter>
                        {/* <Button colorScheme="yellow" mr={3} onClick={handleUpdate} isLoading={loading}>
                            Update
                        </Button> */}
                        <Button colorScheme="green" mr={3} onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    )
}

export default ProfileModal
