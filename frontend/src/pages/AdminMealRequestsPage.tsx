import { gql, useQuery } from "@apollo/client";
import { Flex } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import TitleSection from "../components/asp/requests/TitleSection";
import AdminListView from "../components/mealrequest/AdminListView";
import { GetUserData, GetUserVariables } from "../types/UserTypes";

const GET_USER = gql`
  query GetUserByID($id: String!) {
    getUserById(id: $id) {
      id
      info {
        organizationName
      }
    }
  }
`;

const AdminMealRequestsPage = (): React.ReactElement => {
  const { donorId, aspId } = useParams<{ donorId: string; aspId: string }>();

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const { data: donorData } = useQuery<GetUserData, GetUserVariables>(
    GET_USER,
    {
      variables: { id: donorId || "" },
      skip: !donorId,
    },
  );

  const { data: aspData } = useQuery<GetUserData, GetUserVariables>(GET_USER, {
    variables: { id: aspId || "" },
    skip: !aspId,
  });

  useEffect(() => {
    if (donorId && donorData) {
      const name = donorData.getUserById?.info?.organizationName;
      setTitle(`Meal Donations for ${name}`);
      setDescription(`Here is a table of all the meal donations for ${name}`);
    } else if (aspId && aspData) {
      const name = aspData.getUserById?.info?.organizationName;
      setTitle(`Meal Requests for ${name}`);
      setDescription(`Here is a table of all the meal requests for ${name}`);
    } else {
      setTitle("All Meal Requests");
      setDescription("Here is a table of all the meal requests");
    }
  }, [donorId, aspId, donorData, aspData]);

  return (
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
        <TitleSection title={title} description={description} />
      </Flex>
      <AdminListView donorId={donorId} aspId={aspId} />
    </Flex>
  );
};

export default AdminMealRequestsPage;
