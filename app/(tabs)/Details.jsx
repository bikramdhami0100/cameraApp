import { useState, useEffect } from 'react';
import { Button, Text, SafeAreaView, ScrollView, StyleSheet, Image, View, Platform } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { useLocalSearchParams } from 'expo-router';

export default function Details(){
  const [albums, setAlbums] = useState(null);
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();
   const params=useLocalSearchParams();
  // console.log(params,"this is data");
  async function getAlbums() {
    if (permissionResponse.status !== 'granted') {
      await requestPermission();
    }
    const fetchedAlbums = await MediaLibrary.getAlbumsAsync({
      includeSmartAlbums: true,
    });
    setAlbums(fetchedAlbums);
  }
getAlbums();
  return (
    <SafeAreaView style={styles.container}>
     
      <ScrollView>
        {albums && albums.map((album) => <AlbumEntry album={album}  />)}
      </ScrollView>
    </SafeAreaView>
  );
}

function AlbumEntry({ album }) {
  const [assets, setAssets] = useState([]);
 
  useEffect(() => {
    async function getAlbumAssets() {
      const albumAssets = await MediaLibrary.getAssetsAsync({ album });
      setAssets(albumAssets.assets);
    }
    getAlbumAssets();
  }, []);

  // console.log(params,"data")
  return (
    <View key={album.id} style={styles.albumContainer} >
      {/* <Text>
        {album.title} - {album.assetCount ?? 'no'} assets
      </Text> */}
       {/* <Image key={index} source={{ uri:JSON.parse(params?.id)?.uri }} style={{borderRadius:10, shadowColor:"brown",shadowOpacity:1}} width={100 }height={100} /> */}
      <View style={styles.albumAssetsContainer}>
        {assets && assets.map((asset,index) => (
            
         <View>
             <Image key={index} source={{ uri: asset.uri||JSON.parse(params?.id) }} style={{borderRadius:10, shadowColor:"brown",shadowOpacity:1}} width={100 }height={100} />
        </View>
        ))}
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 8,
    justifyContent: 'center',
    ...Platform.select({
      android: {
        paddingTop: 40,
      },
    }),
  },
  albumContainer: {
    paddingHorizontal: 20,
    marginBottom: 12,
    gap: 4,
  },
  albumAssetsContainer: {
    gap:10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    
  },
});

