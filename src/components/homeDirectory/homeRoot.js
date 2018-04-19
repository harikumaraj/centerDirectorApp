import React from 'react';
import {AsyncStorage,View,Alert} from 'react-native'
import {DrawerNavigator,NavigationActions} from 'react-navigation';
import Notification from './notification/notificationScreen';
import Home from './home/homeScreen';
import Profile from './profile/profileScreen'
import CustomDrawerContentComponent from './custonDrawer/customDrawerScreen';
import AddStudents from './addStudents/addStudents';
import AttendanceSheet from './attendance/attendanceSheet';
import ClassList from './classList/classList';
import StudentList from './studentList/sudentList';
import UpdateAttendanceSheet from './updateAttendance/updateAttendancePage';
import Report from './reportPage/reportPage';
import Holidays from './holidays/holidays';
import fetch from "react-native-cancelable-fetch";
import Spinner from 'react-native-loading-spinner-overlay';

const Navigation = DrawerNavigator(
    {
        Home: {
            screen: Home,
        },
        Notifications: {
            screen: Notification,
        },
        Profile:{
            screen:Profile
        },
        ClassList:{
            screen:ClassList
        },
        AttendanceSheet:{
            screen:AttendanceSheet
        },
        AddStudents:{
            screen:AddStudents
        },
        StudentList:{
            screen:StudentList
        },
        UpdateAttendanceSheet:{
            screen:UpdateAttendanceSheet
        },
        Report:{
            screen:Report
        },
        Holidays:{
            screen:Holidays
        }

    },
    {
        headerMode: 'float',
        contentComponent:CustomDrawerContentComponent,
        initialRouteName:"Home",
    }
);

export default class HomeRoot extends React.Component{

    constructor(props){
        super(props);
        this.state={
            photo:require("../../assets/directorUser.png"),
            clearFlag:false,
            directorDetails:{},
            classList:[],
            directorName:"User"
        };
    }

    componentDidMount(){
        this.fetchClassList();
        AsyncStorage.getItem("loginFlag",(err,loginCheck)=>{
            if(loginCheck!=="true") {
                fetch.abort(1);
                this.setState({fetchFlag: false});
                this.props.navigation.dispatch(this.loginPageResetAction);
            }
        });
        AsyncStorage.getItem("photo",(err,photo)=>{
            if(photo!==null)
                this.setState({photo:JSON.parse(photo)});
        });
        AsyncStorage.getItem("clearFlag",(err,clearFlag)=>{
            if(clearFlag!==null)
                this.setState({clearFlag:JSON.parse(clearFlag)});
        });
        AsyncStorage.getItem("directorDetails",(err,directorDetails)=>{
            if(directorDetails!==null)
                this.setState({directorDetails:JSON.parse(directorDetails),directorName:JSON.parse(directorDetails).directorName});
        });
        AsyncStorage.getItem("classList",(err,classList)=>{
            if(classList!==null)
                this.setState({classList:JSON.parse(classList)});
        });

    }

    loginPageResetAction = NavigationActions.reset({
        index: 0,
        actions: [
            NavigationActions.navigate({ routeName: 'LoginPage'})
        ]
    });

    navigateToLoginPage=(()=>{
        this.setState({clearFlag:false});
        this.props.navigation.dispatch(this.loginPageResetAction);
        AsyncStorage.setItem("loginFlag",JSON.stringify(false));
        AsyncStorage.removeItem("photo");
        AsyncStorage.removeItem("clearFlag");
        AsyncStorage.removeItem("directorDetails");
    }).bind(this);

    setPhoto=((photo)=>{
        this.setState({photo:photo});
        AsyncStorage.setItem("photo",JSON.stringify(photo));
    }).bind(this);

    changeClearFlag=(()=>{
        this.setState({clearFlag:false});
        AsyncStorage.setItem("clearFlag",JSON.stringify(false));
    }).bind(this);

    updateDirectorDetailsAsyncStorage=((directorDetails)=>{
        AsyncStorage.setItem("directorDetails",JSON.stringify(directorDetails));
        this.setState({directorDetails:directorDetails});
    }).bind(this);

    classList=((classList)=>{
        AsyncStorage.setItem("classList",JSON.stringify(classList));
        this.setState({classList:classList});
    }).bind(this);

    refreshFetchClassList=(()=>{
        this.fetchClassList();
    }).bind(this);

    fetchClassList(){
        this.setState({spinnerVisible:true,fetchFlag:true});
        fetch("http://192.168.1.19:8081/Daycare/centerdirector/gettingListOfClassesDetailsByDirectorId", {
            method: "post",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                // "directorId": this.state.directorDetails.directorId
                "directorId": "DIR003"
            })
        },1)
            .then((response)=>response.json())
            .then((response)=>{
                this.setState({spinnerVisible:false,fetchFlag:false});
                if(response.statusCode===200){
                    this.classList(response.data);
                }
            })
            .catch(() => {
                this.setState({spinnerVisible: false,fetchFlag:false});
                setTimeout(()=>{Alert.alert("Error", "Network error! Loaded data will be used or data not available.")});
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
            <View style={{flex:1}}>
                <Spinner visible={this.state.spinnerVisible} textContent={"Loading..."} textStyle={{color: '#FFF'}} />
                <Navigation screenProps={{
                    navigateToLoginPage:this.navigateToLoginPage,
                    photo:this.state.photo,
                    setPhoto:this.setPhoto,
                    clearFlag:this.state.clearFlag,
                    changeClearFlag:this.changeClearFlag,
                    directorDetails:this.state.directorDetails,
                    directorName:this.state.directorName,
                    updateDirectorDetailsAsyncStorage:this.updateDirectorDetailsAsyncStorage,
                    classList:this.state.classList,
                    refreshClassList:this.refreshFetchClassList
                }}/>
            </View>
        )
    }
}