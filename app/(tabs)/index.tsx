import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import NavBar from "@/components/tabs/NavBar";
import useApi from "@/hooks/useApi";
import { useEffect, useCallback, memo, useState } from "react";

interface Product {
    price: number;
    quantity: number;
    stocks: Array<{
        localisation?: {
            city: string;
        };
    }>;
}

interface Statistics {
    totalProducts: number;
    totalStockValue: number;
}

// Memoized stat card component
const StatCard = memo(({ title, value, icon, color }: {
    title: string;
    value: number | string;
    icon: string;
    color: string;
}) => (
    <View style={[styles.statCard, { backgroundColor: color }]}>
        <MaterialCommunityIcons name={icon} size={24} color="white" />
        <Text style={styles.statValue}>
            {typeof value === 'number' ? value.toLocaleString() : value}
        </Text>
        <Text style={styles.statTitle}>{title}</Text>
    </View>
));

const MENU_ITEMS = [
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
    }
] as const;

const HomeScreen = () => {
    const { useFetch, loading, error } = useApi();
    const [stats, setStats] = useState<Statistics>({
        totalProducts: 0,
        totalStockValue: 0
    });
    const [cityCount, setCityCount] = useState<number>(0);

    useEffect(() => {
        const fetchDashboardData = async () => {
            // Fetch statistics
            const statsResponse = await useFetch<{ data: Statistics; status: number }>('statistics', {
                method: 'GET'
            });

            // Fetch products to calculate city count
            const productsResponse = await useFetch<{ data: Product[]; status: number }>('products', {
                method: 'GET'
            });

            if (statsResponse?.data) {
                setStats(statsResponse.data);
            }

            if (productsResponse?.data) {
                // Calculate unique cities
                const cities = new Set();
                productsResponse.data.forEach(product => {
                    product.stocks.forEach(stock => {
                        if (stock.localisation?.city) {
                            cities.add(stock.localisation.city);
                        }
                    });
                });
                setCityCount(cities.size);
            }
        };

        fetchDashboardData();
    }, []);

    const handleNavigation = useCallback((route: string) => {
        router.push(route);
    }, []);

    const STATS_CONFIG = [
        {
            title: "Total Produits",
            key: "totalProducts",
            icon: "package-variant",
            color: "#8B5CF6",
            value: stats.totalProducts
        },
        {
            title: "Nombre de Villes",
            key: "cityCount",
            icon: "city",
            color: "#7C3AED",
            value: cityCount
        },
        {
            title: "Valeur du Stock",
            key: "totalStockValue",
            icon: "cash",
            color: "#6D28D9",
            value: `${stats.totalStockValue.toLocaleString()} MAD`
        }
    ] as const;

    return (
        <SafeAreaView style={styles.container}>
            <NavBar />
            <View style={styles.content}>

                {error ? (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>
                            Une erreur est survenue lors du chargement des données
                        </Text>
                    </View>
                ) : (
                    <View style={styles.statsContainer}>
                        {loading ? (
                            <View style={[styles.loadingIconContainer, {margin: 'auto'}]}>
                                <ActivityIndicator size="large" color="#6D28D9" />
                            </View>
                        ) : (
                            STATS_CONFIG.map((stat) => (
                                <StatCard
                                    key={stat.key}
                                    title={stat.title}
                                    value={stat.value}
                                    icon={stat.icon}
                                    color={stat.color}
                                />
                            ))
                        )}
                    </View>
                )}

                <Text style={styles.sectionTitle}>Actions Rapides</Text>

                <View style={styles.menuGrid}>
                    {MENU_ITEMS.map((item) => (
                        <TouchableOpacity
                            key={item.route}
                            style={styles.menuItem}
                            onPress={() => handleNavigation(item.route)}
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
    headerContainer: {
        marginBottom: 24,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 4,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
        minHeight: 100,
        alignItems: 'center',
    },
    errorContainer: {
        padding: 16,
        backgroundColor: '#FEE2E2',
        borderRadius: 8,
        marginBottom: 24,
    },
    errorText: {
        color: '#DC2626',
        textAlign: 'center',
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
    loadingIconContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    }
});

export default HomeScreen;