import {useState} from "react";
import {config} from "@/config/config";

const useApi = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const useFetch = async <T,>(url: string, options?: RequestInit): Promise<T | null> => {
        setLoading(true);
        setError(null)
        try {
            const response = await fetch(`${config.baseURL}/${url}`, options);
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
            const data = {
                data: await response.json(),
                status: response.status,
            };
            return data as T;
        }catch(error: any) {
            console.log(error);
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
            setError(errorMessage);
            return null;
        }finally {
            setLoading(false);
        }
    }

    return { loading, error, useFetch };
}

export default useApi;