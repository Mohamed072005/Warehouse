import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ActivityIndicator,
    Animated,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import {useAuth} from "@/hooks/useAuth";

const AuthForm: React.FC = () => {
    const { secretKey, setSecretKey, loading, error, authenticate, setError, snakeAnimation } = useAuth();

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.title}>Welcome Back</Text>
                    <Text style={styles.subtitle}>
                        Please enter your secret key to continue
                    </Text>
                </View>

                <Animated.View
                    style={[
                        styles.formContainer,
                        { transform: [{ translateX: snakeAnimation }] },
                    ]}
                >
                    <View style={styles.inputContainer}>
                        <Icon
                            name="key-outline"
                            size={24}
                            color="#6B7280"
                            style={styles.inputIcon}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Enter Secret Key"
                            value={secretKey}
                            onChangeText={(text) => {
                                setSecretKey(text);
                                setError("");
                            }}
                            autoCapitalize="none"
                            placeholderTextColor="#9CA3AF"
                            returnKeyType="go"
                            onSubmitEditing={authenticate}
                        />
                    </View>

                    {error ? <Text style={styles.errorText}>{error}</Text> : null}

                    <TouchableOpacity
                        style={[styles.button, loading && styles.buttonDisabled]}
                        onPress={authenticate}
                        disabled={loading}
                        activeOpacity={0.7}
                    >
                        {loading ? (
                            <ActivityIndicator color="#FFFFFF" />
                        ) : (
                            <Text style={styles.buttonText}>Validate Key</Text>
                        )}
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    content: {
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: 24,
        paddingBottom: 40, // Add some padding for keyboard
    },
    header: {
        marginBottom: 32,
    },
    title: {
        fontSize: 28,
        fontWeight: "700",
        color: "#111827",
        marginBottom: 8,
        textAlign: "center",
    },
    subtitle: {
        fontSize: 16,
        color: "#6B7280",
        textAlign: "center",
    },
    formContainer: {
        width: "100%",
    },
    inputContainer: {
        marginBottom: 16,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F9FAFB",
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 12,
        paddingHorizontal: 16,
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 3,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        height: 50,
        fontSize: 16,
        color: "#111827",
        ...Platform.select({
            android: {
                paddingVertical: 8,
            },
        }),
    },
    button: {
        backgroundColor: "#6366F1",
        height: 50,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        ...Platform.select({
            ios: {
                shadowColor: "#6366F1",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    buttonDisabled: {
        backgroundColor: "#A5B4FC",
    },
    buttonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "600",
    },
    errorText: {
        color: "#EF4444",
        fontSize: 14,
        marginBottom: 16,
        textAlign: "center",
    },
});

export default AuthForm;