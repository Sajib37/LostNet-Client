import { StyleSheet,View } from "react-native";


const Header = ({title}) => {
    return (
        <View style={styles.header}>

        </View>
    );
};

export default Header;

const styles = StyleSheet.create({
    header: {
        paddingTop: 30,
        paddingBottom: 20,
        paddingHorizontal: 16,
        marginBottom: 15,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems:"center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 4,
    },
    headerTitle: {
        color: "#5C6AC4",
        fontSize: 24,
        fontWeight: "bold",
    },
});

