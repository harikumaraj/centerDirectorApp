import React, { Component } from 'react';
import {Text,View,TouchableOpacity,ScrollView,ImageBackground,Dimensions,StyleSheet} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default class ClassList extends Component{
    static navigationOptions = {
        drawerLabel: () => null
    };

    constructor(props){
        super(props);
        this.state={
            classList:this.props.screenProps.classList,
            directorDetails:this.props.screenProps.classList,
            fetchFlag:false,
            spinnerVisible:false,
            popUp:false,
            classSelectedIndex:0,
            deviceHeight:0,
            deviceWidth:0
        };
    }

    componentDidMount() {
        console.log(this.props.screenProps.classList);
        let {height, width} = Dimensions.get('window');
        this.setState({deviceHeight: height, deviceWidth: width});
    }

    togglePopUp(){
        if(this.state.popUp)
            this.setState({popUp:false});
        else
            this.setState({popUp:true});
        this.returnPopUpView();
    }

    returnPopUpView(){
        if(this.state.popUp){
            return(
                <View
                    style={{position:"absolute",width:this.state.deviceWidth,height:"100%",backgroundColor:"rgba(0, 0, 0,0.5)",alignItems:"center",justifyContent:"center"}}
                >
                    <View style={{width:"90%",height:300,alignItems:"center",justifyContent:"center",backgroundColor:"white",borderRadius:5}}>
                        <View style={{width:"90%"}}>
                        <View style={{borderBottomWidth:0.5,borderBottomColor:"#00000077",marginBottom:5}}>
                            <Text style={{color:"rgb(26, 93, 175)",fontSize:17,marginBottom:5}}>Class details</Text>
                        </View>
                        <Text style={styles.popUpText}>Director Id:  {this.state.classList[this.state.classSelectedIndex].directorId}</Text>
                        <Text style={styles.popUpText}>Branch Id:  {this.state.classList[this.state.classSelectedIndex].branchId}</Text>
                        <Text style={styles.popUpText}>Class Id:  {this.state.classList[this.state.classSelectedIndex].classId}</Text>
                        <Text style={styles.popUpText}>Class name:  {this.state.classList[this.state.classSelectedIndex].className}</Text>
                        <Text style={styles.popUpText}>Age group:  {this.state.classList[this.state.classSelectedIndex].ageGroup}</Text>
                        <Text style={styles.popUpText}>Total number of seats:  {this.state.classList[this.state.classSelectedIndex].totalNoOfSeats}</Text>
                        <Text style={styles.popUpText}>Class starts from: {this.state.classList[this.state.classSelectedIndex].classTimingFrom}</Text>
                        <Text style={styles.popUpText}>Class ends at: {this.state.classList[this.state.classSelectedIndex].classTimingTo}</Text>
                        </View>
                    <TouchableOpacity
                        style={{backgroundColor:"rgb(2, 112, 247)",height:40,width:300,alignItems:"center",justifyContent:"center",borderRadius:2,marginTop:20}}
                        onPress={()=>{this.togglePopUp()}}
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
                    <View style={{flex:5,alignItems:"center",justifyContent:"center"}}>
                        <Text style={{color:"#ffffff",fontSize:25}}>Class list</Text>
                    </View>
                    <View style={{flex:1}}></View>
                </View>
                <View style={{flex:10,width:"100%",height:"100%"}}>
                    <View style={{flex:15,backgroundColor:"rgba(122, 181, 249,0.5)"}}>
                        <View style={{flex:1,flexDirection:"row",alignItems:"center",justifyContent:"center"}}>
                            <Text style={{flex:1,color:"#ffffff",textAlign:"center",fontSize:15}}>Class</Text>
                            <Text style={{flex:1,color:"#ffffff",textAlign:"center",fontSize:15}}>start time</Text>
                            <Text style={{flex:1,color:"#ffffff",textAlign:"center",fontSize:15}}>End time</Text>
                            <Text style={{flex:1,color:"#ffffff"}}></Text>
                        </View>
                        <View style={{flex:12}}>
                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                style={{flex:1,backgroundColor:"#ffffff88"}}
                            >
                                {
                                    this.state.classList.map((oneClass,index) => {
                                        return(
                                            <View key={index} style={{width:"100%",height:40,flexDirection:"row",alignItems:"center",justifyContent:"center"}}>
                                                <View style={{flex:1,height:"100%",backgroundColor:"rgb(155, 196, 247)",alignItems:"center",justifyContent:"center"}}>
                                                    <Text style={{textAlign:"center",}}>{oneClass.className}</Text>
                                                </View>
                                                <View style={{flex:1,height:"100%",backgroundColor:"rgb(217, 233, 252)",alignItems:"center",justifyContent:"center"}}>
                                                    <Text style={{textAlign:"center",}}>{oneClass.classTimingFrom}</Text>
                                                </View>
                                                <View style={{flex:1,height:"100%",backgroundColor:"rgb(217, 233, 252)",alignItems:"center",justifyContent:"center"}}>
                                                    <Text style={{textAlign:"center",}}>{oneClass.classTimingTo}</Text>
                                                </View>
                                                    <TouchableOpacity
                                                        style={{flex:1,height:"100%",backgroundColor:"rgb(26, 93, 175)",alignItems:"center",justifyContent:"center"}}
                                                        onPress={()=>{this.setState({selectedClassIndex:index});this.togglePopUp()}}
                                                    >
                                                        <Text style={{color:"#ffffff"}}>Details</Text>
                                                    </TouchableOpacity>
                                            </View>
                                        )
                                    })
                                }
                            </ScrollView>
                        </View>
                        {this.returnPopUpView()}
                    </View>
                </View>
            </ImageBackground>
        )
    }
}

let styles=StyleSheet.create({
    popUpText:{fontSize:15,color:"#666",marginBottom:2}
});