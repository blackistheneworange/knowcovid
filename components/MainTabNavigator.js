import React from 'react';
import {Text} from 'react-native';


import {withTheme} from 'react-native-paper';

import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';


import Icon from 'react-native-vector-icons/Entypo';

import HomeNavigator from './Home/HomeNavigator';
import WorldNavigator from './World/WorldNavigator';
import NewsNavigator from './News/NewsNavigator';


const Tab=createMaterialBottomTabNavigator();


function MainStackNavigator(props){

       const {colors}=props.theme;

	return(
		

	<Tab.Navigator
	activeColor={colors.surface}
	inactiveColor='#fff'
	shifting={true}
	labeled={true}
	
	>

		<Tab.Screen name='Home' component={HomeNavigator} options={{
		tabBarLabel:<Text style={{fontWeight:'bold'}}>Home</Text>,
		tabBarIcon:({color})=>(
		<Icon name='home' color={color} size={24}/>),
		tabBarColor:'#9838a1'
	
		}}
		/>

		<Tab.Screen name='World' component={WorldNavigator} options={{
			tabBarLabel:<Text style={{fontWeight:'bold'}}>World</Text>,
			tabBarColor:'#0c944b',
                        tabBarIcon:({color})=>(
				<Icon name='magnifying-glass' color={color} size={24}/>)
			
		}}
		/>

		<Tab.Screen name='News' component={NewsNavigator} options={{
			tabBarLabel:<Text style={{fontWeight:'bold'}}>News</Text>,
			tabBarColor:'#34aeeb',
			tabBarIcon:({color})=>(
				<Icon color={color} name='news' size={24}/>),
		}}
		
		/>

	</Tab.Navigator>
			
	)
}

export default withTheme(MainStackNavigator)
