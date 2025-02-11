import axios from "axios";
import asyncStorage from '@react-native-async-storage/async-storage'
import {router} from "expo-router";

const axiosClient = axios.create({
    baseURL: 'http://10.0.2.2:5000',
})

export default axiosClient;