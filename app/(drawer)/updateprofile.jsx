import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import Toast from "react-native-toast-message";
import { KeyboardAvoidingView } from "react-native-web";
import Loader from "../../components/ui/loader";
import { fetchUserById, updateUserProfile } from "../../utils/allQuery";

const UpdateProfile = () => {
    const router = useRouter();

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: updateUserProfile,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["user"] });
            queryClient.invalidateQueries({ queryKey: ["items"] });
            router.replace("/profile");
            Toast.show({
                type: "success",
                text1: "Profile Updated Successfully 🎉",
                text2: "Your profile has been updated!",
            });
        },
        onError: (error) => {
            console.error(error);
            Toast.show({
                type: "error",
                text1: "Profile Update Failed",
                text2: "Failed to update your profile. Please try again.",
            });
        },
    });
    const { data: user, isLoading: loadUser } = useQuery({
        queryKey: ["user"],
        queryFn: fetchUserById,
    });

    const [firstName, setFirstName] = useState(user?.firstName || "");
    const [lastName, setLastName] = useState(user?.lastName || "");
    const [email, setEmail] = useState(user?.email || "");
    const [presentAddress, setPresentAddress] = useState(
        user?.presentAddress || ""
    );
    const [permanentAddress, setPermanentAddress] = useState(
        user?.permanentAddress || ""
    );
    const [dateOfBirth, setDateOfBirth] = useState(user?.dateOfBirth || "");
    const [gurdianName, setGurdianName] = useState(user?.gurdianName || "");
    const [image, setImage] = useState(user?.image || "");

    const handleImagePick = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
        });

        console.log(result.assets[0].uri);

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    if (loadUser) {
        return <Loader />;
    }
    const userId = user?._id;

    const handleSubmit = () => {
        const payload = {
            firstName,
            lastName,
            email,
            presentAddress,
            permanentAddress,
            dateOfBirth,
            gurdianName,
        };

        const formData = new FormData();

        formData.append("data", JSON.stringify(payload));

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

        mutation.mutate({ userId, formData });
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}
    style={{ flex: 1 }}
    keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={{ height: 30 }} />

                <TouchableOpacity
                    onPress={handleImagePick}
                    style={styles.imageWrapper}
                >
                    <Image
                        source={{ uri: image || user?.image }}
                        style={styles.avatar}
                    />
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
                        disabled={mutation.isLoading}
                    >
                        <Text style={styles.submitText}>
                            {mutation.isLoading
                                ? "Updating..."
                                : "Save Changes"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
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
