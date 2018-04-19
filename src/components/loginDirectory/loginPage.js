import React from 'react';
import {Text, View, TextInput, TouchableOpacity, Alert} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Spinner from 'react-native-loading-spinner-overlay';
import fetch from "react-native-cancelable-fetch";

export default class LoginPage extends React.Component {

    constructor() {
        super();
        this.state = {
            mobileNo: "",
            spinnerVisible:false,
            fetchFlag:false
        }
    }

    getMobileNumber() {
        if(this.state.mobileNo!==""&&this.state.mobileNo.length===10) {
            this.setState({spinnerVisible: true,fetchFlag:true});
            fetch("http://192.168.1.29:8081/Daycare/centerdirector/loginAuthenticationOfCenterDirector", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    mobileNumber: this.state.mobileNo
                })
            },1)
                .then((response) => response.json())
                .then((response) => {
                    this.setState({spinnerVisible: false,fetchFlag:false});
                    if (response.statusCode !== 200) {
                        setTimeout(() => {
                            Alert.alert("Error", "We faced some issue regarding your request. Please try again!")
                        });
                    } else {
                        this.props.navigation.navigate("OTPConfirmationPage", {mobileNo: this.state.mobileNo});
                    }
                })
                .catch(() => {
                    this.setState({spinnerVisible: false,fetchFlag:false});
                    setTimeout(() => {
                        Alert.alert("Error", "Network error! Please try again")
                    });
                });
            setTimeout(()=>{
                fetch.abort(1);
                this.setState({spinnerVisible: false});
                if(this.state.fetchFlag)
                    setTimeout(()=>{Alert.alert("Error", "Network error! Please connect to internet.")});
                this.setState({fetchFlag:false});
            },10000);
        }
        else{
            Alert.alert("Input error","Please enter a valid phone number");
        }
    }

    render() {
        return (
            <View style={{flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "rgb(66, 176, 244)"}}>
                <Spinner visible={this.state.spinnerVisible} textContent={"Loading..."} textStyle={{color: '#FFF'}} />
                <View style={{width:300, alignItems: "center", justifyContent: "center",}}>
                    <FontAwesome
                        name="user"
                        size={150}
                        style={{color: "#ffffff"}}
                    />
                            <TextInput
                                style={{padding: 10,width:300,marginTop:20, borderWidth: 1, borderRadius: 5, borderColor: "#ffffff",color:"#ffffff"}}
                                placeholder="enter mobile number"
                                placeholderTextColor="#ffffff"
                                autoCorrect={false}
                                onChangeText={(mobileNo) => {
                                    this.setState({mobileNo: mobileNo})
                                }}
                            />
                    <TouchableOpacity
                        style={{alignItems:"center",justifyContent:"center",width:300,height:40,backgroundColor:"#3467fd",borderRadius:5,marginTop:30}}
                        onPress={() => {
                            this.getMobileNumber();
                        }}
                    >
                        <Text style={{color:"#ffffff",fontSize:18}}>Next</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}