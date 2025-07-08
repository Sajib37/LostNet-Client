import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { deleteItemById, fetchItemsByUserId } from "../../utils/allQuery";

const OwnItemsScreen = () => {
    const [userId, setUserId] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const token = await AsyncStorage.getItem("accessToken");
                if (!token) return;
                const decoded = jwtDecode(token);
                setUserId(decoded?.id);
            } catch (err) {
                console.error("Token decoding error:", err);
            }
        };

        fetchUserId();
    }, []);

    const { data: items, isLoading } = useQuery({
        queryKey: ["items-by-userId"],
        queryFn: () => fetchItemsByUserId(userId),
    });

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: deleteItemById,
        onSuccess: (_, deletedId) => {
            Alert.alert("Deleted", "Item has been removed");
            queryClient.invalidateQueries(["items"]);
            queryClient.invalidateQueries(["item"]);
            queryClient.invalidateQueries(["items-by-userId"]);
        },
        onError: (error) => {
            console.error("Delete error:", error);
            Alert.alert("Error", "Could not delete item");
        },
    });

    if (isLoading) {
        return <ActivityIndicator size="large" color="#2C7BE5" />;
    }

    if (!items || items.length === 0) {
        return <Text>No items found</Text>;
    }

    const handleDelete = (id) => {
        mutation.mutate(id);
    };

    const renderItem = ({ item }) => (
        <Animated.View entering={FadeIn.duration(300)} style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>

            <View style={styles.buttonRow}>
                <TouchableOpacity
                    style={styles.updateBtn}
                    onPress={() => router.push(`/detailsitem/${item._id}`)}
                >
                    <Ionicons name="create-outline" size={16} color="#fff" />
                    <Text style={styles.btnText}>Details</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => handleDelete(item._id)}
                >
                    <Ionicons name="trash-outline" size={16} color="#fff" />
                    <Text style={styles.btnText}>Delete</Text>
                </TouchableOpacity>
            </View>
        </Animated.View>
    );

    return (
        <>
            <View style={styles.container}>
                {isLoading ? (
                    <ActivityIndicator size="large" color="#2C7BE5" />
                ) : items.length === 0 ? (
                    <Text style={styles.noItems}>No items found</Text>
                ) : (
                    <FlatList
                        data={items}
                        keyExtractor={(item) => item._id}
                        numColumns={2}
                        columnWrapperStyle={{ justifyContent: "space-between" }}
                        contentContainerStyle={{ paddingBottom: 80 }}
                        ListHeaderComponent={
                            <Text style={styles.heading}>
                                Your Uploaded Items
                            </Text>
                        }
                        renderItem={renderItem}
                    />
                )}
            </View>
        </>
    );
};

export default OwnItemsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#F5F7FA",
    },
    heading: {
        fontSize: 22,
        fontWeight: "700",
        color: "#3F51B5",
        marginBottom: 16,
        textAlign: "center",
        fontFamily: "System",
        letterSpacing: 0.5,
    },

    noItems: {
        textAlign: "center",
        fontSize: 18,
        marginTop: 50,
        color: "#999",
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 12,
        marginBottom: 16,
        width: "48%",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
    },
    image: {
        width: "100%",
        height: 100,
        borderRadius: 12,
        marginBottom: 10,
    },
    title: {
        fontWeight: "bold",
        fontSize: 16,
        color: "#2C7BE5",
        marginBottom: 4,
    },
    description: {
        fontSize: 13,
        color: "#666",
        marginBottom: 10,
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    updateBtn: {
        backgroundColor: "#5C6AC4",
        padding: 4,
        borderRadius: 8,
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    deleteBtn: {
        backgroundColor: "#FF4D4D",
        padding: 4,
        borderRadius: 8,
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    btnText: {
        color: "#fff",
        fontSize: 13,
    },
});
