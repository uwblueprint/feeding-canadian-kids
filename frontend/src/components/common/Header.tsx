import {
    Flex,
    Image
  } from "@chakra-ui/react";

import React from "react";

import Logo from '../../assets/logo.png';

console.log(Logo);

const Header = () => {
    return <Flex justifyContent="left" position="absolute" padding="1.5% 1.5% 1.5% 1.5%"><Image src={Logo} alt="Logo" style={{height:99, width:104}}/></Flex>;
}

export default Header;