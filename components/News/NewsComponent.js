import React,{useState} from 'react';
import axios from 'axios'
import {View,ScrollView,Image,Linking} from 'react-native';

import { Button, Card, Title, Paragraph,Text,ActivityIndicator,Colors } from 'react-native-paper';

export default function NewsComponent(props){

	const [news,setNews]=useState({})
	const [loadInitializer,setLoadInitializer]=useState(false);
	const [loadFailed,setLoadFailed]=useState(false)
	const [pageLoading,setPageLoading]=useState(false)
	
	
	let i=0;

	React.useEffect(()=>{

		setPageLoading(true)

		setLoadFailed(false)

		const unmount=axios.get('http://newsapi.org/v2/top-headlines?country=in&apiKey=00ff71bc285f4bc98e2047bb2feba279&q=covid')
		
		
		.then(res=>{
			setPageLoading(false)
		
		       setNews(res.data.articles)

		},(err)=>{setLoadFailed(true)})
		.catch(err=>{
			setLoadFailed(true)
		})

		return ()=>unmount
	},[loadInitializer])

	function reloadPage(){
		setLoadFailed(false)
		setPageLoading(false)
		setLoadInitializer(!loadInitializer)
	}



	return(
		<ScrollView style={{flex:1,marginTop:10,marginRight:10,marginLeft:10}}>

		{loadFailed?
		<View style={{alignItems:'center',justifyContent:'center',padding:20}}>
		<Text style={{textAlign:'center'}}>Failed to load. Make sure you are connected to the Internet and Retry</Text>
		<Button style={{marginTop:10,width:150}} mode='contained' onPress={reloadPage}>Retry</Button>
		</View>
		:null}
		
		{news.length>0?

			news.map(each=>(

		   <Card key={each.title} style={{marginBottom:20,backgroundColor:'#e3e3e3'}}>
                     
				<Card.Cover source={{uri: each.urlToImage}} />
				
                      <Card.Content style={{marginTop:10}}>
                        <Title>{each.title}</Title>
                        <Paragraph>{each.description}</Paragraph>
                      </Card.Content>
                     

                     <Card.Actions>
                        <Button onPress={()=>Linking.openURL(each.url)}>Read More</Button>

                     </Card.Actions>
                </Card>


			))

			:

			<ActivityIndicator style={{marginTop:150}} animating={pageLoading} color={Colors.red800}/>
		}
		
		</ScrollView>
	)
}
