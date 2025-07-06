import { ActivityIndicator, View } from "react-native";

 const Loader = () => (
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <ActivityIndicator size="large" color="#5C6AC4" />
  </View>
);

export default Loader