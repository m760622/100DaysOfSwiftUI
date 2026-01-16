import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  Text,
  TextInput,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";

import { recognizeTextFromImage } from "../services/ocr";
import { useStore } from "../store/useStore";
import { detectLanguage, getTextAlign, getWritingDirection } from "../utils/language";

export default function HomeScreen() {
  const router = useRouter();
  const { text, language, setText, setLanguage } = useStore();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleTextChange = (value: string) => {
    setText(value);
    setLanguage(detectLanguage(value));
  };

  const processImage = async (result: ImagePicker.ImagePickerResult) => {
    if (result.canceled) {
      return;
    }

    const asset = result.assets?.[0];
    if (!asset?.uri) {
      return;
    }

    setIsProcessing(true);
    try {
      const extracted = await recognizeTextFromImage(asset.uri);
      setText(extracted);
      setLanguage(detectLanguage(extracted));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    await processImage(result);
  };

  const handleUpload = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    await processImage(result);
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <View className="flex-1 px-6 pt-8">
        <Text className="text-2xl font-semibold text-white">Speed Reader</Text>
        <Text className="mt-2 text-sm text-slate-300">
          Paste text or scan an image to begin your RSVP reading session.
        </Text>

        <View className="mt-6 flex-1 rounded-3xl bg-slate-900/60 p-4">
          <TextInput
            className="flex-1 text-base text-white"
            multiline
            placeholder="Paste or scan your text here..."
            placeholderTextColor="#94a3b8"
            value={text}
            onChangeText={handleTextChange}
            textAlign={getTextAlign(language)}
            style={{ writingDirection: getWritingDirection(language) }}
          />
          {isProcessing && (
            <View className="absolute inset-0 items-center justify-center rounded-3xl bg-slate-950/70">
              <ActivityIndicator color="#38bdf8" size="large" />
              <Text className="mt-3 text-sm text-slate-200">
                Extracting text...
              </Text>
            </View>
          )}
        </View>

        <View className="mt-6 flex-row gap-3">
          <Pressable
            className="flex-1 rounded-full bg-sky-500 py-3"
            onPress={() => router.push("/editor")}
          >
            <Text className="text-center text-base font-semibold text-white">
              Edit Text
            </Text>
          </Pressable>
          <Pressable
            className="flex-1 rounded-full bg-emerald-500 py-3"
            onPress={() => router.push("/reader")}
          >
            <Text className="text-center text-base font-semibold text-white">
              Start Reading
            </Text>
          </Pressable>
        </View>
      </View>

      <View className="absolute bottom-8 right-6 items-end gap-3">
        <Pressable
          className="h-14 w-14 items-center justify-center rounded-full bg-white/10 shadow-lg"
          onPress={handleCamera}
        >
          <Text className="text-xs font-semibold text-white">Scan</Text>
        </Pressable>
        <Pressable
          className="h-14 w-14 items-center justify-center rounded-full bg-white/10 shadow-lg"
          onPress={handleUpload}
        >
          <Text className="text-xs font-semibold text-white">Upload</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
