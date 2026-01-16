import { Pressable, SafeAreaView, Text, View } from "react-native";
import { BlurView } from "expo-blur";
import Slider from "@react-native-community/slider";
import { useRouter } from "expo-router";

import { useStore } from "../store/useStore";

const chunkOptions = [1, 2, 3, 5];

export default function SettingsScreen() {
  const router = useRouter();
  const { settings, updateSettings } = useStore();

  return (
    <SafeAreaView className="flex-1 bg-slate-950/80">
      <View className="flex-1 justify-center px-6">
        <BlurView intensity={50} tint="dark" className="rounded-3xl p-6">
          <Text className="text-2xl font-semibold text-white">Reader Settings</Text>
          <Text className="mt-2 text-sm text-slate-300">
            Tune the speed and layout for maximum comprehension.
          </Text>

          <View className="mt-6">
            <Text className="text-sm text-slate-300">Font Size</Text>
            <Text className="mt-1 text-lg font-semibold text-white">
              {Math.round(settings.fontSize)} pt
            </Text>
            <Slider
              minimumValue={24}
              maximumValue={72}
              value={settings.fontSize}
              minimumTrackTintColor="#38bdf8"
              maximumTrackTintColor="#334155"
              thumbTintColor="#e2e8f0"
              onValueChange={(value) => updateSettings({ fontSize: value })}
            />
          </View>

          <View className="mt-6">
            <Text className="text-sm text-slate-300">Words per minute</Text>
            <Text className="mt-1 text-lg font-semibold text-white">
              {Math.round(settings.wpm)} WPM
            </Text>
            <Slider
              minimumValue={100}
              maximumValue={800}
              step={10}
              value={settings.wpm}
              minimumTrackTintColor="#34d399"
              maximumTrackTintColor="#334155"
              thumbTintColor="#e2e8f0"
              onValueChange={(value) => updateSettings({ wpm: value })}
            />
          </View>

          <View className="mt-6">
            <Text className="text-sm text-slate-300">Chunk Size</Text>
            <View className="mt-3 flex-row flex-wrap gap-3">
              {chunkOptions.map((option) => {
                const isActive = option === settings.chunkSize;
                return (
                  <Pressable
                    key={option}
                    className={`rounded-full px-4 py-2 ${
                      isActive ? "bg-sky-500" : "border border-slate-600"
                    }`}
                    onPress={() => updateSettings({ chunkSize: option })}
                  >
                    <Text
                      className={`text-sm font-semibold ${
                        isActive ? "text-white" : "text-slate-200"
                      }`}
                    >
                      {option} words
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <Pressable
            className="mt-8 rounded-full bg-white/10 py-3"
            onPress={() => router.back()}
          >
            <Text className="text-center text-base font-semibold text-white">
              Done
            </Text>
          </Pressable>
        </BlurView>
      </View>
    </SafeAreaView>
  );
}
