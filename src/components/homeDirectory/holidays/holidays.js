import React, {Component} from 'react';
import {Text, View, TouchableOpacity, Animated, ScrollView, TextInput, AsyncStorage,Alert,ImageBackground} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import DateTimePicker from 'react-native-modal-datetime-picker';
import Spinner from 'react-native-loading-spinner-overlay';
import fetch from 'react-native-cancelable-fetch'

export default class Holidays extends Component {
    static navigationOptions = {
        drawerLabel: () => null
    };

    constructor() {
        super();
        this.state = {
            addHolidayHeightAnimate: new Animated.Value(0),
            formalHolidaysHeightAnimate: new Animated.Value(0),
            unFormalHolidaysHeightAnimate: new Animated.Value(0),
            formalHolidayContainer:new Animated.Value(0),
            unFormalHolidayContainer:new Animated.Value(0),
            addHolidayExpanded: false,
            formalHolidayExpanded: false,
            unFormalHolidayExpanded: false,
            formalHolidayList: [],
            unFormalHolidayList: [],
            isDateTimePickerVisible: false,
            textBoxBorderWidth: 0,
            year: parseInt(new Date().toString().substr(11, 4)),
            holiday: {
                month: "",
                holidayDate: "Select the date",
                day: "",
                festivalsOrOccasions: ""
            },
            spinnerVisible:false,
            fetchFlag:false,
        }
    }

    componentDidMount(){
        AsyncStorage.getItem("formalHolidayList", (err, formalHolidayList) => {
            if (formalHolidayList !== null) {
                let tempHolidayList = JSON.parse(formalHolidayList);
                this.setState({formalHolidayList: tempHolidayList});
            }
        });
            AsyncStorage.getItem("unFormalHolidayList", (err, unFormalHolidayList) => {
                if (unFormalHolidayList !== null) {
                    let tempHolidayList = JSON.parse(unFormalHolidayList);
                    this.setState({unFormalHolidayList:tempHolidayList});
                }
        });
        this.getHolidayList();
        // Alert.alert("poop",new Date().toString());
    }

    getHolidayList() {
        this.setState({spinnerVisible: true, fetchFlag: true});
        fetch("http://192.168.1.19:8081/Daycare/centerdirector/showingHolidays",{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({"year":this.state.year})
        },1)
            .then((response)=>response.json())
            .then((response)=>{
            this.setState({spinnerVisible:false,fetchFlag:false});
                if(response.statusCode===200){
                    this.setState({formalHolidayList:response.data[0].formalHolidays,unFormalHolidayList:(response.data[0].unformalHolidays===null)?[]:response.data[0].unformalHolidays});
                    AsyncStorage.setItem("formalHolidayList",JSON.stringify(response.data[0].formalHolidays));
                    AsyncStorage.setItem("unFormalHolidayList",JSON.stringify((response.data[0].unformalHolidays===null)?[]:response.data[0].unformalHolidays));
                }
                else{
                    setTimeout(()=>{Alert.alert("Error","Could not get the data, try again!")},50);
                }
            })
            .catch(()=>{
            this.setState({spinnerVisible:false,fetchFlag:false});
            setTimeout(()=>{Alert.alert("Error","Could not connect to internet! Loading older data!")},50)
            });
        setTimeout(() => {
            fetch.abort(1);
            this.setState({spinnerVisible: false});
            if (this.state.fetchFlag)
                setTimeout(() => {
                    Alert.alert("Error", "Network error! Loaded older data.")
                });
            this.setState({fetchFlag: false});
        }, 10000);
    }

    addHoliday() {
        if(this.state.holiday.holidayDate==="Select the date"||this.state.holiday.festivalsOrOccasions===""){
            Alert.alert("Error!","Please fill in all the details!");
        }else {
            this.setState({spinnerVisible: true,fetchFlag:true});
            let holidayList=this.state.unFormalHolidayList;
            let holidayUpdateList=holidayList.concat([this.state.holiday]);
            fetch("http://192.168.1.19:8081/Daycare/centerdirector/updatingUnformalHolidaysList", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "year": this.state.year,
                    "unformalHolidays":holidayUpdateList

                })
            },2)
                .then((response) => response.json())
                .then((response) => {
                    this.setState({spinnerVisible: false,fetchFlag:false});
                    if (response.statusCode === 200) {
                        setTimeout(() => {
                            this.UnformalHolidaysExpandMoreOnUpdate();
                            Alert.alert("Success", "Holiday added successfully");
                            this.getHolidayList();
                        })
                    } else {
                        setTimeout(() => {
                            Alert.alert("Error", "Could not add holiday. Please try again!");
                        })
                    }
                })
                .catch(() => {
                    this.setState({spinnerVisible: false,fetchFlag:false});
                    setTimeout(() => {
                        Alert.alert("Error", "Could not connect to internet!")
                    }, 50)
                });
            setTimeout(() => {
                fetch.abort(2);
                this.setState({spinnerVisible: false});
                if (this.state.fetchFlag)
                    setTimeout(() => {
                        Alert.alert("Error", "Network error! Please try again later")
                    });
                this.setState({fetchFlag: false});
            }, 10000);
        }
    }

    determineMonth(month){
        switch(month){
            case "Jan":return "01";break;
            case "Feb":return "02";break;
            case "Mar":return "03";break;
            case "Apr":return "04";break;
            case "May":return "05";break;
            case "Jun":return "06";break;
            case "Jul":return "07";break;
            case "Aug":return "08";break;
            case "Sep":return "09";break;
            case "Oct":return "10";break;
            case "Nov":return "11";break;
            case "Dec":return "12";break;
        }
    }

    returnValidDate(date) {
        let tempDate = date.toString().substr(4, 11);
        let dateNum = tempDate.substr(4, 2);
        let monthName = tempDate.substr(0, 3);
        let year = tempDate.substr(7, 4);
        let month = this.determineMonth(monthName);
        let day = date.toString().substr(0, 3);
        return {dateNum, month, monthName, year, day};
    }

    dateTimePickerHandler = {
        _showDateTimePicker: () => {
            this.setState({isDateTimePickerVisible: true})
        },
        _hideDateTimePicker: () => {
            this.setState({isDateTimePickerVisible: false})
        },
        _handleDatePicked: (date) => {
            let tempDate = this.returnValidDate(date.toString());
            console.log(tempDate);
            this.setState({
                holiday: {
                    ...this.state.holiday,
                    holidayDate: tempDate.dateNum.concat("/",tempDate.month,"/",tempDate.year),
                    day: tempDate.day,
                    month: tempDate.monthName
                }
            });
            this.dateTimePickerHandler._hideDateTimePicker();
        }
    };

    UnformalHolidaysExpandMoreOnUpdate(){
        if(this.state.unFormalHolidayExpanded){
            Animated.spring(
                this.state.unFormalHolidaysHeightAnimate,
                {
                    duration: 200,
                    toValue: 40+this.state.unFormalHolidayList.length*30+30
                }
            ).start();
        }
    }

    addHolidayToggle() {
        if (this.state.addHolidayExpanded) {
            this.setState({
                addHolidayExpanded: false, textBoxBorderWidth: 0, holiday: {
                    month: "",
                    holidayDate: "Select the date",
                    day: "",
                    festivalsOrOccasions: ""

                }
            });
            Animated.timing(
                this.state.addHolidayHeightAnimate,
                {
                    duration: 200,
                    toValue: 0
                }
            ).start();
        }
        else {
            this.setState({addHolidayExpanded: true, textBoxBorderWidth: 0.5});
            Animated.spring(
                this.state.addHolidayHeightAnimate,
                {
                    duration: 200,
                    toValue: 150
                }
            ).start();
        }
    }

    formalHolidayToggle() {
        if (this.state.formalHolidayExpanded) {
            this.setState({formalHolidayExpanded: false});
            Animated.timing(
                this.state.formalHolidaysHeightAnimate,
                {
                    duration: 200,
                    toValue: 0
                }
            ).start();
        }
        else {
            this.setState({formalHolidayExpanded: true});
            Animated.spring(
                this.state.formalHolidaysHeightAnimate,
                {
                    duration: 200,
                    toValue: 40+this.state.formalHolidayList.length*30
                }
            ).start();
        }
    }

    unFormalHolidayToggle() {
        if (this.state.unFormalHolidayExpanded) {
            this.setState({unFormalHolidayExpanded: false});
            Animated.timing(
                this.state.unFormalHolidaysHeightAnimate,
                {
                    duration: 200,
                    toValue: 0
                }
            ).start();
        }
        else {
            this.setState({unFormalHolidayExpanded: true});
            Animated.spring(
                this.state.unFormalHolidaysHeightAnimate,
                {
                    duration: 200,
                    toValue: 40+this.state.unFormalHolidayList.length*30
                }
            ).start();
        }
    }

    holidayContainerToggle(toggle,holidayContainer){
        if (toggle===false){
            Animated.timing(
                holidayContainer,
                {
                    duration: 200,
                    toValue: 0
                }
            ).start();
        }
        else {
            Animated.spring(
                holidayContainer,
                {
                    duration: 200,
                    toValue: 30
                }
            ).start();
        }
    }

    arrowDirection(expanded) {
        if (expanded) {
            return (
                <Ionicons
                    name="ios-arrow-dropup"
                    size={20}
                    style={{color: "#fff"}}
                />

            )
        }
        else {
            return (
                <Ionicons
                    name="ios-arrow-dropdown"
                    size={20}
                    style={{color: "#fff"}}
                />
            )
        }
    }

    addNewHolidayView() {
        if (this.state.addHolidayExpanded === true) {
            return (
                <View style={{flex: 1, paddingRight: "5%", paddingLeft: "5%"}}>
                    <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
                        <TouchableOpacity
                            style={{
                                height: "50%",
                                borderBottomWidth: 0.5,
                                borderBottomColor:"#fff",
                                paddingLeft: 10,
                                flexDirection: "row",
                                alignItems: "center"
                            }}
                            onPress={this.dateTimePickerHandler._showDateTimePicker}>
                            <Text style={{flex: 8, fontSize: 0,color:"#fff"}}>{this.state.holiday.holidayDate}</Text>
                            <MaterialIcons
                                name="arrow-drop-down"
                                size={0}
                                style={{flex: 1, color: "#fff"}}
                            />
                        </TouchableOpacity>
                        <DateTimePicker
                            isVisible={this.state.isDateTimePickerVisible}
                            onConfirm={this.dateTimePickerHandler._handleDatePicked}
                            onCancel={this.dateTimePickerHandler._hideDateTimePicker}
                        />
                    </View>
                    <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
                        <View style={{
                            width: "100%",
                            borderWidth: this.state.textBoxBorderWidth,
                            borderRadius: 5,
                            borderColor:"#fff",
                            height: 30
                        }}>
                            <TextInput
                                style={{padding:5,paddingRight: 10,color:"#fff"}}
                                placeholder="Festival name or occasion"
                                placeholderTextColor="#fff"
                                autoCorrect={false}
                                autoCapitalize={"words"}
                                onChangeText={(festivalName) => {
                                    this.setState({
                                        holiday: {
                                            ...this.state.holiday,
                                            festivalsOrOccasions: festivalName
                                        }
                                    })
                                }}
                            />
                        </View>
                    </View>
                    <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
                        <TouchableOpacity
                            style={{
                                backgroundColor: "rgba(109, 164, 242,0.7)",
                                width: "100%",
                                height: 30,
                                justifyContent: "center",
                                alignItems: "center",
                                borderRadius: 5
                            }}
                            onPress={() => {
                                    this.addHoliday();
                            }}
                        >
                            <Text style={{color: "#ffffff", fontSize: 16}}>Update holiday</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )
        }
        else
            return null;
    };

    holidayView(holidayList,expanded,holidayContainer){
        if(expanded===true){
            return(
                <View style={{flex:1}}>
                    <View style={{height:40,flexDirection:"row",justifyContent:"center",alignItems:"center",backgroundColor:"rgba(255, 255, 255,0.8)"}}>
                        <View style={{flex:2,height:"80%",borderRightWidth:0.5,justifyContent:"center",alignItems:"center"}}>
                            <Text style={{color:"rgb(249, 77, 64)"}}>Occasion</Text>
                        </View>
                        <View style={{flex:1,height:"80%",borderRightWidth:0.5,justifyContent:"center",alignItems:"center"}}>
                            <Text style={{color:"rgb(255, 151, 7)"}}>Day</Text>
                        </View>
                        <View style={{flex:1,height:"80%",borderRightWidth:0.5,justifyContent:"center",alignItems:"center"}}>
                            <Text style={{color:"rgb(13, 145, 1)"}}>Month</Text>
                        </View>
                        <View style={{flex:1,height:"80%",borderRightWidth:0.5,justifyContent:"center",alignItems:"center"}}>
                            <Text style={{color:"rgb(1, 101, 168)"}}>Date</Text>
                        </View>
                    </View>
                    <View style={{flex:10}}>
                        {holidayList.map((holidayData,index)=>{
                            let backgroundColorVar="";
                            let textColorVar="";
                            if(index%2===0){
                                backgroundColorVar="rgba(121, 197, 252,0.5)";
                                textColorVar="#ffffff";
                            }else{
                                backgroundColorVar="rgba(255, 255, 255,0.8)";
                                textColorVar="rgb(25, 163, 255)"
                            }
                            return(
                                <Animated.View key={index} style={{height:holidayContainer,flexDirection:"row",justifyContent:"center",alignItems:"center",backgroundColor:backgroundColorVar}}>
                                    <View style={{flex:2,height:"100%",justifyContent:"center",alignItems:"center"}}>
                                        <Text style={{color:textColorVar,fontSize:12}}>{holidayData.festivalsOrOccasions}</Text>
                                    </View>
                                    <View style={{flex:1,height:"100%",justifyContent:"center",alignItems:"center"}}>
                                        <Text style={{color:textColorVar,fontSize:12}}>{holidayData.day}</Text>
                                    </View>
                                    <View style={{flex:1,height:"100%",justifyContent:"center",alignItems:"center"}}>
                                        <Text style={{color:textColorVar,fontSize:12}}>{holidayData.month}</Text>
                                    </View>
                                    <View style={{flex:1,height:"100%",justifyContent:"center",alignItems:"center"}}>
                                        <Text style={{color:textColorVar,fontSize:12}}>{holidayData.holidayDate}</Text>
                                    </View>
                                </Animated.View>
                            )
                        })}
                    </View>
                </View>
            );
        }else{
            return null;
        }
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
                        style={{
                            flex: 1,
                            height: "100%",
                            width: "100%",
                            justifyContent: "space-around",
                            alignItems: "center"
                        }}
                        onPress={() => {
                            this.props.navigation.navigate("Home")
                        }}
                    >
                        <Ionicons
                            name="ios-arrow-back"
                            size={30}
                            style={{color: "#ffffff"}}
                        />
                    </TouchableOpacity>
                    <View style={{flex: 5, alignItems: "center", justifyContent: "center"}}>
                        <Text style={{color: "#ffffff", fontSize: 25}}>Holidays</Text>
                    </View>
                    <TouchableOpacity
                        style={{
                        flex: 1,
                        height: "100%",
                        width: "100%",
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                        onPress={()=>{this.getHolidayList()}}
                    >
                        <MaterialIcons
                            name="refresh"
                            size={30}
                            style={{color: "#ffffff"}}
                        />
                    </TouchableOpacity>
                </View>
                <View  style={{flex: 10,justifyContent:"center"}}>
                    <View>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <TouchableOpacity
                                style={{height: 40, width: "100%", alignItems: "center", justifyContent: "center"}}
                                onPress={() => {
                                    this.addHolidayToggle();
                                }}
                            >
                                <Text style={{color: "#fff", fontSize: 17}}>Add or edit  {this.arrowDirection(this.state.addHolidayExpanded)}</Text>
                            </TouchableOpacity>
                            <Animated.View
                                style={{
                                    height: this.state.addHolidayHeightAnimate,
                                    width: "100%",
                                    backgroundColor:"rgba(100,100,100,0.4)",
                                    borderBottomWidth: 0.5,
                                    borderBottomColor: "#fff",
                                }}
                            >
                                {this.addNewHolidayView()}
                            </Animated.View>
                            <TouchableOpacity
                                style={{height: 40, width: "100%", alignItems: "center", justifyContent: "center"}}
                                onPress={() => {
                                    this.formalHolidayToggle();
                                    setTimeout(()=>{this.holidayContainerToggle(this.state.formalHolidayExpanded,this.state.formalHolidayContainer);},50)
                                }}
                            >
                                <Text style={{color: "#fff", fontSize: 17}}>Formal holidays list  {this.arrowDirection(this.state.formalHolidayExpanded)}</Text>
                            </TouchableOpacity>
                            <Animated.View style={{
                                height:this.state.formalHolidaysHeightAnimate,
                                backgroundColor:"rgba(100,100,100,0.4)",
                                width: "100%",
                                borderBottomWidth: 0.5,
                                borderBottomColor: "#fff"
                            }}
                            >
                                {this.holidayView(this.state.formalHolidayList,this.state.formalHolidayExpanded,this.state.formalHolidayContainer)}
                            </Animated.View>
                            <TouchableOpacity
                                style={{height: 40, width: "100%", alignItems: "center", justifyContent: "center"}}
                                onPress={() => {
                                    this.unFormalHolidayToggle();
                                    setTimeout(()=>{this.holidayContainerToggle(this.state.unFormalHolidayExpanded,this.state.unFormalHolidayContainer);},50)
                                }}
                            >
                                <Text style={{color: "#fff", fontSize: 17}}>non-formal holidays list  {this.arrowDirection(this.state.unFormalHolidayExpanded)}</Text>
                            </TouchableOpacity>
                            <Animated.View style={{
                                height:this.state.unFormalHolidaysHeightAnimate,
                                backgroundColor:"rgba(100,100,100,0.4)",
                                width: "100%",
                                borderBottomWidth: 0.5,
                                borderBottomColor: "#fff"
                            }}
                            >
                                {this.holidayView(this.state.unFormalHolidayList,this.state.unFormalHolidayExpanded,this.state.unFormalHolidayContainer)}
                            </Animated.View>
                        </ScrollView>
                    </View>
                </View>
            </ImageBackground>
        )
    }
}