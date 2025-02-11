import {Stack} from "expo-router";

const AuthLayout: React.FC = () => {
    return (
        <Stack>
            <Stack.Screen
            name="index"
            options={{
                    title: 'Authentication',
            }}/>
        </Stack>
    )
}

export default AuthLayout