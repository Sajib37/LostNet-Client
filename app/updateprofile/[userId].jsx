import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const UpdateProfile = () => {
    const { userId } = useLocalSearchParams();
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [presentAddress, setPresentAddress] = useState("");
    const [permanentAddress, setPermanentAddress] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [gurdianName, setGurdianName] = useState("");
    const [image, setImage] = useState("");

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get(
                    `http://192.168.0.102:5000/api/v1/users/${userId}`
                );
                const user = res.data?.data;

                if (user) {
                    setFirstName(user.firstName);
                    setLastName(user.lastName);
                    setEmail(user.email);
                    setPresentAddress(user.presentAddress);
                    setPermanentAddress(user.permanentAddress);
                    setDateOfBirth(user.dateOfBirth);
                    setGurdianName(user.gurdianName);
                    setImage(user.image);
                }
            } catch (err) {
                console.error("Fetch error:", err);
                Alert.alert("Error", "Failed to load user info");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [userId]);

    const handleImagePick = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const handleSubmit = async () => {
        setSubmitting(true);

        try {
            const formData = new FormData();

            formData.append(
                "data",
                JSON.stringify({
                    firstName,
                    lastName,
                    email,
                    presentAddress,
                    permanentAddress,
                    dateOfBirth,
                    gurdianName,
                })
            );

            if (image && image.startsWith("file://")) {
                const fileName = image.split("/").pop();
                const match = /\.(\w+)$/.exec(fileName || "");
                const fileType = match ? `image/${match[1]}` : `image`;

                formData.append("image", {
                    uri: image,
                    name: fileName,
                    type: fileType,
                });
            }

            await axios.patch(
                `http://192.168.0.102:5000/api/v1/users/${userId}`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            Alert.alert("Success", "Profile updated!");
            router.replace(`/profile/${userId}`);
        } catch (err) {
            console.error(err);
            Alert.alert("Error", "Failed to update profile.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#5C6AC4" />
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* 🔷 Header Placeholder */}
            <View style={{ height: 80 }} />

            <TouchableOpacity
                onPress={handleImagePick}
                style={styles.imageWrapper}
            >
                <Image source={{ uri: image }} style={styles.avatar} />
                <Text style={styles.changeText}>Change Photo</Text>
            </TouchableOpacity>

            <View style={styles.form}>
                <Input
                    label="First Name"
                    value={firstName}
                    onChange={setFirstName}
                />
                <Input
                    label="Last Name"
                    value={lastName}
                    onChange={setLastName}
                />
                <Input
                    label="Email"
                    value={email}
                    onChange={setEmail}
                    keyboardType="email-address"
                />
                <Input
                    label="Guardian Name"
                    value={gurdianName}
                    onChange={setGurdianName}
                />
                <Input
                    label="Date of Birth"
                    value={dateOfBirth}
                    onChange={setDateOfBirth}
                    placeholder="YYYY-MM-DD"
                />
                <Input
                    label="Present Address"
                    value={presentAddress}
                    onChange={setPresentAddress}
                />
                <Input
                    label="Permanent Address"
                    value={permanentAddress}
                    onChange={setPermanentAddress}
                />

                <TouchableOpacity
                    style={styles.submitBtn}
                    onPress={handleSubmit}
                    disabled={submitting}
                >
                    <Text style={styles.submitText}>
                        {submitting ? "Updating..." : "Save Changes"}
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const Input = ({
    label,
    value,
    onChange,
    keyboardType = "default",
    placeholder,
}) => (
    <View style={styles.inputBox}>
        <Text style={styles.label}>{label}</Text>
        <TextInput
            style={styles.input}
            value={value}
            onChangeText={onChange}
            placeholder={placeholder || `Enter ${label}`}
            placeholderTextColor="#999"
            keyboardType={keyboardType}
        />
    </View>
);

export default UpdateProfile;

const styles = StyleSheet.create({
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    container: {
        paddingBottom: 30,
        paddingHorizontal: 20,
        backgroundColor: "#F4F4F4",
    },
    imageWrapper: {
        alignItems: "center",
        marginBottom: 20,
    },
    avatar: {
        width: 110,
        height: 110,
        borderRadius: 55,
        borderWidth: 3,
        borderColor: "#5C6AC4",
    },
    changeText: {
        color: "#5C6AC4",
        marginTop: 6,
        fontSize: 14,
    },
    form: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 20,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 6,
        elevation: 3,
    },
    inputBox: {
        marginBottom: 14,
    },
    label: {
        fontSize: 13,
        marginBottom: 6,
        color: "#555",
    },
    input: {
        backgroundColor: "#F2F2F7",
        padding: 12,
        borderRadius: 10,
        fontSize: 15,
        color: "#333",
    },
    submitBtn: {
        backgroundColor: "#5C6AC4",
        paddingVertical: 14,
        borderRadius: 30,
        alignItems: "center",
        marginTop: 16,
    },
    submitText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});
