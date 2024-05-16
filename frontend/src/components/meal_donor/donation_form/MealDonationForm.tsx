import { gql, useMutation, useQuery } from "@apollo/client";
import { Center, Spinner, useToast } from "@chakra-ui/react";
import { error } from "console";
import React, { useContext, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

import MealDonationFormContactInfo from "./MealDonationFormContactInfo";
import MealDonationFormMealDetails from "./MealDonationFormMealDetails";
import MealDonationFormReviewAndSubmit from "./MealDonationFormReviewAndSubmit";

import { LOGIN_PAGE } from "../../../constants/Routes";
import AuthContext from "../../../contexts/AuthContext";
import { MealRequestsData } from "../../../types/MealRequestTypes";
import { Contact, UserInfo } from "../../../types/UserTypes";
import { ErrorMessage } from "../../../utils/ErrorUtils";
import { logPossibleGraphQLError } from "../../../utils/GraphQLUtils";
import useGetOnsiteContacts from "../../../utils/useGetOnsiteContacts";
import LoadingSpinner from "../../common/LoadingSpinner";
import ThreeStepForm from "../../common/ThreeStepForm";
import TitleSection from "../../common/ThreeStepFormTitleSection";

const MealDonationForm = (): React.ReactElement => {
  // This is the selected onsite staff
  const [onsiteContacts, setOnsiteContact] = useState<Contact[]>([
    {
      name: "",
      email: "",
      phone: "",
    },
  ]);

  // Step 2: Meal details
  const [mealDescription, setMealDescription] = useState<string>("");
  const [additionalInfo, setAdditionalInfo] = useState<string>("");

  const { authenticatedUser, setAuthenticatedUser } = useContext(AuthContext);
  const toast = useToast();
  const [onsiteContactsLoading, setOnsiteContactsLoading] = useState(true);

  const [userInfo, setUserInfo] = useState<UserInfo>(
    authenticatedUser?.info || null,
  );

  const [userId, setUserId] = useState<string>(authenticatedUser?.id || "");

  const [loading, setLoading] = useState(true);
  // This is the list of available onsite staff
  const [availableOnsiteContacts, setAvailableOnsiteContacts] = useState<
    Array<Contact>
  >([]);
  useGetOnsiteContacts(
    toast,
    setAvailableOnsiteContacts,
    setOnsiteContactsLoading,
  );

  // Get the primary contact
  const primaryContact = userInfo?.primaryContact || {
    name: "",
    email: "",
    phone: "",
  };

  const requestorId = authenticatedUser?.id || "";
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
      onsiteContacts {
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
      <TitleSection title="Meal Donation Form" />
      {onsiteContactsLoading || getMealRequestsLoading ? (
        <Center height="100%">
          <LoadingSpinner />
        </Center>
      ) : (
        <ThreeStepForm
          header1="Contact Information"
          header2="Meal Details"
          header3="Review & Submit"
          panel1={
            <MealDonationFormContactInfo
              onsiteContact={onsiteContacts}
              setOnsiteContact={setOnsiteContact}
              availableStaff={availableOnsiteContacts}
              handleNext={() => {}} // Leave like this, gets updated by three-step form
              mealRequestsInformation={
                mealRequestData?.getMealRequestsByIds ?? []
              }
            />
          }
          panel2={
            <MealDonationFormMealDetails
              mealDescription={mealDescription}
              setMealDescription={setMealDescription}
              additionalInfo={additionalInfo}
              setAdditionalInfo={setAdditionalInfo}
              handleBack={() => {}} // Leave like this, gets updated by three-step form
              handleNext={() => {}} // Leave like this, gets updated by three-step form
              mealRequestsInformation={
                mealRequestData?.getMealRequestsByIds ?? []
              }
            />
          }
          panel3={
            <MealDonationFormReviewAndSubmit
              mealRequestsInformation={
                mealRequestData?.getMealRequestsByIds ?? []
              }
              mealDescription={mealDescription}
              additionalInfo={additionalInfo}
              onsiteContact={onsiteContacts}
              requestorId={requestorId}
              primaryContact={primaryContact}
              handleBack={() => {}} // Leave like this, gets updated by three-step form
            />
          }
        />
      )}
    </div>
  );
};

export default MealDonationForm;
