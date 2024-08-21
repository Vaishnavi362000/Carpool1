import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MainTabNavigator from './MainTabNavigator';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import RideDetailsScreen from '../screens/RideDetailsScreen';
import ActiveRideRequestScreen from '../screens/ActiveRideRequestScreen';
import SearchRideScreen from '../screens/SearchRideScreen';
import OfferRideScreen from '../screens/OfferRideScreen';
import SplashScreen from '../screens/SplashScreen';
import AddVehicleScreen from '../screens/AddVehicleScreen';
import AddRoutesScreen from '../screens/AddRoutesScreen';
import RideListScreen from '../screens/RideListScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import CreateDriverScreen from '../screens/CreateDriverScreen';
import RideHistoryScreen from '../screens/RideHistoryScreen';
import ChatDetailScreen from '../screens/ChatDetailScreen';
import VehiclesScreen from '../screens/VehiclesScreen';
import DriverProfileScreen from '../screens/DriverProfileScreen';
import SelectLocationScreen from '../screens/SelectLocationScreen';
import RoutesScreen from '../screens/RoutesScreen';
import FavouritesScreen from '../screens/FavouritesScreen';
import MapScreen from '../screens/MapScreen';
import LocationsScreen from '../screens/LocationsScreen';
import AddLocationScreen from '../screens/AddLocationScreen';
import RideRequestsScreen from '../screens/RideRequestsScreen';
import ManageRideScreen from '../screens/ManageRideScreen';
import OfferedRideScreen from '../screens/OfferedRideScreen';
import RideListScreen2 from '../screens/RideListScreen2';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Onboarding"
          component={OnboardingScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Main"
          component={MainTabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="RideList"
          component={RideListScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="RideDetails"
          component={RideDetailsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ActiveRideRequest"
          component={ActiveRideRequestScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="RideRequests"
          component={RideRequestsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SearchRide"
          component={SearchRideScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="OfferRide"
          component={OfferRideScreen}
          options={{ headerShown: false }}
        />
        {/*
        <Stack.Screen
          name="Map"
          component={MapScreen}
          options={{ headerShown: false }}
        />
        */}
         <Stack.Screen name="OfferedRide" component={OfferedRideScreen} />
        <Stack.Screen name="ManageRide" component={ManageRideScreen} />  
        <Stack.Screen name="RideListScreen2" component={RideListScreen2} />

        <Stack.Screen
          name="AddVehicle"
          component={AddVehicleScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CreateDriverScreen"
          component={CreateDriverScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="RideHistory"
          component={RideHistoryScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ChatDetail"
          component={ChatDetailScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Vehicles"
          component={VehiclesScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="DriverProfile"
          component={DriverProfileScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SelectLocation"
          component={SelectLocationScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Routes"
          component={RoutesScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AddRoutes"
          component={AddRoutesScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Favourites"
          component={FavouritesScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Locations"
          component={LocationsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AddLocation"
          component={AddLocationScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
