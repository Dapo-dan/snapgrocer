import { useClerk, useUser } from "@clerk/expo";
import { UserButton } from "@clerk/expo/native";
import { Pressable, Text, View } from "react-native";

export default function Index() {
  const { user } = useUser();
  const { signOut } = useClerk();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 16,
      }}
    >
      <Text>Welcome!</Text>
      <Text className="text-red-500">
        Edit app/(home)/index.tsx to edit this screen.
      </Text>
      <Text className="text-neutral-500">
        Signed in as {user?.primaryEmailAddress?.emailAddress}
      </Text>
      <Pressable
        className="rounded-lg bg-black px-4 py-2"
        onPress={() => signOut()}
      >
        <Text className="font-semibold text-white">Sign out</Text>
      </Pressable>

      <UserButton />
    </View>
  );
}
