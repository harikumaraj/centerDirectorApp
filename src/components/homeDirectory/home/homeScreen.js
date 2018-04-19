import React, { Component } from 'react';
import {View,TouchableOpacity,Text,ScrollView,Image,AsyncStorage,Alert,ImageBackground} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default class Home extends Component{

    constructor(){
        super();
        this.state={
            classList:[]
        };
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
                        onPress={()=>{this.props.navigation.navigate("DrawerOpen")}}
                    >
                        <Feather
                            name="menu"
                            size={30}
                            style={{color: "#ffffff"}}
                        />
                    </TouchableOpacity>
                    <View style={{flex:5,alignItems:"center",justifyContent:"center"}}>
                        <Text style={{color:"#ffffff",fontSize:25}}>Home</Text>
                    </View>
                    <View style={{flex:1}}></View>
                </View>
                <View style={{flex:10,width:"100%",height:"100%"}}>
                    <View style={{flex:1,flexDirection:"row",alignItems:"center",justifyContent:"center"}}>
                        <TouchableOpacity
                            style={{width:"50%",height:"100%",alignItems:"center",justifyContent:"center"}}
                            onPress={()=>{this.props.navigation.navigate("StudentList")}}
                        >
                            <Entypo
                                name="users"
                                size={100}
                                style={{color: "#ffffff"}}
                            />
                            <Text style={{color:"#ffffff",fontSize:18}}>Student list</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{width:"50%",height:"100%",alignItems:"center",justifyContent:"center"}}
                            onPress={()=>{this.props.navigation.navigate("ClassList")}}
                        >
                            <MaterialIcons
                                name="class"
                                size={110}
                                style={{color: "#ffffff"}}
                            />
                            <Text style={{color:"#ffffff",fontSize:18}}>Class list</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{flex:1,flexDirection:"row",alignItems:"center",justifyContent:"center"}}>
                        <TouchableOpacity
                            style={{width:"50%",height:"100%",alignItems:"center",justifyContent:"center"}}
                            onPress={()=>{this.props.navigation.navigate("AttendanceSheet")}}
                        >
                            <Feather
                                name="check"
                                size={110}
                                style={{color: "#ffffff"}}
                            />
                            <Text style={{color:"#ffffff",fontSize:18}}>Attendance sheet</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{width:"50%",height:"100%",alignItems:"center",justifyContent:"center"}}
                            onPress={()=>{this.props.navigation.navigate("AddStudents")}}
                        >
                            <Entypo
                                name="add-user"
                                size={100}
                                style={{color: "#ffffff"}}
                            />
                            <Text style={{color:"#ffffff",fontSize:18}}>Add student</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{flex:1,flexDirection:"row",marginTop:1,alignItems:"center",justifyContent:"center"}}>
                        <TouchableOpacity
                            style={{width:"50%",height:"100%",alignItems:"center",justifyContent:"center"}}
                            onPress={()=>{this.props.navigation.navigate("Report")}}
                        >
                            <MaterialCommunityIcons
                                name="format-list-bulleted-type"
                                size={100}
                                style={{color: "#ffffff"}}
                            />
                            <Text style={{color:"#ffffff",fontSize:18}}>Student's report</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{width:"50%",height:"100%",alignItems:"center",justifyContent:"center"}}
                            onPress={()=>{this.props.navigation.navigate("Holidays")}}
                        >
                            <Entypo
                                name="calendar"
                                size={100}
                                style={{color: "#ffffff"}}
                            />
                            <Text style={{color:"#ffffff",fontSize:18}}>Holidays</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ImageBackground>
        )
    }
}