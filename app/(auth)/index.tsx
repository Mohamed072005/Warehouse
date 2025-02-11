import {SafeAreaView, StyleSheet, Text, View} from "react-native";

const AuthScreen = () => {
    return (
        <SafeAreaView >
            <Text style={styles.container}>
                Hello from Auth page
            </Text>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        gap: 8,
    }
})

export default AuthScreen;