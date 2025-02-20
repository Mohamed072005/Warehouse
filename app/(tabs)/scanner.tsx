import {CameraView, CameraType, useCameraPermissions, BarcodeScanningResult} from 'expo-camera';
import {useState} from 'react';
import {
    Button,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Modal,
    TextInput,
    Alert,
    KeyboardAvoidingView, Platform, ScrollView, useWindowDimensions
} from 'react-native';
import {getLocalStorage} from "@/lib/localStorages/storageManager";
import useApi from "@/hooks/useApi";
import {NewProduct, Product, ValidationErrors} from "@/lib/types/Product";
import {validationProduct} from "@/lib/validations/validateProduct";

export default function BarcodeScanner() {

    const {width} = useWindowDimensions();
    const {useFetch} = useApi();
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [isTransferProduct, setIsTransferProduct] = useState(false);
    const [currentProduct, setCurrentProduct] = useState<any>(null);
    const [isNewProduct, setIsNewProduct] = useState(false);
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [newProduct, setNewProduct] = useState<NewProduct>({
        id: '',
        name: '',
        type: '',
        price: 0,
        supplier: '',
        barcode: '',
        stocks: [{
            id: '',
            quantity: 0,
            localisation: {
                city: ''
            }
        }]
    });

    if (!permission) {
        return <View/>;
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={styles.message}>We need your permission to show the camera</Text>
                <Button onPress={requestPermission} title="grant permission"/>
            </View>
        );
    }

    const handleBarCodeScanned = async ({type, data}: BarcodeScanningResult) => {
        setScanned(true);
        setCurrentProduct({barcode: data, stocks: []});

        try {
            const response = await useFetch<{ data: Product[], status: number }>('products', {method: 'GET'});
            if (response?.status === 200) {
                const correctProduct = response.data.filter((product: Product) => product.barcode === data);
                if (correctProduct.length > 0) {
                    setCurrentProduct(correctProduct[0]);
                    setIsNewProduct(false);
                    setIsTransferProduct(true)
                    setModalVisible(true);
                } else {
                    setCurrentProduct({barcode: data, stock: []});
                    setIsNewProduct(true);
                    setModalVisible(true);
                }
            }
        } catch (error: any) {
            console.log(error);
        }
    };

    const handleSubmit = async () => {
        try {
            const warehouseman_id = await getLocalStorage('warehouseman_id');
            const PRD_ID = Math.floor(Math.random() * 1000000).toString();
            const STOCK_ID = Math.floor(Math.random() * 1000000).toString();
            if (isNewProduct) {
                try {
                    const validationErrors = validationProduct(newProduct);
                    setErrors(validationErrors);

                    if (Object.keys(validationErrors).length > 0) {
                        const allTouched = Object.keys(validationErrors).reduce((acc, key) => {
                            acc[key] = true;
                            return acc;
                        }, {} as Record<string, boolean>);
                        setTouched(allTouched);
                        return;
                    }
                    const response = await useFetch<{ data: Product, status: number }>('products',
                        {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                ...newProduct,
                                id: PRD_ID,
                                barcode: currentProduct.barcode,
                                stocks: [
                                    {
                                        id: STOCK_ID,
                                        quantity: newProduct.stocks[0].quantity,
                                        localisation: {city: newProduct.stocks[0].localisation.city}
                                    },
                                ],
                                editedBy: [
                                    {
                                        warehousemanId: warehouseman_id,
                                        at: new Date().toISOString().slice(0, 10),
                                    }
                                ]
                            }),
                        },
                    );
                    console.log(response);
                } catch (error: any) {
                    console.log(error);
                }
            } else if (isTransferProduct) {

                const existingStockIndex = currentProduct.editedBy.findIndex(
                    (edit: any) => edit.warehousemanId === warehouseman_id
                );
                let updatedStock;

                if (existingStockIndex !== -1) {
                    updatedStock = currentProduct.stocks.map((stock: any, index: number) => {
                        if (index === existingStockIndex) {
                            return {
                                ...stock,
                                quantity: stock.quantity + newProduct.stocks[0].quantity,
                            };
                        }
                        return stock;
                    });
                } else {
                    updatedStock = [
                        ...currentProduct.stocks,
                        {id: STOCK_ID, quantity: newProduct.stocks[0].quantity}
                    ];
                }

                const updatedData = {
                    ...currentProduct,
                    stocks: updatedStock,
                    editedBy: [{
                        warehousemanId: warehouseman_id,
                        at: new Date().toISOString().slice(0, 10),
                    }]
                };
                try {
                    const response = await useFetch<{
                        product: Product,
                        status: number
                    }>(`products/${currentProduct.id}`,
                        {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(updatedData)
                        }
                    )
                    console.log(response);
                } catch (error: any) {
                    console.log(error);
                }
            } else {
                console.log(`Added ${newProduct.stocks[0].quantity} of ${currentProduct.name} - ${currentProduct.supplier} , id: ${currentProduct.id}`);
            }

            setModalVisible(false);
            setScanned(false);
            setNewProduct({
                id: '',
                name: '',
                type: '',
                price: 0,
                supplier: '',
                barcode: '',
                stocks: [{
                    id: '',
                    quantity: 0,
                    localisation: {
                        city: ''
                    }
                }]
            });
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Something went wrong');
        }
    };

    const renderField = (label: string, value: any, placeholder: string, onChangeText: any, keyboardType = 'default', elementType: string, fieldName: string) => (
        <View style={styles.fieldContainer}>
            {elementType === 'input' ? (
                <>
                    <View style={styles.labelContainer}>
                        <Text style={styles.label}>{label}</Text>
                        <Text style={styles.required}>*</Text>
                    </View>
                    <TextInput
                        style={[
                            styles.input,
                            touched[fieldName] && errors[fieldName] && styles.inputError
                        ]}
                        placeholder={placeholder}
                        placeholderTextColor="#9CA3AF"
                        value={value}
                        onChangeText={(text) => {
                            onChangeText(text);
                            setTouched(prev => ({...prev, [fieldName]: true}));
                        }}
                        onBlur={() => setTouched(prev => ({...prev, [fieldName]: true}))}
                        keyboardType={keyboardType}
                    />
                    {touched[fieldName] && errors[fieldName] && (
                        <Text style={styles.errorText}>{errors[fieldName]}</Text>
                    )}
                </>
            ) : (
                <Text style={styles.label}>{label}: {value}</Text>
            )}
        </View>
    );

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
                <View style={styles.overlay}>
                    <View style={[styles.scanArea, {width: width * 0.9, height: width * 0.7}]}>
                        <View style={styles.scanFrame}/>
                        {scanned && (
                            <View style={styles.scanButtonContainer}>
                                <TouchableOpacity
                                    style={styles.scanButton}
                                    onPress={() => setScanned(false)}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.scanButtonText}>Scan Again</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </View>
            </CameraView>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={styles.container}
                    >
                        <ScrollView style={styles.scrollView}>
                            <View style={styles.formContainer}>
                                {!isNewProduct ? (
                                    // View Product Mode
                                    <View style={styles.productInfo}>
                                        <View style={styles.header}>
                                            <Text style={styles.headerText}>Product Details</Text>
                                        </View>

                                        {renderField(
                                            'Name',
                                            currentProduct?.name,
                                            'Product name',
                                            null,
                                            'default',
                                            'text',
                                            'name'
                                        )}
                                        {renderField(
                                            'Type',
                                            currentProduct?.type,
                                            'Product type',
                                            null,
                                            'default',
                                            'text',
                                            'type'
                                        )}
                                        {renderField(
                                            'Supplier',
                                            currentProduct?.supplier,
                                            'Supplier name',
                                            null,
                                            'default',
                                            'text',
                                            'supplier'
                                        )}
                                        {renderField(
                                            'Price',
                                            currentProduct?.price,
                                            'Price',
                                            null,
                                            'decimal-pad',
                                            'text',
                                            'price'
                                        )}
                                        {renderField(
                                            'Quantity',
                                            newProduct?.stocks[0]?.quantity.toString() || '0',
                                            'Quantity you want to add to the product',
                                            (value: any) => setNewProduct({
                                                ...newProduct,
                                                stocks: [{...newProduct.stocks[0], quantity: parseInt(value) || 0}]
                                            }),
                                            'numeric',
                                            'input',
                                            'quantity'
                                        )}\
                                    </View>
                                ) : (
                                    // New Product Mode
                                    <View style={styles.productInfo}>
                                        <View style={styles.header}>
                                            <Text style={styles.headerText}>New Product</Text>
                                        </View>

                                        {renderField(
                                            'Name',
                                            newProduct.name,
                                            'Enter product name',
                                            (value: any) => setNewProduct({...newProduct, name: value}),
                                            'default',
                                            'input',
                                            'name'
                                        )}
                                        {renderField(
                                            'Type',
                                            newProduct.type,
                                            'Enter product type',
                                            (value: any) => setNewProduct({...newProduct, type: value}),
                                            'default',
                                            'input',
                                            'type'
                                        )}
                                        {renderField(
                                            'City',
                                            newProduct.stocks[0].localisation.city,
                                            'Enter stock city',
                                            (value: any) => setNewProduct({
                                                ...newProduct,
                                                stocks: [{...newProduct.stocks[0], localisation: {city: value}}]
                                            }),
                                            'default',
                                            'input',
                                            'city'
                                        )}
                                        {renderField(
                                            'Price',
                                            newProduct.price,
                                            'Enter price',
                                            (value: any) => setNewProduct({...newProduct, price: value}),
                                            'decimal-pad',
                                            'input',
                                            'price'
                                        )}
                                        {renderField(
                                            'Supplier',
                                            newProduct.supplier,
                                            'Enter supplier',
                                            (value: any) => setNewProduct({...newProduct, supplier: value}),
                                            'default',
                                            'input',
                                            'supplier'
                                        )}
                                        {renderField(
                                            'Quantity',
                                            newProduct.stocks[0].quantity.toString(),
                                            'Enter quantity',
                                            (value: any) => setNewProduct({
                                                ...newProduct,
                                                stocks: [{...newProduct.stocks[0], quantity: parseInt(value) || 0}]
                                            }),
                                            'numeric',
                                            'input',
                                            'quantity'
                                        )}
                                    </View>
                                )}

                                <View style={styles.buttonContainer}>
                                    <TouchableOpacity
                                        style={[styles.button, styles.cancelButton]}
                                        onPress={() => {
                                            setModalVisible(false);
                                            setNewProduct({
                                                id: '',
                                                name: '',
                                                type: '',
                                                price: 0,
                                                supplier: '',
                                                barcode: '',
                                                stocks: [{
                                                    id: '',
                                                    quantity: 0,
                                                    localisation: {
                                                        city: '',
                                                    }
                                                }]
                                            });
                                        }}
                                    >
                                        <Text style={styles.cancelButtonText}>Cancel</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.button, styles.submitButton]}
                                        onPress={handleSubmit}
                                    >
                                        <Text style={styles.submitButtonText}>
                                            {isNewProduct ? 'Save' : 'Add'}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </ScrollView>
                    </KeyboardAvoidingView>
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
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalView: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 30,
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
    confirmButton: {
        backgroundColor: '#6c5ce7',
    },
    modalButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    scrollView: {
        flex: 1,
    },
    formContainer: {},
    header: {
        marginBottom: 24,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    headerText: {
        fontSize: 24,
        fontWeight: '600',
        color: '#111827',
    },
    productInfo: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 24,
    },
    button: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 6,
    },
    cancelButton: {
        backgroundColor: '#F3F4F6',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    submitButton: {
        backgroundColor: '#4F46E5',
    },
    cancelButtonText: {
        color: '#374151',
        fontSize: 16,
        fontWeight: '500',
    },
    submitButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '500',
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    scanArea: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative', // Added for absolute positioning of the button
    },
    scanFrame: {
        width: '100%',
        height: '100%',
        borderWidth: 2,
        borderColor: '#4F46E5',
        borderRadius: 20,
    },
    scanButtonContainer: {
        position: 'absolute',
        bottom: -60, // Position below the scan frame
        width: '100%',
        alignItems: 'center',
    },
    scanButton: {
        backgroundColor: '#4F46E5',
        paddingHorizontal: 32,
        paddingVertical: 12,
        borderRadius: 25,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    scanButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    fieldContainer: {
        marginBottom: 16,
    },
    labelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: '#374151',
        letterSpacing: 0.25,
    },
    required: {
        color: '#EF4444',
        marginLeft: 4,
    },
    input: {
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: '#111827',
        minHeight: 44, // Better touch target
    },
    inputDisabled: {
        backgroundColor: '#F3F4F6',
        borderColor: '#E5E7EB',
        color: '#9CA3AF',
    },
    errorText: {
        fontSize: 12,
        color: '#EF4444',
        marginTop: 4,
    },
    textContainer: {
        backgroundColor: '#F9FAFB',
        borderRadius: 8,
        padding: 12,
        minHeight: 44,
    },
    textContainerDisabled: {
        backgroundColor: '#F3F4F6',
    },
    text: {
        fontSize: 16,
        color: '#111827',
    },
    textDisabled: {
        color: '#9CA3AF',
    },
    inputError: {
        borderColor: '#EF4444',
        backgroundColor: '#FEF2F2',
    },
});