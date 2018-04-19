import React from 'react';
import {AsyncStorage,View,TextInput,Text,TouchableOpacity,Alert} from 'react-native';
import { NavigationActions } from 'react-navigation';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Spinner from 'react-native-loading-spinner-overlay';
import fetch from "react-native-cancelable-fetch";

export default class OTPScreen extends React.Component{

    constructor(props){
        super(props);
        this.state={
            spinnerVisible:false,
            mobileNo:props.navigation.state.params.mobileNo,
            otp:0,
            fetchFlag:false
        };
    }

    componentDidMount(){
    }

    homeResetAction = NavigationActions.reset({
        index: 0,
        actions: [
            NavigationActions.navigate({ routeName: 'HomeRoot'})
        ]
    });

    loginPageResetAction = NavigationActions.reset({
        index: 0,
        actions: [
            NavigationActions.navigate({ routeName: 'LoginPage'})
        ]
    });

    setLoginFlag(){
        AsyncStorage.setItem("loginFlag",JSON.stringify(true));
    };


    setClearFlag(){
        AsyncStorage.setItem("clearFlag",JSON.stringify(true));
    }

    setDirectorDetails=(directorDetails)=>{
        AsyncStorage.setItem("directorDetails",JSON.stringify(directorDetails));
    };

    navigateToHome=()=>{
        this.props.navigation.dispatch(this.homeResetAction);
    };

    getOTP() {
        this.setState({spinnerVisible:true,fetchFlag:true});
        fetch("http://192.168.1.29:8081/Daycare/centerdirector/checkingOTPofCenterDirector", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                mobileNumber: this.state.mobileNo,
                otp:this.state.otp
            })
        })
            .then((response) => response.json())
            .then((response)=>{
                this.setState({spinnerVisible:false,fetchFlag:false});
                if(response.statusCode!==200){
                    setTimeout(()=>{Alert.alert("Error","Please enter valid OTP!")});
                }else{
                    this.setLoginFlag();
                    this.setClearFlag();
                    this.navigateToHome();
                    this.setDirectorDetails(response.data[0]);
                }
            })
            .catch(() => {
                this.setState({spinnerVisible: false,fetchFlag:false});
                setTimeout(()=>{Alert.alert("Error", "Network error! Please try again")},100);
            });
        setTimeout(()=>{
            fetch.abort(1);
            this.setState({spinnerVisible: false});
            if(this.state.fetchFlag)
                setTimeout(()=>{Alert.alert("Error", "Network error! Loaded data will be used or data not available.")});
            this.setState({fetchFlag:false});
        },10000);
    }

    render(){
        return(
            <View style={{flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "rgb(66, 176, 244)"}}>
                <Spinner visible={this.state.spinnerVisible} textContent={"Loading..."} textStyle={{color: '#FFF'}} />
                <View style={{width:300, alignItems: "center", justifyContent: "center"}}>
                    <FontAwesome
                        name="user-secret"
                        size={150}
                        style={{color: "#ffffff"}}
                    />
                    <TextInput
                        style={{padding: 10,width:300,marginTop:20, borderWidth: 1, borderRadius: 5, borderColor: "#ffffff",color:"#ffffff"}}
                        placeholder="enter OTP sent to you"
                        placeholderTextColor="#ffffff"
                        autoCorrect={false}
                        onChangeText={(otp) => {this.setState({otp: otp})}}
                    />
                    <View style={{flexDirection:"row"}}>
                        <TouchableOpacity
                            style={{alignItems:"center",justifyContent:"center",width:140,height:40,marginRight:10,backgroundColor:"#3467fd",borderRadius:5,marginTop:30}}
                            onPress={()=>{this.getOTP()}}
                        >
                            <Text style={{color:"#ffffff",fontSize:18}}>Validate</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{alignItems:"center",justifyContent:"center",width:140,marginLeft:10,height:40,backgroundColor:"#3467fd",borderRadius:5,marginTop:30}}
                            title="go back"
                            onPress={()=>{this.props.navigation.dispatch(this.loginPageResetAction)}}
                        >
                            <Text style={{color:"#ffffff",fontSize:18}}>Go back</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
}