import React,{useState,useEffect} from 'react';
import {View,StyleSheet,Picker,Dimensions,ScrollView} from 'react-native';
import axios from 'axios';

import CountUp from '../World/CounterComponent'
import HomeCharts from './HomeCharts';

import {Text,Colors,Surface,Divider,ActivityIndicator,Button} from 'react-native-paper';

function HomeComponent(props){

	const [stateSelected,setStateSelected]=useState('India');
	const [districtSelected,setDistrictSelected]=useState();
	const [stats,setStats]=useState([])
	const [countryStats,setCountryStats]=useState([])
	const [stateStats,setStateStats]=useState([])
	
	const [states,setStates]=useState([]);
	const [districts,setDistricts]=useState([]);
	const [helplineNumbers,setHelplineNumbers]=useState([])
	const [historyStats,setHistoryStats]=useState([])
	const [loadFailed,setLoadFailed]=useState(false)
	const [pageLoading,setPageLoading]=useState(false)
	const [dataLoading,setDataLoading]=useState(false)
	const [selected,setSelected]=useState()
	const [helpline,setHelpline]=useState({});

	const [confirmed,setConfirmed]=useState()
	const [recovered,setRecovered]=useState({
		all:0,today:0})
	const [active,setActive]=useState({
		all:0,today:0})
	const [deaths,setDeaths]=useState({
		all:0,today:0})

	useEffect(()=>{
		setLoadFailed(false)
		initialLoad()
	},[])

	  
        function initialLoad(){

	    setPageLoading(true)

	     const url1='https://api.covid19india.org/data.json'
	    const url2='https://api.covid19india.org/state_district_wise.json'

	    const req1=axios.get(url1)
	    const req2=axios.get(url2)

	     axios.all([req1,req2])
		.then(([...res])=>{
			
			setStates(Object.assign({},res[1].data))
			
			
			setPageLoading(false)
			setLoadFailed(false)
			setCountryStats(res[0].data.cases_time_series)
			setStats(res[0].data.cases_time_series)
			setStateStats(res[0].data.statewise)
			
			
	     })
	    .catch(err=>{
		    alert(err)
		    setPageLoading(false)
		    setLoadFailed(true)
		
	    })


	     axios.get('https://covid-19india-api.herokuapp.com/v2.0/helpline_numbers')
		.then(res=>{
			setLoadFailed(false)
			setHelplineNumbers(res.data)
		
			
			setHelpline({...helpline,helpline_number:res.data[1].helpline_number,helpline_email:res.data[1].helpline_email,toll_free:res.data[1].toll_free})
	      })
	      .catch(err=>{
	        //none	
	      })

		

	}

	useEffect(()=>{

		if(stats.length>0||Object.keys(stats).length>0){

		

		const latest=stats[stats.length-1]

		if(stateSelected!=='India' && districtSelected && districtSelected!=='All'){
			
		setConfirmed({...confirmed,all:stats.confirmed,today:0})
		setRecovered({...recovered,all:stats.recovered,today:0})
		setActive({...active,all:stats.active,today:0})
		setDeaths({...deaths,all:stats.deceased,today:0})
		}

		else if(stateSelected!=='India'){
			setConfirmed({...confirmed,all:stats.confirmed,today:0})
			setRecovered({...recovered,all:stats.recovered,today:0})
			setActive({...active,all:stats.active,today:0})
			setDeaths({...deaths,all:stats.deaths,today:0})
		}
		else{

		

		const latest=stats[stats.length-1]

		setConfirmed({...confirmed,all:latest.totalconfirmed,today:latest.dailyconfirmed})
		setRecovered({...recovered,all:latest.totalrecovered,today:latest.dailyrecovered})
		setDeaths({...deaths,all:latest.totaldeceased,today:latest.dailydeceased})
		setActive({...active,all:latest.totalconfirmed-latest.totalrecovered-latest.totaldeceased,today:0})

		setHistoryStats(stats)

		}

		
		
		}
	},[stats])

	function changeStateSelected(value){
		
		
		setHelpline({})
		setDistrictSelected('All')
		setStateSelected(value)

	     if(value==='India'){

		    
		     
		     setHelpline({...helpline,helpline_number:helplineNumbers[1].helpline_number,helpline_email:helplineNumbers[1].helpline_email,toll_free:helplineNumbers[1].toll_free})
		     setStats(countryStats)
		     
	     }
	     else{


		setHelpline(helplineNumbers[1].contact_details.filter(each=>each.state_or_UT===value)[0])

		setStats(stateStats.filter(each=>each.state===value)[0])

		setDistricts(states[value].districtData)
	     }


		
		
	}
        
	function changeDistrictSelected(value){
		setDistrictSelected(value)

		if(value!=='All'){
			const data=districts[value]
			setStats(data)
		}
		else{

			setStats(stateStats.filter(each=>each.state===stateSelected)[0])                                                                                            
		}



	}

        function reloadPage(){
		setLoadFailed(false)
		initialLoad()
	}


	return(
		<ScrollView>

		{pageLoading?
			<ActivityIndicator animating={pageLoading} color={Colors.red600} style={{marginTop:200}}/>
		:
		null}

		<View style={styles.container}>

		{loadFailed?
		<View style={{alignItems:'center',justifyContent:'center',padding:20}}>
		<Text style={{textAlign:'center'}}>Failed to load due to either of the following reasons - No Internet Connectivity / No covid cases present in the selected region</Text>
		<Button style={{marginTop:10,width:150}} mode='contained' onPress={reloadPage}>Retry</Button>
		</View>
		:null}

		
		{pageLoading?null
			:
		<>
	        <Text>Select a State (Within India)</Text>
		<Picker
		style={styles.pickerStyle}
		selectedValue={stateSelected}
		onValueChange={(value,index)=>changeStateSelected(value)}
		
		>
		 <Picker.Item style={{fontWeight:'bold'}} label='India' value='India'/>
		
		{Object.keys(states).length>0?
			Object.keys(states).map(each=>(
		
		 <Picker.Item key={each} label={each} value={each}/>
		
			))

		:null
		}

		
		</Picker>

		<View style={styles.pickerBorderStyle}></View>
		</>
		}
		


		{stateSelected===undefined?null
			:stateSelected==='India'?
			null:
		<>
		<Text style={{marginTop:10}}>Select a District</Text>
		<Picker
		style={styles.pickerStyle}
		selectedValue={districtSelected}
		onValueChange={(value,index)=>changeDistrictSelected(value)}
		>
		<Picker.Item label='All' value='All'/>
		{Object.keys(districts).map(each=>(
		<Picker.Item key={each} label={each} value={each}/>
		))}

		</Picker>
		<View style={styles.pickerBorderStyle}></View>
		</>

		}

	
		{confirmed?
		<>

		<View style={styles.dashboard1}>
			{[
				{
				daily:confirmed.today,
				total:confirmed.all,
				title:'Confirmed'
				},
				{
				daily:recovered.today,
				total:recovered.all,
				title:'Recovered'
				}
			].map(each=>(
		 

		  <Surface key={each.title} style={{...styles.surface,backgroundColor:each.title==='Confirmed'?'#cc3737':'#36a334'}}>

		  <Text style={styles.dashboard1Heading}>{each.title}</Text>
		  <Text style={styles.dashboard1Count}><CountUp value={each.total}/></Text>
		  <Text style={styles.dashboard1Increment}>{each.daily>=0?'+':''}<CountUp value={each.daily}/></Text>
		  </Surface>
		
			))}

		</View>

		<View style={styles.dashboard1}>

			{[
				{
				total:active.all,
				daily:0,
				title:'Active'
				},
				{
				daily:deaths.today,
				total:deaths.all,
				title:'Deaths'
				}
			].map(each=>(
				
			<Surface key={each.title} style={{...styles.surface,backgroundColor:each.title==='Active'?'#3287a8':'#5e5e5e'}}>
				<Text color={Colors.red600} style={{...styles.dashboard1Heading,color:'#fff'}}>{each.title}</Text>
				<Text style={styles.dashboard1Count}><CountUp value={each.total}/></Text>
				<Text style={styles.dashboard1Increment}>{each.daily>=0?'+':''}<CountUp value={each.daily}/></Text>
			</Surface>
			
			))}

		</View>

		{Object.keys(helpline).length>0?

		<>
		<Divider/>

		<Surface style={{elevation:4,width:Dimensions.get('screen').width-20,padding:10,alignItems:'center',justifyContent:'center',marginTop:25,marginRight:10}}>
			<Text style={{textDecorationLine:'underline'}}>Helpline Number</Text>
			<Text style={{fontStyle:'italic',fontFamily:'monospace'}}>{helpline.helpline_number}</Text>
			
			{helpline.helpline_email?
			<>
			<Text style={{textDecorationLine:'underline',marginTop:10}}>Helpline Email</Text>
			<Text style={{fontStyle:'italic',fontFamily:'monospace'}}>{helpline.helpline_email}</Text>
			</>
			:null}
			
		</Surface>
		</>

		:null}

		<HomeCharts data={historyStats}/>

		</>

		:
		null}
		

	    </View>
		</ScrollView>
	  
	)
}

const styles=StyleSheet.create({
	container:{
		flex:1,
		paddingTop:15,
	        marginLeft:10,
		width:Dimensions.get('screen').width-20,
		
		
	},
	pickerStyle:{
		height:40,
		
	},
	pickerBorderStyle:{
		borderBottomWidth:1,
		borderColor:'#000',
		width:Dimensions.get('screen').width-20
	},
	dashboard1:{
		
	       marginTop:25,
		flexDirection:'row',
	       alignItems:'center',	
		justifyContent:'space-around',
		
	},

	surface:{
		elevation:4,
		padding:10,
		width:Dimensions.get('screen').width/3,
		justifyContent:'center',
		alignItems:'center'
	},
	dashboard1Heading:{
		fontWeight:'bold',
		fontSize:16,
		color:'#fff'
	},
	dashboard1Count:{
		fontSize:26,
		fontFamily:'monospace',
		color:'#fff'
	},
	dashboard1Increment:{
		fontSize:14,
		color:'#fff'
	}
	
})

export default HomeComponent;
