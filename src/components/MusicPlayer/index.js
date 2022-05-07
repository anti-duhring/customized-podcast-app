import { useEffect, useState, useContext } from "react";
import { View, Text, Button, TouchableOpacity, ActivityIndicator } from "react-native";
import TrackPlayer, { Capability, Event, RepeatMode, State, usePlaybackState, useProgress, useTrackPlayerEvents } from "react-native-track-player";
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import { PlayerContext } from "../PlayerContext";

const MusicPlayer = ({track, trackIndex}) => { 
    const [currentTrack, setCurrentTrack] = useState(null)
    const { 
        playbackState,
        position,
        duration,
        togglePlayback
    } = useContext(PlayerContext)

    const getCurrentTrack = async() => {
        const index = await TrackPlayer.getCurrentTrack()
        setCurrentTrack(index)
    }

    useEffect(() => {
        getCurrentTrack()
    },[])

    return ( 
        <View>
            <LinearGradient colors={['#008037', '#00662c']} style={{padding:10,borderRadius:5}}>
                <View style={{flexDirection:'row'}}>
                    <View style={{padding:5, flex:1, justifyContent:'center', alignItems:'center'}}>
                        <TouchableOpacity onPress={() => {togglePlayback(playbackState, track, trackIndex); setCurrentTrack(trackIndex)}}>
                            {playbackState == State.Buffering || playbackState == State.Connecting ? <ActivityIndicator size={24} color="white" /> : <FontAwesome name={playbackState == State.Playing &&  currentTrack == trackIndex ?  "pause" : "play" } size={24} color="white" />}
                        </TouchableOpacity>
                    </View>
                    <View style={{padding:5, flex:6, justifyContent:'center', alignContent:'flex-start'}}>
                        <View>
                            <MultiSlider 
                                trackStyle={{backgroundColor:'rgba(0,0,0,0.1)'}}
                                markerStyle={{backgroundColor:'white'}}
                                containerStyle={{height:20}}
                                selectedStyle={{backgroundColor:'white'}}
                                values={currentTrack == trackIndex ? [position] : [0]}
                                min={0}
                                sliderLength={250}
                                max={duration > 0 && currentTrack == trackIndex && isNaN(duration) == false ? duration : 100}
                                onValuesChangeFinish={async(values) => {
                                    await TrackPlayer.seekTo(values[0])
                                }}
                            />
                        </View>
                        <View style={{flexDirection:'row', width:'100%', justifyContent:'space-between'}}>
                            <Text style={{color:'white'}} >{
                                currentTrack == trackIndex ?
                                new Date(position * 1000).toISOString().substring(12, 19) :
                                '0:00:00'
                            }</Text>
                            <Text style={{color:'white'}} >{
                                currentTrack == trackIndex ?
                                new Date((duration - position) * 1000).toISOString().substring(12, 19) : 
                                '0:00:00'
                            }</Text>
                        </View>
                    </View>
                </View>
            </LinearGradient>
        </View>
     );
}
 
export default MusicPlayer;