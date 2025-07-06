import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useEffect, useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "expo-router";
import Header from "../components/ui/header";
import Animated, { FadeIn } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";

const OwnItemsScreen = () => {
  const [userItems, setUserItems] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const token = await AsyncStorage.getItem("accessToken");
        if (!token) return;
        const decoded = jwtDecode(token);
        setUserId(decoded?.id);
      } catch (err) {
        console.error("Token decoding error:", err);
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    if (userId) fetchItems();
  }, [userId]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://192.168.0.102:5000/api/v1/item/user-items/${userId}`);
      setUserItems(res.data.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://192.168.0.102:5000/api/v1/${id}`);
      Alert.alert("Deleted", "Item has been removed");
      setUserItems((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.error("Delete error:", err);
      Alert.alert("Error", "Could not delete item");
    }
  };

  const renderItem = ({ item }) => (
    <Animated.View entering={FadeIn.duration(300)} style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.updateBtn}
          onPress={() => router.push(`/detailsitem/${item._id}`)}
        >
          <Ionicons name="create-outline" size={16} color="#fff" />
          <Text style={styles.btnText}>Details</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => handleDelete(item._id)}
        >
          <Ionicons name="trash-outline" size={16} color="#fff" />
          <Text style={styles.btnText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  return (
    <>
      <Header />
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color="#2C7BE5" />
        ) : userItems.length === 0 ? (
          <Text style={styles.noItems}>No items found</Text>
        ) : (
          <FlatList
            data={userItems}
            keyExtractor={(item) => item._id}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: "space-between" }}
            contentContainerStyle={{ paddingBottom: 80 }}
            renderItem={renderItem}
          />
        )}
      </View>
    </>
  );
};

export default OwnItemsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F5F7FA",
  },
  noItems: {
    textAlign: "center",
    fontSize: 18,
    marginTop: 50,
    color: "#999",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    width: "48%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  image: {
    width: "100%",
    height: 100,
    borderRadius: 12,
    marginBottom: 10,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#2C7BE5",
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: "#666",
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  updateBtn: {
    backgroundColor: "#5C6AC4",
    padding: 6,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  deleteBtn: {
    backgroundColor: "#FF4D4D",
    padding: 6,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  btnText: {
    color: "#fff",
    fontSize: 13,
  },
});
