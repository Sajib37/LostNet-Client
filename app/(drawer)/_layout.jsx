import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    DrawerContentScrollView,
    DrawerItemList,
} from "@react-navigation/drawer";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Drawer } from "expo-router/drawer";
import {
    ActivityIndicator,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Toast from "react-native-toast-message";
import { fetchUserById } from "../../utils/allQuery";

export default function DrawerLayout() {
    const { data: user, isLoading } = useQuery({
        queryKey: ["user"],
        queryFn: fetchUserById,
    });
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem("accessToken");
            router.replace("/login");
            Toast.show({
                type: "success",
                text1: "Logged out successfully",
                text2: "See you again soon!",
            });
        } catch (err) {
            console.error("Logout failed:", err);
        }
    };

    return (
        <Drawer
            drawerContent={(props) => (
                <DrawerContentScrollView
                    {...props}
                    contentContainerStyle={{ flex: 1 }}
                >
                    <View>
                        <View style={styles.userContainer}>
                            {isLoading ? (
                                <ActivityIndicator size="small" />
                            ) : user ? (
                                <>
                                    <Image
                                        source={{
                                            uri: user?.image,
                                        }}
                                        style={styles.profileImage}
                                    />
                                    <Text style={styles.userName}>
                                        {user?.firstName} {user?.lastName}
                                    </Text>
                                    <Text style={styles.userEmail}>
                                        {user?.email}
                                    </Text>
                                </>
                            ) : (
                                <Text style={{ textAlign: "center" }}>
                                    User not found
                                </Text>
                            )}
                        </View>

                        <DrawerItemList {...props} />
                    </View>

                    <View style={styles.logoutContainer}>
                        <TouchableOpacity
                            onPress={handleLogout}
                            style={styles.logoutButton}
                        >
                            <Text style={styles.logoutText}>Log Out</Text>
                        </TouchableOpacity>
                    </View>
                </DrawerContentScrollView>
            )}
        >
            <Drawer.Screen name="index" options={{ title: "Home" }} />
            <Drawer.Screen name="profile" options={{ title: "My Profile" }} />
            <Drawer.Screen
                name="updateprofile"
                options={{ title: "Update Your Info" }}
            />
            <Drawer.Screen
                name="additem"
                options={{ title: "Add Found Item" }}
            />
            <Drawer.Screen
                name="uploadeditems"
                options={{ title: "My Uploaded Items" }}
            />
            <Drawer.Screen
                name="myrequests"
                options={{ title: "My Requested Items" }}
            />
        </Drawer>
    );
}

const styles = StyleSheet.create({
    userContainer: {
        alignItems: "center",
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
        marginBottom: 10,
    },
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: 10,
        backgroundColor: "#eee",
        borderWidth: 2,
        borderColor: "#808080",
    },
    userName: {
        fontSize: 16,
        fontWeight: "bold",
    },
    userEmail: {
        fontSize: 14,
        color: "gray",
    },
    logoutContainer: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: "#ddd",
    },
    logoutButton: {
        backgroundColor: "#e74c3c",
        paddingVertical: 10,
        borderRadius: 8,
    },
    logoutText: {
        color: "white",
        textAlign: "center",
        fontWeight: "bold",
    },
});
