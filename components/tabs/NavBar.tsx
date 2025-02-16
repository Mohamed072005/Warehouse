import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import {removeLocalStorage} from "@/lib/localStorages/storageManager";
import {router} from "expo-router";

const NavBar = () => {
    const handleLogout = () => {
        removeLocalStorage('warehousemans_id');
        router.replace("../");
    };
    return (
        <View style={styles.header}>
            <View>
                <Text style={styles.headerTitle}>Tableau de Bord</Text>
                <Text style={styles.headerSubtitle}>Gestion de Stock</Text>
            </View>
            <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                <MaterialCommunityIcons name="logout" size={24} color="#6D28D9" />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#ffffff',
        elevation: 2,
        shadowColor: '#6D28D9',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#6D28D9',
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#9CA3AF',
        marginTop: 2,
    },
    logoutButton: {
        padding: 8,
        backgroundColor: '#F3F4F6',
        borderRadius: 8,
    }
})

export default NavBar;