import {
  ButtonGroup,
  Divider,
  IconButton,
  Image,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import React from "react";

import { FacebookIcon } from "../../assets/icons/Facebook";
import { InstagramIcon } from "../../assets/icons/Instagram";
import { LinkedinIcon } from "../../assets/icons/LinkedIn";
import { TwitterIcon } from "../../assets/icons/TwitterSquare";
import Logo from "../../assets/logo.png";
import useIsWebView from "../../utils/useIsWebView";

const TermsOfUse = () => (
  <Text
    as="a"
    href="https://docs.google.com/document/d/1x1O9uNSVD5WU_hRBPIaaI0gULEp4yYnsJoR6L8XEBvM/edit?usp=sharing"
    target="_blank"
    color="blue.500"
    textDecoration="underline"
    _hover={{ color: "blue.600" }}
>
    Terms of Use
  </Text>
);

const Footer = () => {
  const isWebView = useIsWebView();

  return isWebView ? (
    <VStack width="100wh" bg="#F8F8FB" marginTop="auto">
      <Stack direction="row" h="15%" padding="16px 48px">
        <Image
          src={Logo}
          alt="Logo"
          style={{ height: 70, width: 83 }}
          bg="#F8F8FB"
          alignSelf="center"
        />
        <Divider orientation="vertical" borderColor="#647488" />
        <Stack direction="row">
          <Divider orientation="vertical" borderWidth="1.5px" />
        </Stack>
        <Stack padding="1% 4% 1% 4%">

          <Text fontSize="14px" color="#647488" align="center">
            Feeding Canadian Kids is a registered Canadian charity. We feed
            underserved Canadian kids a nutritious dinner to fill their tummies
            so they sleep well, leading to success in school and healthy
            futures. Registered Charity Number: 783404882RR0001 - <TermsOfUse />
          </Text>
        </Stack>
        <Stack justifyContent="center">
          <ButtonGroup>
            <IconButton
              _hover={{ bg: "white" }}
              bg="#F8F8FB"
              as="a"
              href="https://www.facebook.com/feedingcanadiankidssociety"
              aria-label="Facebook"
              icon={<FacebookIcon />}
              target="_blank"
            />
            <IconButton
              _hover={{ bg: "white" }}
              bg="#F8F8FB"
              as="a"
              href="https://twitter.com/feedingcdnkids"
              aria-label="Twitter"
              icon={<TwitterIcon />}
              target="_blank"
            />
            <IconButton
              _hover={{ bg: "white" }}
              bg="#F8F8FB"
              as="a"
              href="https://www.linkedin.com/company/feeding-canadian-kids/"
              aria-label="LinkedIn"
              icon={<LinkedinIcon />}
              target="_blank"
            />
            <IconButton
              _hover={{ bg: "white" }}
              bg="#F8F8FB"
              as="a"
              href="https://www.instagram.com/feedingcanadiankids/"
              aria-label="Instagram"
              icon={<InstagramIcon />}
              target="_blank"
            />
          </ButtonGroup>
        </Stack>
      </Stack>
    </VStack>
  ) : (
    <VStack width="100wh" bg="#F8F8FB" marginTop="auto">
      <Stack direction="column" h="15%" padding="25px 48px">
        <VStack direction="column" padding="1% 4% 1% 4%">
          <Text fontSize="14px" color="#647488" align="center">
            Feeding Canadian Kids registered Charity Number: 783404882RR0001 -{" "}
            <TermsOfUse />
          </Text>
        </VStack>
        <VStack>
          <ButtonGroup>
            <IconButton
              _hover={{ bg: "white" }}
              bg="#F8F8FB"
              as="a"
              href="https://www.facebook.com/feedingcanadiankidssociety"
              aria-label="Facebook"
              icon={<FacebookIcon />}
              target="_blank"
            />
            <IconButton
              _hover={{ bg: "white" }}
              bg="#F8F8FB"
              as="a"
              href="https://twitter.com/feedingcdnkids"
              aria-label="Twitter"
              icon={<TwitterIcon />}
              target="_blank"
            />
            <IconButton
              _hover={{ bg: "white" }}
              bg="#F8F8FB"
              as="a"
              href="https://www.linkedin.com/company/feeding-canadian-kids/"
              aria-label="LinkedIn"
              icon={<LinkedinIcon />}
              target="_blank"
            />
            <IconButton
              _hover={{ bg: "white" }}
              bg="#F8F8FB"
              as="a"
              href="https://www.instagram.com/feedingcanadiankids/"
              aria-label="Instagram"
              icon={<InstagramIcon />}
              target="_blank"
            />
          </ButtonGroup>
        </VStack>
      </Stack>
    </VStack>
  );
};

export default Footer;
