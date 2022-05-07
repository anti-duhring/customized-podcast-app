import { useEffect } from 'react'
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from './src/screens/Home';
import Podcast from './src/screens/Podcast'
import TrackPlayer, { Capability, Event, RepeatMode, State, usePlaybackState, useProgress, useTrackPlayerEvents } from "react-native-track-player";
import { PlayerContextProvider } from "./src/components/PlayerContext";

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

export default function App() {

  const setupPlayer = async() => {
    try {
        await TrackPlayer.setupPlayer();
        await TrackPlayer.updateOptions({
          stopWithApp:true,
            capabilities: [
                Capability.Play,
                Capability.Pause,
                Capability.Stop,
            ],
            compactCapabilities: [
              Capability.Play,
              Capability.Pause,
              Capability.Stop,
            ]
        })
        console.log('Track Player loaded!')
    }
    catch(e) {
        console.log('Erro:',e)
    } 
    
}

useEffect(() => {
  setupPlayer()
},[])

  return (
    <PlayerContextProvider>
      <StatusBar
        animated={true}
        backgroundColor="#008037"
        style='light'
      />
      <NavigationContainer>
        <Drawer.Navigator useLegacyImplementation>
          <Drawer.Screen name="Home" component={Home} />
          <Drawer.Screen name="Podcast" component={Podcast} options={{headerShown:false}} />
        </Drawer.Navigator>
      </NavigationContainer>
    </PlayerContextProvider>
  );
}

