import React, { Component } from 'react';
import {Text,View,TouchableOpacity,TextInput,ScrollView,ImageBackground,Alert,Image} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';
import Spinner from 'react-native-loading-spinner-overlay';
import PhotoUpload from 'react-native-photo-upload';
import fetch from "react-native-cancelable-fetch";


export default class Profile extends Component{

    static navigationOptions = {
        drawerLabel: () => null
    };

    constructor(props) {
        super(props);
        this.state = {
            directorName: this.props.screenProps.directorDetails.directorName,
            mobileNo: this.props.screenProps.directorDetails.mobileNumber,
            emailId: this.props.screenProps.directorDetails.email,
            building: this.props.screenProps.directorDetails.address1,
            road: this.props.screenProps.directorDetails.address2,
            area: this.props.screenProps.directorDetails.address3,
            city: this.props.screenProps.directorDetails.city,
            state: this.props.screenProps.directorDetails.state,
            pincode: this.props.screenProps.directorDetails.pincode,
            country: this.props.screenProps.directorDetails.country,
            photo: props.screenProps.photo,
            spinnerVisible: false,
            fetchFlag:false,
            directorDetails: this.props.screenProps.directorDetails
        };
        console.log(this.props.screenProps.directorDetails);
    }

    updateProfile(){
        this.props.screenProps.setPhoto(this.state.photo);
        this.setState({spinnerVisible:true,fetchFlag:true});
        fetch("http://192.168.1.19:8081/Daycare/centerdirector/updateCenterDirectorDetails",{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "mobileNumber":this.state.mobileNo,
                "directorName":this.state.directorName,
                "email":this.state.emailId,
                "address1":this.state.building,
                "address2":this.state.road,
                "address3":this.state.area,
                "city":this.state.city,
                "state":this.state.state,
                "pincode":this.state.pincode,
                "country":this.state.country
            })
        },1)
            .then((response)=>response.json())
            .then((response)=>{
                this.setState({spinnerVisible:false,fetchFlag:false});
                if(response.statusCode===200){
                    setTimeout(()=>{Alert.alert("Update status","Profile updated successfully!")});
                    this.props.screenProps.updateDirectorDetailsAsyncStorage(response.data[0]);
                }
                else{
                    setTimeout(()=>{Alert.alert("Update status","Unable to update, provide all the details.")})
                }
            })
            .catch(() => {
                this.setState({spinnerVisible: false,fetchFlag:false});
                setTimeout(()=>{Alert.alert("Error", "Network error! Please try again")});
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
        return (
            <ImageBackground
                style={{flex:1,width:"100%",height:"100%"}}
                source={require("../../../assets/pencil.jpg")}
                blurRadius={10}
            >
                <Spinner visible={this.state.spinnerVisible} textContent={"Loading..."} textStyle={{color: '#FFF'}} />
                <View style={{flex:1,flexDirection:"row",justifyContent:"space-around",alignItems:"center",backgroundColor:"rgba(244, 191, 66,0)"}}>
                    <View style={{flex:1,justifyContent:"space-around",alignItems:"center"}}>
                        <TouchableOpacity
                            onPress={()=>{this.props.navigation.navigate("DrawerOpen")}}
                        >
                            <Feather
                                name="menu"
                                size={30}
                                style={{color: "#ffffff"}}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={{flex:5,alignItems:"center",justifyContent:"center"}}>
                        <Text style={{color:"#ffffff",fontSize:25}}>Profile</Text>
                    </View>
                    <View style={{flex:1}}>
                        <TouchableOpacity
                            onPress={()=>{this.props.navigation.navigate("Home")}}
                        >
                            <Entypo
                                name="home"
                                size={30}
                                style={{color: "#ffffff"}}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{flex:10,width:"100%",height:"100%",alignItems:"center",paddingLeft:"5%",paddingRight:"5%"}}>
                    <ScrollView
                        style={{width:"100%",height:"100%",paddingTop:"5%"}}
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={{flexDirection:"row",alignItems:"center"}}>
                            <Text style={{flex:2,color:"#fff"}}>Director name:</Text>
                            <View style={{flex:4}}>
                                <TextInput
                                    style={{padding:10,borderWidth:0.5,borderRadius:5,color:"#fff",borderColor:"#fff"}}
                                    placeholder="Enter director name"
                                    placeholderTextColor="rgba(0,0,0,0.5)"
                                    autoCorrect={false}
                                    autoCapitalize={"words"}
                                    value={this.state.directorName}
                                    onChangeText={(directorName)=>{this.setState({directorName:directorName})}}
                                />
                            </View>
                        </View>
                        <View style={{flexDirection:"row",alignItems:"center",marginTop:"5%"}}>
                            <Text style={{flex:2,marginBottom:5,color:"#fff"}}>Mobile number:</Text>
                            <View style={{flex:4}}>
                                <TextInput
                                    style={{padding:10,borderWidth:0.5,borderRadius:5,color:"#fff",borderColor:"#fff"}}
                                    placeholder="Enter mobile number"
                                    placeholderTextColor="rgba(0,0,0,0.5)"
                                    autoCorrect={false}
                                    value={this.state.mobileNo}
                                    onChangeText={(mobileNo)=>{this.setState({mobileNo:mobileNo})}}
                                />
                            </View>
                        </View>
                        <View style={{flexDirection:"row",alignItems:"center",marginTop:"5%"}}>
                            <Text style={{flex:2,marginBottom:5,color:"#fff"}}>EmailId:</Text>
                            <View style={{flex:4}}>
                                <TextInput
                                    style={{padding:10,borderWidth:0.5,borderRadius:5,color:"#fff",borderColor:"#fff"}}
                                    placeholder="Enter emailId"
                                    placeholderTextColor="rgba(0,0,0,0.5)"
                                    autoCorrect={false}
                                    autoCapitalize={"none"}
                                    value={this.state.emailId}
                                    onChangeText={(emailId)=>{this.setState({emailId:emailId})}}
                                />
                            </View>
                        </View>
                        <View style={{flexDirection:"row",alignItems:"center",marginTop:"5%"}}>
                            <Text style={{flex:2,marginBottom:5,color:"#fff"}}>Building:</Text>
                            <View style={{flex:4}}>
                                <TextInput
                                    style={{padding:10,borderWidth:0.5,borderRadius:5,color:"#fff",borderColor:"#fff"}}
                                    placeholder="Enter building details"
                                    placeholderTextColor="rgba(0,0,0,0.5)"
                                    autoCorrect={false}
                                    value={this.state.building}
                                    onChangeText={(building)=>{this.setState({building:building})}}
                                />
                            </View>
                        </View>
                        <View style={{flexDirection:"row",alignItems:"center",marginTop:"5%"}}>
                            <Text style={{flex:2,marginBottom:5,color:"#fff"}}>Road:</Text>
                            <View style={{flex:4}}>
                                <TextInput
                                    style={{padding:10,borderWidth:0.5,borderRadius:5,color:"#fff",borderColor:"#fff"}}
                                    placeholder="Enter road name"
                                    placeholderTextColor="rgba(0,0,0,0.5)"
                                    autoCorrect={false}
                                    value={this.state.road}
                                    onChangeText={(road)=>{this.setState({road:road})}}
                                />
                            </View>
                        </View>
                        <View style={{flexDirection:"row",alignItems:"center",marginTop:"5%"}}>
                            <Text style={{flex:2,marginBottom:5,color:"#fff"}}>Area:</Text>
                            <View style={{flex:4}}>
                                <TextInput
                                    style={{padding:10,borderWidth:0.5,borderRadius:5,color:"#fff",borderColor:"#fff"}}
                                    placeholder="Enter area name"
                                    placeholderTextColor="rgba(0,0,0,0.5)"
                                    autoCorrect={false}
                                    value={this.state.area}
                                    onChangeText={(area)=>{this.setState({area:area})}}
                                />
                            </View>
                        </View>
                        <View style={{flexDirection:"row",alignItems:"center",marginTop:"5%"}}>
                            <Text style={{flex:2,marginBottom:5,color:"#fff"}}>City</Text>
                            <View style={{flex:4}}>
                                <TextInput
                                    style={{padding:10,borderWidth:0.5,borderRadius:5,color:"#fff",borderColor:"#fff"}}
                                    placeholder="Enter city name"
                                    placeholderTextColor="rgba(0,0,0,0.5)"
                                    autoCorrect={false}
                                    value={this.state.city}
                                    onChangeText={(city)=>{this.setState({city:city})}}
                                />
                            </View>
                        </View>
                        <View style={{flexDirection:"row",alignItems:"center",marginTop:"5%"}}>
                            <Text style={{flex:2,marginBottom:5,color:"#fff"}}>State:</Text>
                            <View style={{flex:4}}>
                                <TextInput
                                    style={{padding:10,borderWidth:0.5,borderRadius:5,color:"#fff",borderColor:"#fff"}}
                                    placeholder="Enter state name"
                                    placeholderTextColor="rgba(0,0,0,0.5)"
                                    autoCorrect={false}
                                    value={this.state.state}
                                    onChangeText={(state)=>{this.setState({state:state})}}
                                />
                            </View>
                        </View>
                        <View style={{flexDirection:"row",alignItems:"center",marginTop:"5%"}}>
                            <Text style={{flex:2,marginBottom:5,color:"#fff"}}>Pin code:</Text>
                            <View style={{flex:4}}>
                                <TextInput
                                    style={{padding:10,borderWidth:0.5,borderRadius:5,color:"#fff",borderColor:"#fff"}}
                                    placeholder="Enter pin code"
                                    placeholderTextColor="rgba(0,0,0,0.5)"
                                    autoCorrect={false}
                                    value={this.state.pincode}
                                    onChangeText={(pincode)=>{this.setState({pincode:pincode})}}
                                />
                            </View>
                        </View>
                        <View style={{flexDirection:"row",alignItems:"center",marginTop:"5%"}}>
                            <Text style={{flex:2,marginBottom:5,color:"#fff"}}>Country:</Text>
                            <View style={{flex:4}}>
                                <TextInput
                                    style={{padding:10,borderWidth:0.5,borderRadius:5,color:"#fff",borderColor:"#fff"}}
                                    placeholder="Enter country"
                                    placeholderTextColor="rgba(0,0,0,0.5)"
                                    autoCorrect={false}
                                    value={this.state.country}
                                    onChangeText={(country)=>{this.setState({country:country})}}
                                />
                            </View>
                        </View>
                        <View style={{flexDirection:"row",marginTop:"5%",alignItems:"center"}}>
                            <Text
                                style={{fontSize:15,color:"#fff"}}
                            >  Upload Photo</Text>
                            <PhotoUpload
                                onPhotoSelect={avatar => {
                                    if (avatar) {
                                        this.setState({photo:{uri:`data:image/JPG;base64,${avatar}`}});
                                    }
                                }}
                            >
                                <Image
                                    style={{
                                        marginLeft:"10%",
                                        width: 120,
                                        height: 120,
                                        borderRadius: 60
                                    }}
                                    resizeMode='cover'
                                    source={this.state.photo}
                                />
                            </PhotoUpload>
                        </View>
                        <View style={{alignItems:"center",marginTop:"5%",width:"100%"}}>
                            <TouchableOpacity
                                style={{backgroundColor:"rgba(255,255,255,0.5)",width:"100%",height:50,justifyContent:"center",alignItems:"center",borderRadius:5,marginBottom:"10%"}}
                                onPress={()=>{this.updateProfile()}}
                                blurRadius={10}
                            >
                                <Text style={{color:"#ffffff",fontSize:20}}>Update profile</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </ImageBackground>
        )
    }
}