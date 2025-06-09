export const formatCurrency = (
  amount: number,
  currency = "NGN",
  max: number = 0
) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    maximumFractionDigits: max,
    // minimumFractionDigits: 0,
    // notation: "compact",
  }).format(amount);
};

export const formatText = (status: string) => status.replace(/_/g, " ");

export const formatUnderscoreText = (text: string) => {
  // Replace underscores with spaces and capitalize each word
  return text
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
