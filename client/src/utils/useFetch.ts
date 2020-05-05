import { useState, useEffect } from "react";
import axios from "axios";

function useFetch<T>(
    url: string,
    initialData: T | null = null
): [T | null, boolean, number | null] {
    const [data, setData] = useState(initialData);
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState<number | null>(null);

    useEffect(() => {
        setLoading(true);
        setError(null);

        axios
            .get(url)
            .then(response => setData(response.data))
            .catch(error => setError(error?.response?.status ?? -1))
            .finally(() => setLoading(false));
    }, [url]);

    return [data, isLoading, error];
}

export default useFetch;
