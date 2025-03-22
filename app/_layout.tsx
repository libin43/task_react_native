import { Link, Stack } from "expo-router";
import { Button } from "react-native-paper";

export default function RootLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="profile/index" options={{ title: "Profile" }} />
            <Stack.Screen name="tasks/create"
                options={{
                    title: "Create Task",
                    headerRight: () => (
                        <Link href={'/profile'} asChild>
                            <Button>Profile</Button>
                        </Link>
                    )
                }}
            />
            <Stack.Screen name="tasks/[id]"
                options={{
                    title: "Task Details",
                    headerRight: () => (
                        <Link href={'/profile'} asChild>
                            <Button>Profile</Button>
                        </Link>
                    )
                }}
            />
        </Stack>
    )
}
