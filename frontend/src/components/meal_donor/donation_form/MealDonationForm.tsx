import { gql, useMutation, useQuery } from "@apollo/client";
import { Center, Spinner, useToast } from "@chakra-ui/react";
import { error } from "console";
import React, { useContext, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

import MealDonationFormContactInfo from "./MealDonationFormContactInfo";

import { LOGIN_PAGE } from "../../../constants/Routes";
import AuthContext from "../../../contexts/AuthContext";
import { MealRequestsData } from "../../../types/MealRequestTypes";
import { Contact, UserInfo } from "../../../types/UserTypes";
import { ErrorMessage } from "../../../utils/ErrorUtils";
import { logPossibleGraphQLError } from "../../../utils/GraphQLUtils";
import useGetOnsiteContacts from "../../../utils/useGetOnsiteContacts";
import LoadingSpinner from "../../common/LoadingSpinner";
import ThreeStepForm from "../../common/ThreeStepForm";
import ThreeStepFormTitleSection from "../../common/ThreeStepFormTitleSection";

const MealDonationForm = (): React.ReactElement => {
  // This is the selected onsite staff
  const [onsiteStaff, setOnsiteStaff] = useState<Contact[]>([
    {
      name: "",
      email: "",
      phone: "",
    },
  ]);

  const { authenticatedUser, setAuthenticatedUser } = useContext(AuthContext);
  const toast = useToast();
  const [onsiteContactsLoading, setOnsiteContactsLoading] = useState(true);

  const [userInfo, setUserInfo] = useState<UserInfo>(
    authenticatedUser?.info || null,
  );

  const [availableOnsiteContacts, setAvailableOnsiteContacts] = useState<
    Array<Contact>
  >([]);
  useGetOnsiteContacts(
    toast,
    setAvailableOnsiteContacts,
    setOnsiteContactsLoading,
  );

  const requestorId = authenticatedUser?.id;
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const idsParam = searchParams.get("ids");
  // Split the idsParam by dot to get an array of ids
  const ids = idsParam ? idsParam.split(",") : [];

  const GET_MEAL_REQUESTS = gql`
  query getMealRequestsByIds{
    getMealRequestsByIds(
      requestorId: "${requestorId}"
      ids: [${ids?.map((id) => `"${id}"`).join(", ")}],
    ) {
      id
      requestor {
        id
      }
      status
      dropOffDatetime
      dropOffLocation
      mealInfo {
        portions
        dietaryRestrictions
      }
      onsiteStaff {
        name
        email
        phone
      }
      dateCreated
      dateUpdated
      deliveryInstructions
      donationInfo {
        donor {
          id
        }
        commitmentDate
        mealDescription
        additionalInfo
      }
    }
  }
  `;

  const {
    data: mealRequestData,
    error: getUserError,
    loading: getMealRequestsLoading,
  } = useQuery<MealRequestsData>(GET_MEAL_REQUESTS);

  const alertUser = (e: {
    returnValue: string;
    preventDefault: () => void;
  }) => {
    e.preventDefault();

    e.returnValue = "";
  };

  useEffect(() => {
    window.addEventListener("beforeunload", (e) => alertUser(e));
    return () => {
      window.removeEventListener("beforeunload", alertUser);
    };
  }, []);

  logPossibleGraphQLError(getUserError);
  if (getUserError) {
    return <ErrorMessage />;
  }

  if (!authenticatedUser) {
    return <Navigate replace to={LOGIN_PAGE} />;
  }
  if (!ids || ids.length === 0) {
    return (
      <Center>
        No meal requests selected! Please go back and select some meal requests.
      </Center>
    );
  }

  return (
    <div>
      <ThreeStepFormTitleSection title="Meal Donation Form" />
      {onsiteContactsLoading || getMealRequestsLoading ? (
        <Center height="100%">
          <LoadingSpinner />
        </Center>
      ) : (
        <ThreeStepForm
          header1="Contact Information"
          header2="Meal Details"
          header3="Review & submit"
          panel1={
            <MealDonationFormContactInfo
              onsiteStaff={onsiteStaff}
              setOnsiteStaff={setOnsiteStaff}
              availableStaff={availableOnsiteContacts}
              authenticatedUser={authenticatedUser}
              handleNext={() => {}}
              mealRequestsInformation={
                mealRequestData?.getMealRequestsByIds ?? []
              }
            />
          }
          panel2={<div />}
          panel3={<div />}
        />
      )}
    </div>
  );
};

export default MealDonationForm;
