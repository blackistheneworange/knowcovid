import {BarChart,LineChart,Grid,YAxis,XAxis} from 'react-native-svg-charts';
import React from 'react';
import {Dimensions,Text,View} from 'react-native'

import Icon from 'react-native-vector-icons/Entypo';
import {Form,Item,Picker} from 'native-base';
import {Divider,Button,Menu} from 'react-native-paper';

export default function WorldCharts(props){

	let i=0,j=0;

	const stats=props.data;

	const [selected,setSelected]=React.useState('Confirmed');

	const [values,setValues]=React.useState([])
	

	const [menuVisible,setMenuVisible]=React.useState(false)

	
	const fill=  'rgb(134, 65, 244)';
        let data = []
	const contentInset={top:20,bottom:20}

	React.useEffect(()=>{

		if(props.data.cases){

		setValues(Object.entries(props.data.cases).map(([key,value])=>(                         i===0?i++:value-Object.values(props.data.cases)[j++])))
		}

	},[])

	function changeSelected(value)
	{
		i=0,j=0;
		let k=0,l=0,m=0,n=0;
		setSelected(value)
		if(value==='Confirmed'){
	
		  setValues(Object.entries(stats.cases).map(([key,value])=>(                         i===0?i++:value-Object.values(stats.cases)[j++])))
		}
		else if(value==='Recovered'){
	
		
	         setValues(Object.entries(stats.recovered).map(([key,value])=>(                         i===0?i++:value-Object.values(stats.recovered)[j++])))
		}

		else{
			setValues(Object.entries(stats.deaths).map(([key,value])=>(                         i===0?i++:value-Object.values(stats.deaths)[j++])))
		}
		
	}

	function openMenu(){setMenuVisible(true)}
	function closeMenu(){setMenuVisible(false)}

	function handleMenuChange(val){
		closeMenu()
		changeSelected(val)
	}
 
        return (
	<View style={{marginTop:20,paddingBottom:75}}>
	  <Divider/>
	  <Text style={{color:"#030303",marginTop:10,marginLeft:10}}>Select a category</Text>
	  <Menu
            visible={menuVisible}
            onDismiss={closeMenu}
            anchor={
              <Button onPress={openMenu}>{selected+" "}<Icon name="arrow-down"/></Button>
            }
          >
            <Menu.Item onPress={(value) => {handleMenuChange('Confirmed')}} title="Confirmed" />
            <Menu.Item onPress={() => {handleMenuChange('Recovered')}} title="Recovered" />
            <Divider />
            
	   <Menu.Item onPress={()=>{handleMenuChange('Deaths')}} title='Deaths'/>
          </Menu>
	

	<View style={{flexDirection:'row'}}>
	 <YAxis
		svg={{fill:'grey',fontSize:10}}
		data={values}
		contentInset={contentInset}
		numberOfTicks={10}
		
        />
	<XAxis
                    style={{marginHorizontal:-10}}
                    data={[0]}
                    
                    contentInset={{ left: 10, right: 10 }}
                    svg={{ fontSize: 10, fill: 'black' }}
                />
         <BarChart 
		style={{marginLeft:20,height:200,width:Dimensions.get('screen').width-60}}
		data={values}
		svg={{ fill }}
		contentInset={contentInset}
		
	>
         <Grid />
        </BarChart>
	
	</View>
	<Text style={{textAlign:'right',marginRight:10,marginTop:-20,color:'#aaaaaa',fontSize:10}}>Based on the last 30 days</Text>
	</View>
        )
}
