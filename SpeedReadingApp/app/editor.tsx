import { useState } from "react";
import { Pressable, SafeAreaView, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";

import { useStore } from "../store/useStore";
import { detectLanguage, getTextAlign, getWritingDirection } from "../utils/language";

export default function EditorScreen() {
  const router = useRouter();
  const { text, language, setText, setLanguage } = useStore();
  const [draft, setDraft] = useState(text);

  const handleSave = () => {
    setText(draft);
    setLanguage(detectLanguage(draft));
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <View className="flex-1 px-6 pt-8">
        <Text className="text-2xl font-semibold text-white">Edit Text</Text>
        <Text className="mt-2 text-sm text-slate-300">
          Clean up the extracted text before starting your reading session.
        </Text>

        <TextInput
          className="mt-6 flex-1 rounded-3xl bg-slate-900/60 p-4 text-base text-white"
          multiline
          value={draft}
          onChangeText={setDraft}
          textAlign={getTextAlign(language)}
          style={{ writingDirection: getWritingDirection(language) }}
        />

        <View className="mt-6 flex-row gap-3">
          <Pressable
            className="flex-1 rounded-full border border-slate-600 py-3"
            onPress={() => router.back()}
          >
            <Text className="text-center text-base font-semibold text-slate-200">
              Cancel
            </Text>
          </Pressable>
          <Pressable
            className="flex-1 rounded-full bg-sky-500 py-3"
            onPress={handleSave}
          >
            <Text className="text-center text-base font-semibold text-white">
              Save
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
