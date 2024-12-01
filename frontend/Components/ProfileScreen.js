import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  Image,
  Button,
  TextInput,
} from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";

// Placeholder image URL
const placeholderImage = "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541";

const navigateToWelcome = () => {
    navigation.navigate("WelcomeScreen");
}

const navigateToProfileScreen = () => {
    navigation.navigate("ProfileScreen");
}

const ProfileScreen = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");  // State to store the user's email
  
  useEffect(() => {
    const fetchData = async () => {
        try {
          const storedEmail = await AsyncStorage.getItem("email");
          const storedFirstName = await AsyncStorage.getItem("firstName") || "First";
          const storedLastName = await AsyncStorage.getItem("lastName") || "Last";
          const storedProfilePic = await AsyncStorage.getItem("profilePic");
  
          setEmail(storedEmail || "Guest");
          setFirstName(storedFirstName);
          setLastName(storedLastName);
          setUserData({
            profilePic: storedProfilePic || placeholderImage,
          });
        } catch (error) {
          console.error("Error loading profile data", error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchData();
    }, []);
    
  const handleSave = async () => {
    try {
      // Save the updated first and last name locally
      await AsyncStorage.setItem("firstName", firstName);
      await AsyncStorage.setItem("lastName", lastName);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error saving profile data", error);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#D16B6B" />
      </SafeAreaView>
    );
  }
 
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Profile for {email}</Text>      
        </View>
      <View style={styles.profileContainer}>
        <Image 
          source={{ uri: userData.profilePic }} 
          style={styles.profilePic} 
          onError={() => setUserData(prev => ({ ...prev, profilePic: placeholderImage }))} 
        />
      </View>
      <View style={styles.formContainer}>
        <Text style={styles.label}>First Name:</Text>
        <TextInput
          style={styles.input}
          value={firstName}
          onChangeText={setFirstName}
          placeholder="Enter First Name"
        />
        <Text style={styles.label}>Last Name:</Text>
        <TextInput
          style={styles.input}
          value={lastName}
          onChangeText={setLastName}
          placeholder="Enter Last Name"
        />
        <Button title="Save" onPress={handleSave} />
      </View>

      <View style={styles.footerContainer}>
        <Button
          style={styles.button}
          title="Home"
          onPress={navigateToWelcome}
        />
        <Button
          style={styles.button}
          title="Profile"
          onPress={navigateToProfileScreen}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 50,
    color: 'black',
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  formContainer: {
    paddingHorizontal: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
    fontSize: 16,
  },
  listContainer:{
    flex: 0.75,
    paddingHorizontal: 10,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f0f0f0',
    width: '100%',
    paddingVertical: 10,
    marginTop: 'auto',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;