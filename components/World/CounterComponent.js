import React from 'react';
import CountUp from 'react-native-countup';


export default function CounterComponent(props){

	return(
		<CountUp value={props.value} formatter={(val)=>{return parseInt(val)}}/>
	)
}
