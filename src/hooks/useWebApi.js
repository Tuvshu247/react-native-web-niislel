import api from "@/lib/webApi";
import { useCallback, useState } from "react";

export function useWebApi() {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const request = useCallback(
        async (
            endpoint,
            method = "GET",
            body,
            headers
        ) => {
            setLoading(true);
            setError(null);

            try {
                const isFormData =
                    typeof FormData !== "undefined" && body instanceof FormData;

                const config = {
                    url: endpoint,
                    method,
                    headers: {
                        ...(isFormData
                            ? {}
                            : { "Content-Type": "application/json" }),
                        ...headers,
                    },
                    ...(method === "GET" ? { params: body } : { data: body }),
                };

                const res = await api(config);
                setData(res.data?.data || res.data);
            } catch (err) {
                let message = "Алдаа гарлаа";
                if (err?.response?.data) {
                    message =
                        err.response.data.message ||
                        JSON.stringify(err.response.data);
                } else if (err?.message) {
                    message = err.message;
                }
                setError(message);
                setData(null);
            } finally {
                setLoading(false);
            }
        },
        []
    );

    return { data, error, loading, request };
}
