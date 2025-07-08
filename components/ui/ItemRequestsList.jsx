import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    ActivityIndicator,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Toast from "react-native-toast-message";
import { fetchRequestsByItemId, updateItemStatus } from "../../utils/allQuery";

const ItemRequestsList = ({ itemId, itemStatus }) => {
    const { data: requests = [], isLoading } = useQuery({
        queryKey: ["item-requests-by-item"],
        queryFn: () => fetchRequestsByItemId(itemId),
        enabled: !!itemId,
    });

    const queryClient = useQueryClient();

    const { mutate: handOverItem, isPending } = useMutation({
        mutationFn: updateItemStatus,
        onSuccess: () => {
            Toast.show({
                type: "success",
                text1: "Item Delivered 🎉",
                text2: "The item has been marked as delivered.",
            });
            queryClient.invalidateQueries({ queryKey: ["item"] });
            queryClient.invalidateQueries({ queryKey: ["items"] });
            queryClient.invalidateQueries({ queryKey: ["items-by-userId"] });
            
        },
        onError: (error) => {
            console.error("HandOver Error:", error);
            Toast.show({
                type: "error",
                text1: "Hand Over Failed",
                text2: "Failed to mark item as delivered.",
            });
        },
    });

    if (isLoading) {
        return (
            <ActivityIndicator
                size="large"
                color="#2C7BE5"
                style={{ marginTop: 20 }}
            />
        );
    }
    const handleHandOver = async () => {
        if (itemStatus === "Delivered") {
            Toast.show({
                type: "info",
                text1: "Already Delivered",
                text2: "This item has already been marked as delivered.",
            });
            return;
        }

        const token = await AsyncStorage.getItem("accessToken");
        handOverItem({ itemId, token });
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

                            <TouchableOpacity
                                style={styles.handoverBtn}
                                onPress={handleHandOver}
                            >
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
