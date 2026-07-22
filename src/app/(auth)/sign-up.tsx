import { useSignUp } from "@clerk/expo";
import { Link, useRouter, type Href } from "expo-router";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

export default function SignUpScreen() {
  const router = useRouter();
  const { signUp, errors, fetchStatus } = useSignUp();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);

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
    const { error } = await signUp.password({ emailAddress, password });
    if (error) return;

    await signUp.verifications.sendEmailCode();
    setPendingVerification(true);
  };

  const handleVerify = async () => {
    await signUp.verifications.verifyEmailCode({ code });

    if (signUp.status === "complete") {
      await signUp.finalize({ navigate: navigateAfterAuth });
    }
  };

  if (pendingVerification) {
    return (
      <View className="flex-1 items-center justify-center gap-4 bg-white px-6">
        <Text className="text-2xl font-semibold">Check your email</Text>
        <Text className="text-center text-neutral-500">
          Enter the verification code we sent to {emailAddress}.
        </Text>
        <TextInput
          className="w-full rounded-lg border border-neutral-300 px-4 py-3"
          value={code}
          onChangeText={setCode}
          placeholder="Verification code"
          keyboardType="number-pad"
          autoFocus
        />
        {errors.fields.code ? (
          <Text className="text-red-500">{errors.fields.code.message}</Text>
        ) : null}
        <Pressable
          className={`w-full items-center rounded-lg bg-black py-3 ${isFetching ? "opacity-50" : ""}`}
          onPress={handleVerify}
          disabled={isFetching}
        >
          <Text className="font-semibold text-white">Verify</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1 items-center justify-center gap-4 bg-white px-6">
      <Text className="text-2xl font-semibold">Create your account</Text>
      <TextInput
        className="w-full rounded-lg border border-neutral-300 px-4 py-3"
        value={emailAddress}
        onChangeText={setEmailAddress}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
      />
      {errors.fields.emailAddress ? (
        <Text className="text-red-500">{errors.fields.emailAddress.message}</Text>
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
        <Text className="font-semibold text-white">Sign up</Text>
      </Pressable>
      <Link href="/(auth)/sign-in">
        <Text className="text-sm text-neutral-500">
          Already have an account? <Text className="font-semibold text-black">Sign in</Text>
        </Text>
      </Link>
      <View nativeID="clerk-captcha" />
    </View>
  );
}
