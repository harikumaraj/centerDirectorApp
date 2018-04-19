import React, { Component } from 'react';
import {Text,View,TouchableOpacity} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

export default class UpdateClassPage extends Component{
    static navigationOptions = {
    };
    render(){
        return (
            <View style={{flex:1}}>
                <View style={{flex:1,flexDirection:"row",justifyContent:"space-around",alignItems:"center",backgroundColor:"rgb(244, 191, 66)"}}>
                    <TouchableOpacity
                        style={{flex:1,height:"100%",width:"100%",justifyContent:"space-around",alignItems:"center"}}
                        onPress={()=>{this.props.navigation.navigate("DrawerOpen")}}
                    >
                        <Feather
                            name="menu"
                            size={30}
                            style={{color: "#ffffff"}}
                        />
                    </TouchableOpacity>
                    <View style={{flex:5,alignItems:"center",justifyContent:"center"}}>
                        <Text style={{color:"#ffffff",fontSize:20}}>Notifications</Text>
                    </View>
                    <View style={{flex:1}}></View>
                </View>
                <View style={{flex:10,width:"100%",height:"100%"}}>
                </View>
            </View>
        )
    }
}