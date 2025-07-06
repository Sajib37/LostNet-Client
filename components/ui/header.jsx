import { StyleSheet, Text, View } from "react-native";
import ProfileMenu from "./profilemenu"

const Header = ({title}) => {
    return (
        <View style={styles.header}>
            <Text style={styles.headerTitle}>LostNet</Text>
            <ProfileMenu/>
        </View>
    );
};

export default Header;

const styles = StyleSheet.create({
    header: {
        paddingTop: 70,
        paddingBottom: 10,
        paddingHorizontal: 16,
        marginBottom: 15,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems:"center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    headerTitle: {
        color: "#5C6AC4",
        fontSize: 24,
        fontWeight: "bold",
    },
});

