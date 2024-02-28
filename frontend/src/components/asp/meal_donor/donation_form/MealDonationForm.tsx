import { useToast } from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

import MealDonationFormContactInfo from "./MealDonationFormContactInfo";

import { LOGIN_PAGE } from "../../../../constants/Routes";
import AuthContext from "../../../../contexts/AuthContext";
import { Contact, UserInfo } from "../../../../types/UserTypes";
import useGetOnsiteContacts from "../../../../utils/useGetOnsiteContacts";
import ThreeStepForm from "../../../common/ThreeStepForm";
import TitleSection from "../../../common/ThreeStepFormTitleSection";

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
  const [loading, setLoading] = useState(true);

  const [userInfo, setUserInfo] = useState<UserInfo>(
    authenticatedUser?.info || null,
  );

  const [availableOnsiteContacts, setAvailableOnsiteContacts] = useState<
    Array<Contact>
  >([]);
  useGetOnsiteContacts(toast, setAvailableOnsiteContacts, setLoading);

  // This is the list of available onsite staff
  const [availableStaff, setAvailableStaff] = useState<Array<Contact>>(
    userInfo ? JSON.parse(JSON.stringify(availableOnsiteContacts)) : [],
  );

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

  if (!authenticatedUser) {
    return <Navigate replace to={LOGIN_PAGE} />;
  }

  return (
    <div>
      <TitleSection title="Meal Donation Form" showDescription={false} />
      <ThreeStepForm
        header1="Contact Information"
        header2="Meal Details"
        header3="Review & submit"
        panel1={
          <MealDonationFormContactInfo
            onsiteStaff={onsiteStaff}
            setOnsiteStaff={setOnsiteStaff}
            availableStaff={availableStaff}
            authenticatedUser={authenticatedUser}
            handleNext={() => {}}
          />
        }
        panel2={<div />}
        panel3={<div />}
      />
    </div>
  );
};

export default MealDonationForm;
