import {SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Link, router} from "expo-router";
import {removeLocalStorage} from "@/lib/localStorages/storageManager";

const HomeScreen = () => {
    const handelClick = () => {
        removeLocalStorage('warehousemans_id');
        router.replace("../");
    }
    return (
        <View style={styles.container}>
            <Text>
                Hello From Home
            </Text>
            <TouchableOpacity style={styles.button} onPress={handelClick}>
                <Text>Press on me</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 60,
    },
    button: {
        alignItems: 'center',
        backgroundColor: '#DDDDDD',
        padding: 10,
    },
})

export default HomeScreen