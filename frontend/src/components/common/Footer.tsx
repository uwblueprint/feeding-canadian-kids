import { 
    ButtonGroup, 
    Container, 
    Divider,
    IconButton, 
    Image,
    Stack, 
    Text,
    VStack
} from '@chakra-ui/react'
import React from "react";

import { FacebookIcon } from '../../assets/icons/Facebook';
import { InstagramIcon } from '../../assets/icons/Instagram';
import { LinkedinIcon } from '../../assets/icons/LinkedIn';
import { TwitterIcon } from '../../assets/icons/TwitterSquare';
import Logo from '../../assets/logo.png';

const Footer = () => {
  return(
    <VStack as="footer"  bg="#F8F8FB">
      <Stack direction='row' h="15%" padding="2% 5% 2% 4%">
      <Image src={Logo} alt="Logo" style={{height:70, width:83}} bg="#F8F8FB"/>
      <Divider orientation='vertical' borderColor='#647488'/>
      <Stack direction='row' >
  <Divider orientation='vertical' borderWidth='1.5px'/>
</Stack>
      <Stack padding="1% 4% 1% 4%">
        <Text fontSize="14px" color="#647488"  align="center">
            Feeding Canadian Kids is a registered Canadian charity. We feed underserved Canadian kids a nutritious dinner to fill their tummies so they sleep well, leading to success in school and healthy futures. Registered Charity Number: 783404882RR0001
        </Text>
      </Stack>
      <Stack>
          <ButtonGroup>
            <IconButton 
             _hover={{ bg: "white"}}
              bg="#F8F8FB" 
              as="a" 
              href="https://www.facebook.com/feedingcanadiankidssociety"
              aria-label="Facebook"
              icon={<FacebookIcon />} />
            <IconButton
            _hover={{ bg: "white"}}
              bg="#F8F8FB" 
              as="a"
              href="https://twitter.com/feedingcdnkids"
              aria-label="Twitter"
              icon={<TwitterIcon />}
            />
            <IconButton
            _hover={{ bg: "white"}}
              bg="#F8F8FB" 
              as="a"
              href="https://www.linkedin.com/company/feeding-canadian-kids/"
              aria-label="LinkedIn"
              icon={<LinkedinIcon />}
            />
            <IconButton
            _hover={{ bg: "white"}}
              bg="#F8F8FB" 
              as="a"
              href="https://www.instagram.com/feedingcanadiankids/"
              aria-label="Instagram"
              icon={<InstagramIcon />}
            />
          </ButtonGroup>
      </Stack>
      </Stack>
    </VStack>)
}

export default Footer;