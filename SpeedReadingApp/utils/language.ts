import type { ReaderLanguage } from "../store/useStore";

const arabicRegex = /[\u0600-\u06ff]/;
const swedishRegex = /[åäöÅÄÖ]/;

export const detectLanguage = (text: string): ReaderLanguage => {
  if (arabicRegex.test(text)) {
    return "arabic";
  }

  if (swedishRegex.test(text)) {
    return "swedish";
  }

  return "english";
};

export const getWritingDirection = (language: ReaderLanguage) =>
  language === "arabic" ? "rtl" : "ltr";

export const getTextAlign = (language: ReaderLanguage) =>
  language === "arabic" ? "right" : "left";
