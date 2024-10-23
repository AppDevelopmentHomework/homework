import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Button,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Camera } from 'expo-camera';
import * as FileSystem from 'expo-file-system';

export default function CameraFeature() {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [photoUri, setPhotoUri] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleTakePicture = async () => {
    if (cameraRef) {
      const photo = await cameraRef.takePictureAsync();
      setPhotoUri(photo.uri);
      console.log('Photo saved to:', photo.uri);
    }
  };

  if (hasPermission === null) {
    return (
      <View style={styles.permissionContainer}>
        <Text>Requesting Camera Permission</Text>
      </View>
    );
  }
  if (hasPermission === false) {
    return (
      <View style={styles.permissionContainer}>
        <Text>No Camera Permission</Text>
        <Button
          title="Allow Camera"
          onPress={async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
          }}
        />
      </View>
    );
  }

  const toggleCameraType = () => {
    setType(
      type === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  };

  return (
    <View style={styles.container}>
      {photoUri ? (
        <View style={styles.previewContainer}>
          <Text>Photo Saved at: {photoUri}</Text>
          <Image source={{ uri: photoUri }} style={styles.imagePreview} />
          <Button
            title="Take Another Picture"
            onPress={() => setPhotoUri(null)}
          />
        </View>
      ) : (
        <Camera
          style={styles.camera}
          type={type}
          ref={(ref) => setCameraRef(ref)}
        >
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
              <Text style={styles.text}>Flip Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleTakePicture}>
              <Text style={styles.text}>Take Picture</Text>
            </TouchableOpacity>
          </View>
        </Camera>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
  imagePreview: {
    width: '100%',
    height: 400,
    marginBottom: 20,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 30,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 20,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
  },
  text: {
    fontSize: 16,
    color: '#000',
  },
});