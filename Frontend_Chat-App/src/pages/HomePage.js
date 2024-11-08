import React, { useEffect, useState } from 'react'
import { Box, Container, Text } from '@chakra-ui/react'
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import Login from '../components/Authentication/Login'
import Signup from '../components/Authentication/Signup'
import { useNavigate } from 'react-router-dom'

const HomePage = () => {
    const [selectedTab, setSelectedTab] = useState(0)
    // const navigate = useNavigate()
    // useEffect(() => {
    //     const user = JSON.parse(localStorage.getItem('userInfo'))
    //     if (!user)
    //         navigate('/chats')
    // }, [navigate])
    return (
        <Container maxW="xl" centerContent>
            <Box
                bg="#fff"
                w="100%"
                p={3}
                mt='30px'
                borderRadius="lg"
                borderWidth="1px"
            >
                <Text fontSize="4xl" align='center'>
                    Chat App
                </Text>
            </Box>
            <Box
                bg="#fff"
                w="100%"
                p={3}
                mt='10px'
                borderRadius="lg"
                borderWidth="1px"
            >
                <Text fontSize="4xl">
                    <Tabs isFitted colorScheme='green' variant='enclosed' index={selectedTab} onChange={setSelectedTab}>
                        <TabList>
                            <Tab>Login</Tab>
                            <Tab>Sign Up</Tab>
                        </TabList>
                        <TabPanels>
                            <TabPanel>
                                <Login />
                            </TabPanel>
                            <TabPanel>
                                <Signup setSelectedTab={setSelectedTab} />
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </Text>
            </Box>
        </Container>
    )
}

export default HomePage
