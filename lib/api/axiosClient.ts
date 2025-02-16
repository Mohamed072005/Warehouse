import axios from "axios";
import {config} from "@/config/config";

const axiosClient = axios.create({
    baseURL: config.baseURL,
})

export default axiosClient;