import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";

const useFetchUser = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = await AsyncStorage.getItem("accessToken");
                console.log(token);
                if (!token) throw new Error("Token not found");

                const decoded = jwtDecode(token);
                const userId = decoded?.userId || decoded?.id;

                if (!userId) throw new Error("User ID not found in token");

                const res = await fetch(
                    `https://lostnet-server.onrender.com/api/v1/users/${userId}`
                );
                const json = await res.json();
                setUser(json?.data);
            } catch (error) {
                console.error("Error fetching user:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    return { user, loading };
};

export default useFetchUser;
