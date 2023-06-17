import { Avatar,AvatarGroup,Box, Container, Flex, Grid, GridItem, HStack,  Spacer, Tab, TabList, TabPanel, TabPanels, Tabs, Text, VStack } from '@chakra-ui/react'
import React from 'react'
import { Form } from 'react-router-dom'

const titleSection = (): React.ReactElement => {
    return (
        <div>
            
            <VStack
                spacing={4}
                alignItems="center"
                
                height="fit-content"
                style={{
                    background: "white",
                }}
                padding={{ base: "1rem", lg: "2rem" }}
                
            >

        <Text
          alignSelf={{ base: "center", lg: "unset" }}
          variant="desktop-display-xl"
          color="primary.blue"
          as="b"
        >
          Create a meal request
        </Text>

        <Text
            alignSelf={{ base: "center", lg: "unset" }}
            variant="desktop-body"
            textAlign="center"
            maxWidth="100%"
            
        >
            Tell us a little but about your requirements and we will connect you with a meal donor. This program aims to support kids age 6 to 12.
        </Text>

            </VStack>
        </div>
    )
}


const SchedulingForm = (): React.ReactElement => {
    return (

        <Grid templateColumns='repeat(3, 1fr)' gap={4}>
            <GridItem colSpan={1} h='10' bg='tomato' />
            <GridItem colStart={2} colEnd={4} h='10' bg='papayawhip' />
        </Grid>



        // <Flex>

        //     <Box width={1/3}
        //     >
        //         <Text
        //         as='b'
        //         >Date and Time</Text>
        //         <Text>Please select the date for the meal drop-off</Text>
        //     </Box>
        //     <Spacer/>



        //     <Box width={2/3}>
        //         <Text>Meal Type</Text>
        //         <Text>Meal Type</Text>
        //         <Text>Meal Type</Text>
        //         <Text>Meal Type</Text>
        //         <Text>Meal Type</Text>
        //     </Box>

        // </Flex>

    )
    
}



const mealFormProgress = (): React.ReactElement => {

    return (


        <Tabs 
        size="sm"
        
        variant='unstyled' >

            <TabList>

                <Tab>
                    <HStack direction='row' spacing={4}>
                        <Avatar 
                        bgColor='primary.blue'
                        name='1' src='https://bit.ly/broken-link'
                        size='xs'
                         />
                        <Text
                        as='b'
                        fontSize='20px'
                        color='primary.blue'
                        variant='desktop-body'
                        >Scheduling</Text>

                    </HStack>

                    </Tab>
                    <Tab isDisabled >
                    <HStack direction='row' spacing={4}>
                        <Avatar 
                        bgColor='gray'
                        name='2' src='https://bit.ly/broken-link'
                        size='xs'
                         />
                        

                        <Text
                        as='b'
                        color='gray'
                        fontSize='20px'
                        > Meal Donation Information</Text>
                    </HStack>
                    
                   </Tab>
                   <Tab isDisabled >
                    <HStack direction='row' spacing={4}>
                        <Avatar 
                        bgColor='gray'
                        name='3' src='https://bit.ly/broken-link'
                        size='xs'
                         />

                        <Text
                        as='b'
                        color='gray'
                        fontSize='20px'
                        > Review & Submit</Text>
                    </HStack>
                    
                   </Tab>
            </TabList>


            <TabPanels>
                <TabPanel>
                {SchedulingForm()}
                </TabPanel>
                <TabPanel>
                <p>two!</p>
                </TabPanel>
                <TabPanel>
                <p>three!</p>
                </TabPanel>
            </TabPanels>
        </Tabs>
        



    )


}



const CreateMealRequest = (): React.ReactElement => {
    return (
        <div>
            <Flex
                flexDirection="column"
                width="100vw"
                height="100vh"
                justifyContent={{ base: "center", md: "flex-start" }}
                alignItems="center"
            >
                {titleSection()}
                
                {mealFormProgress()}

            </Flex>
            </div>
      
    )
    }


export default CreateMealRequest;