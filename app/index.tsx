import { useNavigation } from "expo-router";
import React, { useState } from "react";
import {
    FlatList,
    Image,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const fakeIcons = [
    {
        title: "Available Foods",
        icon: require("../assets/icons/ready-stock.png"),
    },
    {
        title: "Add Food",
        icon: require("../assets/icons/add-to-cart.png"),
    },
    {
        title: "Monitor own Food",
        icon: require("../assets/icons/monitor.png"),
    },
    {
        title: "Request For food",
        icon: require("../assets/icons/request.png"),
    },
];

const DashboardScreen = () => {
    const navigation = useNavigation();
    const [menuVisible, setMenuVisible] = useState(false);

    const handleMenuSelect = (action: string) => {
        setMenuVisible(false);
        if (action === "logout") {
            // logout logic here
        } else {
            navigation.navigate(action as never);
        }
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Dashboard</Text>
                <TouchableOpacity onPress={() => setMenuVisible(true)}>
                    <Image
                        source={require("../assets/images/register.jpg")} // fake profile picture
                        style={styles.profileImage}
                    />
                </TouchableOpacity>
            </View>

            {/* Dropdown menu */}
            <Modal transparent visible={menuVisible} animationType="fade">
                <Pressable
                    style={styles.overlay}
                    onPress={() => setMenuVisible(false)}
                >
                    <View style={styles.dropdown}>
                        <TouchableOpacity
                            onPress={() => handleMenuSelect("profile")}
                        >
                            <Text style={styles.menuItem}>Profile</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => handleMenuSelect("update-profile")}
                        >
                            <Text style={styles.menuItem}>Update Profile</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => handleMenuSelect("logout")}
                        >
                            <Text style={styles.menuItem}>Logout</Text>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Modal>

            <View style={{ flex: 1 }}>
                <FlatList
                    data={fakeIcons}
                    numColumns={2}
                    contentContainerStyle={styles.cardContainer}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <Image
                                source={item.icon}
                                style={styles.cardIcon}
                                resizeMode="cover"
                            />
                            <Text style={styles.cardTitle}>{item.title}</Text>
                        </View>
                    )}
                    keyExtractor={(_, index) => index.toString()}
                />
            </View>
        </View>
    );
};

export default DashboardScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F3F4F6",
    },
    cardTitle: {
        fontSize: 14,
        fontWeight: "600",
        color: "#374151",
        marginBottom: 10,
        textAlign: "center",
    },
    header: {
        paddingTop: 10,
        paddingBottom: 10,
        paddingHorizontal: 20,
        backgroundColor: "white",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        elevation: 4,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#1F2937",
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    overlay: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "flex-end",
        paddingTop: 90,
        paddingRight: 20,
        backgroundColor: "rgba(0,0,0,0.1)",
    },
    dropdown: {
        width: 160,
        backgroundColor: "white",
        borderRadius: 10,
        paddingVertical: 10,
        elevation: 5,
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 3 },
    },
    menuItem: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        fontSize: 16,
        color: "#374151",
    },
    cardContainer: {
        padding: 20,
        flexGrow:1,
        justifyContent:"center"
    },
    card: {
        flex: 1,
        aspectRatio: 1,
        margin: 10,
        backgroundColor: "#fff",
        borderRadius: 20,
        elevation: 4,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        alignItems: "center",
        justifyContent: "center",
    },
    cardIcon: {
        width: "80%",
        height: "80%",
        borderRadius: 15,
    },
});
