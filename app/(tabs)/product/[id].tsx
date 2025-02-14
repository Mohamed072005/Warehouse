import { StyleSheet, Text, View, SafeAreaView, ScrollView, Image, TouchableOpacity } from "react-native";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import {useLocalSearchParams} from "expo-router";
import {useEffect, useState} from "react";
import {Product} from "@/lib/types/Product";

export const ProductDetails = () => {
    const { productDetail } = useLocalSearchParams<{ productDetail: string }>();
    const [loading, setLoading] = useState<boolean>(true);
    console.log(productDetail);
    const product: Product = JSON.parse(productDetail);

    useEffect(() => {
        if (productDetail){
            setLoading(false);
        }
    }, [productDetail]);

    if (loading) {
        return <Text>Loading...</Text>;
    }
    if (!product) {
        return <Text>Product not found</Text>;
    }

    const totalStock = product?.stocks?.reduce((sum, stock) => sum + stock.quantity, 0);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                {/* Header */}
                <View style={styles.header}>
                    {/*<TouchableOpacity style={styles.backButton}>*/}
                    {/*    <MaterialCommunityIcons name="arrow-left" size={24} color="#6D28D9" />*/}
                    {/*</TouchableOpacity>*/}
                    <Text style={styles.headerTitle}>Détails du Produit</Text>
                </View>

                {/* Product Image */}
                {product?.image !== null ? (
                    <View style={styles.imageContainer}>
                        <Image
                            source={{ uri: product?.image }}
                            style={styles.productImage}
                            resizeMode="cover"
                        />
                    </View>
                ): (
                    <View style={styles.imageContainer}>
                        <Image
                            source={require('../../../assets/images/Apr20_07_1162572100.jpg')}
                            style={styles.productImage}
                            resizeMode="cover"
                        />
                    </View>
                )}

                {/* Product Info Card */}
                <View style={styles.card}>
                    <Text style={styles.productName}>{product?.name}</Text>
                    <View style={styles.badgeContainer}>
                        <View style={styles.badge}>
                            <MaterialCommunityIcons name="tag" size={16} color="#6D28D9" />
                            <Text style={styles.badgeText}>{product?.type}</Text>
                        </View>
                        <View style={styles.badge}>
                            <MaterialCommunityIcons name="factory" size={16} color="#6D28D9" />
                            <Text style={styles.badgeText}>{product?.supplier}</Text>
                        </View>
                    </View>

                    <View style={styles.priceContainer}>
                        <View style={styles.priceItem}>
                            <Text style={styles.priceLabel}>Prix Normal</Text>
                            <Text style={styles.price}>{product?.price} MAD</Text>
                        </View>
                        <View style={styles.priceItem}>
                            <Text style={styles.priceLabel}>Prix Soldé</Text>
                            <Text style={styles.discountPrice}>{product?.solde || '0'} MAD</Text>
                        </View>
                    </View>

                    <View style={styles.barcodeSection}>
                        <MaterialCommunityIcons name="barcode" size={24} color="#6D28D9" />
                        <Text style={styles.barcodeText}>{product?.barcode}</Text>
                    </View>
                </View>

                {/* Stock Information */}
                <View style={styles.card}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Stock Total</Text>
                        <View style={styles.totalStock}>
                            <Text style={styles.totalStockText}>{totalStock} unités</Text>
                        </View>
                    </View>

                    {product?.stocks?.map((stock) => (
                        <View key={stock?.id} style={styles.stockItem}>
                            <View style={styles.stockHeader}>
                                <Text style={styles.stockName}>{stock?.name}</Text>
                                <Text style={styles.stockQuantity}>{stock?.quantity} unités</Text>
                            </View>
                            <View style={styles.locationInfo}>
                                <MaterialCommunityIcons name="map-marker" size={16} color="#6D28D9" />
                                <Text style={styles.locationText}>
                                    {stock?.localisation?.city} ({stock?.localisation?.latitude?.toFixed(4)}, {stock?.localisation?.longitude?.toFixed(4)})
                                </Text>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Edit History */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Historique des Modifications</Text>
                    {product?.editedBy?.map((edit, index) => (
                        <View key={index} style={styles.editItem}>
                            <MaterialCommunityIcons name="clock-outline" size={16} color="#6D28D9" />
                            <Text style={styles.editText}>
                                Modifié par ID: {edit?.warehousemanId} le {new Date(edit?.at).toLocaleDateString()}
                            </Text>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F7FF',
        marginTop: 40
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: 'white',
        elevation: 2,
        shadowColor: '#6D28D9',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#6D28D9',
    },
    backButton: {
        padding: 8,
    },
    editButton: {
        padding: 8,
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
    card: {
        backgroundColor: 'white',
        margin: 16,
        marginTop: 0,
        padding: 16,
        borderRadius: 12,
        elevation: 2,
        shadowColor: '#6D28D9',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    productName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 12,
    },
    badgeContainer: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 16,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 4,
    },
    badgeText: {
        color: '#6D28D9',
        fontSize: 14,
        fontWeight: '500',
    },
    priceContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    priceItem: {
        alignItems: 'center',
    },
    priceLabel: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 4,
    },
    price: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    discountPrice: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#10B981',
    },
    barcodeSection: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        padding: 12,
        borderRadius: 8,
        gap: 8,
    },
    barcodeText: {
        fontSize: 16,
        color: '#4B5563',
        fontFamily: 'monospace',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1F2937',
    },
    totalStock: {
        backgroundColor: '#6D28D9',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    totalStockText: {
        color: 'white',
        fontWeight: '600',
    },
    stockItem: {
        backgroundColor: '#F3F4F6',
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
    },
    stockHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    stockName: {
        fontSize: 16,
        fontWeight: '500',
        color: '#1F2937',
    },
    stockQuantity: {
        fontSize: 16,
        fontWeight: '600',
        color: '#6D28D9',
    },
    locationInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    locationText: {
        fontSize: 14,
        color: '#6B7280',
    },
    editItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 8,
    },
    editText: {
        fontSize: 14,
        color: '#6B7280',
    },
});

export default ProductDetails;