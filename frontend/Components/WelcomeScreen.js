// WelcomeScreen.js
import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  Text,
  Button,
  TouchableOpacity,
  View,
  FlatList,
  ActivityIndicator,
} from "react-native";
import AddItemModal from "./AddItemModal";
import EditItemModal from "./EditItemModal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "./styles/styles";
import { FontAwesome } from '@expo/vector-icons';

export default function WelcomeScreen({ navigation, setIsLoggedIn }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigateToCameraFeature = () => {
    navigation.navigate("CameraFeature");
  };

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const token = await AsyncStorage.getItem("token");
        const response = await fetch("http://172.17.192.1:5000/items/", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const items = await response.json();
        setData(items);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    setIsLoggedIn(false);
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  const handleEditPress = (item) => {
    setSelectedItem(item);
    setIsEditModalVisible(true);
  };

  const handleDeletePress = async (itemId) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`http://172.17.192.1:5000/items/${itemId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorResponse = await response.json();
        console.error("server error", errorResponse);
        throw new Error(errorResponse.message || "Failed to delete item");
      }

      setData((prevData) => prevData.filter((item) => item._id !== itemId));
    } catch (error) {
      console.error("Error deleting item", error);
      alert("Failed to delete item");
    }
  };

  const addItem = async (newItem) => {
    console.log("Adding item:", newItem);
    try {
      const token = await AsyncStorage.getItem("token");
      console.log("Token in addItem:", token);
      const response = await fetch("http://172.17.192.1:5000/items/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newItem),
      });
      if (!response.ok) {
        const errorResponse = await response.json();
        console.error("server error", errorResponse);
        throw new Error(errorResponse.message || "Failed to add item");
      }
      const savedItem = await response.json();
      console.log("saved", savedItem);
      setData((prevData) => [savedItem, ...prevData]);
    } catch (error) {
      console.error("Error adding item", error);
      alert("Failed to add item");
    }
  };

  const saveEditedItem = async (editedItem) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(
        `http://172.17.192.1:5000/items/${editedItem._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: editedItem.title,
            description: editedItem.description,
          }),
        }
      );
      if (!response.ok) {
        const errorResponse = await response.json();
        console.error("server error", errorResponse);
        throw new Error(errorResponse.message || "Failed to update item");
      }

      const savedItem = await response.json();
      setData((prevData) =>
        prevData.map((item) => (item._id === editedItem._id ? savedItem : item))
      );
    } catch (error) {
      console.error("Error updating item", error);
      alert("Failed to update item");
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Welcome!</Text>
      </View>
      <View style={styles.listContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#ff00ff" />
        ): data.length ? (
          <FlatList
            data={data}
            keyExtractor={(item) => item._id.toString()}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.description}>{item.description}</Text>
                <View style={styles.itemActions}>
                  <TouchableOpacity onPress={() => handleEditPress(item)}>
                    <FontAwesome name="edit" size={24} color="black" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDeletePress(item._id)}>
                    <FontAwesome name="trash" size={24} color="red" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        ):(
          <View>
            <Text>No items found</Text>
          </View>
        )}
      </View>
      <AddItemModal onAddItem={addItem} />
      {selectedItem && (
            <EditItemModal
              item={selectedItem}
              isVisible={isEditModalVisible}
              onClose={() => setIsEditModalVisible(false)}
              onSave={saveEditedItem}
            />
      )}
      <View style={styles.footerContainer}>
        <Button
          style={styles.button}
          title="Camera Feature"
          onPress={navigateToCameraFeature}
        />
        <Button style={styles.button} title="Logout" onPress={handleLogout} />
      </View>
    </SafeAreaView>
  );
}
