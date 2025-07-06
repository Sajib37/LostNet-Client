import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Header from "../../components/ui/header";
import Loader from "../../components/ui/loader";

const ProfileScreen = () => {
    const { userId } = useLocalSearchParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch(
                    `http://192.168.0.102:5000/api/v1/users/${userId}`
                );
                const json = await res.json();
                setUser(json?.data);
            } catch (error) {
                console.error("Error fetching user:", error);
            } finally {
                setLoading(false);
            }
        };

        if (userId) fetchUser();
    }, [userId]);

    if (loading) {
        return <Loader />;
    }

    if (!user) {
        return (
            <View style={styles.loaderContainer}>
                <Text style={{ color: "red", fontSize: 16 }}>
                    User not found.
                </Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: "#F4F6FC" }}>
            <Header />

            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.card}>
                    <Image source={{ uri: user.image }} style={styles.avatar} />
                    <Text style={styles.name}>
                        {user.firstName} {user.lastName}
                    </Text>
                    <Text style={styles.email}>{user.email}</Text>
                    <Text style={styles.role}>{user.role}</Text>

                    <View style={styles.infoContainer}>
                        <Info label="Guardian Name" value={user.gurdianName} />
                        <Info label="Date of Birth" value={user.dateOfBirth} />
                        <Info
                            label="Present Address"
                            value={user.presentAddress}
                        />
                        <Info
                            label="Permanent Address"
                            value={user.permanentAddress}
                        />
                    </View>

                    <TouchableOpacity
                        onPress={() =>
                            router.push(`/updateprofile/${user._id}`)
                        }
                        style={styles.button}
                    >
                        <Text style={styles.buttonText}>Update Profile</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};

const Info = ({ label, value }) => (
    <View style={styles.infoBox}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
    </View>
);

export default ProfileScreen;

const styles = StyleSheet.create({
    loaderContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    container: {
        padding: 15,
        backgroundColor: "#F4F6FC",
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 24,
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 5 },
        shadowRadius: 10,
        elevation: 5,
    },
    avatar: {
        width: 110,
        height: 110,
        borderRadius: 55,
        borderWidth: 3,
        borderColor: "#5C6AC4",
        marginBottom: 14,
    },
    name: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#333",
    },
    email: {
        fontSize: 14,
        color: "#666",
        marginBottom: 4,
    },
    role: {
        fontSize: 14,
        color: "#5C6AC4",
        marginBottom: 20,
    },
    infoContainer: {
        width: "100%",
    },
    infoBox: {
        backgroundColor: "#F1F2F6",
        padding: 12,
        borderRadius: 10,
        marginBottom: 10,
    },
    infoLabel: {
        fontSize: 14,
        color: "#777",
        marginBottom: 2,
    },
    infoValue: {
        fontSize: 15,
        color: "#222",
    },
    button: {
        marginTop: 20,
        backgroundColor: "#5C6AC4",
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 25,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 5,
    },
    buttonText: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "bold",
    },
});
