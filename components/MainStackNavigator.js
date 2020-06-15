import React from 'react';
import {Text} from 'react-native';


import {withTheme} from 'react-native-paper';

import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';


import Icon from 'react-native-vector-icons/Entypo';

import HomeNavigator from './Home/HomeNavigator';
import AnalysisNavigator from './Analysis/AnalysisNavigator';
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
		tabBarColor:'#8d22c7'
	
		}}
		/>

		<Tab.Screen name='Analysis' component={AnalysisNavigator} options={{
			tabBarLabel:<Text style={{fontWeight:'bold'}}>Analysis</Text>,
			tabBarColor:'#50a334',
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
