import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Loader from "../../components/ui/loader";
import { useProtectedRoute } from "../../hooks/useProtectedRoute";

const Index = () => {
    const { authLoading } = useProtectedRoute();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    useEffect(() => {
        const fetchItems = async () => {
            try {
                const res = await fetch(
                    "http://192.168.0.102:5000/api/v1/item"
                );
                const json = await res.json();
                setItems(json?.data || []);
            } catch (err) {
                console.error("Error fetching items:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchItems();
    }, []);

    if (authLoading) {
        return <Loader />;
    }

    const renderCard = ({ item }) => (
        <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.location}>{item.location}</Text>
            <TouchableOpacity
                style={styles.detailsButton}
                onPress={() => router.push(`/singleitem/${item._id}`)}
            >
                <Text style={styles.detailsButtonText}>Details</Text>
            </TouchableOpacity>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#5C6AC4" />
            </View>
        );
    }

    return (
        <View style={{ flex: 1 }}>
            <FlatList
                data={items}
                numColumns={2}
                keyExtractor={(item) => item._id}
                contentContainerStyle={styles.container}
                columnWrapperStyle={styles.row}
                renderItem={renderCard}
                ListHeaderComponent={
                    <Text style={styles.heading}>Available Founded Items</Text>
                }
            />
        </View>
    );
};

export default Index;

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 12,
        paddingBottom: 16,
    },
    row: {
        justifyContent: "space-between",
    },
    heading: {
        fontSize: 22,
        fontWeight: "700",
        color: "#3F51B5", 
        marginTop: 20,
        marginBottom: 14,
        textAlign: "center",
        fontFamily: "System", 
        letterSpacing: 0.5,
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
        padding: 12,
        marginVertical: 8,
        width: "48%", // Two columns with spacing
    },
    image: {
        width: "100%",
        height: 120,
        borderRadius: 8,
        marginBottom: 8,
    },
    title: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
        marginBottom: 4,
    },
    location: {
        fontSize: 13,
        color: "#777",
        marginBottom: 8,
    },
    detailsButton: {
        backgroundColor: "#5C6AC4",
        paddingVertical: 6,
        borderRadius: 6,
        alignItems: "center",
    },
    detailsButtonText: {
        color: "#fff",
        fontWeight: "bold",
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
