import {useState} from "react";
import {Keyboard ,Animated} from "react-native";
import {router} from "expo-router";
import axios from "axios";
import axiosClient from "@/lib/api/axiosClient";

export const useAuth = () => {
    const [secretKey, setSecretKey] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const snakeAnimation = useState(new Animated.Value(0))[0];

    const shake = () => {
        Animated.sequence([
            Animated.timing(snakeAnimation, {
                toValue: 10,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(snakeAnimation, {
                toValue: -10,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(snakeAnimation, {
                toValue: 0,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start();
    }

    const authenticate = async () => {
        if (!secretKey.trim()) {
            shake();
            setError("Please enter a secret key");
            return;
        }

        Keyboard.dismiss();
        setLoading(true);
        setError('');

        try {
            const response = await axiosClient.get('/warehousemans');
            const warehousemans = response.data;
            const warehouseman = warehousemans.find((warehouseman: any) => warehouseman.secretKey === secretKey);
            if(warehouseman) {
                router.push("/(tabs)");
            } else {
                shake();
                setLoading(false);
                setError("Invalid secret key. Please try again.");
            }
        }catch (error: any) {
            console.log(error);
            shake();
            setError("An error occurred. Please try again later.");
        } finally {
            setLoading(false);
        }
    }
    return {
        loading,
        error,
        setError,
        authenticate,
        secretKey,
        setSecretKey,
        snakeAnimation
    }
}