import { useSignIn } from "@clerk/expo";
import { Link, useRouter, type Href } from "expo-router";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

export default function SignInScreen() {
  const router = useRouter();
  const { signIn, errors, fetchStatus } = useSignIn();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");

  const isFetching = fetchStatus === "fetching";

  const navigateAfterAuth = ({ decorateUrl }: { decorateUrl: (url: string) => string }) => {
    const url = decorateUrl("/");
    if (url.startsWith("http")) {
      window.location.href = url;
    } else {
      router.replace(url as Href);
    }
  };

  const handleSubmit = async () => {
    const { error } = await signIn.password({ emailAddress, password });
    if (error) return;

    if (signIn.status === "complete") {
      await signIn.finalize({ navigate: navigateAfterAuth });
    }
  };

  return (
    <View className="flex-1 items-center justify-center gap-4 bg-white px-6">
      <Text className="text-2xl font-semibold">Sign in to SnapGrocer</Text>
      <TextInput
        className="w-full rounded-lg border border-neutral-300 px-4 py-3"
        value={emailAddress}
        onChangeText={setEmailAddress}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
      />
      {errors.fields.identifier ? (
        <Text className="text-red-500">{errors.fields.identifier.message}</Text>
      ) : null}
      <TextInput
        className="w-full rounded-lg border border-neutral-300 px-4 py-3"
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
      />
      {errors.fields.password ? (
        <Text className="text-red-500">{errors.fields.password.message}</Text>
      ) : null}
      <Pressable
        className={`w-full items-center rounded-lg bg-black py-3 ${isFetching ? "opacity-50" : ""}`}
        onPress={handleSubmit}
        disabled={isFetching}
      >
        <Text className="font-semibold text-white">Sign in</Text>
      </Pressable>
      <Link href="/(auth)/sign-up">
        <Text className="text-sm text-neutral-500">
          Don&apos;t have an account? <Text className="font-semibold text-black">Sign up</Text>
        </Text>
      </Link>
    </View>
  );
}
