import asyncStorage from "@react-native-async-storage/async-storage";

export const setLocalStorage = async (key: string, value: any) => {
    await asyncStorage.setItem(key, value);
}

export const getLocalStorage = (key: string): any => {
    return asyncStorage.getItem(key);
}

export const removeLocalStorage = async (key: string) => {
    await asyncStorage.removeItem(key);
}