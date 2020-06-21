import React,{useEffect} from 'react';
import axios from 'axios';
import {View,ScrollView,Dimensions,StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {Surface,Text} from 'react-native-paper';
import {Container,Content,Form,Item,Picker} from 'native-base';
import CountUp from './CounterComponent';

import WorldCharts from './WorldCharts';

import {withTheme,ActivityIndicator,Colors} from 'react-native-paper';

import Icon from 'react-native-vector-icons/Entypo'

const CancelToken = axios.CancelToken;
let cancel;



function WorldComponent(props){

	

	const [countries,setCountries]=React.useState([]);
	const [selected,setSelected]=React.useState("");
	const [countryStats,setCountryStats]=React.useState([]);
	const [confirmed,setConfirmed]=React.useState(0)
	const [confirmedRate,setConfirmedRate]=React.useState(0)
	const [recovered,setRecovered]=React.useState(0)
	const [recoveredRate,setRecoveredRate]=React.useState(0)
	const [pageLoading,setPageLoading]=React.useState(false)
	const [dataLoading,setDataLoading]=React.useState(false)
	const [unavailable,setUnavailable]=React.useState(false)
	const [active,setActive]=React.useState(0)       
	const [activeRate,setActiveRate]=React.useState(0)

	const [deaths,setDeaths]=React.useState(0)
        const [deathRate,setDeathRate]=React.useState(0)
	const [lastUpdated,setLastUpdated]=React.useState(Date)

	useEffect(()=>{

	   async function initialLoad(){

	    setPageLoading(true)

	   const storedData=await AsyncStorage.getItem('countries')
		if(storedData){
			setPageLoading(false)
			setCountries(JSON.parse(storedData))
			setSelected(JSON.parse(storedData)[10].Slug)
			
			setDataLoading(true)
			changeSelected(JSON.parse(storedData)[10].Slug)
		

		}
		else{
		
	
		axios.get('https://api.covid19api.com/countries')
		.then((res)=>{
			setPageLoading(false)
			
			
			setCountries(res.data.sort((a,b)=>{return b.Country<a.Country?1:-1}))

			
		        AsyncStorage.setItem('countries',JSON.stringify(res.data.sort((a,b)=>{return b.Country<a.Country?1:-1})))

			
			setSelected(res.data.sort((a,b)=>{return b.Country<a.Country?1:-1})[10].Slug)
			changeSelected(res.data.sort((a,b)=>{return b.Country<a.Country?1:-1})[10].Slug)


		},(err)=>{
		alert(err)
		})
		.catch(err=>{
			alert(err)
		})

		}

	   }

		

		initialLoad()
	

	    
	//	return ()=>unmount;
	},[])

	useEffect(()=>{
	

		if(countryStats.length>0){
		

		

		const latestCase=countryStats[countryStats.length-1];
		const previousCase=countryStats[countryStats.length-2];
		
		
		setConfirmed(latestCase.Confirmed);
		setConfirmedRate(latestCase.Confirmed-previousCase.Confirmed)
		setRecovered(latestCase.Recovered);
		setRecoveredRate(latestCase.Recovered-previousCase.Recovered)

		setDeaths(latestCase.Deaths);
		setDeathRate(latestCase.Deaths-previousCase.Deaths)
		setActive(latestCase.Active);
		setActiveRate(latestCase.Active-previousCase.Active)

		setLastUpdated(new Date(latestCase.Date).toISOString().substring(0,10))

			

		}
	

	},[countryStats])

	function changeSelected(value){


		setSelected(value)
		setCountryStats([])
		setDataLoading(true)
	        setUnavailable(false)

		if(cancel){
			
			cancel()
			
		}
		
		axios.get(`https://api.covid19api.com/country/${value}?from=${new Date(new Date().setDate(new Date().getDate()-30)).toISOString().substring(0,10)}&to=${new Date(new Date()).toISOString().substring(0,10)}`,
		{cancelToken: new CancelToken(function executor(c) {cancel = c;})})
		.then((res)=>{      
			
			setDataLoading(false)
			if(res.data.length===0){
				setUnavailable(true)}else{setUnavailable(false)}
			setCountryStats(res.data)
			
			
		})
		.catch(err=>{
		})
		
	}


		
	return(
	   <View style={{flex:1,height:Dimensions.get('screen').height+500}}>
		<Container>

		<Content>
		<ActivityIndicator animating={pageLoading} color={Colors.red800} style={{marginTop:pageLoading?Dimensions.get('window').height/4:0}}/>

		
		
		{countries.length>0?
		<Form>
		<Text style={{color:"#030303",marginTop:10,marginLeft:10}}>Select a country</Text>
		<Item picker style={{marginLeft:10,marginRight:10}}>
                   <Picker
                      mode="dropdown"
                      iosIcon={<Icon name="arrow-down" />}
                       style={{ width: undefined }}
                       
	                selectedValue={selected}
			
			onValueChange={(value,)=>{changeSelected(value)}}
                   >
			

		    {countries.map((each)=>(


                     <Picker.Item label={each.Country} value={each.Slug} key={each.Slug} />
			
                ))}
                  </Picker>
                 </Item>
		</Form>
		:
		null
		}
		{countryStats.length>0?<Text style={{color:"#555555",marginLeft:15,fontSize:10}}>Last Updated - {lastUpdated}</Text>:null}

		<ActivityIndicator animating={dataLoading} color={Colors.red800} style={{marginTop:dataLoading===true?Dimensions.get('window').height/4:0}}/>

		{unavailable===true?                                      <Text style={{textAlign:'center',fontStyle:'italic'}}>Data unavailable at the moment. Try a different country!</Text>                                                              :null}
  
		
		{countryStats.length>0?
		<>
		 <View style={{flex:1,margin:10,flexDirection:'row',justifyContent:'space-around',alignItems:'center'}}>
			
			<Surface style={styles.surface}>
				<Text style={{fontSize:16,textDecorationLine:'underline'}}>Confirmed</Text>
				<Text style={{textAlign:'center',fontSize:26,fontFamily:'monospace'}}><CountUp value={confirmed}/></Text>
				<Text style={{textAlign:'center',fontSize:14,color:confirmedRate>0?'red':'green'}}>{confirmedRate>=0?'+ ':null}<CountUp value={confirmedRate}/></Text>
			</Surface>
			

			<Surface style={styles.surface}>
				<Text style={{fontSize:16,textDecorationLine:'underline'}}>Recovered</Text>
				<Text style={{textAlign:'center',fontSize:26,fontFamily:'monospace'}}><CountUp value={recovered}/></Text>
				<Text style={{textAlign:'center',fontSize:14,color:recoveredRate<0?'red':'green'}}>{recoveredRate>=0?'+ ':null}<CountUp value={recoveredRate}/></Text>
			 
			</Surface>
		</View>

		<View style={{flex:1,alignItems:'center',justifyContent:'space-around',flexDirection:'row'}}>

			<Surface style={styles.surface}>
				<Text style={{fontSize:16,textDecorationLine:'underline'}}>Active</Text>
				<Text style={{textAlign:'center',fontSize:26,fontFamily:'monospace'}}><CountUp value={active}/></Text>
				<Text style={{textAlign:'center',fontSize:14,color:activeRate>0?'red':'green'}}>{activeRate>=0?'+ ':null}<CountUp value={activeRate}/></Text>
			</Surface>

			<Surface style={styles.surface}>
				<Text style={{fontSize:16,textDecorationLine:'underline'}}>Deaths</Text>
				<Text style={{textAlign:'center',fontSize:26,fontFamily:'monospace'}}><CountUp value={deaths}/></Text>
				<Text style={{textAlign:'center',fontSize:14,color:deathRate>0?'red':'green'}}>{deathRate>=0?'+ ':null}<CountUp value={deathRate}/></Text>

			</Surface>
			
		</View>

	<View style={{marginLeft:10,marginRight:10}}><WorldCharts xAxis={countryStats.map(each=>(each.Date))} yAxis={countryStats.map(each=>(each))}/></View>

		</>
	:null}	
		
		</Content>

		</Container>
		</View>
		
		
	)

}

const styles=StyleSheet.create({
	surface:{
		elevation:4,
		padding:12,
		
		alignItems:'center',
		justifyContent:'center'
	}
})


export default withTheme(WorldComponent)
