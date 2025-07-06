import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import {
    Image,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const ProfileMenu = () => {
    const [menuVisible, setMenuVisible] = useState(false);
    const [userData, setUserData] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = await AsyncStorage.getItem("accessToken");
                if (!token) return;

                const decoded = jwtDecode(token);
                const userId = decoded?.id;

                const res = await fetch(
                    `http://192.168.0.102:5000/api/v1/users/${userId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const json = await res.json();
                if (json?.data) {
                    setUserData(json.data);
                }
            } catch (err) {
                console.log("Failed to fetch user:", err);
            }
        };

        fetchUser();
    }, []);

    const handleSelect = (option) => {
        setMenuVisible(false);
        if (option === "profile") {
            router.push(`/profile/${userData._id}`);
        } else if (option === "update-profile") {
            router.push(`/updateprofile/${userData._id}`);
        } else if (option === "additem") {
            router.push("/additem");
        } else if (option === "uploadeditems") {
            router.push("/uploadeditems");
        } else if (option === "logout") {
            AsyncStorage.removeItem("accessToken");
            router.replace("/login");
        }
    };
    const userImage = userData?.image
        ? { uri: userData.image }
        : require("../../assets/images/login.jpg");

    return (
        <>
            <TouchableOpacity onPress={() => setMenuVisible(true)}>
                <Image source={userImage} style={styles.profilePic} />
            </TouchableOpacity>

            <Modal
                transparent
                visible={menuVisible}
                animationType="fade"
                onRequestClose={() => setMenuVisible(false)}
            >
                <Pressable
                    style={styles.overlay}
                    onPress={() => setMenuVisible(false)}
                >
                    <View style={styles.dropdown}>
                        <TouchableOpacity
                            onPress={() => handleSelect("profile")}
                        >
                            <Text style={styles.menuItem}>Profile</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => handleSelect("update-profile")}
                        >
                            <Text style={styles.menuItem}>Update Profile</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => handleSelect("additem")}
                        >
                            <Text style={styles.menuItem}>Add an Item</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => handleSelect("uploadeditems")}
                        >
                            <Text style={styles.menuItem}>Uploaded Items</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => handleSelect("logout")}
                        >
                            <Text style={styles.menuItem}>Logout</Text>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Modal>
        </>
    );
};

export default ProfileMenu;

const styles = StyleSheet.create({
    profilePic: {
        width: 36,
        height: 36,
        borderRadius: 18,
    },
    overlay: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "flex-end",
        paddingTop: 60,
        paddingRight: 20,
        backgroundColor: "rgba(0,0,0,0.1)",
    },
    dropdown: {
        backgroundColor: "#fff",
        borderRadius: 10,
        paddingVertical: 8,
        width: 160,
        elevation: 6,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
    },
    menuItem: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        fontSize: 16,
        color: "#333",
    },
});
