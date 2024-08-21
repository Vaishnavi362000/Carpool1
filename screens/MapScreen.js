{/*
import React, { useState, useEffect, useRef } from 'react';
import { View, Dimensions, TextInput, StyleSheet,Text, PermissionsAndroid, Platform, Image } from 'react-native';
import MapView from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import { Button } from 'native-base';
import { useNavigation } from '@react-navigation/native';

const HERE_API_KEY = 'BLiCQHHuN3GFygSHe27hv4rRBpbto7K35v7HXYtANC8';

const SearchMapScreen = ({navigation}) => {
  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [address, setAddress] = useState('');
  const {  goBack, ...rest } = useNavigation();
  const mapRef = useRef(null);

  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'We need access to your location to show your position on the map',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Location permission denied');
          return;
        }
      }
      getCurrentLocation();
    };

    const getCurrentLocation = () => {
      Geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newRegion = {
            ...region,
            latitude,
            longitude,
          };
          setRegion(newRegion);
          fetchAddressFromCoordinates(latitude, longitude);
        },
        (error) => {
          console.log(error.code, error.message);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    };

    requestLocationPermission();
  }, []);

  const fetchAddressFromCoordinates = (latitude, longitude) => {
    fetch(`https://revgeocode.search.hereapi.com/v1/revgeocode?at=${latitude},${longitude}&apikey=${HERE_API_KEY}`)
      .then(response => response.json())
      .then(data => {
        if (data.items && data.items.length > 0) {
          setAddress(data.items[0].address.label);
        }
      })
      .catch(error => {
        console.error(error);
      });
  };
   
   const handleSearch=()=>{

   }

  const onRegionChangeComplete = (region) => {
    setRegion(region);
    fetchAddressFromCoordinates(region.latitude, region.longitude);
  };

  return (
    
    <View style={{ flex: 1 }}>
      
      <MapView
        ref={mapRef}
        style={styles.map}
        region={region}
        onRegionChangeComplete={onRegionChangeComplete}
        showsUserLocation={true}
      />
      
      <View style={styles.pinContainer}>
        <Image
          source={require('./pin.png')} // Replace with your custom pin image
          style={styles.pin}
        />
      </View>
      <View style={styles.searchBoxContainer}>
      <Text>Select Location</Text>
        <TextInput
          style={styles.searchBox}
          value={address}
          editable={false}
        />
      </View>
      <View style={styles.buttonContainer}>
        
         <Button
            mt="4"
            backgroundColor='black'
            onPress={()=>navigation.navigate('SearchRide',{address})}
            
            borderRadius={15}
            //rounded="full"
            px="8"
            py="4"
            _text={{ fontSize: 'lg', fontWeight: 'bold' }}
          >
            Confirm Location
          </Button>
   
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  pinContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -24, 
    marginLeft: -12, 
    zIndex: 1,
  },
  pin: {
    width: 24,
    height: 48, 
  },
  searchBoxContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 10,
    elevation: 10,
  },
  searchBox: {
    height: 40,
    paddingHorizontal: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
  },
   buttonContainer: {
    position: 'absolute',
    bottom: 80,
    left: 20,
    right: 20,
  },
});

export default SearchMapScreen;
*/}