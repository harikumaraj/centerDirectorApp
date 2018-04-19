import React, { Component } from 'react';
import {Text,View,TouchableOpacity,ScrollView,Alert,Dimensions,StyleSheet,ImageBackground} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ModalDropdown from 'react-native-modal-dropdown';
import fetch from "react-native-cancelable-fetch";
import Spinner from 'react-native-loading-spinner-overlay';

export default class StudentList extends Component{
    static navigationOptions = {
        drawerLabel: () => null
    };

    constructor(props){
        super(props);
        this.state={
            selectedClass:"class",
            studentList:[],
            classList:props.screenProps.classList,
            dropDownClassList:[],
            selectedClassIndex:0,
            studentListSize:0,
            fetchFlag:false,
            spinnerVisible:false,
            popUp:false,
            deviceHeight:0,
            deviceWidth:0,
            selectedStudentIndex:0,
            parentDetails:{student:[]}
        }
    }

    componentDidMount(){
        let {height,width}=Dimensions.get('window');
        this.setState({deviceHeight:height,deviceWidth:width});
        if(this.state.classList.length===0)
            this.setState({studentListSize:1});
        else if(this.state.classList.length<5)
            this.setState({studentListSize:this.state.classList.length});
        else
            this.setState({studentListSize:5});
        let tempDropDownClassList=[];
        this.state.classList.map((studentClass)=>{
            tempDropDownClassList.push(studentClass.className);
        });
        this.setState({dropDownClassList:(tempDropDownClassList.length===0)?["none"]:tempDropDownClassList});
        if(this.state.classList[0]!==undefined){
            this.setState({selectedClass:this.state.classList[0].className});
            this.getStudentList(0);
        }
    }

    getStudentList(index){
        if(this.state.popUp)
            this.setState({popUp:false});
        if(this.state.classList.length!==0) {
            // this.setState({spinnerVisible: true, fetchFlag: true});
            fetch("http://192.168.1.19:8081/Daycare/centerdirector/gettingStudentsDetailsInClass", {
                method: "post",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "student": [
                        {
                            // "directorId" : this.state.classList[index].directorId,
                            // "branchId" : this.state.classList[index].branchId,
                            // "classId" : this.state.classList[index].classId
                            "directorId": "DIR003",
                            "branchId": "BRANCH003",
                            "classId": "CLS003"
                        }
                    ]
                })
            }, 1)
                .then((response) => response.json())
                .then((response) => {
                    this.setState({spinnerVisible: false, fetchFlag: false});
                    if (response.statusCode === 200) {
                        this.setState({studentList: response.data});
                    }
                    else {
                        setTimeout(() => {
                            Alert.alert("Alert", "No data found")
                        });
                    }
                })
                .catch(() => {
                    this.setState({spinnerVisible: false, fetchFlag: false});
                    setTimeout(() => {
                        Alert.alert("Error", "Network error! Loaded data will be used or data not available.")
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
    }

    getParentData(){
        this.setState({spinnerVisible:true,fetchFlag:true});
        fetch("http://192.168.1.19:8081/Daycare/centerdirector/selectingParentsDetailsByMobileNumber",{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "mobileNumber":this.state.studentList[this.state.selectedStudentIndex].ParentMObileNumber,
            })
        },2)
            .then((response)=>response.json())
            .then((response)=>{
                console.log(response);
                this.setState({spinnerVisible: false,fetchFlag:false});
                if(response.statusCode===200) {
                    this.setState({parentDetails:response.data[0]});
                }
            })
            .catch(() => {
                this.setState({spinnerVisible: false,fetchFlag:false,popUp:false});
                setTimeout(()=>{Alert.alert("Internet problem!", "Could not load your details. Please connect to internet")},50);
            });
        setTimeout(()=>{
            fetch.abort(2);
            this.setState({spinnerVisible: false});
            if(this.state.fetchFlag)
                setTimeout(()=>{Alert.alert("Internet problem", "Could not load your details. Please connect to internet")});
            this.setState({fetchFlag:false});
        },10000);
    };

    togglePopUp(){
        if(this.state.popUp)
            this.setState({popUp:false,parentDetails:{student:[]}});
        else {
            this.setState({popUp: true});
            this.getParentData();
        }
        this.returnPopUpView();
    }

    returnPopUpView(){
        if(this.state.popUp){
            return(
                <View
                    style={{position:"absolute",width:this.state.deviceWidth,height:"100%",backgroundColor:"rgba(0, 0, 0,0.5)",alignItems:"center",justifyContent:"center"}}
                >
                    <View style={{width:"90%",height:520,alignItems:"center",justifyContent:"center",backgroundColor:"white",borderRadius:5}}>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={{height:"100%",alignItems:"center",justifyContent:"center"}}>
                                {this.state.parentDetails.student.map((parentDetail,index)=>{
                                    if(parentDetail.studentId===this.state.studentList[this.state.selectedStudentIndex].studentId) {
                                        return (
                                            <View key={index} style={{marginTop:20}}>
                                                <View style={{borderBottomWidth:0.5,borderBottomColor:"#00000077",marginBottom:5}}>
                                                    <Text style={{color:"rgb(26, 93, 175)",fontSize:17,marginBottom:5}}>Parent details</Text>
                                                </View>
                                                <Text style={styles.popUpText}>Parent name: {this.state.parentDetails.parentName}</Text>
                                                <Text style={styles.popUpText}>Mobile number: {this.state.parentDetails.mobileNumber}</Text>
                                                <Text style={styles.popUpText}>Email Id: {this.state.parentDetails.email}</Text>
                                                <Text style={styles.popUpText}>Parent's anniversary date: {this.state.parentDetails.anniversaryDay}</Text>
                                                <Text style={styles.popUpText}>Address: {this.state.parentDetails.address1}, {this.state.parentDetails.address2}, {this.state.parentDetails.address2}, {this.state.parentDetails.city}, {this.state.parentDetails.state}, {this.state.parentDetails.country}</Text>
                                                <Text style={styles.popUpText}>Pin code: {this.state.parentDetails.pincode}</Text>
                                                <View style={{borderBottomWidth:0.5,borderBottomColor:"#00000077",marginBottom:5,marginTop:5}}>
                                                    <Text style={{color:"rgb(26, 93, 175)",fontSize:17,marginBottom:5}}>Student details</Text>
                                                </View>
                                                <Text style={styles.popUpText}>Student name: {this.state.parentDetails.student[index].studentName}</Text>
                                                <Text style={styles.popUpText}>Student Id: {this.state.parentDetails.student[index].studentId}</Text>
                                                <Text style={styles.popUpText}>Class Id: {this.state.parentDetails.student[index].classId}</Text>
                                                <Text style={styles.popUpText}>Branch Id: {this.state.parentDetails.student[index].branchId}</Text>
                                                <Text style={styles.popUpText}>Director Id:{this.state.parentDetails.student[index].directorId}</Text>
                                                <Text style={styles.popUpText}>DOB: {this.state.parentDetails.student[index].studentDateOfBirth}</Text>
                                                <Text style={styles.popUpText}>DOJ: {this.state.parentDetails.student[index].joiningDate}</Text>
                                                <Text style={styles.popUpText}>Age: {this.state.parentDetails.student[index].studentAge}</Text>
                                                <Text style={styles.popUpText}>Gender: {this.state.parentDetails.student[index].studentGender}</Text>
                                                <View style={{borderBottomWidth:0.5,borderBottomColor:"#00000077",marginBottom:5,marginTop:5}}>
                                                    <Text style={{color:"rgb(26, 93, 175)",fontSize:17,marginBottom:5}}>Child's activities</Text>
                                                </View>
                                                <Text style={styles.popUpText}>Food list: {this.state.parentDetails.student[index].food}</Text>
                                                <Text style={styles.popUpText}>Medicine list: {this.state.parentDetails.student[index].medicine}</Text>
                                                <Text style={styles.popUpText}>Last fed at {this.state.parentDetails.student[index].lastFetTime}.</Text>
                                                <Text style={styles.popUpText}>Last diapers changed at {this.state.parentDetails.student[index].diapersChangedTime}.</Text>
                                                <Text style={styles.popUpText}>Last medicine given time {this.state.parentDetails.student[index].medicineGivenTime}.</Text>
                                                <Text style={styles.popUpText}>Total nap time is {this.state.parentDetails.student[index].napTime}.</Text>
                                                <Text style={styles.popUpText}>Additional comments: {(this.state.parentDetails.student[index].additionalDetails.length===0)?"none":this.state.parentDetails.student[index].additionalDetails}.</Text>
                                            </View>
                                        );
                                    }
                                })}
                            </View>
                        </ScrollView>
                        <TouchableOpacity
                            style={{backgroundColor:"rgb(2, 112, 247)",height:40,width:300,alignItems:"center",justifyContent:"center",borderRadius:2,marginTop:20,marginBottom:20}}
                            onPress={()=>{this.togglePopUp();}}
                        >
                            <Text style={{color:"#ffffff"}}>Dismiss</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )
        }
        else{
            return null;
        }
    }

    render(){
        return (
            <ImageBackground
                style={{flex:1,width:"100%",height:"100%"}}
                source={require("../../../assets/pencil.jpg")}
                blurRadius={10}
            >
                <Spinner visible={this.state.spinnerVisible} textContent={"Loading..."} textStyle={{color: '#FFF'}} />
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
                    <View style={{flex:4,alignItems:"center",justifyContent:"center"}}>
                        <Text style={{marginLeft:"20%",color:"#ffffff",fontSize:25}}>Student List</Text>
                    </View>
                    <View style={{flex:2,alignItems:"center",justifyContent:"center",height:"100%",width:"100%"}}>
                        <ModalDropdown
                            options={this.state.dropDownClassList}
                            style={{height:30,width:100,borderWidth:1,borderColor:"#ffffff",borderRadius:5,alignItems:"center",justifyContent:"center"}}
                            textStyle={{color:"#ffffff",fontSize:15}}
                            dropdownStyle={{backgroundColor:"rgba(6, 44, 91,0.9)"}}
                            dropdownTextStyle={{height:40,color:"#ffffff",backgroundColor:"rgba(0,0,0,0)",fontSize:15,textAlign:"center"}}
                            showsVerticalScrollIndicator={false}
                            dropdownTextHighlightStyle={{backgroundColor:"rgb(133, 204, 252)"}}
                            adjustFrame={()=>{return({height:this.state.studentListSize*40,width:100,top:"8%",right:"2%"})}}
                            onSelect={(index,className)=>{
                                this.setState({selectedClass:className,selectedClassIndex:index});
                                this.getStudentList(index);
                            }}
                        >
                            <Text style={{color:"#ffffff",fontSize:15}}>{this.state.selectedClass}  {(()=><Ionicons
                                name="ios-arrow-down"
                                size={15}
                                style={{color: "#ffffff"}}
                            />)()}</Text>
                        </ModalDropdown>
                    </View>
                </View>
                <View style={{flex:10,width:"100%",height:"100%",paddingLeft:5,paddingRight:5,paddingBottom:5}}>
                    <View style={{flex:1,backgroundColor:"rgba(122, 181, 249,0.5)",borderRadius:5}}>
                        <View style={{flex:1,flexDirection:"row",alignItems:"center",justifyContent:"center"}}>
                            <Text style={{flex:1,color:"#ffffff",textAlign:"center",fontSize:17}}>Id</Text>
                            <Text style={{flex:2,color:"#ffffff",textAlign:"center",fontSize:17}}>Name</Text>
                            <Text style={{flex:1,color:"#ffffff"}}></Text>
                        </View>
                        <View style={{flex:12,backgroundColor:"rgba(255,255,255,0.3)"}}>
                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                style={{flex:1,margin:5,backgroundColor:"rgba(255,255,255,0.3)",padding:1}}
                            >
                                {
                                    this.state.studentList.map((student,index) => {
                                        return(
                                            <View key={index} style={{width:"100%",height:40,flexDirection:"row",alignItems:"center",justifyContent:"center"}}>
                                                <View style={{flex:1,height:"100%",backgroundColor:"rgb(155, 196, 247)",alignItems:"center",justifyContent:"center"}}>
                                                    <Text style={{textAlign:"center",}}>{student.studentId}</Text>
                                                </View>
                                                <View style={{flex:2,height:"100%",backgroundColor:"rgb(184, 210, 242)",alignItems:"center",justifyContent:"center"}}>
                                                    <Text style={{textAlign:"center",}}>{student.StudentName}</Text>
                                                </View>
                                                <TouchableOpacity
                                                    style={{flex:1,height:"100%",backgroundColor:"rgb(26, 93, 175)",alignItems:"center",justifyContent:"center"}}
                                                        onPress={()=>{this.setState({selectedStudentIndex:index});this.togglePopUp()}}
                                                    >
                                                        <Text style={{color:"#ffffff"}}>Details</Text>
                                                </TouchableOpacity>
                                            </View>
                                        )
                                    })
                                }
                            </ScrollView>
                        </View>
                    </View>
                    {this.returnPopUpView()}
                </View>
            </ImageBackground>
        )
    }
}

let styles=StyleSheet.create({
   popUpText:{fontSize:15,color:"#666",marginBottom:2}
});