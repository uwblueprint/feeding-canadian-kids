import React, { useContext, useEffect, useState } from "react";
import type { Value } from "react-multi-date-picker";

import SchedulingFormCalendar from "./SchedulingFormCalendar";
import SchedulingFormMealInfo from "./SchedulingFormMealInfo";
import SchedulingFormWeekly from "./SchedulingFormWeekly";
import TitleSection from "./TitleSection";

import AuthContext from "../../../contexts/AuthContext";
import { Contact, UserInfo } from "../../../types/UserTypes";
import ThreeStepForm from "../../common/ThreeStepForm";

const CreateMealRequest = (): React.ReactElement => {
  // Part 1: Scheduling
  const [isWeeklyInput, setIsWeeklyInput] = useState(true); // Are we in weekly input mode (false means we are in calendar mode)
  const [donationFrequency, setDonationFrequency] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [scheduledDropOffTime, setScheduledDropOffTime] = useState("");

  const [mealRequestDates, setMealRequestDates] = useState<Value>([]);

  // Part 2: Meal Donation Information
  const [address, setAddress] = useState<string>("");
  const [numMeals, setNumMeals] = useState<number>(0);
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string>("");
  const [deliveryInstructions, setDeliveryInstructions] = useState<string>("");
  const [onsiteStaff, setOnsiteStaff] = useState<Contact[]>([
    {
      name: "Tester",
      phone: "123467",
      email: "test@text.com",
    },
  ]);

  const { authenticatedUser, setAuthenticatedUser } = useContext(AuthContext);
  const [userInfo, setUserInfo] = useState<UserInfo>(
    authenticatedUser?.info || null,
  );

  const [onsiteInfo, setOnsiteInfo] = useState<Array<Contact>>(
    userInfo
      ? JSON.parse(JSON.stringify(userInfo.onsiteContacts))
      : [
          {
            name: "Tester",
            phone: "123467",
            email: "test@test.com",
          },
        ],
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
            setAddress={setAddress}
            handleNext={() => {}} // Will be assigned by three step form
            numMeals={numMeals}
            setNumMeals={() => {}}
            dietaryRestrictions={dietaryRestrictions}
            setDietaryRestrictions={setDietaryRestrictions}
            deliveryInstructions={deliveryInstructions}
            setDeliveryInstructions={setDeliveryInstructions}
            onsiteStaff={onsiteStaff}
            setOnsiteStaff={setOnsiteStaff}
            onsiteInfo={onsiteInfo}
          />
        }
        panel3={<p>three!</p>}
      />
    </div>
  );
};

export default CreateMealRequest;
