import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { DrawerToggleButton } from "@react-navigation/drawer";
import EpisodeList from './EpisodeList'
import Episode from './Episode'

const Stack = createNativeStackNavigator();

const Podcast = ({navigation}) => {
    return ( 
        <Stack.Navigator initialRouteName="EpisodeList">
            <Stack.Screen name="EpisodeList" options={{ 
              title:'BrFF Podcast',
              headerLeft: () => (<DrawerToggleButton onPress={() => navigation.toggleDrawer()} />
              )}
              } component={EpisodeList} />
            <Stack.Screen name="Episode" options={({route}) => ({ 
            title:route.params.episodeName,
            headerLeft: () => (<DrawerToggleButton onPress={() => navigation.toggleDrawer()} />
            ), 
            headerRight: () => (
                <TouchableOpacity style={styles.goBackButton} onPress={() => navigation.navigate('EpisodeList')}>
                    <Text>Voltar</Text>
                </TouchableOpacity>
            ) 
            })
            } component={Episode} />
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
