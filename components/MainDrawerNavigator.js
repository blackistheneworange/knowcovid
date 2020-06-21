import React from 'react';
import {Linking,View,Text} from 'react-native'
import {createDrawerNavigator,DrawerContentScrollView,DrawerItem} from '@react-navigation/drawer';

import MainTabNavigator from './MainTabNavigator';

import Icon from 'react-native-vector-icons/Entypo';

const Drawer=createDrawerNavigator();



function MainDrawerNavigator(props){

	function CustomDrawerContent(props){
		return(
			<DrawerContentScrollView>

			<View style={{backgroundColor:'#7373e3',height:140,alignItems:'center',justifyContent:'center'}}>
			<Text style={{color:'#fff',fontSize:30,fontWeight:'bold'}}>KNOW COVID</Text>
                        <Text style={{color:'#aaa',fontSize:8}}>version 1.0.0</Text>
			</View>

			
			<DrawerItem
			label=''
			icon={()=><Icon name='chevron-with-circle-left' size={26} style={{flex:1}}/>}			
			onPress={()=>props.navigation.closeDrawer()}
			style={{flex:1,justifyContent:'center'}}
			/>
			

			<DrawerItem
			label='Github'
			icon={()=><Icon name='github-with-circle' size={24}/>}
			onPress={()=>Linking.openURL('https://github.com/blackistheneworange/knowcovid')}
			/>

			<DrawerItem
			label='LinkedIn'
			icon={()=><Icon name='linkedin-with-circle' size={24}/>}
			onPress={()=>Linking.openURL('https://www.linkedin.com/in/hariharanpr')}
			/>

			</DrawerContentScrollView>
                        
		)
	}

	return(
	   
	  <Drawer.Navigator
		drawerContent={(props)=><CustomDrawerContent {...props}/>}
		>
		<Drawer.Screen name='Main' component={MainTabNavigator}/>
	  </Drawer.Navigator>

	)
}

export default MainDrawerNavigator;
