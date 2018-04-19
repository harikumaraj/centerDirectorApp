import React from 'react';
import {Text,ScrollView,TouchableOpacity,View,Platform,ImageBackground,Image} from 'react-native';
import {DrawerItems,SafeAreaView} from 'react-navigation'

export default CustomDrawerContentComponent = (props) => {

    function returnDirectorName(){
        return(props.screenProps.directorName);
    }

    return(
        <SafeAreaView style={{flex: 1}} forceInset={{top: 'always', horizontal: 'never'}}>
            <View
                style={{
                    marginTop:(Platform.OS==="ios")?"-8%":0,
                    width: "100%",
                    height: 200,
                    justifyContent:"flex-end"
                }}
            >
                <ImageBackground
                    style={{width:"100%",height:"100%",justifyContent:"center",alignItems:"center"}}
                    source={require("../../../assets/batman.jpg")}
                >
                        <TouchableOpacity
                            style={{
                                height:100,
                                width:100,
                                borderRadius:50,
                            }}
                            onPress={()=>{props.navigation.navigate("Profile")}}
                        >
                            <Image
                            style={{width:100,height:100,borderRadius:50}}
                            source={props.screenProps.photo}
                            />
                        </TouchableOpacity>
                            <Text style={{marginTop:"5%",color:"#ffffff",backgroundColor:"rgba(0,0,0,0)"}}>{props.screenProps.directorName}</Text>
                </ImageBackground>
            </View>
            <ScrollView>
                <DrawerItems {...props}/>
                <TouchableOpacity
                onPress={()=>{props.screenProps.navigateToLoginPage()}}
                >
                    <Text style={{marginTop:"3.5%",marginLeft:"6%",fontSize:14,fontWeight:"bold"}}>Logout</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}