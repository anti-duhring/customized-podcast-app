import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, Dimensions, Animated, ImageBackground } from "react-native";
import { useRef, useState, useEffect } from "react";
import HeaderImageScrollView, { TriggeringView } from 'react-native-image-header-scroll-view'
import MusicPlayer from "../../../components/MusicPlayer";
import { LinearGradient } from 'expo-linear-gradient';

const MAX_HEIGHT = 200;
const MIN_HEIGHT = 55;
const WIDTH = Dimensions.get('window').width;

const Episode = ({navigation, route}) => {
    const episode = route.params?.episodeObject
    const episodeName = route.params?.episodeName
    const episodeID = route.params?.episodeID
    const episodeDescription = episode.description.replace(/<p>/g,'').replace(/<br>/g,``).replace(/<\/p>/g,'')
    const trackLength = route.params?.trackLength
    let episodeImage = episode.itunes.image;

    if(episodeImage == 'https://d3t3ozftmdmh3i.cloudfront.net/production/podcast_uploaded_nologo400/2234723/2234723-1645583930433-8a8b649a48b9d.jpg') episodeImage = 'https://brffootball.com.br/wp-content/uploads/2022/02/cropped-logo.png'

    const opacity = useRef(new Animated.Value(0)).current;

    const fadeIn = () => {
        Animated.timing(opacity,{
            toValue: 1,
            duration: 200,
            useNativeDriver: true
        }).start()
    }

    const fadeOut = () => {
        Animated.timing(opacity,{
            toValue: 0,
            duration: 100,
            useNativeDriver: true
        }).start()
    }


    useEffect(() => {
        console.log(episode)
    },[])

    return ( 
        <View style={{flex:1}}>
        <HeaderImageScrollView
            maxHeight={MAX_HEIGHT}
            minHeight={MIN_HEIGHT}
            maxOverlayOpacity={0.6}
            minOverlayOpacity={0}
            fadeOutForeground
            renderForeground={() => (
                <View style={styles.titleContainer}>
                  <Text style={styles.imageTitle}>
                  {(episode.title.indexOf('-')!=-1) ? episode.title.split('- ')[1] : episode.title}
                  </Text>
                  <Text style={styles.imageTitle}> #{trackLength - episodeID}</Text>
                </View>
              )}
            renderFixedForeground={() => (
                <Animated.View
                    style={[styles.navTitleView,{opacity}]}
                >
                  <Text style={styles.navTitle}>
                  {(episode.title.indexOf('-')!=-1) ? episode.title.split('- ')[1] : episode.title}
                  </Text>
                </Animated.View>
              )}
            renderHeader={() => (
                <ImageBackground imageStyle={{resizeMode:'cover'}} style={styles.imageHeader} source={{uri: episodeImage}}>
                    <LinearGradient locations={[0, 0.8]} colors={['transparent', 'rgba(0, 0, 0, 0.6)' /*rgba(0, 128, 55, .6)*/]} style={styles.episodeContainer}>
                    </LinearGradient>
                 </ImageBackground>
                //<Image source={{uri:episode.itunes.image}} style={styles.imageHeader} />
            )}
        >
            <TriggeringView onDisplay={() => fadeOut()} onBeginHidden={() => {fadeIn()}}>
            <View style={styles.sectionPlayer}>
            <MusicPlayer trackIndex={episodeID} track={{
                            url: 'https://'+episode.enclosures[0].url.split('https%3A%2F%2F')[1].replace(/%2F/g,'/'),
                            title: episodeName,
                            artist: episode.authors[0].name,
                            artwork: 'https://brffootball.com.br/wp-content/uploads/2022/02/cropped-logo.png',
                            duration: (Number(episode.enclosures[0].length) / 1000).toFixed(0)
                        }} />
            </View>
            </TriggeringView>
        <View style={[styles.section, styles.sectionLarge]}>
            <Text>{episodeDescription}</Text>
        </View>
        <View style={styles.section}>
            <Text style={styles.sectionInfo}>Publicado em: {episode.published}</Text>
            <Text style={styles.sectionInfo}>{episode.id}</Text>
        </View>
            </HeaderImageScrollView>

        </View>
     );
}
 
export default Episode;

const styles = StyleSheet.create({
    imageHeader: {
        height: MAX_HEIGHT,
        width: WIDTH,
        //resizeMode:'cover',
        backgroundColor:'black'
    },
    episodeContainer:{
        height:'100%',
    },
    title: {
        fontSize: 20,
    },
    sectionPlayer: {
        backgroundColor: '#008037',
    },
    section: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#cccccc',
        backgroundColor: 'white',
    },
    navTitle: {
        color: 'white',
        fontSize: 18,
        backgroundColor: 'transparent',
    },
    navTitleView: {
        height: MIN_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 0,
        opacity: 0,
    },
    sectionLarge: {
        height: 600,
    },
    titleContainer: {
        flex: 1,
        alignSelf: 'stretch',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    imageTitle: {
        color: 'white',
        backgroundColor: 'transparent',
        fontSize: 27,
        fontWeight: 'bold',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 0, height: 0},
        textShadowRadius: 10
    },
    sectionInfo: {
        color:'rgba(0, 0, 0, 0.5)',
        fontStyle: 'italic'
    }
})