import TextRecognition from "@react-native-ml-kit/text-recognition";

export const recognizeTextFromImage = async (uri: string) => {
  const result = await TextRecognition.recognize(uri);

  if (typeof result.text === "string") {
    return result.text;
  }

  if (Array.isArray(result.blocks)) {
    return result.blocks
      .map((block) => block.lines.map((line) => line.text).join(" "))
      .join("\n");
  }

  return "";
};
