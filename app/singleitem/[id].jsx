import { useLocalSearchParams } from "expo-router";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useEffect, useState } from "react";
import Header from "../../components/ui/header";

const screenWidth = Dimensions.get("window").width;

export default function SingleItemScreen() {
  const { id } = useLocalSearchParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/v1/item/get-single-item/${id}`);
        const json = await res.json();
        setItem(json?.data);
      } catch (err) {
        console.error("Error loading item", err);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  const handleRequest = () => {
    Alert.alert("Request Sent", "You have requested this item.");
    // Future: Send POST request to backend
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#5C6AC4" />
      </View>
    );
  }

  if (!item) return <Text>Item not found</Text>;

  return (
    <View style={{ flex: 1, backgroundColor: "#F2F4F8" }}>
      <Header title={item?.title}/>

      <ScrollView contentContainerStyle={styles.content}>

        <Image source={{ uri: item.image }} style={styles.image} />

        <Text style={styles.title}>{item.title}</Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: item.status === "Available" ? "#4CAF50" : "#F44336" },
          ]}
        >
          <Text style={styles.statusText}>{item.status}</Text>
        </View>


        <View style={styles.card}>
          <Text style={styles.label}>📍 Location</Text>
          <Text style={styles.value}>{item.location}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>📝 Description</Text>
          <Text style={styles.value}>{item.description}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>📅 Found On</Text>
          <Text style={styles.value}>
            {new Date(item.dateOfFound).toLocaleDateString()}
          </Text>
        </View>

        <TouchableOpacity style={styles.requestButton} onPress={handleRequest}>
          <Text style={styles.requestButtonText}>Request This Item</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}


const styles = StyleSheet.create({
  header: {
    backgroundColor: "#5C6AC4",
    paddingTop: 60,
    paddingBottom: 20,
    alignItems: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 6,
  },
  headerText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },
  image: {
    width: screenWidth * 0.85,
    height: 200,
    borderRadius: 15,
    marginTop: 20,
    alignSelf: "center",
    backgroundColor: "#eee",
  },
  content: {
    padding: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
    marginTop: 20,
    marginBottom: 8,
  },
  statusBadge: {
    alignSelf: "center",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 20,
  },
  statusText: {
    color: "#fff",
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#444",
    marginBottom: 4,
  },
  value: {
    fontSize: 15,
    color: "#555",
  },
  requestButton: {
    backgroundColor: "#5C6AC4",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 30,
  },
  requestButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
