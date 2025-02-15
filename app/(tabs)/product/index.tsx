import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    TextInput,
    FlatList,
    TouchableOpacity,
    RefreshControl,
    Image,
} from "react-native";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import {useEffect, useState} from "react";
import {Product} from "@/lib/types/Product";
import useApi from "@/hooks/useApi";
import  {router} from "expo-router";
import NavBar from "@/components/tabs/NavBar";

export const ProductScreen = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [priceSort, setPriceSort] = useState<'none' | 'asc' | 'desc'>('none');
    const [quantitySort, setQuantitySort] = useState<'none' | 'asc' | 'desc'>('none');
    const { useFetch } = useApi();
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

    const handlePriceSort = () => {
        setPriceSort(current => {
            if (current === 'none') return 'asc';
            if (current === 'asc') return 'desc';
            return 'none';
        });
        setQuantitySort('none');
    };

    const handleQuantitySort = () => {
        setQuantitySort(current => {
            if (current === 'none') return 'asc';
            if (current === 'asc') return 'desc';
            return 'none';
        });
        setPriceSort('none');
    };

    const getSortedProducts = (products: Product[] | undefined | null) => {
        if (!products) return [];

        let sortedProducts = [...products];

        sortedProducts = sortedProducts.filter((product: Product) => {
            return product?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product?.barcode?.toLowerCase().includes(searchQuery.toLowerCase());
        });

        if (priceSort !== 'none') {
            sortedProducts.sort((a, b) => {
                const priceA = parseFloat(a.price);
                const priceB = parseFloat(b.price);
                return priceSort === 'asc' ? priceA - priceB : priceB - priceA;
            });
        }

        if (quantitySort !== 'none') {
            sortedProducts.sort((a, b) => {
                const quantityA = a.stocks.reduce((sum: number, stock: any) => sum + stock.quantity, 0);
                const quantityB = b.stocks.reduce((sum: number, stock: any) => sum + stock.quantity, 0);
                return quantitySort === 'asc' ? quantityA - quantityB : quantityB - quantityA;
            });
        }

        return sortedProducts;
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

            <View style={styles.filterContainer}>
                <TouchableOpacity
                    style={[
                        styles.filterButtons,
                        {backgroundColor: quantitySort !== 'none' ? "#c380ff" : "#fff"}
                    ]}
                    onPress={handleQuantitySort}
                >
                    <View style={styles.filterButtonContent}>
                        <Text
                            style={[
                                styles.filterText,
                                {color: quantitySort !== 'none' ? "#fff" : "#c380ff"}
                            ]}
                        >
                            Quantity {quantitySort !== 'none' ? (quantitySort === 'asc' ? '↓' : '↑') : ''}
                        </Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.filterButtons,
                        {backgroundColor: priceSort !== 'none' ? "#c380ff" : "#fff"}
                    ]}
                    onPress={handlePriceSort}
                >
                    <View style={styles.filterButtonContent}>
                        <Text
                            style={[
                                styles.filterText,
                                {color: priceSort !== 'none' ? "#fff" : "#c380ff"}
                            ]}
                        >
                            Price {priceSort !== 'none' ? (priceSort === 'asc' ? '↓' : '↑') : ''}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>

            <FlatList
                data={getSortedProducts(products)}
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
    filterContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 30,
        alignItems: 'center',
        marginBottom: 6
    },
    filterButtons: {
        borderRadius: 25,
        borderWidth: 1,
        borderColor: '#a1a1a1',
        paddingHorizontal: 15,
        paddingVertical: 12,
        minWidth: 100,
        alignItems: 'center',
    },
    filterText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    filterButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
});

export default ProductScreen;