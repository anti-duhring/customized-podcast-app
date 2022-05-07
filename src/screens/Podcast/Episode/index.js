import { View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator, ScrollView } from "react-native";
import { useState, useEffect, useRef, useContext } from "react";
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign, FontAwesome } from '@expo/vector-icons'
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import MusicPlayer from "../../../components/MusicPlayer";

const Episode = ({navigation, route}) => {
    const episode = route.params?.episodeObject
    const episodeName = route.params?.episodeName
    const episodeID = route.params?.episodeID
    const episodeDescription = episode.description.replace(/<p>/g,'').replace(/<br>/g,``).replace(/<\/p>/g,'')


    return ( 
        <View style={{padding:10}}>
            <ScrollView>
                <MusicPlayer trackIndex={episodeID} track={{
                    url: 'https://'+episode.enclosures[0].url.split('https%3A%2F%2F')[1].replace(/%2F/g,'/'),
                    title: episodeName,
                    artist: episode.authors[0].name,
                    artwork: 'https://brffootball.com.br/wp-content/uploads/2022/02/cropped-logo.png',
                    duration: (Number(episode.enclosures[0].length) / 1000).toFixed(0)
                }} />
                <View>
                    <View style={{alignItems:'center',padding:10}}>
                        <Image source={{uri:episode.itunes.image}} style={{width:200, height:200,borderRadius:5}} />
                    </View>
                    <View style={{paddingVertical:5,}}>
                        <Text style={{fontSize:20,fontWeight:'bold',}}>{episodeName}</Text>
                    </View>
                    <View>
                        <Text>{episodeDescription}</Text>
                    </View>
                </View>
            </ScrollView>
        </View>
     );
}
 
export default Episode;
