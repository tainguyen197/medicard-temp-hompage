export const formatDate = (date: Date | string): string => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

export const LANGUAGE_OPTIONS = [
  { value: "vi", label: "Vietnamese" },
  { value: "en", label: "English" },
];