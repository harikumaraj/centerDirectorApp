import React, { Component } from 'react';
import {Text,View,TouchableOpacity,ImageBackground} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default class Report extends Component{
    static navigationOptions = {
        drawerLabel: () => null
    }
    render(){
        return (
            <ImageBackground
                style={{flex:1,width:"100%",height:"100%"}}
                source={require("../../../assets/pencil.jpg")}
                blurRadius={10}
            >
                <View style={{flex:1,flexDirection:"row",justifyContent:"space-around",alignItems:"center"}}>
                    <TouchableOpacity
                        style={{flex:1,height:"100%",width:"100%",justifyContent:"space-around",alignItems:"center"}}
                        onPress={()=>{this.props.navigation.navigate("Home")}}
                    >
                        <Ionicons
                            name="ios-arrow-back"
                            size={30}
                            style={{color: "#ffffff"}}
                        />
                    </TouchableOpacity>
                    <View style={{flex:5,alignItems:"center",justifyContent:"center"}}>
                        <Text style={{color:"#ffffff",fontSize:25}}>Report</Text>
                    </View>
                    <View style={{flex:1}}></View>
                </View>
                <View style={{flex:10,width:"100%",height:"100%"}}>
                </View>
            </ImageBackground>
        )
    }
}