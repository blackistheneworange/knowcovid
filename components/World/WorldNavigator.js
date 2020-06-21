import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import WorldComponent from './WorldComponent';

const Stack=createStackNavigator();

export default function WorldNavigator(props){
	return(
		
		<Stack.Navigator>
		<Stack.Screen name='World' component={WorldComponent} options={{
			headerTintColor:'#fff',
			headerLeft:()=>(
				<Icon name='menu' size={24} color='#fff' style={{marginTop:5,marginLeft:15}} onPress={()=>props.navigation.toggleDrawer()}/>
			),
			headerStyle:{
				backgroundColor:'#6bbf99'
			}
		}}
		/>
		</Stack.Navigator>
		
	)
}

