import React, { useEffect, useState } from "react";

import SchedulingFormCalendar from "./SchedulingFormCalendar";
import SchedulingFormWeekly from "./SchedulingFormWeekly";
import TitleSection from "./TitleSection";

import ThreeStepForm from "../../common/ThreeStepForm";

const CreateMealRequest = (): React.ReactElement => {
  // Part 1: Scheduling
  const [isWeeklyInput, setIsWeeklyInput] = useState(true); // Are we in weekly input mode (false means we are in calendar mode)
  const [donationFrequency, setDonationFrequency] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [scheduledDropOffTime, setScheduledDropOffTime] = useState("");

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
        header2="Meal Donation Information"
        header3="Review & Submit"
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
                setIsWeeklyInput={setIsWeeklyInput}
                handleNext={() => {}} // Will be assigned by three step form
             />
          )
        }
        panel2={<p>two!</p>}
        panel3={<p>three!</p>}
      />
    </div>
  );
};

export default CreateMealRequest;
