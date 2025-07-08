import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import React, { useState } from "react";
import {
    Alert,
    ImageBackground,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import axios from "axios";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";

export default function RegisterScreen() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!firstName || !lastName || !email || !password) {
            Alert.alert("Error", "Please fill all fields.");
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post(
                "https://lostnet-server.onrender.com/api/v1/users/register",
                {
                    firstName,
                    lastName,
                    email,
                    password,
                }
            );
            console.log(response);
            if (response?.status === 200 || response?.status === 201) {
                router.replace("/login");
                Toast.show({
                    type: "success",
                    text1: "Account Created !",
                    text2: "You can now log in",
                });

                
            }
        } catch (error) {
            Toast.show({
                type: "error",
                text1: "Registration Failed",
                text2: "Try again later",
            });
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ImageBackground
            source={require("../assets/images/register.jpg")}
            style={styles.background}
            resizeMode="cover"
        >
            <StatusBar barStyle="light-content" />

            <BlurView intensity={50} tint="light" style={styles.card}>
                <Text style={styles.title}>Create Account</Text>

                <View style={styles.inputWrapper}>
                    <MaterialCommunityIcons
                        name="account-outline"
                        size={20}
                        color="#5C6AC4"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="First Name"
                        placeholderTextColor="#888"
                        value={firstName}
                        onChangeText={setFirstName}
                    />
                </View>

                <View style={styles.inputWrapper}>
                    <MaterialCommunityIcons
                        name="account-outline"
                        size={20}
                        color="#5C6AC4"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Last Name"
                        placeholderTextColor="#888"
                        value={lastName}
                        onChangeText={setLastName}
                    />
                </View>

                <View style={styles.inputWrapper}>
                    <MaterialCommunityIcons
                        name="email-outline"
                        size={20}
                        color="#5C6AC4"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        placeholderTextColor="#888"
                        keyboardType="email-address"
                        value={email}
                        onChangeText={setEmail}
                    />
                </View>

                <View style={styles.inputWrapper}>
                    <MaterialCommunityIcons
                        name="lock-outline"
                        size={20}
                        color="#5C6AC4"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        placeholderTextColor="#888"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />
                </View>

                <TouchableOpacity
                    style={styles.button}
                    onPress={handleRegister}
                    disabled={loading}
                >
                    <Text style={styles.buttonText}>
                        {loading ? "Registering..." : "Register"}
                    </Text>
                </TouchableOpacity>
            </BlurView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: "100%",
        height: "100%",

        alignItems: "center",
        justifyContent: "center",
    },
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.3)", // slight dark overlay
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    card: {
        width: "90%",
        borderRadius: 20,
        padding: 24,
        overflow: "hidden", // Required for BlurView rounding
        shadowColor: "#000",
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 10,
        elevation: 6,
        backgroundColor: "rgba(255, 255, 255, 0.2)", // fallback
    },

    title: {
        fontSize: 26,
        fontWeight: "700",
        color: "#2C7BE5",
        marginBottom: 20,
        textAlign: "center",
    },
    inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F0F2F5",
        borderRadius: 30,
        paddingHorizontal: 15,
        marginBottom: 15,
        paddingVertical: 10,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: "#333",
        marginLeft: 10,
    },
    button: {
        backgroundColor: "#2C7BE5",
        paddingVertical: 14,
        borderRadius: 30,
        alignItems: "center",
        marginTop: 10,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    register: {
        textAlign: "center",
        marginTop: 16,
        color: "#444",
    },
    link: {
        color: "#2C7BE5",
        fontWeight: "bold",
    },
});
