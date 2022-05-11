import { View, Text, ActivityIndicator, Image, StyleSheet, FlatList, Pressable, Animated, ImageBackground, TextInput, Keyboard, ScrollView } from "react-native";
import { useState, useEffect, useContext, useRef } from "react";
import * as rssParser from 'react-native-rss-parser'
import { LinearGradient } from 'expo-linear-gradient';
import TrackPlayer from "react-native-track-player";
import { scaleAnimation } from '../../../animations/scale'
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import SkeletonPlaceHolderPodcast from '../../../components/SkeletonPlaceHolderPodcast'


const EpisodeList = ({navigation}) => {
    const [isLoading, setIsLoading] = useState(true)
    const [isLoadingPagination, setIsLoadingPagination] = useState(false)
    const [pageCurrent, setPageCurrent] = useState(1)
    const [errorMessage, setErrorMessage] = useState(null)

    const [searchText, setSearchText] = useState('')
    const [episodes,setEpisodes] = useState([])
    const [DATA, setDATA] = useState([])

    const animateX = useRef(new Animated.Value(1)).current;
    const [itemAnimate, setItemAnimate] = useState(null);

    const getPodcasts = async() => {
        const RSS_URL = `https://anchor.fm/s/dea812c/podcast/rss`;
        try {
            const response = await fetch(RSS_URL)
            const responseData = await response.text()
            const data = await rssParser.parse(responseData)
            
            setEpisodes(                
                data.items.map((episode, index) => {
                    return {
                    key: episode.id,
                    episodeObject: episode,
                    episodeID: index
                    }
                })
              )

            setPlaylistPodcast(data.items)
            setDATA(
                data.items.map((episode, index) => {
                  return {
                    key: episode.id,
                    episodeObject: episode,
                    episodeID: index
                  }
                })
              )
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

    useEffect(() => {
        if(searchText=='') {
            setEpisodes(DATA)
        } else {
            setEpisodes(
                DATA.filter(item => {
                    if(item.episodeObject.title.toLowerCase().indexOf(searchText.toLocaleLowerCase()) > -1) {
                        return true
                    } else {
                        return false
                    }
                })
            )
        }
    },[searchText])

    return ( 
        <View style={{flex:1,backgroundColor:'white', }}>
            <Pressable style={{flex:1}} onPress={Keyboard.dismiss}>
            {errorMessage && <Text>{errorMessage}</Text>}
            <View style={{padding:10,alignItems:'center', marginTop:20,}}>
                <View style={{padding:5, borderRadius: 5, backgroundColor: '#F6F7F2', width:200, flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
                    <FontAwesome name="search" style={{paddingLeft:5,paddingRight:10}} size={17} color="#323232" />
                    <TextInput
                        value={searchText}
                        onChangeText={setSearchText}
                        style={{width:150, color:'#323232'}}
                        placeholder='Pesquisar...'
                        placeholderTextColor={'#C1C1C1'}
                    />
                </View>
            </View>
            
            {!errorMessage && isLoading ? 
           <SkeletonPlaceHolderPodcast />
            : 
            <Animated.FlatList
            data={episodes}
            keyExtractor={item => item.key}
            contentContainerStyle={{
              padding:10,
              paddingBottom:80
            }}
            removeClippedSubviews={false}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            getItemLayout={(data, index) => (
                {length: 175, offset: 175 * index, index}
              )}
            renderItem={({item, index}) => {
              return <Animated.View
                style={{ borderRadius:12,marginBottom:10,
                shadowColor:'#000',
                shadowOffset: {
                  width: 0,
                  height:10
                },
                shadowOpacity:1,
                shadowRadius:20,
                elevation:10,
                borderWidth:1,
                borderColor: 'rgba(255,255,255,0)',
                transform:[{scale: (itemAnimate == item.key) ? animateX : 1}]
                }}
              >
              <Pressable onPressIn={() => setItemAnimate(item.key)} onPress={() =>{ 
              scaleAnimation(animateX,() => {
                navigation.navigate('Episode',{
                    episodeObject: item.episodeObject,
                    episodeName: item.episodeObject.title,
                    episodeID: item.episodeID,
                    trackLength: DATA.length
                })
              })}}>
                <ImageBackground imageStyle={{borderRadius:12,resizeMode:'center'}} style={styles.imageBackground} source={{uri: item.episodeObject.itunes.image}}>
                    <LinearGradient locations={[0, 0.8]} colors={['transparent', 'rgba(0, 128, 55, .6)']} style={styles.episodeContainer}>
                            <View style={{height:'100%',flexDirection:'row',paddingBottom:5}}>
                                <View style={{flex:7, justifyContent:'flex-end'}}>
                                    <Text style={{fontSize:17,fontWeight:'700',color:'white'}}>{
                                        (item.episodeObject.title.indexOf('-')!=-1) ? item.episodeObject.title.split('- ')[1] : 
                                        item.episodeObject.title
                                    }</Text>
                                    <Text style={{fontSize:12,color:'white',}}>{weekDay(item.episodeObject.published)}</Text>
                                    <Text  style={{fontSize:12,color:'white',}}>{secondsToHms(item.episodeObject.itunes.duration)}</Text>
                                </View>
                                <View style={{flex:1, justifyContent:'flex-end',padding:10}}>
                                    <AntDesign name="play" size={36} color="white" />
                                </View>
                            </View>
                    </LinearGradient>
                </ImageBackground>
                </Pressable>
              </Animated.View>
              
            }}
        />}
          </Pressable>
        </View>
     );
}
 
export default EpisodeList;

const styles = StyleSheet.create({
    imageBackground: {
        height:170,
        backgroundColor: 'black',
        borderRadius:12,
    },
    episodeContainer:{
        padding:10,
        height:'100%',
        borderRadius:12,
    }
})