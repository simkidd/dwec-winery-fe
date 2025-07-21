import { ICartItem, ICartItemVariant } from "@/interfaces/cart.interface";

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

export const isVariantItem = (item: ICartItem): item is ICartItemVariant => {
  return "variant" in item && item.variant !== undefined;
};

export const getPaginationRange = (current: number, total: number) => {
  let start = Math.max(1, current - 2);
  let end = Math.min(total, current + 2);

  if (total <= 5) {
    start = 1;
    end = total;
  } else {
    if (current <= 3) {
      end = 5;
    } else if (current >= total - 2) {
      start = total - 4;
    }
  }

  const range = [];
  for (let i = start; i <= end; i++) {
    range.push(i);
  }
  return range;
};

export function slugify(text: string = ""): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// export const debounce = (fn: Function, delay: number) => {
//   let timeoutId: NodeJS.Timeout;
//   return (...args: any[]) => {
//     clearTimeout(timeoutId);
//     timeoutId = setTimeout(() => fn(...args), delay);
//   };
// };

export const formatCategory = (category?: string) => {
  if (!category) return "Uncategorized";

  return category
    .split("-") // Split hyphenated words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
    .join(" "); // Join with spaces
};
