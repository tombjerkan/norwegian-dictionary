import { useState, useEffect } from "react";
import axios from "axios";

function useData<T>(
    url: string,
    initialData: T | null = null
): [T | null, boolean, boolean, boolean] {
    const [data, setData] = useState(initialData);
    const [isLoading, setLoading] = useState(true);
    const [isUnavailable, setUnavailable] = useState(false);
    const [isError, setError] = useState(false);

    function handleError(error: any) {
        if (error?.response?.status === 404) {
            setUnavailable(true);
        } else {
            setError(true);
        }
    }

    useEffect(() => {
        setLoading(true);
        setUnavailable(false);
        setError(false);

        axios
            .get(url)
            .then(response => setData(response.data))
            .catch(handleError)
            .finally(() => setLoading(false));
    }, [url]);

    return [data, isLoading, isUnavailable, isError];
}

export default useData;
