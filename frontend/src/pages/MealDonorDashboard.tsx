import { Box, Button as ChakraButton, Flex, Image, Text, Wrap } from "@chakra-ui/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import FullCalendar from "@fullcalendar/react";
import React from "react";
import {
  IoArrowBackCircleOutline,
  IoLocationOutline,
  IoPersonOutline,
} from "react-icons/io5";
import { PiForkKnifeFill } from "react-icons/pi";
import { useNavigate } from "react-router-dom";

import EditMealRequestForm from "./EditMealRequestForm";

import BackgroundImage from "../assets/background.png";
import RefreshCredentials from "../components/auth/RefreshCredentials";
import * as Routes from "../constants/Routes";

type ButtonProps = { text: string; path: string };

const Button = ({ text, path }: ButtonProps) => {
  const navigate = useNavigate();
  return <ChakraButton onClick={() => navigate(path)}>{text}</ChakraButton>;
};

const realEvents = [{
  title: "Conference",
  start: "2024-01-24T16:00:00",
  end: "2024-01-25"
}]

const SchoolSidebar = () => {
  return (
    <Flex
      flexDirection="column"
      textAlign="left"
      borderRight="2px solid #D9D9D9"
      padding="20px 40px"
    >
      <IoArrowBackCircleOutline size="44px"/>
      <Flex>
        <Image 
          src="https://images.squarespace-cdn.com/content/v1/5dc5d641498834108f7c46a5/6384d8a2-9c31-4ae6-a287-256643f2271e/responsiveclassroom.png?format=1500w"
          borderRadius="full"
          objectFit="contain"
          height="200px"
        />
      </Flex>

      <Flex
        gap="20px"
        flexDirection="column"
      >
        <Text>
          School Distance
        </Text>
        <Text fontSize="lg" as="b">
          School Name
        </Text>
        <Flex alignItems="center" gap="5px">
          <IoPersonOutline />
          <Text>
            Number of Kids
          </Text>
        </Flex>
        <Flex alignItems="center" gap="5px">
          <IoLocationOutline />
          <Text>
            Location
          </Text>
        </Flex>  
        <Text>
          School Description
        </Text>
      </Flex>

      <Flex
        flexDirection="column"
        gap="10px"
      >
        <Text>
          Meal Accomodations Needed
        </Text>
        <Flex gap="10px">
          <Box borderRadius="md" bg="#EBEEFF" padding="10px">
            Accomodation 1
          </Box>
          <Box borderRadius="md" bg="#EBF6ED" padding="10px">
            Accomodation 2
          </Box>
        </Flex> 
      </Flex>
    </Flex>
  )
}

const CalendarView = () => {
  return (
    <Box>
      <Text fontSize="lg" as="b">
        Select Dates to Donate Meals
      </Text>
      <Text display="flex" gap="5px" alignItems="center" margin="5px 0px 0px 0px">
        *each date displays the meal delivery time slot & number of meals needed
        <PiForkKnifeFill />
      </Text>
      <Text margin="20px 0px">
        Number selected
      </Text>

      <FullCalendar
          headerToolbar={{
            left: "prev",
            center: "title",
            right: "next",
          }}
          themeSystem="Simplex"
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          events={realEvents}
          selectable
          // eventContent={renderEventContent}
          // eventClick={(info) => {
          //   setSelectedMealRequest(
          //     info.event.extendedProps.mealRequest,
          //   );
          //   // info.el.style.borderColor = "red";
          // }}
          // eventMouseLeave={() => {
          //   setSelectedMealRequest(undefined);
          // }}
        />

        <ChakraButton float="right" margin="20px 0px">Next</ChakraButton>
    </Box>
  )
}

const MealDonorDashboard = (): React.ReactElement => {
  return (
    <Flex
      // style={{
      //   textAlign: "center",
      //   paddingTop: "20px",
      //   height: "100vh",
      //   backgroundImage: `url(${BackgroundImage})`,
      //   backgroundPosition: "center",
      //   backgroundRepeat: "no-repeat",
      //   backgroundSize: "cover",
      // }}
      borderTop="2px solid #D9D9D9"
    >
      <Flex 
        width="370px" 
        justifyContent="center"
      >
        <SchoolSidebar />
      </Flex>
      <Flex
        width="100%"
        justifyContent="center"
        margin="30px 10px"
      >
        <CalendarView />
      </Flex>
    </Flex>
  );
};

export default MealDonorDashboard;
