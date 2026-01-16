import { useEffect, useMemo, useState } from "react";
import { Pressable, SafeAreaView, Text, View } from "react-native";
import { useRouter } from "expo-router";

import { useStore } from "../store/useStore";
import { getTextAlign, getWritingDirection } from "../utils/language";

export default function ReaderScreen() {
  const router = useRouter();
  const { text, language, settings } = useStore();
  const [index, setIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const words = useMemo(() => text.trim().split(/\s+/).filter(Boolean), [text]);
  const chunkSize = settings.chunkSize;

  const currentChunk = useMemo(() => {
    if (words.length === 0) {
      return "Add text to begin.";
    }

    return words.slice(index, index + chunkSize).join(" ");
  }, [words, index, chunkSize]);

  useEffect(() => {
    setIndex(0);
  }, [text, chunkSize]);

  useEffect(() => {
    if (!isRunning || words.length === 0) {
      return;
    }

    const intervalMs = (60000 / settings.wpm) * chunkSize;
    const interval = setInterval(() => {
      setIndex((prev) => {
        const next = prev + chunkSize;
        if (next >= words.length) {
          return 0;
        }
        return next;
      });
    }, intervalMs);

    return () => clearInterval(interval);
  }, [chunkSize, isRunning, settings.wpm, words.length]);

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <View className="flex-1 items-center justify-center px-6">
        <Text
          className="text-center font-semibold text-white"
          style={{
            fontSize: settings.fontSize,
            textAlign: getTextAlign(language),
            writingDirection: getWritingDirection(language),
          }}
        >
          {currentChunk}
        </Text>
      </View>

      <View className="px-6 pb-10">
        <View className="flex-row gap-3">
          <Pressable
            className="flex-1 rounded-full border border-slate-600 py-3"
            onPress={() => router.push("/settings")}
          >
            <Text className="text-center text-base font-semibold text-slate-200">
              Settings
            </Text>
          </Pressable>
          <Pressable
            className="flex-1 rounded-full bg-emerald-500 py-3"
            onPress={() => setIsRunning((prev) => !prev)}
          >
            <Text className="text-center text-base font-semibold text-white">
              {isRunning ? "Pause" : "Start"}
            </Text>
          </Pressable>
        </View>
        <Pressable className="mt-3 py-2" onPress={() => router.back()}>
          <Text className="text-center text-sm text-slate-400">Back</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
