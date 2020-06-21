import React,{useEffect} from 'react';
import axios from 'axios';
import {View,ScrollView,Dimensions,StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {Surface,Text,Button} from 'react-native-paper';
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
	const [countryStats,setCountryStats]=React.useState({});
	const [countryHistory,setCountryHistory]=React.useState({});
	const [temp,setTemp]=React.useState({})
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

	
	const [loadFailed,setLoadFailed]=React.useState(false)

	useEffect(()=>{
		initialLoad()

	},[])

	

	useEffect(()=>{
	

		if(Object.keys(countryStats).length>0){
		

		

		const latestCase=countryStats;

	
	
		
		setConfirmed(latestCase.cases);
		setConfirmedRate(latestCase.todayCases)
		setRecovered(latestCase.recovered);
		setRecoveredRate(latestCase.todayRecovered)

		setDeaths(latestCase.deaths);
		setDeathRate(latestCase.todayDeaths)
		setActive(latestCase.active);
		setActiveRate(latestCase.todayCases-latestCase.todayRecovered-latestCase.todayDeaths)

		setLastUpdated(new Date(countryStats.updated).toISOString().substring(0,10))
		

			

		}
	

	},[countryStats])

	async function initialLoad(){
		setPageLoading(true)
		const storedData=await AsyncStorage.getItem('countries')
		if(storedData){
			setPageLoading(false)
			setCountries(JSON.parse(storedData))
			setSelected(JSON.parse(storedData)[0].code)
			setDataLoading(true)
			changeSelected(JSON.parse(storedData)[0].code)
		}
		else{
		axios.get('https://api.printful.com/countries')                                                     .then((res)=>{                                            setPageLoading(false)
		setCountries(res.data.result)

		AsyncStorage.setItem('countries',JSON.stringify(res.data.result))
		changeSelected(res.data.result[0].code)
         	},(err)=>{
			setPageLoading(false)
			setLoadFailed(true)                       })                                                .catch(err=>{
			setPageLoading(false)
			setLoadFailed(true)                       })                                                                                                  }                                                                                                 }




	function changeSelected(value){


		setSelected(value)
		setCountryStats({})
		setTemp({})
		setDataLoading(true)
	        setUnavailable(false)
		setLoadFailed(false)

		if(cancel){
			
			cancel()
			
		}

		const url2=`https://corona.lmao.ninja/v2/historical/${value}?lastdays=30`;
		const url1=`https://corona.lmao.ninja/v2/countries/${value}?yesterday=true`

		const req1=axios.get(url1)
		
		axios.all([req1],
		{cancelToken: new CancelToken(function executor(c) {cancel = c;})})
		.then((([...res])=>{      
		
			setDataLoading(false)
			if(!res[0].data.country){
				setUnavailable(true)}else{setUnavailable(false)}
			

			setCountryStats(res[0].data)
			
			
			
		}))
		.catch(err=>{
			setLoadFailed(true)
			setDataLoading(false)
		})

		axios.get(url2)
		.then(res=>{
		    setTemp(res.data)
			
		})
		.catch(err=>{
		
		});
		
	}

	function reloadPage(){
		setLoadFailed(false)
		if(countries.length===0){
			
			initialLoad()
		}
		else{
		
			changeSelected(selected)
		}
	}

		
	return(
	   <View style={{flex:1,height:Dimensions.get('screen').height+500}}>

		{loadFailed?
		<View style={{alignItems:'center',justifyContent:'center',padding:20}}>

		<Text style={{textAlign:'center'}}>Failed to load due to either of the following reasons - No Internet Connectivity / No covid cases present in the selected country</Text>
		<Button style={{marginTop:10,width:150}} mode='contained' onPress={reloadPage}>Retry</Button>
		</View>
		:null}

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


                     <Picker.Item label={each.name} value={each.code} key={each.code} />
			
                ))}
                  </Picker>
                 </Item>
		</Form>
		:
		null
		}
		{Object.keys(countryStats).length>1?<Text style={{color:"#555555",marginLeft:15,fontSize:10}}>Last Updated - {lastUpdated}</Text>:null}

		<ActivityIndicator animating={dataLoading} color={Colors.red800} style={{marginTop:dataLoading===true?Dimensions.get('window').height/4:0}}/>

		{unavailable===true?                                      <Text style={{textAlign:'center',fontStyle:'italic'}}>Data unavailable at the moment. Try a different country!</Text>                                                              :null}
  
		
		{Object.keys(countryStats).length>1?
		<>
		 <View style={{flex:1,marginTop:10,marginBottom:15,flexDirection:'row',justifyContent:'space-around',alignItems:'center'}}>
				
			
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

				{Object.keys(temp).length>0?
					<View style={{marginLeft:10,marginTop:10}}><WorldCharts data={temp.timeline}/></View>:
					Object.keys(temp).length===0&&Object.keys(countryStats).length>1?
					<Text style={{marginTop:36,fontWeight:'bold',fontSize:20,textAlign:'center'}}>No Historical Data</Text>:
					null}



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
		width:Dimensions.get('window').width/3,
		alignItems:'center',
		justifyContent:'center'
	}
})


export default withTheme(WorldComponent)
