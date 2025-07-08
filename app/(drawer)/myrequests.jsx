import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import useFetchUser from "../../hooks/useFetchUser";

export default function RequestedItems() {
    const { user, loading: userLoading } = useFetchUser();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchRequestedItems = async () => {
        try {
            const response = await fetch(
                `https://lostnet-server.onrender.com/api/v1/item-request/requested-by/${user?._id}`
            );
            const data = await response.json();
            if (data.success) {
                setRequests(data.data);
            }
        } catch (error) {
            console.error("Error fetching requested items:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?._id) {
            fetchRequestedItems();
        }
    }, [user]);

    if (userLoading || loading) {
        return <ActivityIndicator size="large" style={{ marginTop: 30 }} />;
    }

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.sectionTitle}>Requested Items</Text>

            {requests.length === 0 ? (
                <Text style={styles.noDataText}>No requested items found.</Text>
            ) : (
                <FlatList
                    data={requests}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <Image
                                source={{ uri: item.itemId.image }}
                                style={styles.image}
                            />

                            <View style={styles.infoContainer}>
                                <Text style={styles.itemTitle}>
                                    {item.itemId.title}
                                </Text>
                                <Text style={styles.ownerName}>
                                    Owner: {item.itemId.userId.firstName}{" "}
                                    {item.itemId.userId.lastName}
                                </Text>
                                <Text style={styles.ownerEmail}>
                                    {item.itemId.userId.email}
                                </Text>
                                <Text style={styles.status}>
                                    {item.itemId.status}
                                </Text>
                            </View>
                        </View>
                    )}
                />
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: "#f9f9f9",
    },
    status: {
        fontSize: 14,
        color: "#008000",
        fontWeight: "bold",
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 16,
        textAlign: "center",
        color: "#1E88E5",
    },
    noDataText: {
        textAlign: "center",
        marginTop: 40,
        color: "#888",
        fontSize: 16,
    },
    card: {
        flexDirection: "row",
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 12,
        marginBottom: 14,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 4,
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 8,
        marginRight: 12,
        backgroundColor: "#eee",
    },
    infoContainer: {
        flex: 1,
        justifyContent: "center",
    },
    itemTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 4,
        color: "#333",
    },
    ownerName: {
        fontSize: 15,
        color: "#555",
    },
    ownerEmail: {
        fontSize: 14,
        color: "#888",
    },
});
