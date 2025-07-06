import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Toast from "react-native-toast-message";

const ItemRequestsList = ({ itemId }) => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const res = await axios.get(
                    `http://192.168.0.102:5000/api/v1/item-request/by-item/${itemId}`
                );
                setRequests(res.data.data);
            } catch (error) {
                console.error("Error fetching requests:", error);
            } finally {
                setLoading(false);
            }
        };

        if (itemId) fetchRequests();
    }, [itemId]);

    if (loading) {
        return (
            <ActivityIndicator
                size="large"
                color="#2C7BE5"
                style={{ marginTop: 20 }}
            />
        );
    }

    const handleHandOver = async () => {
        try {
            const token = await AsyncStorage.getItem("accessToken");
            const res = await axios.patch(
                `http://192.168.0.102:5000/api/v1/item/${itemId}`,
                { status: "Delivered" },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            Toast.show({
                type: "success",
                text1: "Item Delivered 🎉",
                text2: "The item has been marked as delivered.",
            });
            // Optional: Reload the list or update UI here
        } catch (error) {
            console.error("HandOver Error:", error);
            Toast.show({
                type: "error",
                text1: "Hand Over Failed",
                text2: "Failed to mark item as delivered.",
            });
        }
    };

    return (
        <View style={{ marginTop: 24 }}>
            <Text style={styles.sectionTitle}>📨 Requests for this Item</Text>

            {requests.length === 0 ? (
                <Text style={styles.noRequestText}>
                    No requests found for this item.
                </Text>
            ) : (
                requests.map((req) => (
                    <View key={req._id} style={styles.card}>
                        <Image
                            source={{ uri: req.requestedBy.image }}
                            style={styles.image}
                        />
                        <View style={styles.info}>
                            <Text style={styles.name}>
                                {req.requestedBy.firstName}{" "}
                                {req.requestedBy.lastName}
                            </Text>
                            <Text style={styles.email}>
                                {req.requestedBy.email}
                            </Text>

                            <TouchableOpacity style={styles.handoverBtn} onPress={handleHandOver}>
                                <Text style={styles.handoverText}>
                                    Hand Over
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ))
            )}
        </View>
    );
};

export default ItemRequestsList;

const styles = StyleSheet.create({
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
        color: "#2C3E50",
    },
    noRequestText: {
        textAlign: "center",
        color: "#888",
        fontSize: 14,
    },
    card: {
        flexDirection: "row",
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 12,
        marginBottom: 14,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    image: {
        width: 70,
        height: 70,
        borderRadius: 12,
        marginRight: 12,
    },
    info: {
        flex: 1,
        justifyContent: "center",
    },
    name: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#2C3E50",
    },
    email: {
        fontSize: 14,
        color: "#555",
        marginVertical: 2,
    },
    address: {
        fontSize: 13,
        color: "#777",
    },
    handoverBtn: {
        marginTop: 8,
        backgroundColor: "#5C6AC4",
        paddingVertical: 5,
        paddingHorizontal: 12,
        borderRadius: 8,
        alignSelf: "flex-start",
    },
    handoverText: {
        color: "#fff",
        fontWeight: "bold",
    },
});
