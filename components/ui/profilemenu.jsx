import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  Image,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";

const ProfileMenu = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const router = useRouter();

  const handleSelect = (option) => {
    setMenuVisible(false);
    if (option === "profile") {
      router.push("/profile");
    } else if (option === "update-profile") {
      router.push("/updateprofile");
    } else if (option === "logout") {
      // TODO: handle logout logic here
      console.log("Logging out...");
    }
  };

  return (
    <>
      <TouchableOpacity onPress={() => setMenuVisible(true)}>
        <Image
          source={require("../../assets/images/login.jpg")}
          style={styles.profilePic}
        />
      </TouchableOpacity>

      <Modal
        transparent
        visible={menuVisible}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setMenuVisible(false)}>
          <View style={styles.dropdown}>
            <TouchableOpacity onPress={() => handleSelect("profile")}>
              <Text style={styles.menuItem}>Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleSelect("update-profile")}>
              <Text style={styles.menuItem}>Update Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleSelect("logout")}>
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
