import React, {Component} from 'react';
import {Text, View, TouchableOpacity, TextInput, ScrollView,Alert,ImageBackground} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import DateTimePicker from 'react-native-modal-datetime-picker';
import Spinner from 'react-native-loading-spinner-overlay';
import fetch from'react-native-cancelable-fetch'


export default class AddStudent extends Component {
    static navigationOptions = {
        drawerLabel: () => null
    };

    constructor(props){
        super(props);
        this.state={
            studentName:"",
            parentName:"",
            mobileNo:"",
            studentId:"",
            DOJ:"pick a date",
            directorId:props.screenProps.directorDetails.directorId,
            branchId:props.screenProps.directorDetails.branchId,
            classId:"",
            isDateTimePickerVisibleDOJ: false,
            spinnerVisible:false,
            parentFound:false,
            fetchFlag:false,
        };
    }

    returnValidDate(date){
        let tempDate=date.toString().substr(4,11);
        let day=tempDate.substr(4,2);
        let month=tempDate.substr(0,3);
        let year=tempDate.substr(7,4);
        let monthName=month;
        switch(month){
            case "Jan":month="01";break;
            case "Feb":month="02";break;
            case "Mar":month="03";break;
            case "Apr":month="04";break;
            case "May":month="05";break;
            case "Jun":month="06";break;
            case "Jul":month="07";break;
            case "Aug":month="08";break;
            case "Sep":month="09";break;
            case "Oct":month="10";break;
            case "Nov":month="11";break;
            case "Dec":month="12";break;
        }
        return {day,month,monthName,year};
    }

    dateTimePickerHandler={
        _showDateTimePickerDOJ: () => {this.setState({ isDateTimePickerVisibleDOJ: true })},
        _hideDateTimePickerDOJ: () => {this.setState({ isDateTimePickerVisibleDOJ: false })},
        _handleDatePickedDOJ: (date) => {
            let tempDate=this.returnValidDate(date);
            this.setState({
                DOJ:tempDate.day.concat("-",tempDate.monthName,"-",tempDate.year)
            });
            this.dateTimePickerHandler._hideDateTimePickerDOJ();
        }
    };

    saveStudentDetails() {
        if (this.state.mobileNo === "" || this.state.studentName === "" || this.state.parentName === "" || this.state.studentId==="" ||
            this.state.DOJ === "pick a date" || this.state.directorId === "" || this.state.branchId === "" || this.state.classId === "") {
            Alert.alert("Error", "Please fill in all the fields.");
        }
        else if(this.state.parentFound===false){
            this.setState({spinnerVisible: true,fetchFlag:true});
            fetch("http://192.168.1.19:8081/Daycare/centerdirector/saveParentsDetails", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "parentName": this.state.parentName,
                    "mobileNumber": this.state.mobileNo,
                    student: [{
                        "studentId":this.state.studentId,
                        "studentName": this.state.studentName,
                        "directorId": this.state.directorId,
                        "branchId": this.state.branchId,
                        "classId": this.state.classId,
                        "childActivity": "good",
                        "joiningDate": this.state.DOJ
                    }]
                })
            },1)
                .then((response) => response.json())
                .then((response) => {
                    console.log(response);
                    this.setState({spinnerVisible: false,fetchFlag:false});
                    if (response.statusCode === 200) {
                        setTimeout(() => {
                            Alert.alert("Status", "Student details updated successfully!")
                        })
                    }
                    else {
                        setTimeout(() => {
                            Alert.alert("Status", "Cannot update details. Please try again later.")
                        })
                    }
                })
                .catch(() => {
                    this.setState({spinnerVisible: false,fetchFlag:false});
                    setTimeout(() => {
                        Alert.alert("Error", "Network error! Please try again")
                    });
                });
            setTimeout(() => {
                fetch.abort(1);
                this.setState({spinnerVisible: false});
                if (this.state.fetchFlag)
                    setTimeout(() => {
                        Alert.alert("Error", "Network error! Loaded data will be used or data not available.")
                    });
                this.setState({fetchFlag: false});
            }, 10000);
        }
        else if(this.state.parentFound===true){
            this.setState({spinnerVisible: true,fetchFlag:true});
            fetch("http://192.168.1.19:8081/Daycare/centerdirector/addingOneMoreKidToParent", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "parentName": this.state.parentName,
                    "mobileNumber": this.state.mobileNo,
                    student: [{
                        "studentId":this.state.studentId,
                        "studentName": this.state.studentName,
                        "directorId": this.state.directorId,
                        "branchId": this.state.branchId,
                        "classId": this.state.classId,
                        "joiningDate": this.state.DOJ,
                        "childActivity": ""
                    }]
                })
            },2)
                .then((response) => response.json())
                .then((response) => {
                    console.log(response);
                    this.setState({spinnerVisible: false,fetchFlag:false});
                    if (response.statusCode === 200) {
                        setTimeout(() => {
                            Alert.alert("Status", "Student details updated successfully!")
                        })
                    }
                    else {
                        setTimeout(() => {
                            Alert.alert("Status", "Cannot update details. Please try again later.")
                        })
                    }
                })
                .catch(() => {
                    this.setState({spinnerVisible: false,fetchFlag:false});
                    setTimeout(() => {
                        Alert.alert("Error", "Network error! Please try again")
                    });
                });
            setTimeout(() => {
                fetch.abort(2);
                this.setState({spinnerVisible: false});
                if (this.state.fetchFlag)
                    setTimeout(() => {
                        Alert.alert("Error", "Network error! Loaded data will be used or data not available.")
                    });
                this.setState({fetchFlag: false});
            }, 10000);
        }
    }

    checkParentsIfAlreadyExist(){
        this.setState({spinnerVisible: true});
        return fetch("http://192.168.1.19:8081/Daycare/centerdirector/selectingParentsDetailsByMobileNumber",{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "mobileNumber": this.state.mobileNo
            })
        })
            .then((response)=>response.json())
            .then((response)=>{
            console.log(response);
                this.setState({spinnerVisible: false});
                if(response.data===null){
                    this.setState({parentFound:false});
                }else{
                    this.setState({parentFound:true,parentName:response.data[0].parentName});
                }
            })
            .catch(() => {
                this.setState({spinnerVisible: false,mobileNo:""});
                setTimeout(()=>{Alert.alert("Error", "Network error! Please try again")});
            });
    }

    render() {
        return (
            <ImageBackground
                style={{flex:1,width:"100%",height:"100%"}}
                source={require("../../../assets/pencil.jpg")}
                blurRadius={10}
            >
                <Spinner visible={this.state.spinnerVisible} textContent={"Loading..."} textStyle={{color: '#FFF'}} />
                <View style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "space-around",
                    alignItems: "center",
                }}>
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
                    <View style={{flex: 5, alignItems: "center", justifyContent: "center"}}>
                        <Text style={{color: "#ffffff", fontSize: 25}}>Add student</Text>
                    </View>
                    <View style={{flex: 1}}></View>
                </View>
                <View style={{flex: 10, width: "100%", height: "100%",paddingLeft:"5%",paddingRight:"5%"}}>
                    <ScrollView style={{width:"100%",height:"100%",paddingTop:"5%"}}>
                        <View style={{flexDirection: "row", alignItems: "center", justifyContent: "center"}}>
                            <Text style={{flex:1,color:"#fff"}}>Mobile number:</Text>
                            <View style={{flex:2,borderWidth:0.5,borderRadius:5,height:40,borderColor:"#fff"}}>
                                <TextInput
                                    style={{padding:10,color:"#fff"}}
                                    placeholder="enter student's name"
                                    placeholderTextColor="rgba(0,0,0,0.5)"
                                    autoCorrect={false}
                                    value={this.state.mobileNo}
                                    onChangeText={(mobileNo)=>{this.setState({mobileNo:mobileNo})}}
                                    onBlur={()=>{this.checkParentsIfAlreadyExist()}}
                                />
                            </View>
                        </View>
                        <View style={{flexDirection: "row", alignItems: "center", justifyContent: "center",marginTop:"5%"}}>
                            <Text style={{flex:1,color:"#fff"}}>Student's name:</Text>
                            <View style={{flex:2,borderWidth:0.5,borderRadius:5,height:40,borderColor:"#fff"}}>
                                <TextInput
                                    style={{padding:10,color:"#fff"}}
                                    placeholder="enter student's name"
                                    placeholderTextColor="rgba(0,0,0,0.5)"
                                    autoCorrect={false}
                                    autoCapitalize={"words"}
                                    onChangeText={(studentName)=>{this.setState({studentName:studentName})}}
                                />
                            </View>
                        </View>
                        <View style={{flexDirection: "row", alignItems: "center", justifyContent: "center",marginTop:"5%"}}>
                            <Text style={{flex:1,color:"#fff"}}>Parent's name:</Text>
                            <View style={{flex:2,borderWidth:0.5,borderRadius:5,height:40,borderColor:"#fff"}}>
                                <TextInput
                                    style={{padding:10,color:"#fff"}}
                                    placeholder="enter parent's name"
                                    placeholderTextColor="rgba(0,0,0,0.5)"
                                    autoCorrect={false}
                                    autoCapitalize={"words"}
                                    onChangeText={(parentName)=>{this.setState({parentName:parentName})}}
                                    value={this.state.parentName}
                                />
                            </View>
                        </View>
                        <View style={{flexDirection: "row", alignItems: "center", justifyContent: "center",marginTop:"5%"}}>
                            <Text style={{flex:1,color:"#fff"}}>Date of joining:</Text>
                            <View style={{ flex: 2 }}>
                                <TouchableOpacity
                                    style={{flex:1,borderBottomWidth:0.5,height:40,flexDirection:"row",alignItems:"center",borderColor:"#fff"}}
                                    onPress={this.dateTimePickerHandler._showDateTimePickerDOJ}>
                                    <Text style={{flex:7,fontSize:16,paddingLeft:"5%",color:"#fff"}}>{this.state.DOJ}</Text>
                                    <MaterialIcons
                                        name="arrow-drop-down"
                                        size={27}
                                        style={{flex:1,color: "#fff"}}
                                    />
                                </TouchableOpacity>
                                <DateTimePicker
                                    isVisible={this.state.isDateTimePickerVisibleDOJ}
                                    onConfirm={this.dateTimePickerHandler._handleDatePickedDOJ}
                                    onCancel={this.dateTimePickerHandler._hideDateTimePickerDOJ}
                                />
                            </View>
                        </View>
                        <View style={{flexDirection: "row", alignItems: "center", justifyContent: "center",marginTop:"5%"}}>
                            <Text style={{flex:1,color:"#fff"}}>Student id:</Text>
                            <View style={{flex:2,borderWidth:0.5,borderRadius:5,height:40,borderColor:"#fff"}}>
                                <TextInput
                                    style={{padding:10,color:"#fff"}}
                                    placeholder="enter student's Id"
                                    placeholderTextColor="rgba(0,0,0,0.5)"
                                    autoCorrect={false}
                                    autoCapitalize={"characters"}
                                    onChangeText={(studentId)=>{this.setState({studentId:studentId})}}
                                />
                            </View>
                        </View>
                        <View style={{flexDirection:"row",alignItems:"center",marginTop:"5%"}}>
                            <Text style={{flex:2,marginBottom:5,color:"#fff"}}>Director id:</Text>
                            <View style={{flex:4}}>
                                <TextInput
                                    style={{padding:10,borderWidth:1,borderRadius:5,borderColor:"#fff",color:"#fff"}}
                                    placeholder="Enter director id"
                                    placeholderTextColor="rgba(0,0,0,0.5)"
                                    autoCorrect={false}
                                    autoCapitalize={"characters"}
                                    value={this.state.directorId}
                                    onChangeText={(directorId)=>{this.setState({directorId:directorId})}}
                                    editable={false}
                                />
                            </View>
                        </View>
                        <View style={{flexDirection:"row",alignItems:"center",marginTop:"5%"}}>
                            <Text style={{flex:2,marginBottom:5,color:"#fff"}}>Branch id:</Text>
                            <View style={{flex:4}}>
                                <TextInput
                                    style={{padding:10,borderWidth:1,borderRadius:5,borderColor:"#fff",color:"#fff"}}
                                    placeholder="Enter branch id"
                                    placeholderTextColor="rgba(0,0,0,0.5)"
                                    autoCorrect={false}
                                    autoCapitalize={"characters"}
                                    value={this.state.branchId}
                                    onChangeText={(branchId)=>{this.setState({branchId:branchId})}}
                                    editable={false}
                                />
                            </View>
                        </View>
                        <View style={{flexDirection:"row",alignItems:"center",marginTop:"5%"}}>
                            <Text style={{flex:2,marginBottom:5,color:"#fff"}}>Class id:</Text>
                            <View style={{flex:4}}>
                                <TextInput
                                    style={{padding:10,borderWidth:1,borderRadius:5,borderColor:"#fff",color:"#fff"}}
                                    placeholder="Enter class id"
                                    placeholderTextColor="rgba(0,0,0,0.5)"
                                    autoCorrect={false}
                                    autoCapitalize={"characters"}
                                    value={this.state.classId}
                                    onChangeText={(classId)=>{this.setState({classId:classId})}}
                                />
                            </View>
                        </View>
                        <View style={{alignItems:"center",marginTop:"5%",width:"100%"}}>
                            <TouchableOpacity
                                style={{backgroundColor:"rgba(255,255,255,0.5)",width:"100%",height:50,justifyContent:"center",alignItems:"center",borderRadius:5}}
                                onPress={()=>{this.saveStudentDetails();}}
                            >
                                <Text style={{color:"#ffffff",fontSize:20}}>Add student</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </ImageBackground>
        )
    }
}