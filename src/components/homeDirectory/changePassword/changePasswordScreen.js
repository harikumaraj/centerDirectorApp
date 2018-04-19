import React from 'react';
import {View,TextInput,Text,ActivityIndicator} from 'react-native';

export default class ChangePassword extends React.Component{

    constructor(){
        super();
        this.state={flag:true};
        setTimeout(()=>{this.setState({flag:false})},5000)
    }

    render(){
        return(
            <View style={{flex:1}}>
                <View style={{flex:1}}>
                </View>
                <View style={{flex:10}}>
            <View style={{flex:1,justifyContent:"center",alignItems:"center",backgroundColor:"#31df33"}}>
                <View style={{height:"40%",width:300,justifyContent:"center",alignItems:"center"}}>
                    <View style={{flex:1,flexDirection:"row",alignItems:"center"}}>
                        <Text style={{flex:1}}>
                            Old password:
                        </Text>
                        <View style={{flex:2,borderWidth:1,borderRadius:5,height:40}}>
                            <TextInput
                                style={{padding:10}}
                                placeholder="enter old password"
                            />
                        </View>
                    </View>
                    <View style={{flex:1,flexDirection:"row",alignItems:"center"}}>
                        <Text style={{flex:1}}>
                            New password:
                        </Text>
                        <View style={{flex:2,borderWidth:1,borderRadius:5,height:40}}>
                            <TextInput
                                style={{padding:10}}
                                placeholder="enter new password"
                            />
                        </View>
                    </View>
                    <View style={{flex:1,flexDirection:"row",alignItems:"center"}}>
                        <Text style={{flex:1}}>
                            Renter new password:
                        </Text>
                        <View style={{flex:2,borderWidth:1,borderRadius:5,height:40}}>
                            <TextInput
                                style={{padding:10}}
                                placeholder="enter new password again"
                            />
                        </View>
                    </View>
                </View>
            </View>
            </View>
            </View>
        )
    }
}