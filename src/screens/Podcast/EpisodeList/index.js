import { View, Text, ActivityIndicator, ScrollView, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useState, useEffect, useContext } from "react";
import * as rssParser from 'react-native-rss-parser'
import { LinearGradient } from 'expo-linear-gradient';
import TrackPlayer from "react-native-track-player";


const EpisodeList = ({navigation}) => {

    const [isLoading, setIsLoading] = useState(true)
    const [errorMessage, setErrorMessage] = useState(null)
    const [episodes,setEpisodes] = useState([])

    const getPodcasts = async() => {
        //const response = await fetch(`https://anchor.fm/s/dea812c/podcast/rss`)
        const RSS_URL = `https://anchor.fm/s/dea812c/podcast/rss`;
        try {
            const response = await fetch(RSS_URL)
            const responseData = await response.text()
            const data = await rssParser.parse(responseData)
            setEpisodes(data.items)
            setPlaylistPodcast(data.items)
        } catch(e) {
            console.log('Erro:',e)
        } 
    }

    const weekDay = (date) => {
        const day = date.split(',')[0]
        const datecalendar = date.split(',')[1]
        const daycalendar = datecalendar.split(' ')[1];
        const monthcalendar = datecalendar.split(' ')[2];
        const yearcalendar = datecalendar.split(' ')[3];
        let dayPT;
        switch(day) {
            case 'Mon':
                dayPT = 'Segunda-feira';
                break;
            case 'Tue':
                dayPT = 'Terça-feira';
                break;
            case 'Wed':
                dayPT = 'Quarta-feira';
                break;
            case 'Thu':
                dayPT = 'Quinta-feira';
                break;
            case 'Fri':
                dayPT = 'Sexta-feira'
                break;
            case 'Sat':
                dayPT = 'Sábado'
                break;
            case 'Sun':
                dayPT = 'Domingo'
                break;
            default:
                dayPT = '';
        }
        return `${dayPT} - ${daycalendar} ${monthcalendar} ${yearcalendar}`
    }

    const secondsToHms = (d) => {
        d = Number(d);
        var h = Math.floor(d / 3600);
        var m = Math.floor(d % 3600 / 60);
        var s = Math.floor(d % 3600 % 60);
    
        var hDisplay = h > 0 ? h + (h == 1 ? "hr " : "hrs ") : "";
        var mDisplay = m > 0 ? m + (m == 1 ? "min" : "mins") : "";
        var sDisplay = s > 0 ? s + (s == 1 ? "s" : "s") : "";
        return hDisplay + mDisplay; 
    }

    const setPlaylistPodcast = async(episodesData) => {
        let playlist = []
        episodesData.map((episode, index) => { 
            playlist.push({
                url: 'https://'+episode.enclosures[0].url.split('https%3A%2F%2F')[1].replace(/%2F/g,'/'),
                title: episode.title,
                artist: episode.authors[0].name,
                artwork: 'https://brffootball.com.br/wp-content/uploads/2022/02/cropped-logo.png',
                duration: (Number(episode.enclosures[0].length) / 1000).toFixed(0)
            })
        })

        await TrackPlayer.add(playlist);
        console.log(playlist.length,'tracked')
        setIsLoading(false)
    } 

    useEffect(() => {
        getPodcasts();
    },[])

    if(isLoading){
        return (
            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
              <ActivityIndicator size="large" color="#008037" />
            </View>
        )
    }

    return ( 
        <View>
            {errorMessage && <Text>{errorMessage}</Text>}
            <ScrollView>
                {!errorMessage && episodes.map((episode, index) => {
                    const htmlEP = episode.description;
                    if(index>10) return 
                    return (
                        <TouchableOpacity key={episode.id} onPress={() => {
                        navigation.navigate('Episode',{
                            episodeObject: episode,
                            episodeName: episode.title,
                            episodeID: index
                        })}}>
                            <LinearGradient colors={['#008037', '#00662c']} style={styles.episodeContainer}>
                                <View style={styles.imageEpisodeContainer}>
                                    <Image style={styles.imageEpisode} source={{uri: episode.itunes.image}} />
                                </View>
                                <View style={styles.episodeInfo}>
                                    <Text style={styles.episodeTitle}>{episode.title}</Text>
                                    <Text style={styles.episodePublished}>
                                        {weekDay(episode.published)}
                                    </Text>
                                    <Text style={styles.episodeDuration}>{secondsToHms(episode.itunes.duration)}</Text>
                                </View>
                            </LinearGradient>
                        </TouchableOpacity>
                    )
                })}
            </ScrollView>
        </View>
     );
}
 
export default EpisodeList;

const styles = StyleSheet.create({
    episodeContainer:{
        flexDirection:'row',
        margin:10,
        paddingRight:5,
        borderRadius:5,
        height:100,
    },
    imageEpisodeContainer:{
        justifyContent:'center',
        flex:1,
    },
    imageEpisode:{
        width:80,
        height:'100%',
        borderTopLeftRadius:5,
        borderBottomLeftRadius:5,
      },
      episodeInfo:{
          justifyContent:'center',
          flex:3,
          paddingLeft:5,
      },
      episodeTitle:{
          color:'white',
          fontWeight:'bold',
      },
      episodeDuration:{
          color:'white',
          fontSize:10,
      },
      episodePublished:{
          color:'white',
          fontSize:10,
      }
})