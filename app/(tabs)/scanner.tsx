import { CameraView, CameraType, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
import { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Modal, TextInput, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getLocalStorage} from "@/lib/localStorages/storageManager";
import useApi from "@/hooks/useApi";
import {Product} from "@/lib/types/Product";

interface NewProduct {
    id: string;
    name: string;
    type: string;
    barcode: string;
    price: string;
    supplier: string;
    stock:[{
        id: string,
        quantity: number
    }]
}

export default function BarcodeScanner() {

    const { error, loading, useFetch } = useApi();
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [isTransferProduct, setIsTransferProduct] = useState(false);
    const [currentProduct, setCurrentProduct] = useState<any>(null);
    const [isNewProduct, setIsNewProduct] = useState(false);
    const [newProduct, setNewProduct] = useState<NewProduct>({
        id: '',
        name: '',
        type: '',
        price: '',
        supplier: '',
        barcode: '',
        stock: [{
            id: '',
            quantity: 0
        }]
    });

    if (!permission) {
        return <View />;
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={styles.message}>We need your permission to show the camera</Text>
                <Button onPress={requestPermission} title="grant permission" />
            </View>
        );
    }

    const handleBarCodeScanned = async ({ type, data }: BarcodeScanningResult) => {
        console.log(data);
        setScanned(true);
        setCurrentProduct({ barcode: data });
        const warehouseman_id = await getLocalStorage('warehouseman_id');
        try {
            const response = await useFetch<{ data: Product[], status: number }>('products', { method: 'GET' });
            if (response?.status === 200) {
                const correctProduct = response.data.filter((product: Product) => product.id === +data);
                console.log(correctProduct);
                if(correctProduct.length > 0){
                    setCurrentProduct(correctProduct);
                    setIsNewProduct(false);
                    setModalVisible(true);
                }else {
                    setCurrentProduct({ barcode: data });
                    setIsNewProduct(true);
                    setModalVisible(true);
                }
            }
        }catch (error: any) {
            console.log(error);
        }
    };

    const handleSubmit = async () => {
        try {
            const warehouseman = (await AsyncStorage.getItem('warehouseman')) || '';
            const warehouseman_id = JSON.parse(warehouseman).warehouseId;

            const PRD_ID = Math.floor(Math.random() * 1000000).toString();

            if (isNewProduct) {
                console.log(`New product added: 
          id: ${newProduct.id}
          Name: ${newProduct.name}
          Type: ${newProduct.type}
          Price: ${newProduct.price}
          Supplier: ${newProduct.supplier}
          Barcode: ${currentProduct.barcode}
          Stock: ${newProduct.stock[0].quantity}
        `);
                // await addProduct({ ...newProduct, id: PRD_ID, barcode: currentProduct.barcode, stock: [{ id: warehouseman_id, quantity: newProduct.stock[0].quantity }] })
                setModalVisible(false);
                setNewProduct({
                    id: '',
                    name: '',
                    type: '',
                    price: '',
                    supplier: '',
                    barcode: '',
                    stock: [{
                        id: '',
                        quantity: 0
                    }]
                });
            } else if (isTransferProduct) {
                // Add new stock for current warehouse
                // const result = await updateStock(currentProduct, {
                //     id: warehouseman_id,
                //     quantity: newProduct.stock[0].quantity
                // });
                //
                // if (result.status) {
                //     Alert.alert('Success', 'Stock added successfully');
                // } else {
                //     Alert.alert('Error', 'Failed to add stock');
                // }
            } else {
                console.log(`Added ${newProduct.stock[0].quantity} of ${currentProduct.name} - ${currentProduct.supplier} , id: ${currentProduct.id}`);
                // await updateStock(currentProduct, newProduct.stock[0])
            }

            setModalVisible(false);
            setScanned(false);
            setNewProduct({
                id: '',
                name: '',
                type: '',
                price: '',
                supplier: '',
                barcode: '',
                stock: [{
                    id: '',
                    quantity: 0
                }]
            });
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Something went wrong');
        }
    };

    return (
        <View style={styles.container}>
            <CameraView
                style={styles.camera}
                facing="back"
                onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                barcodeScannerSettings={{
                    barcodeTypes: ['ean13', 'upc_a'],
                }}
            >
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={() => setScanned(false)}>
                        <Text style={styles.text}>Scan Again</Text>
                    </TouchableOpacity>
                </View>
            </CameraView>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalTitle}>
                            {isNewProduct ? 'Add New Product' : 'Product Found'}
                        </Text>

                        {!isNewProduct && (
                            <>
                                <Text style={styles.productName}><Text style={{ fontWeight: 'bold' }}>Name: </Text> {currentProduct?.name} </Text>
                                <Text style={styles.productName}><Text style={{ fontWeight: 'bold' }}>Type: </Text> {currentProduct?.type} </Text>
                                <Text style={styles.productName}><Text style={{ fontWeight: 'bold' }}>Supplier: </Text> {currentProduct?.supplier} </Text>
                                <Text style={styles.productName}><Text style={{ fontWeight: 'bold' }}>Price: </Text> {currentProduct?.price} </Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter quantity"
                                    keyboardType="numeric"
                                    value={newProduct.stock[0].quantity.toString()}
                                    onChangeText={(value) => setNewProduct({
                                        ...newProduct,
                                        stock: [{ ...newProduct.stock[0], quantity: parseInt(value) || 0 }]
                                    })}
                                />
                            </>
                        )}

                        {isNewProduct && (
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Product Name"
                                    value={newProduct.name}
                                    onChangeText={(value) => setNewProduct({ ...newProduct, name: value })}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Product Type"
                                    value={newProduct.type}
                                    onChangeText={(value) => setNewProduct({ ...newProduct, type: value })}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Price"
                                    keyboardType="decimal-pad"
                                    value={newProduct.price}
                                    onChangeText={(value) => setNewProduct({ ...newProduct, price: value })}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Supplier"
                                    value={newProduct.supplier}
                                    onChangeText={(value) => setNewProduct({ ...newProduct, supplier: value })}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Quantity"
                                    keyboardType="numeric"
                                    value={newProduct.stock[0].quantity.toString()}
                                    onChangeText={(value) => setNewProduct({
                                        ...newProduct,
                                        stock: [{ ...newProduct.stock[0], quantity: parseInt(value) || 0 }]
                                    })}
                                />
                            </View>
                        )}

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => {
                                    setModalVisible(false);
                                    setNewProduct({
                                        id: '',
                                        name: '',
                                        type: '',
                                        price: '',
                                        supplier: '',
                                        barcode: '',
                                        stock: [{
                                            id: '',
                                            quantity: 0
                                        }]
                                    });
                                }}
                            >
                                <Text style={styles.modalButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.confirmButton]}
                                onPress={handleSubmit}
                            >
                                <Text style={styles.modalButtonText}>
                                    {isNewProduct ? 'Save' : 'Add'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    message: {
        textAlign: 'center',
        paddingBottom: 10,
    },
    camera: {
        flex: 1,
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end',
        marginBottom: 30,
        backgroundColor: 'transparent',
        gap: 15,
    },
    button: {
        backgroundColor: '#6c5ce7',
        padding: 15,
        borderRadius: 12,
        width: '48%',
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#6c5ce7',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    text: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 25,
        width: '90%',
        maxHeight: '80%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#333',
    },
    productName: {
        fontSize: 18,
        marginBottom: 10,
        color: '#666',
    },
    inputContainer: {
        width: '100%',
        gap: 10,
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        marginBottom: 10,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        gap: 10,
    },
    modalButton: {
        flex: 1,
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#ff4757',
    },
    confirmButton: {
        backgroundColor: '#6c5ce7',
    },
    modalButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});