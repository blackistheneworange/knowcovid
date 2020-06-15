import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import AnalysisComponent from './AnalysisComponent';

const Stack=createStackNavigator();

export default function AnalysisNavigator(props){
	return(
		
		<Stack.Navigator>
		<Stack.Screen name='Analysis' component={AnalysisComponent} options={{
			headerTintColor:'#fff',
			headerLeft:()=>(
				<Icon name='menu' size={24} color='#fff' style={{marginTop:5,marginLeft:15}} onPress={()=>props.navigation.toggleDrawer()}/>
			),
			headerStyle:{
				backgroundColor:'#50a334'
			}
		}}
		/>
		</Stack.Navigator>
		
	)
}

