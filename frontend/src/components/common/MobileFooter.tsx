import {
  ButtonGroup,
  IconButton,
  Stack,
  Text,
  VStack,
  useMediaQuery,
} from "@chakra-ui/react";
import React from "react";

import { FacebookIcon } from "../../assets/icons/Facebook";
import { InstagramIcon } from "../../assets/icons/Instagram";
import { LinkedinIcon } from "../../assets/icons/LinkedIn";
import { TwitterIcon } from "../../assets/icons/TwitterSquare";

const MobileFooter = () => {
  const [isMobileView] = useMediaQuery("(max-width: 56em)");

  return isMobileView ? (
    <VStack width="100wh" bg="#F8F8FB">
      <Stack direction="column" h="15%" padding="25px 48px">
        <VStack direction="column" padding="1% 4% 1% 4%">
          <Text fontSize="14px" color="#647488" align="center">
            Feeding Canadian Kids registered Charity Number: 783404882RR0001
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
  ) : null;
};

export default MobileFooter;
