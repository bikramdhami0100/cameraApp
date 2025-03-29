import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState,useCallback,useRef } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { useNavigation, useRouter } from 'expo-router';
export default function App() {
  const router=useRouter();
  const navigation=useNavigation();
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [albums, setAlbums] = useState(null);
  const [permissionResponseMedia, requestPermissionMedia] = MediaLibrary.usePermissions();
  async function getAlbums() {
    if (permissionResponseMedia.status !== 'granted') {
      await requestPermissionMedia();
    }
    const fetchedAlbums = await MediaLibrary.getAlbumsAsync({
      includeSmartAlbums:true
    });
    console.log(fetchedAlbums,"data")
    
  }
  getAlbums();

  const cameraRef = useRef(null);
  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }
  
 
  const takePicture = async () => {
    if (cameraRef?.current) {
      const photo = await cameraRef?.current?.takePictureAsync();
      console.log("Photo taken:", photo?.uri);

      // Save to gallery
      const asset = await MediaLibrary.createAssetAsync(photo?.uri);
        console.log(asset,"photos")
        if(asset){
          router.push("Details",{ id:JSON.stringify(asset)})
          // navigation.navigate.
        }
    }
  };

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera}  facing={facing}>
           <View style={{flex:1,flexDirection:"row",gap:30,justifyContent:"space-evenly",alignItems:"flex-end",marginBottom:4}}>

           <TouchableOpacity style={{backgroundColor:"blue",padding:10, borderRadius:10}} onPress={takePicture}>
        <Text  style={{color:"white"}}>Capture</Text>
      </TouchableOpacity>
          <TouchableOpacity style={{backgroundColor:"blue",padding:10, borderRadius:10}} onPress={()=>{
            toggleCameraFacing();
          }}>
            <Text style={{color:"white"}}>Flid Camera</Text>
          </TouchableOpacity>
           </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});
