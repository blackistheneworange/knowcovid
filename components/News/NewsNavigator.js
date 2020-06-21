import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import NewsComponent from './NewsComponent';

const Stack=createStackNavigator();

export default function NewsNavigator(props){
	return(
		
		<Stack.Navigator>
		<Stack.Screen name='News' component={NewsComponent} options={{
			headerTintColor:'#fff',
			headerStyle:{
				backgroundColor:'#2dbccf'
			},
			headerLeft:()=>(
				<Icon name='menu' size={24} color='#fff' style={{marginLeft:15,marginTop:5}} onPress={()=>props.navigation.toggleDrawer()}/>)
		}}
		/>
		</Stack.Navigator>
		
	)
}

