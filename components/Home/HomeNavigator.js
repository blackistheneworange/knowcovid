import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {withTheme} from 'react-native-paper';


import HomeComponent from './HomeComponent';

const Stack=createStackNavigator();
const Drawer=createDrawerNavigator();

function HomeNavigator(props){
	
	const {colors}=props.theme;


	const {navigation}=props;

	return(
		
	<Stack.Navigator
	options={{
		headerStyle:{
			backgroundColor:'red'}
	}}>

	<Stack.Screen name='Home' component={HomeComponent} options={{
		headerTintColor:'#fff',
		headerLeft:(props)=>(
		     <Icon name="menu" size={24} color='#fff' style={{marginLeft:15,marginTop:5}} onPress={()=>navigation.toggleDrawer()}/>),
		headerStyle:{
			backgroundColor:'#8d22c7'
		},
			
			
	}}/>

	</Stack.Navigator>
		
	)
}

export default withTheme(HomeNavigator)

