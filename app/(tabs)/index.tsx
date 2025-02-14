import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Link, router } from "expo-router";
import { removeLocalStorage } from "@/lib/localStorages/storageManager";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import NavBar from "@/components/tabs/NavBar";

const HomeScreen = () => {

    const statsCards = [
        {
            title: "Total Produits",
            value: "1,234",
            icon: "package-variant",
            color: "#8B5CF6"
        },
        {
            title: "En Stock",
            value: "891",
            icon: "warehouse",
            color: "#7C3AED"
        },
        {
            title: "Alertes Stock",
            value: "12",
            icon: "alert-circle",
            color: "#6D28D9"
        }
    ];

    const menuItems = [
        {
            title: "Scanner",
            icon: "barcode-scan",
            description: "Scanner des codes-barres",
            route: "/scanner",
            color: "#8B5CF6"
        },
        {
            title: "Stock",
            icon: "clipboard-list",
            description: "Gérer le stock",
            route: "/stock",
            color: "#7C3AED"
        },
        {
            title: "Nouveau Produit",
            icon: "plus-box",
            description: "Ajouter un produit",
            route: "/new-product",
            color: "#6D28D9"
        },
        {
            title: "Inventaire",
            icon: "view-list",
            description: "Voir l'inventaire",
            route: "/inventory",
            color: "#5B21B6"
        },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <NavBar />
            <View style={styles.content}>
                <View style={styles.statsContainer}>
                    {statsCards.map((stat, index) => (
                        <View
                            key={index}
                            style={[styles.statCard, { backgroundColor: stat.color }]}
                        >
                            <MaterialCommunityIcons name={stat.icon} size={24} color="white" />
                            <Text style={styles.statValue}>{stat.value}</Text>
                            <Text style={styles.statTitle}>{stat.title}</Text>
                        </View>
                    ))}
                </View>

                <Text style={styles.sectionTitle}>Actions Rapides</Text>

                <View style={styles.menuGrid}>
                    {menuItems.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.menuItem}
                            onPress={() => router.push(item.route)}
                        >
                            <View style={[styles.iconContainer, { backgroundColor: item.color + '15' }]}>
                                <MaterialCommunityIcons name={item.icon} size={32} color={item.color} />
                            </View>
                            <Text style={styles.menuItemTitle}>{item.title}</Text>
                            <Text style={styles.menuItemDescription}>{item.description}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F7FF',
        marginTop: 55,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    statCard: {
        flex: 1,
        margin: 4,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#6D28D9',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        marginTop: 8,
    },
    statTitle: {
        fontSize: 12,
        color: 'white',
        opacity: 0.9,
        marginTop: 4,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#4B5563',
        marginBottom: 16,
    },
    menuGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 16,
    },
    menuItem: {
        width: '47%',
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 16,
        elevation: 2,
        shadowColor: '#6D28D9',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    menuItemTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#4B5563',
        marginBottom: 4,
    },
    menuItemDescription: {
        fontSize: 12,
        color: '#9CA3AF',
    },
});

export default HomeScreen;