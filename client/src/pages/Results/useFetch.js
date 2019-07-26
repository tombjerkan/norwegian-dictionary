import { useState, useEffect } from "react";
import axios from "axios";

function useFetch(url) {
    const [data, setData] = useState(null);
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);

        axios.get(url)
            .then(response => setData(response.data))
            .catch(error => setError(error.response.status))
            .finally(() => setLoading(false));
    }, [url]);

    return [data, isLoading, error];
}

export default useFetch;