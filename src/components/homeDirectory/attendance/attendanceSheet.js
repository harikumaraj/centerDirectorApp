import React, { Component } from 'react';
import {Text,View,TouchableOpacity,ScrollView,Alert,ImageBackground,Dimensions} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ModalDropdown from 'react-native-modal-dropdown';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import fetch from "react-native-cancelable-fetch";
import Spinner from 'react-native-loading-spinner-overlay';

export default class AttendanceSheet extends Component{
    static navigationOptions = {
        drawerLabel: () => null
    };

    constructor(props){
        super(props);
        this.state={
            selectedClass:"class",
            studentList:[],
            attendanceList:[],
            classList:props.screenProps.classList,
            dropDownClassList:[],
            selectedClassIndex:0,
            studentListSize:0,
            date:new Date().toLocaleString().substr(0,10).replace(/\//g,"-"),
            checked:false,
            fetchFlag:false,
            spinnerVisible:false
        }
    }

    componentDidMount(){
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

    getStudentList(){
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
                            // "directorId" : this.state.classList[this.state.selectedClassIndex].directorId,
                            // "branchId" : this.state.classList[this.state.selectedClassIndex].branchId,
                            // "classId" : this.state.classList[this.state.selectedClassIndex].classId
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
                    let tempAttendanceList = [];
                    response.data.map(() => {
                        tempAttendanceList.push({attendance: false})
                    });
                    if (response.statusCode === 200) {
                        this.setState({studentList: response.data, attendanceList: tempAttendanceList});
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

    updateAttendance(){
        let attendanceListStudents=[];
        this.state.studentList.map((studentDetails)=>{
            attendanceListStudents.push({"studentId":studentDetails.studentId});
        });
        this.setState({spinnerVisible: true, fetchFlag: true});

        fetch("http://192.168.1.19:8081/Daycare/centerdirector/kidsdailyattendence",{
            method: "post",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                        // "directorId" : this.state.classList[index].directorId,
                        // "branchId" : this.state.classList[index].branchId,
                        // "classId" : this.state.classList[index].classId
                        "dateofAttendence":this.state.date,
                        "directorId" : "DIR003",
                        "branchId" : "BRANCH003",
                        "classId" : "CLS003",
                        "studentIds":attendanceListStudents
            })
        },2)
            .then((response)=>response.json())
            .then((response)=>{
                this.setState({spinnerVisible:false,fetchFlag:false});
                if(response.statusCode===200){
                    setTimeout(()=>{Alert.alert("Alert", "Attendance updated!")});
                }
                else{
                    setTimeout(()=>{Alert.alert("Error", "Could not update attendance! Multiple updates")});
                }
            })
            .catch((error) => {
                this.setState({spinnerVisible: false,fetchFlag:false});
                setTimeout(()=>{Alert.alert("Error", "Network error! Could not update attendance!")});
            });
        setTimeout(()=>{
            fetch.abort(2);
            this.setState({spinnerVisible: false});
            if(this.state.fetchFlag)
                setTimeout(()=>{Alert.alert("Error", "Network error! Could not update attendance!")});
            this.setState({fetchFlag:false});
        },10000);
    }

    checkedOrUnchecked(index){
        if(this.state.attendanceList[index].attendance===false){
            return(
                <MaterialCommunityIcons
                    style={{color:"blue"}}
                    name="checkbox-blank-outline"
                    size={20}
                />
            )
        }
        else if(this.state.attendanceList[index].attendance===true){
            return(
                <MaterialCommunityIcons
                    style={{color:"blue"}}
                    name="checkbox-marked"
                    size={20}
                />
            )
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
                        <Text style={{marginLeft:"20%",color:"#ffffff",fontSize:25}}>Attendance</Text>
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
                <View style={{flex:10,width:"100%",height:"100%",paddingLeft:5,paddingRight:5}}>
                    <View style={{flex:11,backgroundColor:"rgba(122, 181, 249, 0.5)",borderRadius:5,marginBottom:5}}>
                        <View style={{flex:1,flexDirection:"row",alignItems:"center",justifyContent:"center"}}>
                            <Text style={{flex:1,color:"#ffffff",textAlign:"center",fontSize:13}}>Student Id</Text>
                            <Text style={{flex:2,color:"#ffffff",textAlign:"center",fontSize:13}}>Name</Text>
                            <Text style={{flex:1,color:"#ffffff",textAlign:"center",fontSize:13}}>Attendance</Text>
                        </View>
                        <View style={{flex:12}}>
                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                style={{flex:1,margin:5,backgroundColor:"rgba(255,255,255,0.5)",padding:1}}
                            >
                                {
                                    this.state.studentList.map((student,index) => {
                                        return(
                                            <TouchableOpacity
                                                key={index}
                                                style={{width:"100%",height:40,flexDirection:"row",alignItems:"center",justifyContent:"center"}}
                                                onPress={()=>{
                                                    let attendanceList=this.state.attendanceList;
                                                    attendanceList[index].attendance=!attendanceList[index].attendance;
                                                    this.setState({attendanceList:attendanceList});
                                                }}
                                            >
                                                <View style={{flex:1,height:"100%",backgroundColor:"rgb(155, 196, 247)",alignItems:"center",justifyContent:"center"}}>
                                                    <Text style={{textAlign:"center",}}>{student.studentId}</Text>
                                                </View>
                                                <View style={{flex:2,height:"100%",backgroundColor:"rgb(184, 210, 242)",alignItems:"center",justifyContent:"center"}}>
                                                    <Text style={{textAlign:"center",}}>{student.StudentName}</Text>
                                                </View>
                                                <View style={{flex:1,height:"100%",alignItems:"center",justifyContent:"center"}}>
                                                    {this.checkedOrUnchecked(index)}
                                                </View>
                                            </TouchableOpacity>
                                        )
                                    })
                                }
                            </ScrollView>
                        </View>
                    </View>
                    <TouchableOpacity
                        style={{flex:1,backgroundColor:"rgb(2, 112, 247)",justifyContent:"center",alignItems:"center",marginBottom:5}}
                        onPress={()=>{this.updateAttendance()}}
                    >
                        <Text style={{color:"#fff",fontSize:17}}>Update attendance</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        )
    }
}