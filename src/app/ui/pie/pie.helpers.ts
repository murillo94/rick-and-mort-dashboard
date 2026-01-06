export const formatLabelPercentage = (value: number) => {
  const percentage = Math.round(value);

  // Hide labels for very tiny segments (< 2%)
  if (percentage < 2) return null;

  // Adjust font size based on percentage - smaller segments get smaller fonts
  let fontSize = "4px";
  if (percentage >= 10) fontSize = "8px";
  else if (percentage >= 7) fontSize = "7px";
  else if (percentage >= 5) fontSize = "6px";
  else if (percentage >= 3) fontSize = "5px";

  return {
    percentage,
    fontSize,
  };
};
