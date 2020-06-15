import React from 'react';

import {NavigationContainer} from '@react-navigation/native';

import MainDrawerNavigator from './MainDrawerNavigator';

export default function MainComponent(){
	return(
		<NavigationContainer>
		  <MainDrawerNavigator/>
		</NavigationContainer>
	)
}
