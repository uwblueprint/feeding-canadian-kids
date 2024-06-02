export function convertTimeToUtc(time: string): string {
  // Take a time like 11:42 and convert it to the UTC time again in the HH:MM format

  // Split the time string into hours and minutes
  const [hours, minutes] = time.split(":").map(Number);

  // Create a new Date object with the current date and the specified time
  const now = new Date();
  const localDate = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    hours,
    minutes,
  );

  // Get the UTC time components
  const utcHours = localDate.getUTCHours();
  const utcMinutes = localDate.getUTCMinutes();

  // Format the UTC time as a string
  const utcTimeString = `${String(utcHours).padStart(2, "0")}:${String(
    utcMinutes,
  ).padStart(2, "0")}`;

  return utcTimeString;
}
