import { Text, TouchableOpacity, StyleSheet, Share } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack'
import { DrawerToggleButton } from "@react-navigation/drawer";
import EpisodeList from './EpisodeList'
import Episode from './Episode'
import { Ionicons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons'; 

const Stack = createStackNavigator();

const Podcast = ({navigation}) => {

  const onShare = async(episodeTitle, episodeLink) => {
    try {
      const result = await Share.share({
        message: 
        `Estou ouvindo o episódio "${episodeTitle}" do Podcast do BrFF.
Ouça você também! ${episodeLink}`
      })
            if (result.action === Share.sharedAction) {
      if (result.activityType) {
        // shared with activity type of result.activityType
      } else {
        // shared
      }
    } else if (result.action === Share.dismissedAction) {
      // dismissed
      }
    } catch (e) {
      alert(e)
    }
  }

    return ( 
        <Stack.Navigator initialRouteName="EpisodeList">
          <Stack.Screen name="EpisodeList"  options={{ 
              headerTransparent: true,
              title:'',
              headerLeft: () => (
                <DrawerToggleButton onPress={() => navigation.toggleDrawer()} />
              )}
              } component={EpisodeList} />

          <Stack.Screen name="Episode" options={({route}) => ({ 
            title: '',
            headerTransparent: true,
            headerLeft: () => (
              <TouchableOpacity style={{marginLeft:10,}} onPress={() => navigation.navigate('EpisodeList')}>
                <Ionicons name="arrow-back" size={24} color="white" />
              </TouchableOpacity>
            ),
            headerRight: () => (
              <TouchableOpacity style={{marginRight:10,}} onPress={() => {
                onShare(route.params?.episodeName, route.params?.episodeObject.links[0].url)
              }}>
                <Entypo name="share" size={24} color="white" />
              </TouchableOpacity>
            )
          })} component={Episode} />
        </Stack.Navigator>
     );
}
 
export default Podcast;

const styles = StyleSheet.create({
    goBackButton:{
      marginRight:5,
      backgroundColor:'white',
      padding:10,
    }
  })