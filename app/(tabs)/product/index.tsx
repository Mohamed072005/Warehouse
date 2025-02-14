import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    TextInput,
    FlatList,
    TouchableOpacity,
    RefreshControl,
    Image
} from "react-native";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import {useEffect, useState} from "react";
import {Product} from "@/lib/types/Product";
import useApi from "@/hooks/useApi";
import  {router} from "expo-router";
import NavBar from "@/components/tabs/NavBar";

export const ProductScreen = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const { loading, useFetch, error } = useApi();
    const [products, setProducts] = useState<Product[] | null>();
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        const getProducts = async () => {
            const response = await useFetch<{ data: Product[], status: number }>("/products", { method: "GET" });
            setProducts(response.data);
        };
        getProducts();
    }, [refreshing]);

    const onRefresh = () => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 1000);
    };

    const ProductQuantityAndStock = ({ item }) => {
        let stockStatusColor, stockStatusText;
        let quantity = item.stocks.reduce((sum: number, stock: any) => sum + stock.quantity, 0);
        stockStatusColor =
            quantity === 0
                ? "#EF4444"
                : quantity <= 10
                    ? "#FFCC00"
                    : "#10B981";

        stockStatusText =
            quantity === 0
                ? "Stock épuisé"
                : quantity <= 10
                    ? "Stock faible"
                    : "En stock";
        return (
            <>
                <View style={styles.infoRow}>
                    <View style={styles.stockStatus}>
                        <View
                            style={[
                                styles.stockIndicator,
                                {backgroundColor: stockStatusColor},
                            ]}
                        />
                        <Text style={[styles.stockText, {color: stockStatusColor}]}>
                            {stockStatusText}
                        </Text>
                    </View>
                </View>
            </>
        )
    };

    const renderProductCard = ({ item }) => (
        <TouchableOpacity style={styles.productCard}>
            {item.image !== null ? (
                <View style={styles.imageContainer}>
                    <Image
                        source={{uri: item?.image}}
                        style={styles.productImage}
                        resizeMode="cover"
                    />
                </View>
            ) : (
                <View style={styles.imageContainer}>
                    <Image
                        source={require('../../../assets/images/Apr20_07_1162572100.jpg')}
                        style={styles.productImage}
                        resizeMode="cover"
                    />
                </View>
            )}
            <View style={styles.productHeader}>
                <View>
                    <Text style={styles.productName}>{item.name}</Text>
                </View>
                <TouchableOpacity style={styles.moreButton}>
                    <MaterialCommunityIcons name="dots-vertical" size={24} color="#6D28D9" />
                </TouchableOpacity>
            </View>

            <View style={styles.productInfo}>
                <View style={styles.infoRow}>
                    <View style={styles.infoItem}>
                        <MaterialCommunityIcons name="package-variant" size={20} color="#6D28D9" />
                        <Text style={styles.infoText}>{item.quantity} unités</Text>
                    </View>
                    <View style={styles.infoItem}>
                        <MaterialCommunityIcons name="tag" size={20} color="#6D28D9" />
                        <Text style={styles.infoText}>{item.price}</Text>
                    </View>
                </View>
                <ProductQuantityAndStock item={item} />
            </View>

            <View style={styles.actionButtons}>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() =>
                        router.push({
                            pathname: "/product/[id]",
                            params: { productDetail: JSON.stringify(item) },
                        })
                    }>
                    <MaterialCommunityIcons name="pencil" size={20} color="#6D28D9" />
                    <Text style={styles.actionButtonText}>View Details</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <NavBar />

            <View style={styles.searchContainer}>
                <MaterialCommunityIcons name="magnify" size={24} color="#9CA3AF" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Rechercher un produit..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            <FlatList
                data={products}
                renderItem={renderProductCard}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.productList}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor="#6D28D9"
                    />
                }
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F7FF',
        marginTop: 55,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: 'white',
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
    filterButton: {
        padding: 8,
        backgroundColor: '#F3F4F6',
        borderRadius: 8,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 16,
        padding: 12,
        backgroundColor: 'white',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#4B5563',
    },
    productList: {
        padding: 16,
        gap: 16,
    },
    productCard: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        elevation: 2,
        shadowColor: '#6D28D9',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    productHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    productName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#4B5563',
    },
    productSku: {
        fontSize: 14,
        color: '#9CA3AF',
        marginTop: 2,
    },
    moreButton: {
        padding: 4,
    },
    productInfo: {
        marginBottom: 12,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    infoText: {
        fontSize: 14,
        color: '#4B5563',
    },
    stockStatus: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    stockIndicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    stockText: {
        fontSize: 14,
        fontWeight: '500',
    },
    actionButtons: {
        flexDirection: 'row',
        borderTopWidth: 1,
        justifyContent: 'center',
        borderTopColor: '#E5E7EB',
        paddingTop: 12,
        marginTop: 12,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        padding: 8,
        borderRadius: 8,
        backgroundColor: '#F3F4F6',
    },
    actionButtonText: {
        fontSize: 14,
        color: '#6D28D9',
        fontWeight: '500',
    },
    fab: {
        position: 'absolute',
        right: 16,
        bottom: 16,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#6D28D9',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#6D28D9',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    imageContainer: {
        height: 200,
        backgroundColor: 'white',
        margin: 16,
        borderRadius: 12,
        overflow: 'hidden',
    },
    productImage: {
        width: '100%',
        height: '100%',
    },
});

export default ProductScreen;