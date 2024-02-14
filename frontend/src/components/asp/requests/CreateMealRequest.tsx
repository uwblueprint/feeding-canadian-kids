import { Center, Spinner, useToast } from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import type { Value } from "react-multi-date-picker";
import { Navigate } from "react-router-dom";

import SchedulingFormCalendar from "./SchedulingFormCalendar";
import SchedulingFormMealInfo from "./SchedulingFormMealInfo";
import SchedulingFormReviewAndSubmit from "./SchedulingFormReviewAndSubmit";
import SchedulingFormWeekly from "./SchedulingFormWeekly";
import TitleSection from "./TitleSection";

import { LOGIN_PAGE } from "../../../constants/Routes";
import AuthContext from "../../../contexts/AuthContext";
import { Contact, UserInfo } from "../../../types/UserTypes";
import useGetOnsiteContacts from "../../../utils/useGetOnsiteContacts";
import ThreeStepForm from "../../common/ThreeStepForm";

const CreateMealRequest = (): React.ReactElement => {
  // Part 1: Scheduling
  const [isWeeklyInput, setIsWeeklyInput] = useState(false); // Are we in weekly input mode (false means we are in calendar mode)
  const [donationFrequency, setDonationFrequency] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [scheduledDropOffTime, setScheduledDropOffTime] = useState("");

  const [mealRequestDates, setMealRequestDates] = useState<Date[]>([]);

  // Part 2: Meal Donation Information
  const [numMeals, setNumMeals] = useState<number>(0);
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string>("");
  const [deliveryInstructions, setDeliveryInstructions] = useState<string>("");

  // This is the selected onsite staff
  const [onsiteStaff, setOnsiteStaff] = useState<Contact[]>([
    {
      name: "",
      email: "",
      phone: "",
    },
  ]);

  const { authenticatedUser, setAuthenticatedUser } = useContext(AuthContext);

  const [userId, setUserId] = useState<string>(authenticatedUser?.id || "");

  const [userInfo, setUserInfo] = useState<UserInfo>(
    authenticatedUser?.info || null,
  );

  const toast = useToast();
  const [loading, setLoading] = useState(true);
  // This is the list of available onsite staff
  const [availableOnsiteContacts, setAvailableOnsiteContacts] = useState<
    Array<Contact>
  >([]);
  useGetOnsiteContacts(toast, setAvailableOnsiteContacts, setLoading);

  // User's address
  const [address, setAddress] = useState<string>(
    userInfo ? userInfo.organizationAddress : "",
  );

  // Button state (array of booleans)
  const [weekdayButtonStates, setWeekdayButtonStates] = useState(
    Array(7).fill(false),
  );

  // TODO: once the last tab is reached, submit the form
  // Below is a way to get a list of days, i.e. the indexes of the true values in the boolean array
  const selectedDays = weekdayButtonStates
    .map((state, i) => (state ? i : -1))
    .filter((day) => day !== -1);

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

  if (loading) {
    return (
      <div>
        <TitleSection />
        <Center>
          <Spinner />
        </Center>
      </div>
    );
  }
  return (
    <div>
      <TitleSection />

      <ThreeStepForm
        header1="Scheduling"
        header2="Meal donation information"
        header3="Review & submit"
        panel1={
          isWeeklyInput ? (
            <SchedulingFormWeekly
              donationFrequency={donationFrequency}
              setDonationFrequency={setDonationFrequency}
              weekdayButtonStates={weekdayButtonStates}
              setWeekdayButtonStates={setWeekdayButtonStates}
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              scheduledDropOffTime={scheduledDropOffTime}
              setScheduledDropOffTime={setScheduledDropOffTime}
              setIsWeeklyInput={setIsWeeklyInput}
              handleNext={() => {}} // Will be assigned by three step form
            />
          ) : (
            <SchedulingFormCalendar
              scheduledDropOffTime={scheduledDropOffTime}
              setScheduledDropOffTime={setScheduledDropOffTime}
              dates={mealRequestDates}
              setDates={setMealRequestDates}
              setIsWeeklyInput={setIsWeeklyInput}
              handleNext={() => {}} // Will be assigned by three step form
            />
          )
        }
        panel2={
          <SchedulingFormMealInfo
            address={address}
            numMeals={numMeals}
            setNumMeals={setNumMeals}
            dietaryRestrictions={dietaryRestrictions}
            setDietaryRestrictions={setDietaryRestrictions}
            deliveryInstructions={deliveryInstructions}
            setDeliveryInstructions={setDeliveryInstructions}
            onsiteStaff={onsiteStaff}
            setOnsiteStaff={setOnsiteStaff}
            availableStaff={availableOnsiteContacts}
            handleBack={() => {}} // Will be assigned by three step form
            handleNext={() => {}} // Will be assigned by three step form
          />
        }
        panel3={
          <SchedulingFormReviewAndSubmit
            scheduledDropOffTime={scheduledDropOffTime}
            mealRequestDates={mealRequestDates}
            numMeals={numMeals}
            dietaryRestrictions={dietaryRestrictions}
            deliveryInstructions={deliveryInstructions}
            onsiteStaff={onsiteStaff}
            address={address}
            userId={userId}
            handleBack={() => {}} // Will be assigned by three step form
          />
        }
      />
    </div>
  );
};

export default CreateMealRequest;
