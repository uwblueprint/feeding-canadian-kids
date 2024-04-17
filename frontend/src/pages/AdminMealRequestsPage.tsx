import { Flex } from "@chakra-ui/react";
import React from "react";

import TitleSection from "../components/asp/requests/TitleSection";
import AdminListView from "../components/mealrequest/AdminListView";

const AdminMealRequestsPage = (): React.ReactElement => (
    <Flex
        flexDir="column"
        w={{ base: "100%" }}
        p={{ base: "14px", sm: "36px", lg: "48px" }}
        borderRadius="8px"
        bgColor="background.white"
        justifyContent="center"
        alignItems="center"
    >
        <Flex flexDir="column" width="100%">
            <TitleSection
                title="All Meal Requests"
                description="Here is a table of all the meal requests"
            />
        </Flex>
        <AdminListView authId="65b6fc756aacd51b15a859ce"/>
    </Flex>
)

export default AdminMealRequestsPage;