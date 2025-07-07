import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import {
    Alert,
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { Feather } from "@expo/vector-icons";

const AddItemScreen = () => {
    const [form, setForm] = useState({
        title: "",
        description: "",
        location: "",
        dateOfFound: new Date(),
    });

    const [imageFile, setImageFile] = useState(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const token = await AsyncStorage.getItem("accessToken");
                if (!token) return;
                const decoded = jwtDecode(token);
                setUserId(decoded?.id);
            } catch (err) {
                console.log(err);
            }
        };

        fetchUserId();
    }, []);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
            base64: false,
        });

        if (!result.canceled && result.assets.length > 0) {
            const asset = result.assets[0];
            const uriParts = asset.uri.split(".");
            const fileType = uriParts[uriParts.length - 1];
            setImageFile({
                uri: asset.uri,
                name: `upload.${fileType}`,
                type: `image/${fileType}`,
            });
        }
    };

    const handleChange = (key, value) => {
        setForm({ ...form, [key]: value });
    };

    const handleSubmit = async () => {
        if (!userId) {
            Alert.alert("Error", "User not authenticated");
            return;
        }

        const payload = {
            ...form,
            userId,
        };

        const formData = new FormData();
        formData.append("data", JSON.stringify(payload));

        if (imageFile) {
            formData.append("image", {
                uri: imageFile.uri,
                name: imageFile.name,
                type: imageFile.type,
            });
        }

        try {
            const res = await axios.post(
                "http://192.168.0.102:5000/api/v1/item/post-item",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            Alert.alert("Success", "Item added successfully!");
            setForm({
                title: "",
                description: "",
                location: "",
                dateOfFound: new Date(),
            });
            setImageFile(null);
        } catch (err) {
            console.log(err);
            Alert.alert("Error", "Failed to submit item.");
        }
    };

    const renderInput = (placeholder, value, onChangeText, iconName, multiline = false, height = 50) => (
        <View style={styles.inputWrapper}>
            <Feather name={iconName} size={20} color="#777" style={styles.inputIcon} />
            <TextInput
                style={[styles.input, { height }]}
                placeholder={placeholder}
                multiline={multiline}
                value={value}
                onChangeText={onChangeText}
            />
        </View>
    );

    return (
        <>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.card}>
                    <Text style={styles.title}>Add Found Item</Text>

                    {renderInput("Title", form.title, (text) => handleChange("title", text), "tag")}

                    {renderInput("Description", form.description, (text) => handleChange("description", text), "file-text", true, 100)}

                    {renderInput("Location", form.location, (text) => handleChange("location", text), "map-pin")}

                    <TouchableOpacity
                        style={styles.datePicker}
                        onPress={() => setShowDatePicker(true)}
                    >
                        <Text style={styles.dateText}>
                            {form.dateOfFound.toDateString()}
                        </Text>
                    </TouchableOpacity>

                    {showDatePicker && (
                        <DateTimePicker
                            value={form.dateOfFound}
                            mode="date"
                            display={Platform.OS === "ios" ? "spinner" : "default"}
                            onChange={(event, selectedDate) => {
                                setShowDatePicker(false);
                                if (selectedDate) {
                                    handleChange("dateOfFound", selectedDate);
                                }
                            }}
                        />
                    )}

                    <TouchableOpacity onPress={pickImage} style={styles.imageField}>
                        {imageFile ? (
                            <Image source={{ uri: imageFile.uri }} style={styles.imageInside} />
                        ) : (
                            <View style={styles.uploadPlaceholder}>
                                <Feather name="upload" size={40} color="#555" style={{ marginBottom: 8 }} />
                                <Text style={styles.uploadText}>Upload Image</Text>
                            </View>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                        <Text style={styles.buttonText}>Submit Item</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </>
    );
};

export default AddItemScreen;

const styles = StyleSheet.create({
    container: {
        paddingVertical: 30,
        paddingHorizontal: 20,
        backgroundColor: "#F5F7FA",
        flexGrow: 1,
    },
    card: {
        backgroundColor: "rgba(255,255,255,0.85)",
        borderRadius: 20,
        padding: 20,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 6 },
        shadowRadius: 10,
        elevation: 4,
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#2C7BE5",
        marginBottom: 20,
        textAlign: "center",
    },
    inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#ffffff",
        borderRadius: 30,
        borderWidth: 1,
        borderColor: "#E0E0E0",
        marginBottom: 15,
        paddingHorizontal: 15,
    },
    inputIcon: {
        marginRight: 5,
    },
    input: {
        flex: 1,
        fontSize: 14,
        paddingVertical: 12,
    },
    datePicker: {
        backgroundColor: "#ffffff",
        borderRadius: 30,
        paddingVertical: 12,
        paddingHorizontal: 18,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: "#E0E0E0",
    },
    dateText: {
        fontSize: 14,
        color: "#555",
    },
    imageField: {
        backgroundColor: "#E8EAF6",
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        height: 180,
        marginTop: 15,
        overflow: "hidden",
    },
    uploadPlaceholder: {
        justifyContent: "center",
        alignItems: "center",
    },
    uploadText: {
        color: "#555",
        fontWeight: "600",
        fontSize: 16,
    },
    imageInside: {
        width: "100%",
        height: "100%",
        resizeMode: "cover",
    },
    button: {
        backgroundColor: "#2C7BE5",
        borderRadius: 30,
        paddingVertical: 14,
        alignItems: "center",
        marginTop: 20,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 14,
    },
});
